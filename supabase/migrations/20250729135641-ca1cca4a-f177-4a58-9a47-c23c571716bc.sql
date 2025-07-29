-- Create audit logging table for security events
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert audit logs (no user restriction for logging)
CREATE POLICY "System can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (true);

-- Create function to prevent self-privilege escalation
CREATE OR REPLACE FUNCTION public.prevent_self_privilege_escalation()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role change security
CREATE TRIGGER trigger_prevent_self_privilege_escalation
    BEFORE INSERT OR UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_self_privilege_escalation();

-- Create function to validate role changes
CREATE OR REPLACE FUNCTION public.validate_role_change(
    target_user_id UUID,
    new_role app_role
) RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;