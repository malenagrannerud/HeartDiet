/**
 * ==========================================
 * HEALTH GOALS DATA HOOKS
 * ==========================================
 * 
 * React Query hooks for managing health goals
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/lib/database.types';

type HealthGoalRow = Database['public']['Tables']['health_goals']['Row'];
type HealthGoalInsert = Database['public']['Tables']['health_goals']['Insert'];
type HealthGoalUpdate = Database['public']['Tables']['health_goals']['Update'];

/**
 * Fetch user's health goals
 */
export function useHealthGoals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['health-goals', user?.id],
    queryFn: async (): Promise<HealthGoalRow | null> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('health_goals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

/**
 * Save or update health goals
 */
export function useSaveHealthGoals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goals: Omit<HealthGoalInsert, 'user_id' | 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const goalData: HealthGoalInsert = {
        user_id: user.id,
        ...goals,
      };

      const { data, error } = await supabase
        .from('health_goals')
        .upsert(goalData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-goals'] });
      toast({
        title: 'Mål sparade',
        description: 'Dina hälsomål har sparats.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Fel vid sparande',
        description: error.message,
      });
    },
  });
}
