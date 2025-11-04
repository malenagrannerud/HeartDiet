// src/lib/progress-utils.ts
import { startOfMonth, endOfMonth } from "date-fns";
import { DayLog } from "@/types/progress";

export const calculateDaysWithGoalThisMonth = (achievementDays: Date[], date: Date): number => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  
  return achievementDays.filter(day => {
    const dayDate = new Date(day);
    return dayDate >= monthStart && dayDate <= monthEnd;
  }).length;
};

export const calculateCurrentStreak = (achievementDays: Date[]): number => {
  if (achievementDays.length === 0) return 0;
  
  const sortedDays = [...achievementDays].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
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
    
    if (hasDay) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};