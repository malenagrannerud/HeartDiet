import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import type { HealthPriorities } from "@/lib/schemas";

const PRIORITIES_KEY = "healthPriorities";

export function useHealthPriorities() {
  return useQuery({
    queryKey: [PRIORITIES_KEY],
    queryFn: async (): Promise<HealthPriorities | null> => {
      return getStorageItem<HealthPriorities>(PRIORITIES_KEY);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSaveHealthPriorities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (priorities: HealthPriorities) => {
      setStorageItem(PRIORITIES_KEY, priorities);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRIORITIES_KEY] });
    },
  });
}
