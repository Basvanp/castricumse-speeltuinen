-- Critical Security Fixes Migration
-- Phase 1: Enable RLS on all unprotected tables

-- Enable RLS on audit_logs table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on favorites table  
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Enable RLS on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Enable RLS on site_settings table
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_preferences table
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create secure function to get user role (fixes search_path vulnerability)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT ur.role 
  FROM public.user_roles ur 
  WHERE ur.user_id = auth.uid() 
  ORDER BY 
    CASE 
      WHEN ur.role = 'admin' THEN 1
      WHEN ur.role = 'user' THEN 2
      ELSE 3
    END
  LIMIT 1;
$$;

-- Create secure function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'
  );
$$;

-- Create secure function to validate role changes (prevents privilege escalation)
CREATE OR REPLACE FUNCTION public.validate_role_change(target_user_id UUID, new_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only admins can change roles
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can change user roles';
  END IF;
  
  -- Prevent users from changing their own role to admin
  IF target_user_id = auth.uid() AND new_role = 'admin' THEN
    RAISE EXCEPTION 'Users cannot grant themselves administrator privileges';
  END IF;
  
  -- Validate role value
  IF new_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Invalid role. Must be admin or user';
  END IF;
  
  RETURN TRUE;
END;
$$;

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles  
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update roles with validation"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.validate_role_change(user_id, role));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin());

-- RLS Policies for audit_logs table
CREATE POLICY "Only admins can read audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "System can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- RLS Policies for favorites table
CREATE POLICY "Users can view their own favorites"
ON public.favorites
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own favorites"
ON public.favorites
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own favorites"
ON public.favorites
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for notifications table
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- RLS Policies for reviews table
CREATE POLICY "Anyone can read reviews"
ON public.reviews
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
ON public.reviews
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews"
ON public.reviews
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can delete any review"
ON public.reviews
FOR DELETE
TO authenticated
USING (public.is_admin());

-- RLS Policies for site_settings table
CREATE POLICY "Anyone can read public site settings"
ON public.site_settings
FOR SELECT
USING (setting_key NOT LIKE '%_secret%' AND setting_key NOT LIKE '%_key%' AND setting_key NOT LIKE '%_token%');

CREATE POLICY "Admins can read all site settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can modify site settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- RLS Policies for user_preferences table
CREATE POLICY "Users can manage their own preferences"
ON public.user_preferences
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Fix existing speeltuinen policy to use role-based authentication instead of hardcoded email
DROP POLICY IF EXISTS "Admin delete access" ON public.speeltuinen;

CREATE POLICY "Admin delete access"
ON public.speeltuinen
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Update existing database functions to use secure search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    user_role text;
BEGIN
    SELECT ur.role INTO user_role
    FROM public.user_roles ur
    WHERE ur.user_id = user_uuid
    ORDER BY 
        CASE 
            WHEN ur.role = 'admin' THEN 1
            WHEN ur.role = 'user' THEN 2
            ELSE 3
        END
    LIMIT 1;
    
    RETURN COALESCE(user_role, 'user');
END;
$$;

CREATE OR REPLACE FUNCTION public.log_error(
    p_error_code character varying,
    p_user_id uuid DEFAULT NULL::uuid,
    p_session_id character varying DEFAULT NULL::character varying,
    p_page_url text DEFAULT NULL::text,
    p_user_agent text DEFAULT NULL::text,
    p_error_message text DEFAULT NULL::text,
    p_stack_trace text DEFAULT NULL::text,
    p_additional_data jsonb DEFAULT NULL::jsonb,
    p_ip_address inet DEFAULT NULL::inet
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    log_id INTEGER;
BEGIN
    INSERT INTO public.error_logs (
        error_code,
        user_id,
        session_id,
        page_url,
        user_agent,
        error_message,
        stack_trace,
        additional_data,
        ip_address
    ) VALUES (
        p_error_code,
        p_user_id,
        p_session_id,
        p_page_url,
        p_user_agent,
        p_error_message,
        p_stack_trace,
        p_additional_data,
        p_ip_address
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_error_statistics(p_days integer DEFAULT 30)
RETURNS TABLE(error_code character varying, category character varying, title character varying, count bigint, last_occurrence timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ec.error_code,
        ec.category,
        ec.title,
        COUNT(el.id) as count,
        MAX(el.created_at) as last_occurrence
    FROM public.error_codes ec
    LEFT JOIN public.error_logs el ON ec.error_code = el.error_code
    WHERE el.created_at >= NOW() - INTERVAL '1 day' * p_days
       OR el.created_at IS NULL
    GROUP BY ec.error_code, ec.category, ec.title
    ORDER BY count DESC NULLS LAST, ec.error_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.find_orphaned_photos()
RETURNS TABLE(url text, size_bytes bigint, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        objects.name::text as url,
        (objects.metadata->>'size')::bigint as size_bytes,
        objects.created_at
    FROM storage.objects
    WHERE bucket_id = 'speeltuin-fotos'
    AND NOT EXISTS (
        SELECT 1 FROM public.speeltuinen s 
        WHERE s.fotos @> ARRAY[objects.name]::text[]
        OR s.afbeelding_url = objects.name
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_orphaned_photos()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    deleted_count integer := 0;
    orphaned_record record;
BEGIN
    FOR orphaned_record IN 
        SELECT name FROM storage.objects 
        WHERE bucket_id = 'speeltuin-fotos'
        AND NOT EXISTS (
            SELECT 1 FROM public.speeltuinen s 
            WHERE s.fotos @> ARRAY[objects.name]::text[]
            OR s.afbeelding_url = objects.name
        )
    LOOP
        DELETE FROM storage.objects 
        WHERE bucket_id = 'speeltuin-fotos' 
        AND name = orphaned_record.name;
        
        deleted_count := deleted_count + 1;
    END LOOP;
    
    RETURN deleted_count;
END;
$$;

-- Create secure user invitation function
CREATE OR REPLACE FUNCTION public.invite_user_secure(
    user_email TEXT,
    user_role TEXT DEFAULT 'user'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Only admins can invite users
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only administrators can invite users';
    END IF;
    
    -- Validate email format
    IF user_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;
    
    -- Validate role
    IF user_role NOT IN ('admin', 'user') THEN
        RAISE EXCEPTION 'Invalid role. Must be admin or user';
    END IF;
    
    -- This function would typically integrate with an email service
    -- For now, we'll return a message indicating manual setup is needed
    result := jsonb_build_object(
        'success', true,
        'message', 'User invitation requires email integration. Please create user manually via Supabase dashboard.',
        'email', user_email,
        'role', user_role
    );
    
    RETURN result;
END;
$$;