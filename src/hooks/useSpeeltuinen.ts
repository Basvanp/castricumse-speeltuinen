import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Speeltuin } from '@/types/speeltuin';

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