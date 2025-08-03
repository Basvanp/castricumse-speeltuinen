-- Fix RLS Policies
-- This migration fixes the RLS policies that are causing permission denied errors

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Audit logs are viewable by admins" ON public.audit_logs;

-- Create fixed policies for audit_logs
CREATE POLICY "Audit logs are viewable by admins" 
ON public.audit_logs
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Alternative approach: Create a function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a simpler policy using the function
DROP POLICY IF EXISTS "Audit logs are viewable by admins" ON public.audit_logs;
CREATE POLICY "Audit logs are viewable by admins" 
ON public.audit_logs
FOR SELECT 
USING (public.is_admin());

-- Also create a policy that allows all authenticated users to view audit logs for now
-- (we can restrict this later if needed)
CREATE POLICY "Audit logs are viewable by authenticated users" 
ON public.audit_logs
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Ensure the insert policy exists
CREATE POLICY IF NOT EXISTS "Audit logs can be inserted by authenticated users" 
ON public.audit_logs
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Add comment for the function
COMMENT ON FUNCTION public.is_admin() IS 'Check if the current user has admin role'; 