import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate a session ID that persists during the user's visit
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export const useAnalytics = () => {
  const trackEvent = useCallback(async (
    eventType: string, 
    speeltuinId?: string, 
    additionalData?: Record<string, any>
  ) => {
    try {
      await supabase
        .from('analytics_events')
        .insert({
          event_type: eventType,
          speeltuin_id: speeltuinId || null,
          session_id: getSessionId(),
          user_agent: navigator.userAgent,
          ...additionalData
        });
    } catch (error) {
      // Silently fail analytics to not disrupt user experience
      console.error('Analytics tracking failed:', error);
    }
  }, []);

  return { trackEvent };
};