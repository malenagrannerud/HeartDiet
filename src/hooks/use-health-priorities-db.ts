/**
 * TanStack Query hook for managing health_priorities in Supabase
 * Replaces localStorage-based healthPriorities storage
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface HealthPriorities {
  priorities: string[];
}

interface DbHealthPriorities {
  id: string;
  user_id: string;
  priorities: string[];
  created_at: string;
  updated_at: string;
}

const HEALTH_PRIORITIES_KEY = "healthPriorities";

/**
 * Fetch health priorities for the current user
 */
export function useHealthPriorities() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [HEALTH_PRIORITIES_KEY, user?.id],
    queryFn: async (): Promise<HealthPriorities | null> => {
      if (!user || !isSupabaseConfigured) return null;

      const { data, error } = await supabase
        .from("health_priorities")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching health priorities:", error);
        throw error;
      }

      return data
        ? { priorities: (data as DbHealthPriorities).priorities || [] }
        : null;
    },
    enabled: !!user && isSupabaseConfigured,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Update or create health priorities
 */
export function useUpdateHealthPriorities() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (priorities: string[]) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      // Check if record exists
      const { data: existing } = await supabase
        .from("health_priorities")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("health_priorities")
          .update({
            priorities,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("health_priorities").insert({
          user_id: user.id,
          priorities,
        });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HEALTH_PRIORITIES_KEY] });
    },
  });
}
