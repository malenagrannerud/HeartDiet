/**
 * TanStack Query hook for managing card_completions in Supabase
 * Replaces localStorage-based card completion tracking
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { format, subDays } from "date-fns";

export type CardId = "tutorial" | "health-goals" | "medications" | "health-metrics";

export interface CardCompletion {
  cardId: CardId;
  completedDate: string;
}

interface DbCardCompletion {
  id: string;
  user_id: string;
  card_id: string;
  completed_date: string;
  created_at: string;
}

const CARD_COMPLETIONS_KEY = "cardCompletions";

/**
 * Fetch all card completions for the current user
 */
export function useCardCompletions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [CARD_COMPLETIONS_KEY, user?.id],
    queryFn: async (): Promise<CardCompletion[]> => {
      if (!user || !isSupabaseConfigured) return [];

      // Only fetch completions from the last 7 days
      const sevenDaysAgo = format(subDays(new Date(), 7), "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("card_completions")
        .select("*")
        .eq("user_id", user.id)
        .gte("completed_date", sevenDaysAgo);

      if (error) {
        console.error("Error fetching card completions:", error);
        throw error;
      }

      return (data as DbCardCompletion[]).map((c) => ({
        cardId: c.card_id as CardId,
        completedDate: c.completed_date,
      }));
    },
    enabled: !!user && isSupabaseConfigured,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Mark a card as completed today
 */
export function useMarkCardCompleted() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cardId: CardId) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      const today = format(new Date(), "yyyy-MM-dd");

      // Upsert to handle "already completed today" case
      const { error } = await supabase.from("card_completions").upsert(
        {
          user_id: user.id,
          card_id: cardId,
          completed_date: today,
        },
        { onConflict: "user_id,card_id,completed_date" }
      );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CARD_COMPLETIONS_KEY] });
    },
  });
}

/**
 * Check if a card is completed today
 */
export function isCardCompletedToday(
  completions: CardCompletion[],
  cardId: CardId
): boolean {
  const today = format(new Date(), "yyyy-MM-dd");
  return completions.some(
    (c) => c.cardId === cardId && c.completedDate === today
  );
}

/**
 * Check if a card was completed on a different day (should be hidden)
 */
export function wasCardCompletedOnDifferentDay(
  completions: CardCompletion[],
  cardId: CardId
): boolean {
  const today = format(new Date(), "yyyy-MM-dd");
  const completion = completions.find((c) => c.cardId === cardId);
  return completion ? completion.completedDate !== today : false;
}

/**
 * Get cards that should be hidden (completed on previous days)
 */
export function getCardsToHide(
  completions: CardCompletion[]
): Record<CardId, boolean> {
  const today = format(new Date(), "yyyy-MM-dd");
  
  return {
    tutorial: completions.some(
      (c) => c.cardId === "tutorial" && c.completedDate !== today
    ),
    "health-goals": completions.some(
      (c) => c.cardId === "health-goals" && c.completedDate !== today
    ),
    medications: completions.some(
      (c) => c.cardId === "medications" && c.completedDate !== today
    ),
    "health-metrics": completions.some(
      (c) => c.cardId === "health-metrics" && c.completedDate !== today
    ),
  };
}
