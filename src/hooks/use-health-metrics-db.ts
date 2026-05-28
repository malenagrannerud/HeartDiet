import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import type { HealthMetrics } from "@/lib/schemas";

const METRICS_KEY = "healthMetrics";

export function useHealthMetrics() {
  return useQuery({
    queryKey: [METRICS_KEY],
    queryFn: async (): Promise<HealthMetrics | null> => {
      return getStorageItem<HealthMetrics>(METRICS_KEY);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSaveHealthMetrics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metrics: HealthMetrics) => {
      setStorageItem(METRICS_KEY, metrics);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [METRICS_KEY] });
    },
  });
}
