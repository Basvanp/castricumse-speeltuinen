-- Database Analysis Script voor Speeltuinen
-- Dit script analyseert de database structuur en vindt orphaned foto's

-- 1. Huidige database structuur bekijken
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'speeltuinen'
ORDER BY ordinal_position;

-- 2. Aantal speeltuinen met foto's
SELECT 
    COUNT(*) as total_speeltuinen,
    COUNT(CASE WHEN fotos IS NOT NULL AND fotos != '[]'::jsonb THEN 1 END) as speeltuinen_met_fotos,
    COUNT(CASE WHEN afbeelding_url IS NOT NULL AND afbeelding_url != '' THEN 1 END) as speeltuinen_met_oude_foto
FROM public.speeltuinen;

-- 3. Foto's in de fotos kolom analyseren
SELECT 
    id,
    naam,
    fotos,
    jsonb_array_length(fotos) as aantal_fotos
FROM public.speeltuinen 
WHERE fotos IS NOT NULL 
AND fotos != '[]'::jsonb
ORDER BY aantal_fotos DESC;

-- 4. Foto URL's uit de fotos kolom extraheren
WITH foto_urls AS (
    SELECT 
        id,
        naam,
        jsonb_array_elements(fotos)->>'url' as foto_url
    FROM public.speeltuinen 
    WHERE fotos IS NOT NULL 
    AND fotos != '[]'::jsonb
)
SELECT 
    foto_url,
    COUNT(*) as aantal_gebruik
FROM foto_urls 
GROUP BY foto_url 
ORDER BY aantal_gebruik DESC;

-- 5. Storage bucket inhoud bekijken (als toegang tot storage schema)
-- SELECT 
--     name,
--     bucket_id,
--     created_at,
--     updated_at
-- FROM storage.objects 
-- WHERE bucket_id = 'speeltuin-fotos'
-- ORDER BY created_at DESC;

-- 6. Speeltuinen zonder foto's
SELECT 
    id,
    naam,
    afbeelding_url,
    fotos
FROM public.speeltuinen 
WHERE (fotos IS NULL OR fotos = '[]'::jsonb)
AND (afbeelding_url IS NULL OR afbeelding_url = '')
ORDER BY naam;

-- 7. Mogelijke orphaned foto's (foto's in storage maar niet gelinkt aan speeltuinen)
-- Dit vereist toegang tot storage schema en is een schatting
-- SELECT 
--     o.name as storage_file,
--     o.created_at
-- FROM storage.objects o
-- WHERE o.bucket_id = 'speeltuin-fotos'
-- AND NOT EXISTS (
--     SELECT 1 
--     FROM public.speeltuinen s,
--          jsonb_array_elements(s.fotos) as foto
--     WHERE foto->>'url' LIKE '%' || o.name
-- );

-- 8. Audit logs voor speeltuinen verwijderingen
SELECT 
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    created_at
FROM public.audit_logs 
WHERE table_name = 'speeltuinen'
AND action IN ('DELETE', 'UPDATE')
ORDER BY created_at DESC
LIMIT 20;

-- 9. Recente wijzigingen aan speeltuinen
SELECT 
    id,
    naam,
    updated_at,
    afbeelding_url,
    CASE 
        WHEN fotos IS NULL THEN 'NULL'
        WHEN fotos = '[]'::jsonb THEN 'Leeg'
        ELSE jsonb_array_length(fotos)::text || ' foto(s)'
    END as fotos_status
FROM public.speeltuinen 
ORDER BY updated_at DESC
LIMIT 10; 