import { format } from "date-fns";
import { getCurrentDate } from "./simulated-date";

interface TipEntry {
  type: 'tip' | 'weight' | 'bloodPressure';
  value: number;
  value2?: number;
  tipId?: number;
}

interface DayLog {
  date: string;
  entries: TipEntry[];
}

const STORAGE_KEY = 'dayLogs';

/**
 * Get all day logs from storage
 */
export const getDayLogs = (): DayLog[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading day logs:', error);
    return [];
  }
};

/**
 * Save day logs to storage
 */
const saveDayLogs = (logs: DayLog[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving day logs:', error);
  }
};

/**
 * Check if a tip is completed today
 */
export const isTipCompletedToday = (tipId: number): boolean => {
  const today = format(getCurrentDate(), 'yyyy-MM-dd');
  const logs = getDayLogs();
  const todayLog = logs.find(log => log.date === today);
  
  if (!todayLog) return false;
  
  return todayLog.entries.some(
    entry => entry.type === 'tip' && entry.tipId === tipId
  );
};

/**
 * Mark a tip as completed for today
 */
export const markTipCompleted = (tipId: number): void => {
  const today = format(getCurrentDate(), 'yyyy-MM-dd');
  const logs = getDayLogs();
  const existingLogIndex = logs.findIndex(log => log.date === today);
  
  if (existingLogIndex >= 0) {
    // Check if this tip is already marked for today
    const alreadyMarked = logs[existingLogIndex].entries.some(
      entry => entry.type === 'tip' && entry.tipId === tipId
    );
    
    if (!alreadyMarked) {
      logs[existingLogIndex].entries.push({
        type: 'tip',
        value: 1,
        tipId
      });
    }
  } else {
    // Create new log for today
    logs.push({
      date: today,
      entries: [{
        type: 'tip',
        value: 1,
        tipId
      }]
    });
  }
  
  saveDayLogs(logs);
};

/**
 * Unmark a tip as completed for today
 */
export const unmarkTipCompleted = (tipId: number): void => {
  const today = format(getCurrentDate(), 'yyyy-MM-dd');
  const logs = getDayLogs();
  const existingLogIndex = logs.findIndex(log => log.date === today);
  
  if (existingLogIndex >= 0) {
    logs[existingLogIndex].entries = logs[existingLogIndex].entries.filter(
      entry => !(entry.type === 'tip' && entry.tipId === tipId)
    );
    
    // Remove the day log if no entries left
    if (logs[existingLogIndex].entries.length === 0) {
      logs.splice(existingLogIndex, 1);
    }
    
    saveDayLogs(logs);
  }
};

/**
 * Toggle tip completion for today
 */
export const toggleTipCompletion = (tipId: number): boolean => {
  const isCompleted = isTipCompletedToday(tipId);
  
  if (isCompleted) {
    unmarkTipCompleted(tipId);
    return false;
  } else {
    markTipCompleted(tipId);
    return true;
  }
};
