-- Create site_settings table for persistent storage of site configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL DEFAULT 'string',
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Site settings are viewable by everyone" ON site_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Site settings are manageable by authenticated users" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description, category, is_public) VALUES
-- Site Information
('site_name', '"Speeltuinen Castricum"', 'string', 'Site naam', 'site', true),
('site_description', '"Ontdek alle speeltuinen in Castricum"', 'string', 'Site beschrijving', 'site', true),
('contact_email', '"hallo@speeltuincastricum.nl"', 'string', 'Contact email', 'site', true),
('contact_phone', '"volgt nog"', 'string', 'Telefoonnummer', 'site', true),

-- Social Media
('facebook_url', '""', 'string', 'Facebook URL', 'social', true),
('instagram_url', '""', 'string', 'Instagram URL', 'social', true),
('twitter_url', '""', 'string', 'Twitter/X URL', 'social', true),

-- SEO Settings
('meta_title', '"Speeltuinen Castricum - Vind de perfecte speeltuin"', 'string', 'Meta title', 'seo', true),
('meta_description', '"Ontdek alle speeltuinen in Castricum. Zoek op leeftijd, faciliteiten en locatie. Inclusief foto''s, openingstijden en toegankelijkheidsinformatie."', 'string', 'Meta description', 'seo', true),
('keywords', '"speeltuinen, castricum, kinderen, speelplaats, recreatie"', 'string', 'Keywords', 'seo', true),

-- Map Settings
('default_zoom', '13', 'number', 'Default zoom level', 'map', true),
('center_lat', '52.5455', 'number', 'Center latitude', 'map', true),
('center_lng', '4.6583', 'number', 'Center longitude', 'map', true),
('marker_color', '"#3b82f6"', 'string', 'Marker kleur', 'map', true),

-- Privacy Settings
('cookie_consent_enabled', 'true', 'boolean', 'Cookie consent enabled', 'privacy', false),
('analytics_tracking_enabled', 'true', 'boolean', 'Analytics tracking enabled', 'privacy', false),
('privacy_policy_text', '"Deze website verzamelt minimale gegevens voor het verbeteren van de gebruikerservaring..."', 'string', 'Privacy policy text', 'privacy', true),

-- Maintenance Settings
('maintenance_mode', 'false', 'boolean', 'Maintenance mode enabled', 'maintenance', false),
('maintenance_message', '"We zijn bezig met onderhoud aan de website. Probeer het later opnieuw."', 'string', 'Maintenance message', 'maintenance', true)

ON CONFLICT (setting_key) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at(); 