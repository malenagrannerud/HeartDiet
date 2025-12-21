/**
 * Hook for managing user plans on tip pages with safe localStorage access
 * Uses Zod validation to prevent corrupted data from crashing the app
 */

import { useState, useEffect, useCallback } from "react";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { userPlansSchema, type UserPlanType } from "@/lib/schemas";

export interface UserPlan {
  goal: string;
  when: string;
  how: string;
  reminder: string;
}

/**
 * Custom hook for managing user plans with validated localStorage persistence
 * @param tipName - Unique identifier for the tip (e.g., 'fruit', 'fish', 'salt')
 */
export function useTipUserPlans(tipName: string) {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const storageKey = `userPlans-${tipName}`;

  // Load plans from localStorage on mount with validation
  useEffect(() => {
    const savedPlans = getStorageItem(storageKey, userPlansSchema);
    if (savedPlans) {
      setUserPlans(savedPlans as UserPlan[]);
    }
  }, [storageKey]);

  // Save plan (new or edited)
  const handleSavePlan = useCallback((plan: UserPlan) => {
    let updatedPlans: UserPlan[];
    
    if (editingIndex !== null) {
      updatedPlans = [...userPlans];
      updatedPlans[editingIndex] = plan;
    } else {
      updatedPlans = [...userPlans, plan];
    }
    
    setUserPlans(updatedPlans);
    setEditingIndex(null);
    setStorageItem(storageKey, updatedPlans, userPlansSchema);
  }, [editingIndex, userPlans, storageKey]);

  // Delete plan by index
  const handleDeletePlan = useCallback((index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    setStorageItem(storageKey, updatedPlans, userPlansSchema);
  }, [userPlans, storageKey]);

  // Open edit dialog for a plan
  const handleEditPlan = useCallback((index: number) => {
    setEditingIndex(index);
    setIsDialogOpen(true);
  }, []);

  // Open dialog for new plan
  const handleAddPlan = useCallback(() => {
    setEditingIndex(null);
    setIsDialogOpen(true);
  }, []);

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null);
    setIsDialogOpen(false);
  }, []);

  return {
    userPlans,
    editingIndex,
    isDialogOpen,
    setIsDialogOpen,
    handleSavePlan,
    handleDeletePlan,
    handleEditPlan,
    handleAddPlan,
    handleCancelEdit,
  };
}
