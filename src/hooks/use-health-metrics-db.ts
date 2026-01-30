/**
 * TanStack Query hook for managing health_metrics in Supabase
 * Stores user health goals and static data (height, goal values)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface HealthMetrics {
  height?: string;
  goalWeight?: string;
  goalSystolic?: string;
  goalDiastolic?: string;
  goalLDL?: string;
  goalHDL?: string;
  goalHbA1c?: string;
  goalFastingGlucose?: string;
}

interface DbHealthMetrics {
  id: string;
  user_id: string;
  height: string | null;
  goal_weight: string | null;
  goal_systolic: string | null;
  goal_diastolic: string | null;
  goal_ldl: string | null;
  goal_hdl: string | null;
  goal_hba1c: string | null;
  goal_fasting_glucose: string | null;
  created_at: string;
  updated_at: string;
}

const HEALTH_METRICS_KEY = "healthMetrics";

/**
 * Convert database format to frontend format
 */
function dbToFrontend(db: DbHealthMetrics): HealthMetrics {
  return {
    height: db.height || undefined,
    goalWeight: db.goal_weight || undefined,
    goalSystolic: db.goal_systolic || undefined,
    goalDiastolic: db.goal_diastolic || undefined,
    goalLDL: db.goal_ldl || undefined,
    goalHDL: db.goal_hdl || undefined,
    goalHbA1c: db.goal_hba1c || undefined,
    goalFastingGlucose: db.goal_fasting_glucose || undefined,
  };
}

/**
 * Convert frontend format to database format
 */
function frontendToDb(metrics: HealthMetrics): Partial<DbHealthMetrics> {
  return {
    height: metrics.height || null,
    goal_weight: metrics.goalWeight || null,
    goal_systolic: metrics.goalSystolic || null,
    goal_diastolic: metrics.goalDiastolic || null,
    goal_ldl: metrics.goalLDL || null,
    goal_hdl: metrics.goalHDL || null,
    goal_hba1c: metrics.goalHbA1c || null,
    goal_fasting_glucose: metrics.goalFastingGlucose || null,
  };
}

/**
 * Fetch health metrics for the current user
 */
export function useHealthMetricsDb() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [HEALTH_METRICS_KEY, user?.id],
    queryFn: async (): Promise<HealthMetrics | null> => {
      if (!user || !isSupabaseConfigured) return null;

      const { data, error } = await supabase
        .from("health_metrics")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching health metrics:", error);
        throw error;
      }

      return data ? dbToFrontend(data as DbHealthMetrics) : null;
    },
    enabled: !!user && isSupabaseConfigured,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Update or create health metrics
 */
export function useUpdateHealthMetrics() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metrics: Partial<HealthMetrics>) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      // Check if record exists
      const { data: existing } = await supabase
        .from("health_metrics")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      const dbData = frontendToDb(metrics as HealthMetrics);

      if (existing) {
        const { error } = await supabase
          .from("health_metrics")
          .update({
            ...dbData,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("health_metrics").insert({
          user_id: user.id,
          ...dbData,
        });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HEALTH_METRICS_KEY] });
    },
  });
}
