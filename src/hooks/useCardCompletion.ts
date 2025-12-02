import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

/**
 * Hook to fetch card completion status from database
 */
export const useCardCompletion = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['cardCompletion', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('completed_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

/**
 * Hook to mark a card as completed
 */
export const useMarkCardComplete = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cardData: {
      cardId: string;
      title: string;
      completedDate: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('completed_activities')
        .insert({
          user_id: user.id,
          activity_id: cardData.cardId,
          activity_title: cardData.title,
          activity_type: 'card',
          completed_date: cardData.completedDate,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cardCompletion'] });
    },
  });
};
