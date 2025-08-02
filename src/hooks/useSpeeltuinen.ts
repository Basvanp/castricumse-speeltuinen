import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Speeltuin, SpeeltuinFilters, Review, Notification, UserPreferences } from '@/types/speeltuin';

// Existing speeltuinen hooks
export const useSpeeltuinen = (filters?: SpeeltuinFilters) => {
  return useQuery({
    queryKey: ['speeltuinen', filters],
    queryFn: async () => {
      let query = supabase
        .from('speeltuinen')
        .select('*')
        .order('naam');

      if (filters?.searchTerm) {
        query = query.ilike('naam', `%${filters.searchTerm}%`);
      }

      if (filters?.hasGlijbaan) {
        query = query.eq('heeft_glijbaan', true);
      }

      if (filters?.hasSchommel) {
        query = query.eq('heeft_schommel', true);
      }

      if (filters?.hasZandbak) {
        query = query.eq('heeft_zandbak', true);
      }

      if (filters?.hasKabelbaan) {
        query = query.eq('heeft_kabelbaan', true);
      }

      if (filters?.hasBankjes) {
        query = query.eq('heeft_bankjes', true);
      }

      if (filters?.hasSportveld) {
        query = query.eq('heeft_sportveld', true);
      }

      if (filters?.typeNatuurspeeltuin) {
        query = query.eq('type_natuurspeeltuin', true);
      }

      if (filters?.typeBuurtspeeltuin) {
        query = query.eq('type_buurtspeeltuin', true);
      }

      if (filters?.typeSchoolplein) {
        query = query.eq('type_schoolplein', true);
      }

      if (filters?.typeSpeelbos) {
        query = query.eq('type_speelbos', true);
      }

      if (filters?.isRolstoeltoegankelijk) {
        query = query.eq('is_rolstoeltoegankelijk', true);
      }

      if (filters?.hasWaterPomp) {
        query = query.eq('heeft_water_pomp', true);
      }

      if (filters?.hasKlimtoestel) {
        query = query.eq('heeft_klimtoestel', true);
      }

      if (filters?.hasSkatebaan) {
        query = query.eq('heeft_skatebaan', true);
      }

      if (filters?.hasBasketbalveld) {
        query = query.eq('heeft_basketbalveld', true);
      }

      if (filters?.hasTrapveld) {
        query = query.eq('heeft_trapveld', true);
      }

      if (filters?.hasWipwap) {
        query = query.eq('heeft_wipwap', true);
      }

      if (filters?.hasDuikelrek) {
        query = query.eq('heeft_duikelrek', true);
      }

      if (filters?.hasSchaduw) {
        query = query.eq('heeft_schaduw', true);
      }

      if (filters?.isOmheind) {
        query = query.eq('is_omheind', true);
      }

      if (filters?.hasParkeerplaats) {
        query = query.eq('heeft_parkeerplaats', true);
      }

      if (filters?.hasToilet) {
        query = query.eq('heeft_toilet', true);
      }

      if (filters?.hasHoreca) {
        query = query.eq('heeft_horeca', true);
      }

      if (filters?.grootte) {
        query = query.eq('grootte', filters.grootte);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Filter by distance if user location is provided
      if (filters?.userLocation && filters?.maxDistance) {
        const filteredData = data.filter((speeltuin) => {
          const distance = calculateDistance(
            filters.userLocation![0],
            filters.userLocation![1],
            speeltuin.latitude,
            speeltuin.longitude
          );
          return distance <= filters.maxDistance!;
        });
        return filteredData;
      }

      return data;
    },
  });
};

export const useCreateSpeeltuin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (speeltuin: Omit<Speeltuin, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('speeltuinen')
        .insert([{
          ...speeltuin,
          toegevoegd_door: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speeltuinen'] });
    },
  });
};

export const useSpeeltuin = (id: string) => {
  return useQuery({
    queryKey: ['speeltuin', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('speeltuinen')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });
};

export const useDeleteSpeeltuin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('speeltuinen')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speeltuinen'] });
    },
  });
};

export const useUpdateSpeeltuin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Speeltuin> }) => {
      const { data, error } = await supabase
        .from('speeltuinen')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['speeltuinen'] });
      queryClient.invalidateQueries({ queryKey: ['speeltuin', data.id] });
    },
  });
};

// Reviews hooks
export const useReviews = (speeltuinId?: string) => {
  return useQuery({
    queryKey: ['reviews', speeltuinId],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          speeltuin:speeltuinen(id, naam, afbeelding_url)
        `)
        .order('created_at', { ascending: false });

      if (speeltuinId) {
        query = query.eq('speeltuin_id', speeltuinId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!speeltuinId,
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'is_verified'>) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', data.speeltuin_id] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Review> }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', data.speeltuin_id] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

// Notifications hooks
export const useNotifications = (userId?: string) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          speeltuin:speeltuinen(id, naam, afbeelding_url)
        `)
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });
};

export const useUnreadNotifications = (userId?: string) => {
  return useQuery({
    queryKey: ['unread-notifications', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId!)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
    },
  });
};

// User preferences hooks
export const useUserPreferences = (userId?: string) => {
  return useQuery({
    queryKey: ['user-preferences', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId!)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<UserPreferences> }) => {
      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences', data.user_id] });
    },
  });
};

// Helper function for distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}