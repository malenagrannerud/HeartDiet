import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import type { DayLogEntry } from "@/lib/schemas";

export interface DayLog {
  date: string;
  entries: DayLogEntry[];
}

const DAY_LOGS_KEY = "dayLogs";

export function useDayLogs() {
  return useQuery({
    queryKey: [DAY_LOGS_KEY],
    queryFn: async (): Promise<DayLog[]> => {
      return getStorageItem<DayLog[]>(DAY_LOGS_KEY) || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpsertDayLogEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, entry }: { date: string; entry: DayLogEntry }) => {
      const logs = getStorageItem<DayLog[]>(DAY_LOGS_KEY) || [];
      const existingIndex = logs.findIndex((l) => l.date === date);

      if (existingIndex >= 0) {
        const existingEntries = logs[existingIndex].entries;
        if (entry.type === "tip") {
          const tipExists = existingEntries.some((e) => e.type === "tip" && e.tipId === entry.tipId);
          logs[existingIndex].entries = tipExists
            ? existingEntries.filter((e) => !(e.type === "tip" && e.tipId === entry.tipId))
            : [...existingEntries, entry];
          setStorageItem(DAY_LOGS_KEY, logs);
          return !tipExists;
        }
        logs[existingIndex].entries = [...existingEntries.filter((e) => e.type !== entry.type), entry];
      } else {
        logs.push({ date, entries: [entry] });
      }
      setStorageItem(DAY_LOGS_KEY, logs);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DAY_LOGS_KEY] });
    },
  });
}

export function useRemoveDayLogEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, entryType, tipId }: { date: string; entryType: string; tipId?: number }) => {
      const logs = getStorageItem<DayLog[]>(DAY_LOGS_KEY) || [];
      const existingIndex = logs.findIndex((l) => l.date === date);
      if (existingIndex < 0) return;
      
      logs[existingIndex].entries = logs[existingIndex].entries.filter((e) => {
        if (entryType === "tip") return !(e.type === "tip" && e.tipId === tipId);
        return e.type !== entryType;
      });
      
      if (logs[existingIndex].entries.length === 0) {
        logs.splice(existingIndex, 1);
      }
      setStorageItem(DAY_LOGS_KEY, logs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DAY_LOGS_KEY] });
    },
  });
}

export function isTipCompletedOnDate(dayLogs: DayLog[], tipId: number, date: Date): boolean {
  const dateStr = date.toISOString().split("T")[0];
  const log = dayLogs.find((l) => l.date === dateStr);
  return log?.entries.some((e) => e.type === "tip" && e.tipId === tipId) || false;
}

export function isTipCompletedToday(dayLogs: DayLog[], tipId: number): boolean {
  return isTipCompletedOnDate(dayLogs, tipId, new Date());
}
