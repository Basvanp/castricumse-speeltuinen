import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SiteSetting, SiteSettings, SiteSettingsFormData } from '@/types/siteSettings';

// Fetch all site settings
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }

      // Transform the data into a flat object
      const settings: Partial<SiteSettings> = {};
      
      data?.forEach((setting: SiteSetting) => {
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

      return settings as SiteSettings;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch public site settings (for non-admin users)
export const usePublicSiteSettings = () => {
  return useQuery({
    queryKey: ['public-site-settings'],
    queryFn: async (): Promise<Partial<SiteSettings>> => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('is_public', true)
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching public site settings:', error);
        throw error;
      }

      // Transform the data into a flat object
      const settings: Partial<SiteSettings> = {};
      
      data?.forEach((setting: SiteSetting) => {
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

      return settings;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Update site settings
export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<SiteSettingsFormData>) => {
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
    },
    onSuccess: () => {
      // Invalidate and refetch site settings
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['public-site-settings'] });
    },
  });
};