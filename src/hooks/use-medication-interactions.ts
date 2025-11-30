import { useState, useEffect } from "react";
import { medications, MedicationData, FoodInteraction } from "@/data/medications";
import { getStorageItem } from "@/lib/storage";
import { selectedMedicationsSchema } from "@/lib/schemas";

export interface MedicationInteraction {
  medication: MedicationData;
  interaction: FoodInteraction;
}

/**
 * Hook to get relevant medication interactions for a specific tip page
 * @param tipId - The tip ID to filter interactions for
 * @returns Array of medication interactions relevant to this tip
 */
export const useMedicationInteractions = (tipId: number): MedicationInteraction[] => {
  const [interactions, setInteractions] = useState<MedicationInteraction[]>([]);

  useEffect(() => {
    // Load user's selected medications from localStorage
    const selectedMeds = getStorageItem('selectedMedications', selectedMedicationsSchema);
    
    if (!selectedMeds || selectedMeds.length === 0) {
      setInteractions([]);
      return;
    }

    // Get medication IDs from selected medications
    const selectedMedIds = selectedMeds.map(m => m.id);

    // Find medications that match the selected IDs
    const userMedications = medications.filter(med => 
      selectedMedIds.includes(med.id)
    );

    // Filter for interactions that match this tipId
    const relevantInteractions: MedicationInteraction[] = [];
    
    userMedications.forEach(medication => {
      medication.foodInteractions.forEach(interaction => {
        if (interaction.tipId === tipId) {
          relevantInteractions.push({
            medication,
            interaction
          });
        }
      });
    });

    setInteractions(relevantInteractions);
  }, [tipId]);

  return interactions;
};
