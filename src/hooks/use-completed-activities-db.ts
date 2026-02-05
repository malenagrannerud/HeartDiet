/**
 * TanStack Query hook for managing completed_activities in Supabase
 * Replaces localStorage-based completedActivities storage
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export interface CompletedActivity {
  id: string;
  title: string;
  completedDate: string;
  type: string;
}

interface DbCompletedActivity {
  id: string;
  user_id: string;
  activity_id: string;
  title: string;
  activity_type: string;
  completed_date: string;
  created_at: string;
}

const COMPLETED_ACTIVITIES_KEY = "completedActivities";

/**
 * Fetch all completed activities for the current user
 */
export function useCompletedActivities() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [COMPLETED_ACTIVITIES_KEY, user?.id],
    queryFn: async (): Promise<CompletedActivity[]> => {
      if (!user || !isSupabaseConfigured) return [];

      const { data, error } = await supabase
        .from("completed_activities")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching completed activities:", error);
        throw error;
      }

      return (data as DbCompletedActivity[]).map((a) => ({
        id: a.activity_id,
        title: a.title,
        completedDate: a.completed_date,
        type: a.activity_type,
      }));
    },
    enabled: !!user && isSupabaseConfigured,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Mark an activity as completed
 */
export function useMarkActivityCompleted() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      activityId,
      title,
      type,
    }: {
      activityId: string;
      title: string;
      type: string;
    }) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("completed_activities").upsert(
        {
          user_id: user.id,
          activity_id: activityId,
          title,
          activity_type: type,
          completed_date: format(new Date(), "yyyy-MM-dd"),
        },
        { onConflict: "user_id,activity_id" }
      );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMPLETED_ACTIVITIES_KEY] });
    },
  });
}
