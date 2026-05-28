import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import type { SelectedMedication } from "@/lib/schemas";

const MEDS_KEY = "selectedMedications";

export function useSelectedMedications() {
  return useQuery({
    queryKey: [MEDS_KEY],
    queryFn: async (): Promise<SelectedMedication[]> => {
      return getStorageItem<SelectedMedication[]>(MEDS_KEY) || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useToggleMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (med: SelectedMedication) => {
      const meds = getStorageItem<SelectedMedication[]>(MEDS_KEY) || [];
      const exists = meds.find((m) => m.id === med.id);
      if (exists) {
        setStorageItem(MEDS_KEY, meds.filter((m) => m.id !== med.id));
      } else {
        setStorageItem(MEDS_KEY, [...meds, med]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDS_KEY] });
    },
  });
}
