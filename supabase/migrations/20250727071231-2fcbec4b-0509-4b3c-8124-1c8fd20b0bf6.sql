-- Create site_settings table for SEO and other site-wide settings
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT NOT NULL DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Site settings are publicly readable" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can update site settings" 
ON public.site_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default SEO settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description) VALUES
  ('site_name', 'Castricum Speeltuinen Gids', 'text', 'De naam van de website'),
  ('site_description', 'Ontdek alle speeltuinen in Castricum en omgeving. Complete gids met foto''s, faciliteiten en locatie-informatie.', 'text', 'Korte beschrijving van de website'),
  ('meta_title', 'Castricum Speeltuinen Gids - Alle Speeltuinen in Castricum', 'text', 'Meta title voor SEO'),
  ('meta_description', 'Vind de perfecte speeltuin in Castricum! Complete overzicht met foto''s, faciliteiten, leeftijdsgroepen en locaties. Ideaal voor gezinnen met kinderen.', 'text', 'Meta beschrijving voor SEO'),
  ('meta_keywords', 'speeltuinen, Castricum, kinderen, gezin, spelen, Noord-Holland', 'text', 'Meta keywords voor SEO'),
  ('contact_email', 'hallo@speeltuincastricum.nl', 'email', 'Contact email adres'),
  ('contact_phone', 'volgt nog', 'text', 'Contact telefoonnummer'),
  ('social_facebook', 'https://facebook.com/castricum-speeltuinen', 'url', 'Facebook pagina URL'),
  ('social_instagram', 'https://instagram.com/castricum_speeltuinen', 'url', 'Instagram profiel URL'),
  ('social_twitter', 'https://twitter.com/castricum_play', 'url', 'Twitter profiel URL'),
  ('map_zoom', '12', 'number', 'Standaard zoom level voor de kaart'),
  ('map_center_lat', '52.5463', 'number', 'Standaard latitude voor kaart centrum'),
  ('map_center_lng', '4.6748', 'number', 'Standaard longitude voor kaart centrum'),
  ('organization_name', 'Gemeente Castricum', 'text', 'Naam van de organisatie'),
  ('organization_address', 'Dorpsstraat 30, 1901 EN Castricum', 'text', 'Adres van de organisatie'),
  ('enable_analytics', 'true', 'boolean', 'Analytics tracking inschakelen'),
  ('privacy_policy', 'Wij respecteren uw privacy en gebruiken alleen noodzakelijke cookies.', 'textarea', 'Privacy policy tekst');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();