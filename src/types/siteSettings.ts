export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  category: 'site' | 'social' | 'seo' | 'map' | 'privacy' | 'maintenance' | 'general';
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  // Site Information
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  
  // Social Media
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  
  // SEO Settings
  meta_title: string;
  meta_description: string;
  keywords: string;
  
  // Map Settings
  default_zoom: number;
  center_lat: number;
  center_lng: number;
  marker_color: string;
  
  // Privacy Settings
  cookie_consent_enabled: boolean;
  analytics_tracking_enabled: boolean;
  privacy_policy_text: string;
  
  // Maintenance Settings
  maintenance_mode: boolean;
  maintenance_message: string;
}

export interface SiteSettingsFormData {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  default_zoom: number;
  center_lat: number;
  center_lng: number;
  marker_color: string;
  cookie_consent_enabled: boolean;
  analytics_tracking_enabled: boolean;
  privacy_policy_text: string;
  maintenance_mode: boolean;
  maintenance_message: string;
} 