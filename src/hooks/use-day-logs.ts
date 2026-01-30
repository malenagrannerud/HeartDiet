/**
 * TanStack Query hook for managing day_logs in Supabase
 * Replaces localStorage-based dayLogs storage
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import type { DayLogEntry } from "@/lib/schemas";

export interface DayLog {
  date: string;
  entries: DayLogEntry[];
}

interface DbDayLog {
  id: string;
  user_id: string;
  date: string;
  entries: DayLogEntry[];
  created_at: string;
  updated_at: string;
}

const DAY_LOGS_KEY = "dayLogs";

/**
 * Fetch all day logs for the current user
 */
export function useDayLogs() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [DAY_LOGS_KEY, user?.id],
    queryFn: async (): Promise<DayLog[]> => {
      if (!user || !isSupabaseConfigured) return [];

      const { data, error } = await supabase
        .from("day_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching day logs:", error);
        throw error;
      }

      return (data as DbDayLog[]).map((log) => ({
        date: log.date,
        entries: log.entries || [],
      }));
    },
    enabled: !!user && isSupabaseConfigured,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Add or update an entry for a specific date
 */
export function useUpsertDayLogEntry() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      entry,
    }: {
      date: string;
      entry: DayLogEntry;
    }) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      // First, try to get existing log for this date
      const { data: existingLog } = await supabase
        .from("day_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", date)
        .maybeSingle();

      if (existingLog) {
        // Update existing entries
        const existingEntries = (existingLog.entries as DayLogEntry[]) || [];
        
        // For tips, toggle behavior - remove if exists, add if not
        if (entry.type === "tip") {
          const tipExists = existingEntries.some(
            (e) => e.type === "tip" && e.tipId === entry.tipId
          );
          
          const updatedEntries = tipExists
            ? existingEntries.filter(
                (e) => !(e.type === "tip" && e.tipId === entry.tipId)
              )
            : [...existingEntries, entry];

          const { error } = await supabase
            .from("day_logs")
            .update({
              entries: updatedEntries,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingLog.id);

          if (error) throw error;
          return !tipExists; // Return new completion status
        }

        // For health metrics, replace existing entry of same type
        const filteredEntries = existingEntries.filter(
          (e) => e.type !== entry.type
        );
        const updatedEntries = [...filteredEntries, entry];

        const { error } = await supabase
          .from("day_logs")
          .update({
            entries: updatedEntries,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingLog.id);

        if (error) throw error;
        return true;
      } else {
        // Create new log
        const { error } = await supabase.from("day_logs").insert({
          user_id: user.id,
          date,
          entries: [entry],
        });

        if (error) throw error;
        return true;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DAY_LOGS_KEY] });
    },
  });
}

/**
 * Remove an entry from a specific date
 */
export function useRemoveDayLogEntry() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      entryType,
      tipId,
    }: {
      date: string;
      entryType: DayLogEntry["type"];
      tipId?: number;
    }) => {
      if (!user || !isSupabaseConfigured) {
        throw new Error("User not authenticated");
      }

      const { data: existingLog } = await supabase
        .from("day_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", date)
        .maybeSingle();

      if (!existingLog) return;

      const existingEntries = (existingLog.entries as DayLogEntry[]) || [];
      const updatedEntries = existingEntries.filter((e) => {
        if (entryType === "tip") {
          return !(e.type === "tip" && e.tipId === tipId);
        }
        return e.type !== entryType;
      });

      if (updatedEntries.length === 0) {
        // Delete the entire log if no entries left
        await supabase.from("day_logs").delete().eq("id", existingLog.id);
      } else {
        await supabase
          .from("day_logs")
          .update({
            entries: updatedEntries,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingLog.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DAY_LOGS_KEY] });
    },
  });
}

/**
 * Check if a tip is completed on a specific date
 */
export function isTipCompletedOnDate(
  dayLogs: DayLog[],
  tipId: number,
  date: Date
): boolean {
  const dateStr = format(date, "yyyy-MM-dd");
  const log = dayLogs.find((l) => l.date === dateStr);
  return log?.entries.some((e) => e.type === "tip" && e.tipId === tipId) || false;
}

/**
 * Check if a tip is completed today
 */
export function isTipCompletedToday(
  dayLogs: DayLog[],
  tipId: number
): boolean {
  return isTipCompletedOnDate(dayLogs, tipId, new Date());
}
