-- Create Missing Tables
-- This migration creates all missing tables that are referenced in the code

-- 1. Create audit_logs table
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

-- 2. Create reviews table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  speeltuin_id UUID NOT NULL REFERENCES public.speeltuinen(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pros TEXT,
  cons TEXT,
  visit_date DATE,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Create notifications table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('new_speeltuin', 'review_response', 'favorite_update', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  speeltuin_id UUID REFERENCES public.speeltuinen(id) ON DELETE CASCADE,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Create user_preferences table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID NOT NULL PRIMARY KEY,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  favorite_notifications BOOLEAN DEFAULT true,
  review_notifications BOOLEAN DEFAULT true,
  new_speeltuin_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Create favorites table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  speeltuin_id UUID NOT NULL REFERENCES public.speeltuinen(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, speeltuin_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

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

-- Create policies for reviews
CREATE POLICY "Reviews are publicly viewable" 
ON public.reviews
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own reviews" 
ON public.reviews
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON public.user_preferences
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for favorites
CREATE POLICY "Users can view their own favorites" 
ON public.favorites
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" 
ON public.favorites
FOR ALL 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON public.audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_reviews_speeltuin_id ON public.reviews(speeltuin_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_speeltuin_id ON public.favorites(speeltuin_id);

-- Add comments for documentation
COMMENT ON TABLE public.audit_logs IS 'Audit log table for tracking user actions';
COMMENT ON TABLE public.reviews IS 'User reviews for playgrounds';
COMMENT ON TABLE public.notifications IS 'User notifications';
COMMENT ON TABLE public.user_preferences IS 'User notification preferences';
COMMENT ON TABLE public.favorites IS 'User favorite playgrounds'; 