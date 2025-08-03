-- Create Audit Logs Table
-- This migration creates the missing audit_logs table that is referenced in the code

-- Create the audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for audit_logs
CREATE POLICY "Audit logs are viewable by admins" 
ON public.audit_logs
FOR SELECT 
USING (auth.uid() IN (
  SELECT user_id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
));

CREATE POLICY "Audit logs can be inserted by authenticated users" 
ON public.audit_logs
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON public.audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Add comments for documentation
COMMENT ON TABLE public.audit_logs IS 'Audit log table for tracking user actions';
COMMENT ON COLUMN public.audit_logs.user_id IS 'User who performed the action';
COMMENT ON COLUMN public.audit_logs.action IS 'Type of action (INSERT, UPDATE, DELETE)';
COMMENT ON COLUMN public.audit_logs.table_name IS 'Name of the table that was affected';
COMMENT ON COLUMN public.audit_logs.record_id IS 'ID of the record that was affected';
COMMENT ON COLUMN public.audit_logs.old_values IS 'Previous values before the change';
COMMENT ON COLUMN public.audit_logs.new_values IS 'New values after the change';
COMMENT ON COLUMN public.audit_logs.ip_address IS 'IP address of the user';
COMMENT ON COLUMN public.audit_logs.user_agent IS 'User agent string';
COMMENT ON COLUMN public.audit_logs.created_at IS 'Timestamp when the action occurred'; 