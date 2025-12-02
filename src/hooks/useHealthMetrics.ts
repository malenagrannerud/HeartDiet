/**
 * ==========================================
 * HEALTH METRICS DATA HOOKS
 * ==========================================
 * 
 * React Query hooks for managing health metrics data
 * Provides loading, error, and success states automatically
 * 
 * USAGE:
 * const { data: metrics, isLoading } = useHealthMetrics();
 * const saveMetric = useSaveHealthMetric();
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/lib/database.types';

type HealthMetricRow = Database['public']['Tables']['health_metrics']['Row'];
type HealthMetricInsert = Database['public']['Tables']['health_metrics']['Insert'];
type HealthMetricUpdate = Database['public']['Tables']['health_metrics']['Update'];

/**
 * Fetch all health metrics for current user
 */
export function useHealthMetrics() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['health-metrics', user?.id],
    queryFn: async (): Promise<HealthMetricRow[]> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('measurement_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

/**
 * Fetch latest health metric
 */
export function useLatestHealthMetric() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['health-metrics', 'latest', user?.id],
    queryFn: async (): Promise<HealthMetricRow | null> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('measurement_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

/**
 * Save new health metric
 */
export function useSaveHealthMetric() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metric: Omit<HealthMetricInsert, 'user_id' | 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const metricData: HealthMetricInsert = {
        user_id: user.id,
        ...metric,
      };

      const { data, error } = await supabase
        .from('health_metrics')
        .insert(metricData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
      toast({
        title: 'Mätning sparad',
        description: 'Din hälsomätning har sparats.',
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

/**
 * Update existing health metric
 */
export function useUpdateHealthMetric() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...update }: { id: string } & Partial<Omit<HealthMetricRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
      const updateData: HealthMetricUpdate = update;
      
      const { data, error } = await supabase
        .from('health_metrics')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
      toast({
        title: 'Mätning uppdaterad',
        description: 'Din hälsomätning har uppdaterats.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Fel vid uppdatering',
        description: error.message,
      });
    },
  });
}

/**
 * Delete health metric
 */
export function useDeleteHealthMetric() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('health_metrics')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
      toast({
        title: 'Mätning borttagen',
        description: 'Din hälsomätning har tagits bort.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Fel vid borttagning',
        description: error.message,
      });
    },
  });
}

/**
 * Fetch metrics by date range
 */
export function useHealthMetricsByDateRange(startDate: string, endDate: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['health-metrics', 'range', user?.id, startDate, endDate],
    queryFn: async (): Promise<HealthMetricRow[]> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .gte('measurement_date', startDate)
        .lte('measurement_date', endDate)
        .order('measurement_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!startDate && !!endDate,
  });
}
