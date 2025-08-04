-- Fix remaining security linter warnings

-- Check and fix any functions with mutable search_path
-- (Most functions should now be fixed, but let's ensure the trigger function is secure)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Add a trigger to the updated_at function for speeltuinen table
DROP TRIGGER IF EXISTS update_speeltuinen_updated_at ON public.speeltuinen;
CREATE TRIGGER update_speeltuinen_updated_at
    BEFORE UPDATE ON public.speeltuinen
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add audit logging trigger function for security monitoring
CREATE OR REPLACE FUNCTION public.audit_table_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (
            table_name,
            action,
            record_id,
            old_values,
            user_id,
            ip_address
        ) VALUES (
            TG_TABLE_NAME,
            TG_OP,
            OLD.id::text,
            to_jsonb(OLD),
            auth.uid(),
            inet_client_addr()
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (
            table_name,
            action,
            record_id,
            old_values,
            new_values,
            user_id,
            ip_address
        ) VALUES (
            TG_TABLE_NAME,
            TG_OP,
            NEW.id::text,
            to_jsonb(OLD),
            to_jsonb(NEW),
            auth.uid(),
            inet_client_addr()
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (
            table_name,
            action,
            record_id,
            new_values,
            user_id,
            ip_address
        ) VALUES (
            TG_TABLE_NAME,
            TG_OP,
            NEW.id::text,
            to_jsonb(NEW),
            auth.uid(),
            inet_client_addr()
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;

-- Add audit triggers to critical tables
CREATE TRIGGER audit_speeltuinen_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.speeltuinen
    FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_user_roles_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

-- Add index for better audit log performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_action ON public.audit_logs(table_name, action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON public.audit_logs(user_id, created_at);

-- Create security monitoring function
CREATE OR REPLACE FUNCTION public.get_security_events(days_back INTEGER DEFAULT 7)
RETURNS TABLE(
    event_time timestamp with time zone,
    event_type text,
    table_name text,
    user_id uuid,
    details jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Only admins can view security events
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. Administrator privileges required.';
    END IF;

    RETURN QUERY
    SELECT 
        al.created_at as event_time,
        al.action as event_type,
        al.table_name,
        al.user_id,
        jsonb_build_object(
            'record_id', al.record_id,
            'ip_address', al.ip_address,
            'changes', CASE 
                WHEN al.action = 'UPDATE' THEN 
                    jsonb_build_object(
                        'from', al.old_values,
                        'to', al.new_values
                    )
                WHEN al.action = 'DELETE' THEN al.old_values
                WHEN al.action = 'INSERT' THEN al.new_values
                ELSE null
            END
        ) as details
    FROM public.audit_logs al
    WHERE al.created_at >= NOW() - INTERVAL '1 day' * days_back
    ORDER BY al.created_at DESC;
END;
$$;