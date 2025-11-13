import { useState, useEffect } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { ProgressDayLog, ProgressStats } from "@/lib/progress-types";

/**
 * Custom hook for managing progress tracking state and logic
 * Handles loading/saving day logs, calculating streaks, and filtering data by date
 */
export const useProgress = () => {
  const [dayLogs, setDayLogs] = useState<ProgressDayLog[]>([]);
  const [achievementDays, setAchievementDays] = useState<Date[]>([]);
  const [weightDays, setWeightDays] = useState<Date[]>([]);
  const [bloodPressureDays, setBloodPressureDays] = useState<Date[]>([]);
  const [highestStreak, setHighestStreak] = useState(0);

  // Load progress data from localStorage on component mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('dayLogs');
    if (savedLogs) {
      setDayLogs(JSON.parse(savedLogs));
    }
    
    const savedHighestStreak = localStorage.getItem('highestStreak');
    if (savedHighestStreak) {
      setHighestStreak(parseInt(savedHighestStreak));
    }
  }, []);

  // Update derived state when dayLogs change
  useEffect(() => {
    const achievedDays = dayLogs
      .filter(log => log.entries.some(entry => entry.type === 'tip'))
      .map(log => new Date(log.date + 'T00:00:00'));
    setAchievementDays(achievedDays);

    const weightLogDays = dayLogs
      .filter(log => log.entries.some(entry => entry.type === 'weight'))
      .map(log => new Date(log.date));
    setWeightDays(weightLogDays);

    const bpLogDays = dayLogs
      .filter(log => log.entries.some(entry => entry.type === 'bloodPressure'))
      .map(log => new Date(log.date));
    setBloodPressureDays(bpLogDays);
    
    // Update highest streak record if current streak exceeds it
    const currentStreakValue = getCurrentStreak(achievedDays);
    if (currentStreakValue > highestStreak) {
      setHighestStreak(currentStreakValue);
      localStorage.setItem('highestStreak', currentStreakValue.toString());
    }
  }, [dayLogs, highestStreak]);

  /**
   * Calculates the current consecutive day streak of following tips
   */
  const getCurrentStreak = (achievementDays: Date[]) => {
    if (achievementDays.length === 0) return 0;
    
    const sortedDays = [...achievementDays].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDays.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasDay = sortedDays.some(day => {
        const d = new Date(day);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === checkDate.getTime();
      });
      
      if (hasDay) streak++;
      else break;
    }
    return streak;
  };

  /**
   * Counts how many days in the current month the user followed their tips
   */
  const getDaysWithGoalThisMonth = (date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    return achievementDays.filter(day => {
      const dayDate = new Date(day);
      return dayDate >= monthStart && dayDate <= monthEnd;
    }).length;
  };

  /**
   * Get comprehensive progress statistics
   */
  const getProgressStats = (date: Date): ProgressStats => ({
    daysThisMonth: getDaysWithGoalThisMonth(date),
    currentStreak: getCurrentStreak(achievementDays),
    highestStreak
  });

  return {
    dayLogs,
    setDayLogs,
    achievementDays,
    weightDays,
    bloodPressureDays,
    highestStreak,
    getCurrentStreak: () => getCurrentStreak(achievementDays),
    getDaysWithGoalThisMonth,
    getProgressStats
  };
};