import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: string;
  description: string | null;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async (): Promise<Record<string, string>> => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value');
      
      if (error) {
        throw error;
      }
      
      // Convert array to object for easier access
      const settings: Record<string, string> = {};
      data?.forEach(setting => {
        if (setting.setting_value) {
          settings[setting.setting_key] = setting.setting_value;
        }
      });
      
      return settings;
    },
  });
};

export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data, error } = await supabase
        .from('site_settings')
        .update({ setting_value: value })
        .eq('setting_key', key)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
};

export const useUpdateMultipleSiteSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: Record<string, string>) => {
      const updates = Object.entries(settings).map(async ([key, value]) => {
        return supabase
          .from('site_settings')
          .update({ setting_value: value })
          .eq('setting_key', key);
      });
      
      const results = await Promise.all(updates);
      
      // Check for errors
      for (const result of results) {
        if (result.error) {
          throw result.error;
        }
      }
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
};