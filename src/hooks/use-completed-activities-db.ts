import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import type { CompletedActivity } from "@/lib/schemas";

const ACTIVITIES_KEY = "completedActivities";

export function useCompletedActivities() {
  return useQuery({
    queryKey: [ACTIVITIES_KEY],
    queryFn: async (): Promise<CompletedActivity[]> => {
      return getStorageItem<CompletedActivity[]>(ACTIVITIES_KEY) || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddCompletedActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: CompletedActivity) => {
      const activities = getStorageItem<CompletedActivity[]>(ACTIVITIES_KEY) || [];
      setStorageItem(ACTIVITIES_KEY, [...activities, activity]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES_KEY] });
    },
  });
}

export function useRemoveCompletedActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const activities = getStorageItem<CompletedActivity[]>(ACTIVITIES_KEY) || [];
      setStorageItem(ACTIVITIES_KEY, activities.filter((a) => a.id !== id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES_KEY] });
    },
  });
}
