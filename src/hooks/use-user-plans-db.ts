/**
 * TanStack Query hook for managing user_plans in Supabase
 * Replaces localStorage-based userPlans storage for tip pages
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface UserPlan {
  id?: string; // Database ID
  goal: string;
  when: string;
  how: string;
  reminder: string;
}

interface DbUserPlan {
  id: string;
  user_id: string;
  tip_name: string;
  goal: string;
  when_text: string;
  how: string;
  reminder: string;
  created_at: string;
  updated_at: string;
}

const USER_PLANS_KEY = "userPlans";

/**
 * Convert database format to frontend format
 */
function dbToFrontend(db: DbUserPlan): UserPlan {
  return {
    id: db.id,
    goal: db.goal,
    when: db.when_text,
    how: db.how,
    reminder: db.reminder || "",
  };
}

/**
 * Fetch all user plans for a specific tip
 */
export function useUserPlansDb(tipName: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [USER_PLANS_KEY, tipName, user?.id],
    queryFn: async (): Promise<UserPlan[]> => {
      if (!user || !isSupabaseConfigured) return [];

      const { data, error } = await supabase
        .from("user_plans")
        .select("*")
        .eq("user_id", user.id)
        .eq("tip_name", tipName)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching user plans:", error);
        throw error;
      }

      return (data as DbUserPlan[]).map(dbToFrontend);
    },
    enabled: !!user && isSupabaseConfigured,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Add a new plan
 */
export function useAddUserPlan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tipName,
      plan,
    }: {
      tipName: string;
      plan: Omit<UserPlan, "id">;
    }) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("user_plans").insert({
        user_id: user.id,
        tip_name: tipName,
        goal: plan.goal,
        when_text: plan.when,
        how: plan.how,
        reminder: plan.reminder || "",
      });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [USER_PLANS_KEY, variables.tipName],
      });
    },
  });
}

/**
 * Update an existing plan
 */
export function useUpdateUserPlan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tipName,
      planId,
      plan,
    }: {
      tipName: string;
      planId: string;
      plan: Omit<UserPlan, "id">;
    }) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("user_plans")
        .update({
          goal: plan.goal,
          when_text: plan.when,
          how: plan.how,
          reminder: plan.reminder || "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", planId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [USER_PLANS_KEY, variables.tipName],
      });
    },
  });
}

/**
 * Delete a plan
 */
export function useDeleteUserPlan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tipName,
      planId,
    }: {
      tipName: string;
      planId: string;
    }) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("user_plans")
        .delete()
        .eq("id", planId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [USER_PLANS_KEY, variables.tipName],
      });
    },
  });
}
