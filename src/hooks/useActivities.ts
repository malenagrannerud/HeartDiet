import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

/**
 * Hook to fetch user's completed activities from database
 */
export const useActivities = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['activities', user?.id],
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
 * Hook to save a completed activity
 */
export const useSaveActivity = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (activity: {
      id: string;
      title: string;
      completedDate: string;
      type?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('completed_activities')
        .insert({
          user_id: user.id,
          activity_id: activity.id,
          activity_title: activity.title,
          activity_type: activity.type || 'general',
          completed_date: activity.completedDate,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: (error) => {
      console.error('Error saving activity:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte spara aktivitet',
        variant: 'destructive',
      });
    },
  });
};
