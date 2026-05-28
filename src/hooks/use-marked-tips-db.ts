import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import type { MarkedTip } from "@/lib/schemas";

const MARKED_TIPS_KEY = "markedTips";

export function useMarkedTips() {
  return useQuery({
    queryKey: [MARKED_TIPS_KEY],
    queryFn: async (): Promise<MarkedTip[]> => {
      return getStorageItem<MarkedTip[]>(MARKED_TIPS_KEY) || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useToggleMarkedTip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tip: MarkedTip) => {
      const tips = getStorageItem<MarkedTip[]>(MARKED_TIPS_KEY) || [];
      const exists = tips.find((t) => t.id === tip.id);
      if (exists) {
        setStorageItem(MARKED_TIPS_KEY, tips.filter((t) => t.id !== tip.id));
      } else {
        setStorageItem(MARKED_TIPS_KEY, [...tips, tip]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MARKED_TIPS_KEY] });
    },
  });
}
