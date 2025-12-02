import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Database } from '@/lib/database.types';

type HealthPriority = Database['public']['Tables']['health_priorities']['Row'];
type HealthPriorityInsert = Database['public']['Tables']['health_priorities']['Insert'];

/**
 * Hook to fetch user's health priorities (selected goals like cholesterol, blood pressure, etc.)
 */
export const useHealthPriorities = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['healthPriorities', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('health_priorities')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      // Return null if no data found (not an error)
      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      
      return data;
    },
    enabled: !!user,
  });
};

/**
 * Hook to save user's health priorities
 */
export const useSaveHealthPriorities = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (priorities: string[]) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('health_priorities')
        .upsert({
          user_id: user.id,
          priorities,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthPriorities'] });
      toast({
        title: 'Sparat',
        description: 'Dina hälsomål har sparats',
      });
    },
    onError: (error) => {
      console.error('Error saving health priorities:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte spara hälsomål',
        variant: 'destructive',
      });
    },
  });
};
