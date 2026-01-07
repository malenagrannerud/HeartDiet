/**
 * TanStack Query hook for managing marked_tips in Supabase
 * Replaces localStorage-based markedTips storage
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export interface MarkedTip {
  id: number;
  markedDate: string;
  color: string;
}

interface DbMarkedTip {
  id: string;
  user_id: string;
  tip_id: number;
  marked_date: string;
  color: string;
  created_at: string;
}

const MARKED_TIPS_KEY = "markedTips";

/**
 * Fetch all marked tips for the current user
 */
export function useMarkedTips() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [MARKED_TIPS_KEY, user?.id],
    queryFn: async (): Promise<MarkedTip[]> => {
      if (!user || !isSupabaseConfigured) return [];

      const { data, error } = await supabase
        .from("marked_tips")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching marked tips:", error);
        throw error;
      }

      return (data as DbMarkedTip[]).map((tip) => ({
        id: tip.tip_id,
        markedDate: tip.marked_date,
        color: tip.color,
      }));
    },
    enabled: !!user && isSupabaseConfigured,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Mark or unmark a tip
 */
export function useToggleMarkedTip() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tipId,
      color,
    }: {
      tipId: number;
      color: string;
    }): Promise<boolean> => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      // Check if tip is already marked
      const { data: existing } = await supabase
        .from("marked_tips")
        .select("id")
        .eq("user_id", user.id)
        .eq("tip_id", tipId)
        .maybeSingle();

      if (existing) {
        // Unmark (delete)
        const { error } = await supabase
          .from("marked_tips")
          .delete()
          .eq("id", existing.id);

        if (error) throw error;
        return false; // No longer marked
      } else {
        // Mark (insert)
        const { error } = await supabase.from("marked_tips").insert({
          user_id: user.id,
          tip_id: tipId,
          marked_date: format(new Date(), "yyyy-MM-dd"),
          color,
        });

        if (error) throw error;
        return true; // Now marked
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MARKED_TIPS_KEY] });
    },
  });
}

/**
 * Add a marked tip
 */
export function useAddMarkedTip() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tipId,
      color,
    }: {
      tipId: number;
      color: string;
    }) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("marked_tips").upsert(
        {
          user_id: user.id,
          tip_id: tipId,
          marked_date: format(new Date(), "yyyy-MM-dd"),
          color,
        },
        { onConflict: "user_id,tip_id" }
      );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MARKED_TIPS_KEY] });
    },
  });
}

/**
 * Remove a marked tip
 */
export function useRemoveMarkedTip() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tipId: number) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("marked_tips")
        .delete()
        .eq("user_id", user.id)
        .eq("tip_id", tipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MARKED_TIPS_KEY] });
    },
  });
}
