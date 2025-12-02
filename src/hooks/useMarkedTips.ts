import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

/**
 * Hook to fetch user's marked tips from database
 */
export const useMarkedTips = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['markedTips', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('marked_tips')
        .select('*')
        .eq('user_id', user.id)
        .order('marked_date', { ascending: false });
      
      if (error) throw error;
      
      // Transform to match expected format
      return data.map(tip => ({
        id: tip.tip_id,
        markedDate: tip.marked_date,
        color: tip.color,
      }));
    },
    enabled: !!user,
  });
};

/**
 * Hook to save a marked tip
 */
export const useSaveMarkedTip = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tip: { id: number; color: string; markedDate: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('marked_tips')
        .insert({
          user_id: user.id,
          tip_id: tip.id,
          color: tip.color,
          marked_date: tip.markedDate,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markedTips'] });
    },
  });
};

/**
 * Hook to delete a marked tip
 */
export const useDeleteMarkedTip = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tipId: number) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('marked_tips')
        .delete()
        .eq('user_id', user.id)
        .eq('tip_id', tipId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markedTips'] });
    },
  });
};
