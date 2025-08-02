import { useCallback, useState, useEffect } from 'react';
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

// Check if analytics is enabled based on cookie consent
const isAnalyticsEnabled = () => {
  const cookieConsent = localStorage.getItem('cookieConsent');
  const analyticsEnabled = localStorage.getItem('analyticsEnabled');
  
  // If user explicitly declined cookies, don't track
  if (cookieConsent === 'declined') {
    return false;
  }
  
  // If user accepted cookies and analytics is enabled, track
  if (cookieConsent === 'accepted' && analyticsEnabled === 'true') {
    return true;
  }
  
  // If no consent given yet, don't track
  return false;
};

export const useAnalytics = () => {
  const trackEvent = useCallback(async (
    eventType: string, 
    speeltuinId?: string, 
    additionalData?: Record<string, any>
  ) => {
    // Only track if analytics is enabled
    if (!isAnalyticsEnabled()) {
      return;
    }

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

// Hook to manage cookie consent
export const useCookieConsent = () => {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    const analytics = localStorage.getItem('analyticsEnabled');
    
    setHasConsented(cookieConsent === 'accepted' || cookieConsent === 'declined');
    setAnalyticsEnabled(analytics === 'true');
  }, []);

  const acceptCookies = useCallback((enableAnalytics: boolean = true) => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('analyticsEnabled', enableAnalytics ? 'true' : 'false');
    setHasConsented(true);
    setAnalyticsEnabled(enableAnalytics);
  }, []);

  const declineCookies = useCallback(() => {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('analyticsEnabled', 'false');
    setHasConsented(true);
    setAnalyticsEnabled(false);
  }, []);

  const updateAnalyticsPreference = useCallback((enabled: boolean) => {
    localStorage.setItem('analyticsEnabled', enabled ? 'true' : 'false');
    setAnalyticsEnabled(enabled);
  }, []);

  return {
    hasConsented,
    analyticsEnabled,
    acceptCookies,
    declineCookies,
    updateAnalyticsPreference,
    isAnalyticsEnabled: () => isAnalyticsEnabled()
  };
};