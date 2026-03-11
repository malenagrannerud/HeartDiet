/**
 * Main diary page component
 * 
 * @module MainDagbok
 * 
 * @description
 * Main page for displaying and managing daily tip completions.
 * Features:
 * - Weekly calendar view showing tip completion status
 * - Week navigation (previous/next/current week)
 * - Toggle tip completion by clicking squares
 * - Persistent storage of completed tips
 * - Persistent storage of marked/bookmarked tips
 * - Today's date highlighting
 * 
 * Data is stored in localStorage using schemas for type safety.
 * 
 * @requires react - useState for state management
 * @requires react-router-dom - Navigation
 * @requires date-fns - Date manipulation utilities
 * @requires @/lib/storage - Local storage utilities
 * @requires @/lib/schemas - Type validation schemas
 * @requires @/lib/simulated-date - Date utilities for consistent date handling
 * @requires @/components/LoggCalender - Calendar component
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDays, subWeeks, addWeeks, startOfWeek, isSameDay } from "date-fns";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { markedTipsSchema } from "@/lib/schemas";
import { getCurrentDate } from "@/lib/simulated-date";
import { LoggCalender } from "@/pages/Dagbok/LoggCalender";
import { headerContainer, pageContainer, pageSubtitle, pageTitle } from "@/lib/design-tokens";

/**
 * Main diary page component
 * 
 * @component
 * @returns {JSX.Element} Main diary page with calendar
 * 
 * @example
 * <MainDagbok />
 */
export const MainDagbok = () => {
  const navigate = useNavigate();
  
  /**
   * Start of current week (Monday)
   * Initialized to current week based on simulated date
   */
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = getCurrentDate();
    return startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
  });

  /**
   * Array of completed tip IDs in format "tipId-YYYY-MM-DD"
   * Loaded from localStorage on mount
   */
  const [completedTips, setCompletedTips] = useState<string[]>(() => 
    (getStorageItem('completedTips') as string[]) || []
  );
  
  /**
   * Array of marked/bookmarked tip IDs
   * Loaded from localStorage on mount
   */
  const [markedTips, setMarkedTips] = useState(() => 
    getStorageItem('markedTips', markedTipsSchema) || []
  );

  /**
   * Array of 7 dates representing the current week
   * Generated from currentWeekStart
   */
  const weekDates = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeekStart, i)
  );

  /**
   * Navigate to previous week
   */
  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  /**
   * Navigate to next week
   */
  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  /**
   * Navigate back to current week
   */
  const handleCurrentWeek = () => {
    const today = getCurrentDate();
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
  };

  /**
   * Toggle completion status for a tip on a specific date
   * Updates state and persists to localStorage
   * 
   * @param {number} tipId - ID of the tip to toggle
   * @param {Date} date - Date when tip was completed/uncompleted
   */
  const handleTipToggle = (tipId: number, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const completionId = `${tipId}-${dateStr}`;
    
    setCompletedTips(prev => {
      const newCompleted = prev.includes(completionId)
        ? prev.filter(id => id !== completionId) // Remove if exists
        : [...prev, completionId]; // Add if doesn't exist
      
      setStorageItem('completedTips', newCompleted);
      return newCompleted;
    });
  };

  /**
   * Check if a tip is completed on a specific date
   * 
   * @param {number} tipId - ID of the tip to check
   * @param {Date} date - Date to check
   * @returns {boolean} True if tip is completed on that date
   */
  const isTipCompletedOnDate = (tipId: number, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const completionId = `${tipId}-${dateStr}`;
    return completedTips.includes(completionId);
  };

  /**
   * Check if a given date is today (using simulated date)
   * 
   * @param {Date} date - Date to check
   * @returns {boolean} True if date is today
   */
  const isToday = (date: Date) => {
    const today = getCurrentDate();
    return isSameDay(date, today);
  };

  return (

  <div className={pageContainer}>
          <header className={headerContainer}>
              <h1 className={pageTitle}>Dagbok</h1>
              <p className={pageSubtitle}>Logga dina dagliga aktiviteter</p>
          </header>




    <div className="p-4">
      <LoggCalender
        weekDates={weekDates}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onCurrentWeek={handleCurrentWeek}
        onTipToggle={handleTipToggle}
        isTipCompletedOnDate={isTipCompletedOnDate}
        isToday={isToday}
        markedTipIds={markedTips.map(tip => tip.id).filter((id): id is number => id !== undefined)}
      />
    </div>
  </div>


  );
};