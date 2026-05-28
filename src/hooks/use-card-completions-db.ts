import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import type { CardCompletion } from "@/lib/schemas";

const CARD_COMPLETIONS_KEY = "cardCompletions";

export function useCardCompletions() {
  return useQuery({
    queryKey: [CARD_COMPLETIONS_KEY],
    queryFn: async (): Promise<CardCompletion[]> => {
      return getStorageItem<CardCompletion[]>(CARD_COMPLETIONS_KEY) || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCompleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (completion: CardCompletion) => {
      const completions = getStorageItem<CardCompletion[]>(CARD_COMPLETIONS_KEY) || [];
      const filtered = completions.filter((c) => c.cardId !== completion.cardId);
      setStorageItem(CARD_COMPLETIONS_KEY, [...filtered, completion]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CARD_COMPLETIONS_KEY] });
    },
  });
}
