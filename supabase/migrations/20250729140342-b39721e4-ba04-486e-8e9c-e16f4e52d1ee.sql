-- Fix search path security warnings by updating functions with proper search_path
CREATE OR REPLACE FUNCTION public.prevent_self_privilege_escalation()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
    -- Prevent users from upgrading their own role to admin
    IF (TG_OP = 'UPDATE' OR TG_OP = 'INSERT') AND 
       NEW.user_id = auth.uid() AND 
       NEW.role = 'admin'::app_role AND 
       (TG_OP = 'INSERT' OR OLD.role != 'admin'::app_role) THEN
        RAISE EXCEPTION 'Users cannot grant themselves admin privileges';
    END IF;
    
    -- Log the role change
    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values
    ) VALUES (
        auth.uid(),
        CASE WHEN TG_OP = 'INSERT' THEN 'role_created' ELSE 'role_updated' END,
        'user_roles',
        NEW.id,
        CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
        row_to_json(NEW)
    );
    
    RETURN NEW;
END;
$$;

-- Fix search path for role validation function
CREATE OR REPLACE FUNCTION public.validate_role_change(
    target_user_id UUID,
    new_role app_role
) RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
    -- Only admins can change roles
    IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
        RAISE EXCEPTION 'Only administrators can change user roles';
    END IF;
    
    -- Prevent self-privilege escalation
    IF target_user_id = auth.uid() AND new_role = 'admin'::app_role THEN
        RAISE EXCEPTION 'Cannot grant yourself admin privileges';
    END IF;
    
    -- Additional validation can be added here
    RETURN TRUE;
END;
$$;