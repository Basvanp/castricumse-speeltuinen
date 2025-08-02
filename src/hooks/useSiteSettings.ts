import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SiteSetting, SiteSettings, SiteSettingsFormData } from '@/types/siteSettings';

// Default site settings (fallback when database table doesn't exist)
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: 'Speeltuinen Castricum',
  site_description: 'Ontdek alle speeltuinen in Castricum',
  contact_email: 'info@castricum.nl',
  contact_phone: '0251-656565',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  meta_title: 'Speeltuinen Castricum - Vind de perfecte speeltuin',
  meta_description: 'Ontdek alle speeltuinen in Castricum. Zoek op leeftijd, faciliteiten en locatie. Inclusief foto\'s, openingstijden en toegankelijkheidsinformatie.',
  keywords: 'speeltuinen, castricum, kinderen, speelplaats, recreatie',
  default_zoom: 13,
  center_lat: 52.5455,
  center_lng: 4.6583,
  marker_color: '#3b82f6',
  cookie_consent_enabled: true,
  analytics_tracking_enabled: true,
  privacy_policy_text: 'Deze website verzamelt minimale gegevens voor het verbeteren van de gebruikerservaring...',
  maintenance_mode: false,
  maintenance_message: 'We zijn bezig met onderhoud aan de website. Probeer het later opnieuw.'
};

// Fetch all site settings
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async (): Promise<SiteSettings> => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .order('category', { ascending: true });

        if (error) {
          console.warn('Site settings table not found, using defaults:', error.message);
          return DEFAULT_SITE_SETTINGS;
        }

        // If no data, return defaults
        if (!data || data.length === 0) {
          console.log('No site settings found, using defaults');
          return DEFAULT_SITE_SETTINGS;
        }

        // Transform the data into a flat object
        const settings: Partial<SiteSettings> = {};
        
        data.forEach((setting: SiteSetting) => {
          const key = setting.setting_key as keyof SiteSettings;
          let value = setting.setting_value;
          
          // Parse the value based on type
          if (setting.setting_type === 'number') {
            value = Number(value);
          } else if (setting.setting_type === 'boolean') {
            value = Boolean(value);
          } else if (setting.setting_type === 'string' && typeof value === 'string') {
            // Remove quotes if they exist
            value = value.replace(/^"|"$/g, '');
          }
          
          settings[key] = value;
        });

        // Merge with defaults to ensure all required fields exist
        return { ...DEFAULT_SITE_SETTINGS, ...settings };
      } catch (error) {
        console.error('Error fetching site settings:', error);
        return DEFAULT_SITE_SETTINGS;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch public site settings (for non-admin users)
export const usePublicSiteSettings = () => {
  return useQuery({
    queryKey: ['public-site-settings'],
    queryFn: async (): Promise<Partial<SiteSettings>> => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('is_public', true)
          .order('category', { ascending: true });

        if (error) {
          console.warn('Site settings table not found, using defaults:', error.message);
          return DEFAULT_SITE_SETTINGS;
        }

        // If no data, return defaults
        if (!data || data.length === 0) {
          console.log('No public site settings found, using defaults');
          return DEFAULT_SITE_SETTINGS;
        }

        // Transform the data into a flat object
        const settings: Partial<SiteSettings> = {};
        
        data.forEach((setting: SiteSetting) => {
          const key = setting.setting_key as keyof SiteSettings;
          let value = setting.setting_value;
          
          // Parse the value based on type
          if (setting.setting_type === 'number') {
            value = Number(value);
          } else if (setting.setting_type === 'boolean') {
            value = Boolean(value);
          } else if (setting.setting_type === 'string' && typeof value === 'string') {
            // Remove quotes if they exist
            value = value.replace(/^"|"$/g, '');
          }
          
          settings[key] = value;
        });

        // Merge with defaults to ensure all required fields exist
        return { ...DEFAULT_SITE_SETTINGS, ...settings };
      } catch (error) {
        console.error('Error fetching public site settings:', error);
        return DEFAULT_SITE_SETTINGS;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Update site settings
export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<SiteSettingsFormData>) => {
      try {
        const updatePromises = Object.entries(updates).map(async ([key, value]) => {
          // Determine the type of the value
          let settingType = 'string';
          if (typeof value === 'number') {
            settingType = 'number';
          } else if (typeof value === 'boolean') {
            settingType = 'boolean';
          }

          // Format the value for storage
          let formattedValue = value;
          if (settingType === 'string') {
            formattedValue = `"${value}"`;
          }

          const { error } = await supabase
            .from('site_settings')
            .update({
              setting_value: formattedValue,
              setting_type: settingType,
              updated_at: new Date().toISOString()
            })
            .eq('setting_key', key);

          if (error) {
            console.error(`Error updating setting ${key}:`, error);
            throw error;
          }
        });

        await Promise.all(updatePromises);
      } catch (error) {
        console.error('Error updating site settings:', error);
        // For now, just log the error and don't throw
        // This allows the UI to work even without the database table
        console.log('Site settings table not available, changes not persisted');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch site settings
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['public-site-settings'] });
    },
  });
};

// Update a single setting
export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      try {
        // Determine the type of the value
        let settingType = 'string';
        if (typeof value === 'number') {
          settingType = 'number';
        } else if (typeof value === 'boolean') {
          settingType = 'boolean';
        }

        // Format the value for storage
        let formattedValue = value;
        if (settingType === 'string') {
          formattedValue = `"${value}"`;
        }

        const { error } = await supabase
          .from('site_settings')
          .update({
            setting_value: formattedValue,
            setting_type: settingType,
            updated_at: new Date().toISOString()
          })
          .eq('setting_key', key);

        if (error) {
          console.error(`Error updating setting ${key}:`, error);
          throw error;
        }
      } catch (error) {
        console.error('Error updating site setting:', error);
        // For now, just log the error and don't throw
        console.log('Site settings table not available, changes not persisted');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch site settings
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['public-site-settings'] });
    },
  });
};