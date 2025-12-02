import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

/**
 * Hook to fetch all user's health data (metrics + goals combined)
 * This is a convenience hook that combines health metrics and goals
 */
export const useHealthData = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['healthData', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Fetch both metrics and goals in parallel
      const [metricsResult, goalsResult] = await Promise.all([
        supabase
          .from('health_metrics')
          .select('*')
          .eq('user_id', user.id)
          .order('measurement_date', { ascending: false }),
        supabase
          .from('health_goals')
          .select('*')
          .eq('user_id', user.id)
          .single(),
      ]);
      
      if (metricsResult.error && metricsResult.error.code !== 'PGRST116') {
        throw metricsResult.error;
      }
      
      return {
        metrics: metricsResult.data || [],
        goals: goalsResult.data || null,
      };
    },
    enabled: !!user,
  });
};
