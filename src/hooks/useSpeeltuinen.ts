import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Speeltuin, SpeeltuinFilters, Favorite, Review, Notification, UserPreferences } from '@/types/speeltuin';

export const useSpeeltuinen = () => {
  return useQuery({
    queryKey: ['speeltuinen'],
    queryFn: async (): Promise<Speeltuin[]> => {
      const { data, error } = await supabase
        .from('speeltuinen')
        .select('*')
        .order('naam');
      
      if (error) {
        throw error;
      }
      
      // Convert the database response to match our Speeltuin type
      return (data || []).map(speeltuin => ({
        ...speeltuin,
        fotos: speeltuin.fotos || []
      })) as Speeltuin[];
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

export const useUpdateSpeeltuin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Speeltuin> & { id: string }) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speeltuinen'] });
    },
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

// Favorites hooks
export const useFavorites = (userId?: string) => {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: async (): Promise<Favorite[]> => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          speeltuin:speeltuinen(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ speeltuinId, userId }: { speeltuinId: string; userId: string }) => {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          speeltuin_id: speeltuinId,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ speeltuinId, userId }: { speeltuinId: string; userId: string }) => {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('speeltuin_id', speeltuinId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
    },
  });
};

export const useIsFavorite = (speeltuinId: string, userId?: string) => {
  return useQuery({
    queryKey: ['favorite', speeltuinId, userId],
    queryFn: async (): Promise<boolean> => {
      if (!userId) return false;
      
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('speeltuin_id', speeltuinId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return !!data;
    },
    enabled: !!userId,
  });
};

// Reviews hooks
export const useReviews = (speeltuinId: string) => {
  return useQuery({
    queryKey: ['reviews', speeltuinId],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          speeltuin:speeltuinen(*),
          user:profiles(name, avatar_url)
        `)
        .eq('speeltuin_id', speeltuinId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'is_verified'>) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          ...review,
          is_verified: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { speeltuin_id }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', speeltuin_id] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...review }: Partial<Review> & { id: string }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          ...review,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { speeltuin_id }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', speeltuin_id] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, speeltuinId }: { id: string; speeltuinId: string }) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, { speeltuinId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', speeltuinId] });
    },
  });
};

// Notifications hooks
export const useNotifications = (userId?: string) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async (): Promise<Notification[]> => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          speeltuin:speeltuinen(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

export const useUnreadNotifications = (userId?: string) => {
  return useQuery({
    queryKey: ['unread-notifications', userId],
    queryFn: async (): Promise<number> => {
      if (!userId) return 0;
      
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications', userId] });
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

      if (error) throw error;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications', userId] });
    },
  });
};

// User preferences hooks
export const useUserPreferences = (userId?: string) => {
  return useQuery({
    queryKey: ['user-preferences', userId],
    queryFn: async (): Promise<UserPreferences | null> => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    },
    enabled: !!userId,
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, ...preferences }: Partial<UserPreferences> & { userId: string }) => {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences', userId] });
    },
  });
};