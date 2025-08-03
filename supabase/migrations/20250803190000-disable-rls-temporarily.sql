-- Temporarily Disable RLS
-- This migration temporarily disables RLS to fix permission issues

-- Disable RLS on all tables to fix permission issues
ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites DISABLE ROW LEVEL SECURITY;

-- Add comment explaining this is temporary
COMMENT ON TABLE public.audit_logs IS 'Audit log table for tracking user actions (RLS temporarily disabled)';
COMMENT ON TABLE public.reviews IS 'User reviews for playgrounds (RLS temporarily disabled)';
COMMENT ON TABLE public.notifications IS 'User notifications (RLS temporarily disabled)';
COMMENT ON TABLE public.user_preferences IS 'User notification preferences (RLS temporarily disabled)';
COMMENT ON TABLE public.favorites IS 'User favorite playgrounds (RLS temporarily disabled)'; 