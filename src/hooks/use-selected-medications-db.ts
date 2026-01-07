/**
 * TanStack Query hook for managing selected_medications in Supabase
 * Replaces localStorage-based selectedMedications storage
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export interface SelectedMedication {
  id: string;
  name: string;
  addedDate: string;
}

interface DbSelectedMedication {
  id: string;
  user_id: string;
  medication_id: string;
  name: string;
  added_date: string;
  created_at: string;
}

const SELECTED_MEDICATIONS_KEY = "selectedMedications";

/**
 * Fetch all selected medications for the current user
 */
export function useSelectedMedications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [SELECTED_MEDICATIONS_KEY, user?.id],
    queryFn: async (): Promise<SelectedMedication[]> => {
      if (!user || !isSupabaseConfigured) return [];

      const { data, error } = await supabase
        .from("selected_medications")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching selected medications:", error);
        throw error;
      }

      return (data as DbSelectedMedication[]).map((med) => ({
        id: med.medication_id,
        name: med.name,
        addedDate: med.added_date,
      }));
    },
    enabled: !!user && isSupabaseConfigured,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Add a medication
 */
export function useAddMedication() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      medicationId,
      name,
    }: {
      medicationId: string;
      name: string;
    }) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("selected_medications").upsert(
        {
          user_id: user.id,
          medication_id: medicationId,
          name,
          added_date: format(new Date(), "yyyy-MM-dd"),
        },
        { onConflict: "user_id,medication_id" }
      );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SELECTED_MEDICATIONS_KEY] });
    },
  });
}

/**
 * Remove a medication
 */
export function useRemoveMedication() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (medicationId: string) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("selected_medications")
        .delete()
        .eq("user_id", user.id)
        .eq("medication_id", medicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SELECTED_MEDICATIONS_KEY] });
    },
  });
}

/**
 * Replace all medications (for bulk save)
 */
export function useReplaceAllMedications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      medications: Array<{ medicationId: string; name: string }>
    ) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      // Delete all existing
      await supabase
        .from("selected_medications")
        .delete()
        .eq("user_id", user.id);

      // Insert all new
      if (medications.length > 0) {
        const { error } = await supabase.from("selected_medications").insert(
          medications.map((med) => ({
            user_id: user.id,
            medication_id: med.medicationId,
            name: med.name,
            added_date: format(new Date(), "yyyy-MM-dd"),
          }))
        );

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SELECTED_MEDICATIONS_KEY] });
    },
  });
}
