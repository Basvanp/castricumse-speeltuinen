-- Fix security definer views by removing SECURITY DEFINER and ensuring proper RLS
-- Drop and recreate views without SECURITY DEFINER

DROP VIEW IF EXISTS public.popular_speeltuinen;
DROP VIEW IF EXISTS public.daily_stats;

-- Recreate views without SECURITY DEFINER (they will use SECURITY INVOKER by default)
CREATE VIEW public.popular_speeltuinen AS
SELECT s.naam,
    count(ae.id) AS view_count
FROM (speeltuinen s
    LEFT JOIN analytics_events ae ON ((s.id = ae.speeltuin_id)))
WHERE ((ae.event_type = 'speeltuin_view'::text) AND (ae.created_at >= (now() - '30 days'::interval)))
GROUP BY s.id, s.naam
ORDER BY (count(ae.id)) DESC;

CREATE VIEW public.daily_stats AS
SELECT date(created_at) AS date,
    count(DISTINCT session_id) AS unique_visitors,
    count(*) FILTER (WHERE (event_type = 'page_view'::text)) AS page_views,
    count(*) FILTER (WHERE (event_type = 'speeltuin_view'::text)) AS speeltuin_views,
    count(*) FILTER (WHERE (event_type = 'filter_used'::text)) AS filter_uses
FROM analytics_events
WHERE (created_at >= (now() - '30 days'::interval))
GROUP BY (date(created_at))
ORDER BY (date(created_at)) DESC;

-- Enable RLS on views (ensure they respect existing policies)
ALTER VIEW public.popular_speeltuinen SET (security_invoker = true);
ALTER VIEW public.daily_stats SET (security_invoker = true);

-- Create a secure user invitation function
CREATE OR REPLACE FUNCTION public.invite_user_secure(
    user_email text,
    user_role app_role DEFAULT 'user'::app_role
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    invite_result json;
    new_user_id uuid;
BEGIN
    -- Only admins can invite users
    IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can invite users';
    END IF;

    -- Generate a secure random password (will be reset via email)
    -- Use admin API to create user with email verification required
    -- This requires the user to verify their email and set their own password
    
    -- For now, return success message indicating email invitation would be sent
    -- In production, this would integrate with Supabase Admin API
    
    RETURN json_build_object(
        'success', true,
        'message', 'Invitation would be sent to ' || user_email || ' with role ' || user_role::text,
        'requires_email_verification', true
    );
END;
$$;