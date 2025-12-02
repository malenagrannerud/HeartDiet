import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

/**
 * Hook to save health data (combined metrics and goals)
 * This is a convenience hook that can save either metrics or goals
 */
export const useSaveHealthData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: {
      metrics?: any;
      goals?: any;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const results = {
        metrics: null as any,
        goals: null as any,
      };
      
      // Save metrics if provided
      if (data.metrics) {
        const { data: metricsData, error: metricsError } = await supabase
          .from('health_metrics')
          .insert({
            user_id: user.id,
            ...data.metrics,
          })
          .select()
          .single();
        
        if (metricsError) throw metricsError;
        results.metrics = metricsData;
      }
      
      // Save goals if provided
      if (data.goals) {
        const { data: goalsData, error: goalsError } = await supabase
          .from('health_goals')
          .upsert({
            user_id: user.id,
            ...data.goals,
          })
          .select()
          .single();
        
        if (goalsError) throw goalsError;
        results.goals = goalsData;
      }
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthData'] });
      queryClient.invalidateQueries({ queryKey: ['healthMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['healthGoals'] });
    },
    onError: (error) => {
      console.error('Error saving health data:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte spara hälsodata',
        variant: 'destructive',
      });
    },
  });
};
