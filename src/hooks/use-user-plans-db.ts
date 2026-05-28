import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import type { UserPlanType } from "@/lib/schemas";

const PLANS_KEY = "userPlans";

export function useUserPlans() {
  return useQuery({
    queryKey: [PLANS_KEY],
    queryFn: async (): Promise<UserPlanType[]> => {
      return getStorageItem<UserPlanType[]>(PLANS_KEY) || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSaveUserPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: UserPlanType) => {
      const plans = getStorageItem<UserPlanType[]>(PLANS_KEY) || [];
      setStorageItem(PLANS_KEY, [...plans, plan]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PLANS_KEY] });
    },
  });
}
