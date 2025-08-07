-- Check if site_settings table exists and create it if it doesn't
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'site_settings') THEN
        -- Create site_settings table
        CREATE TABLE public.site_settings (
            id SERIAL PRIMARY KEY,
            setting_key VARCHAR(255) NOT NULL UNIQUE,
            setting_value TEXT,
            setting_type VARCHAR(50) NOT NULL DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
            description TEXT,
            category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('site', 'social', 'seo', 'map', 'privacy', 'maintenance', 'general')),
            is_public BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );

        -- Enable RLS
        ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Anyone can read public site settings" 
        ON public.site_settings 
        FOR SELECT 
        USING (
            setting_key NOT LIKE '%_secret%' AND 
            setting_key NOT LIKE '%_key%' AND 
            setting_key NOT LIKE '%_token%'
        );

        CREATE POLICY "Admins can read all site settings" 
        ON public.site_settings 
        FOR SELECT 
        USING (is_admin());

        CREATE POLICY "Only admins can modify site settings" 
        ON public.site_settings 
        FOR ALL 
        USING (is_admin()) 
        WITH CHECK (is_admin());

        -- Create trigger for updated_at
        CREATE TRIGGER update_site_settings_updated_at
        BEFORE UPDATE ON public.site_settings
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();

        -- Insert default settings
        INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description, category, is_public) VALUES
        ('site_name', 'Speeltuinen Castricum', 'string', 'Naam van de website', 'site', true),
        ('site_description', 'Ontdek de beste speeltuinen in Castricum. Een complete gids voor ouders en kinderen.', 'string', 'Beschrijving van de website', 'site', true),
        ('contact_email', 'hallo@speeltuincastricum.nl', 'string', 'Contact email adres', 'site', true),
        ('contact_phone', 'volgt nog', 'string', 'Contact telefoonnummer', 'site', true),
        ('facebook_url', '', 'string', 'Facebook pagina URL', 'social', true),
        ('instagram_url', '', 'string', 'Instagram pagina URL', 'social', true),
        ('twitter_url', '', 'string', 'Twitter/X pagina URL', 'social', true),
        ('meta_title', 'Speeltuinen Castricum - Complete Gids', 'string', 'SEO meta title', 'seo', true),
        ('meta_description', 'Ontdek alle speeltuinen in Castricum. Vind de perfecte speelplek voor je kinderen met onze interactieve kaart en uitgebreide informatie.', 'string', 'SEO meta description', 'seo', true),
        ('keywords', 'speeltuinen, castricum, kinderen, spelen, playground, familie, outdoor', 'string', 'SEO keywords', 'seo', true),
        ('default_zoom', '13', 'number', 'Default zoom level voor de kaart', 'map', true),
        ('center_lat', '52.5486', 'number', 'Kaart center latitude', 'map', true),
        ('center_lng', '4.6695', 'number', 'Kaart center longitude', 'map', true),
        ('marker_color', '#3b82f6', 'string', 'Kleur van de markers op de kaart', 'map', true),
        ('cookie_consent_enabled', 'true', 'boolean', 'Cookie consent banner inschakelen', 'privacy', true),
        ('analytics_tracking_enabled', 'true', 'boolean', 'Analytics tracking inschakelen', 'privacy', true),
        ('privacy_policy_text', 'Wij gebruiken koekjes om je ervaring op onze speeltuin website nog leuker te maken! Deze helpen ons om de website te verbeteren en te onthouden wat je leuk vindt. Geen zorgen, het zijn alleen digitale koekjes! 😊', 'string', 'Privacy policy tekst voor cookie banner', 'privacy', true),
        ('maintenance_mode', 'false', 'boolean', 'Onderhoudsmodus inschakelen', 'maintenance', false),
        ('maintenance_message', 'De website is tijdelijk niet beschikbaar wegens onderhoud. We zijn zo snel mogelijk weer online!', 'string', 'Bericht dat wordt getoond tijdens onderhoud', 'maintenance', false);

    END IF;
END $$;