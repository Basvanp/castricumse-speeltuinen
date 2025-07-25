-- Create analytics_events table
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  speeltuin_id UUID REFERENCES public.speeltuinen(id),
  session_id TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Analytics events are publicly readable"
ON public.analytics_events
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert analytics events"
ON public.analytics_events
FOR INSERT
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_speeltuin_id ON public.analytics_events(speeltuin_id);

-- Create view for popular speeltuinen
CREATE VIEW public.popular_speeltuinen AS
SELECT 
  s.naam,
  COUNT(ae.id) as view_count
FROM public.speeltuinen s
LEFT JOIN public.analytics_events ae ON s.id = ae.speeltuin_id 
WHERE ae.event_type = 'speeltuin_view'
  AND ae.created_at >= NOW() - INTERVAL '30 days'
GROUP BY s.id, s.naam
ORDER BY view_count DESC;

-- Create view for daily stats
CREATE VIEW public.daily_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT session_id) as unique_visitors,
  COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
  COUNT(*) FILTER (WHERE event_type = 'speeltuin_view') as speeltuin_views,
  COUNT(*) FILTER (WHERE event_type = 'filter_used') as filter_uses
FROM public.analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;