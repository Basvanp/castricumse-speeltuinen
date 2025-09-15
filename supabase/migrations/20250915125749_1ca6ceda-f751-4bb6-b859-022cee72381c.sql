-- Fix security issue: Restrict error logs access to admins only
-- Remove overly permissive service role read access and implement proper admin-only access

-- Drop the problematic service role policy that allows reading all error logs
DROP POLICY IF EXISTS "Allow service role to read all error logs" ON public.error_logs;

-- Create a new policy that only allows admins to read all error logs
CREATE POLICY "Only admins can read all error logs" 
ON public.error_logs 
FOR SELECT 
USING (public.is_admin());

-- Update the get_error_statistics function to ensure it respects admin access
CREATE OR REPLACE FUNCTION public.get_error_statistics(p_days integer DEFAULT 30)
RETURNS TABLE(error_code character varying, category character varying, title character varying, count bigint, last_occurrence timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    -- Only admins can access error statistics
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. Administrator privileges required.';
    END IF;

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
$function$;

-- Create a function to anonymize sensitive data for non-admin access (future use)
CREATE OR REPLACE FUNCTION public.get_anonymized_error_logs(user_uuid uuid DEFAULT auth.uid())
RETURNS TABLE(
    id integer,
    error_code character varying,
    created_at timestamp with time zone,
    error_message text,
    anonymized_data jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    -- Users can only see their own anonymized error logs
    RETURN QUERY
    SELECT 
        el.id,
        el.error_code,
        el.created_at,
        el.error_message,
        jsonb_build_object(
            'has_stack_trace', (el.stack_trace IS NOT NULL),
            'has_additional_data', (el.additional_data IS NOT NULL),
            'page_url', el.page_url
        ) as anonymized_data
    FROM public.error_logs el
    WHERE el.user_id = user_uuid
    ORDER BY el.created_at DESC;
END;
$function$;