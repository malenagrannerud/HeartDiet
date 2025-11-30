import { useState, useEffect } from "react";
import { healthGoalTips, HealthGoalTip } from "@/data/health-goal-tips";
import { getStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema } from "@/lib/schemas";

/**
 * Hook to get relevant health goal tips for a specific tip page
 * @param tipId - The tip ID to filter tips for
 * @returns Array of health goal tips relevant to this tip and user's selected goals
 */
export const useHealthGoalTips = (tipId: number): HealthGoalTip[] => {
  const [tips, setTips] = useState<HealthGoalTip[]>([]);

  useEffect(() => {
    // Load user's selected health goals from localStorage
    const healthData = getStorageItem('healthPriorities', healthPrioritiesSchema);
    const selectedGoals = healthData?.priorities || [];
    
    if (selectedGoals.length === 0) {
      setTips([]);
      return;
    }

    // Filter tips that match both this tipId and user's selected goals
    const relevantTips = healthGoalTips.filter(
      tip => tip.tipId === tipId && selectedGoals.includes(tip.goalId)
    );
    
    setTips(relevantTips);
  }, [tipId]);

  return tips;
};
