-- Migration: Cleanup orphaned photos and add triggers for automatic photo management
-- This migration adds triggers to automatically clean up photos from storage when playgrounds are deleted or updated

-- 1. Create function to extract photo URLs from JSONB array
CREATE OR REPLACE FUNCTION public.extract_photo_urls(photos_jsonb jsonb)
RETURNS text[] AS $$
DECLARE
    urls text[] := '{}';
    photo_record record;
BEGIN
    IF photos_jsonb IS NULL OR photos_jsonb = '[]'::jsonb THEN
        RETURN urls;
    END IF;
    
    FOR photo_record IN SELECT jsonb_array_elements(photos_jsonb) as photo
    LOOP
        IF photo_record.photo->>'url' IS NOT NULL THEN
            urls := array_append(urls, photo_record.photo->>'url');
        END IF;
    END LOOP;
    
    RETURN urls;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create function to delete photos from storage
CREATE OR REPLACE FUNCTION public.delete_photos_from_storage(photo_urls text[])
RETURNS void AS $$
DECLARE
    photo_url text;
    file_name text;
BEGIN
    IF photo_urls IS NULL OR array_length(photo_urls, 1) IS NULL THEN
        RETURN;
    END IF;
    
    FOREACH photo_url IN ARRAY photo_urls
    LOOP
        -- Extract filename from URL
        file_name := substring(photo_url from 'speeltuin-fotos/(.+)$');
        
        IF file_name IS NOT NULL THEN
            -- Delete from storage.objects
            DELETE FROM storage.objects 
            WHERE bucket_id = 'speeltuin-fotos' 
            AND name = file_name;
            
            -- Log the deletion
            INSERT INTO public.audit_logs (
                user_id,
                action,
                table_name,
                record_id,
                old_values,
                new_values
            ) VALUES (
                auth.uid(),
                'photo_deleted_from_storage',
                'storage.objects',
                NULL,
                jsonb_build_object('file_name', file_name, 'photo_url', photo_url),
                NULL
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create function to handle photo cleanup on speeltuin deletion
CREATE OR REPLACE FUNCTION public.cleanup_speeltuin_photos()
RETURNS TRIGGER AS $$
DECLARE
    old_photo_urls text[];
    new_photo_urls text[];
    removed_photo_urls text[];
    photo_url text;
BEGIN
    -- Extract photo URLs from old and new records
    old_photo_urls := public.extract_photo_urls(OLD.fotos);
    new_photo_urls := public.extract_photo_urls(NEW.fotos);
    
    -- Find removed photos (in old but not in new)
    removed_photo_urls := '{}';
    FOREACH photo_url IN ARRAY old_photo_urls
    LOOP
        IF NOT (photo_url = ANY(new_photo_urls)) THEN
            removed_photo_urls := array_append(removed_photo_urls, photo_url);
        END IF;
    END LOOP;
    
    -- Delete removed photos from storage
    IF array_length(removed_photo_urls, 1) > 0 THEN
        PERFORM public.delete_photos_from_storage(removed_photo_urls);
    END IF;
    
    -- Log the photo changes
    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values
    ) VALUES (
        auth.uid(),
        CASE 
            WHEN TG_OP = 'DELETE' THEN 'speeltuin_deleted_with_photos'
            WHEN TG_OP = 'UPDATE' THEN 'speeltuin_photos_updated'
            ELSE 'speeltuin_created'
        END,
        'speeltuinen',
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN jsonb_build_object('fotos', OLD.fotos) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN jsonb_build_object('fotos', NEW.fotos) ELSE NULL END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger for photo cleanup on speeltuin updates
CREATE TRIGGER trigger_cleanup_speeltuin_photos
    AFTER UPDATE ON public.speeltuinen
    FOR EACH ROW
    EXECUTE FUNCTION public.cleanup_speeltuin_photos();

-- 5. Create trigger for photo cleanup on speeltuin deletion
CREATE TRIGGER trigger_cleanup_speeltuin_photos_on_delete
    AFTER DELETE ON public.speeltuinen
    FOR EACH ROW
    EXECUTE FUNCTION public.cleanup_speeltuin_photos();

-- 6. Create function to find and report orphaned photos
CREATE OR REPLACE FUNCTION public.find_orphaned_photos()
RETURNS TABLE(
    storage_file text,
    file_size bigint,
    created_at timestamptz,
    orphaned_reason text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.name as storage_file,
        o.metadata->>'size'::bigint as file_size,
        o.created_at,
        'Not referenced in any speeltuin fotos array' as orphaned_reason
    FROM storage.objects o
    WHERE o.bucket_id = 'speeltuin-fotos'
    AND NOT EXISTS (
        SELECT 1 
        FROM public.speeltuinen s,
             jsonb_array_elements(s.fotos) as foto
        WHERE foto->>'url' LIKE '%' || o.name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create function to clean up orphaned photos
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_photos()
RETURNS integer AS $$
DECLARE
    orphaned_count integer := 0;
    orphaned_record record;
BEGIN
    -- Count and delete orphaned photos
    FOR orphaned_record IN 
        SELECT * FROM public.find_orphaned_photos()
    LOOP
        DELETE FROM storage.objects 
        WHERE bucket_id = 'speeltuin-fotos' 
        AND name = orphaned_record.storage_file;
        
        orphaned_count := orphaned_count + 1;
        
        -- Log the cleanup
        INSERT INTO public.audit_logs (
            user_id,
            action,
            table_name,
            record_id,
            old_values,
            new_values
        ) VALUES (
            auth.uid(),
            'orphaned_photo_cleaned',
            'storage.objects',
            NULL,
            jsonb_build_object(
                'file_name', orphaned_record.storage_file,
                'file_size', orphaned_record.file_size,
                'created_at', orphaned_record.created_at
            ),
            NULL
        );
    END LOOP;
    
    RETURN orphaned_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to get speeltuinen with photos for admin interface
CREATE OR REPLACE FUNCTION public.get_speeltuinen_with_photos()
RETURNS TABLE(
    id uuid,
    naam text,
    fotos jsonb,
    aantal_fotos integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.naam,
        s.fotos,
        CASE 
            WHEN s.fotos IS NULL OR s.fotos = '[]'::jsonb THEN 0
            ELSE jsonb_array_length(s.fotos)
        END as aantal_fotos
    FROM public.speeltuinen s
    WHERE s.fotos IS NOT NULL 
    AND s.fotos != '[]'::jsonb
    ORDER BY jsonb_array_length(s.fotos) DESC, s.naam;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.extract_photo_urls(text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_photos_from_storage(text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_speeltuin_photos() TO authenticated;
GRANT EXECUTE ON FUNCTION public.find_orphaned_photos() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_orphaned_photos() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_speeltuinen_with_photos() TO authenticated;

-- 10. Add comments for documentation
COMMENT ON FUNCTION public.extract_photo_urls(jsonb) IS 'Extract photo URLs from JSONB array in fotos column';
COMMENT ON FUNCTION public.delete_photos_from_storage(text[]) IS 'Delete photos from storage.objects table';
COMMENT ON FUNCTION public.cleanup_speeltuin_photos() IS 'Trigger function to cleanup photos when speeltuin is updated or deleted';
COMMENT ON FUNCTION public.find_orphaned_photos() IS 'Find photos in storage that are not referenced by any speeltuin';
COMMENT ON FUNCTION public.cleanup_orphaned_photos() IS 'Clean up orphaned photos from storage and return count of deleted files';
COMMENT ON FUNCTION public.get_speeltuinen_with_photos() IS 'Get speeltuinen with photos for admin interface display'; 