import { useState } from "react";
import { medications } from "@/data/medications";

export function useMedicationInteractions(selectedMeds: string[]) {
  const [interactions] = useState<string[]>([]);
  return { interactions, isLoading: false };
}
