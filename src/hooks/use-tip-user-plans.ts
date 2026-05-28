import { useQuery } from "@tanstack/react-query";
import { getStorageItem } from "@/lib/storage";
import type { UserPlanType } from "@/lib/schemas";

const PLANS_KEY = "userPlans";

export function useTipUserPlans(tipId: number) {
  return useQuery({
    queryKey: [PLANS_KEY, tipId],
    queryFn: async (): Promise<UserPlanType[]> => {
      const allPlans = getStorageItem<UserPlanType[]>(PLANS_KEY) || [];
      return allPlans;
    },
    staleTime: 1000 * 60 * 5,
  });
}
