/**
 * ==========================================
 * UNIFIED HEALTH DATA STORAGE
 * ==========================================
 * 
 * Single source of truth for health measurements.
 * 
 * STORAGE STRATEGY:
 * - dayLogs: Time-series data for all health measurements (weight, BP, fats, glucose)
 * - healthMetrics: User-defined GOALS only (goalWeight, goalSystolic, etc.)
 * 
 * This eliminates the dual storage (extendedHealthMetrics + dayLogs) confusion.
 */

import { format } from 'date-fns';
import { getStorageItem, setStorageItem } from './storage';
import { dayLogsSchema, healthMetricsSchema, DayLog, DayLogEntry } from './schemas';
import { getCurrentDate } from './simulated-date';

// ==========================================
// TYPES
// ==========================================

export interface HealthMeasurement {
  date: string;
  weight?: number;
  height?: number;
  bloodPressure?: { systolic: number; diastolic: number };
  bloodFats?: { ldl: number; hdl?: number; triglycerides?: number };
  bloodGlucose?: { hba1c?: number; fastingGlucose?: number };
}

export interface HealthGoals {
  goalWeight?: number;
  goalSystolic?: number;
  goalDiastolic?: number;
  goalLDL?: number;
  goalHDL?: number;
  goalHbA1c?: number;
  goalFastingGlucose?: number;
}

// ==========================================
// DAYLOGS OPERATIONS (Time-series measurements)
// ==========================================

/**
 * Get all day logs from localStorage
 */
export const getDayLogsData = () => {
  const logs = JSON.parse(localStorage.getItem('dayLogs') || '[]');
  return logs || [];
};

/**
 * Save day logs to localStorage
 */
export const saveDayLogs = (logs: DayLog[]): boolean => {
  return setStorageItem('dayLogs', logs, dayLogsSchema);
};

/**
 * Add or update an entry in dayLogs for a specific date
 * Ensures only one entry per metric type per day
 */
export const addHealthEntry = (
  dateStr: string,
  entry: Omit<DayLogEntry, 'tipId'>
): void => {
  const logs = getDayLogsData();
  const existingLogIndex = logs.findIndex(log => log.date === dateStr);

  if (existingLogIndex >= 0) {
    // Remove existing entry of same type, then add new one
    logs[existingLogIndex].entries = logs[existingLogIndex].entries.filter(
      e => e.type !== entry.type
    );
    logs[existingLogIndex].entries.push(entry);
  } else {
    // Create new day log
    logs.push({ date: dateStr, entries: [entry] });
  }

  saveDayLogs(logs);
};

/**
 * Get the latest measurement for a specific metric type
 * Useful for pre-filling forms with last known values
 */
export const getLatestMeasurement = (
  type: 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose'
): { date: string; value: number; value2?: number; value3?: number } | null => {
  const logs = getDayLogsData();
  
  // Sort logs by date descending and find first matching entry
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (const log of sortedLogs) {
    const entry = log.entries.find(e => e.type === type);
    if (entry) {
      return {
        date: log.date,
        value: entry.value,
        value2: entry.value2,
        value3: entry.value3,
      };
    }
  }

  return null;
};

/**
 * Get measurement for a specific date and type
 */
export const getMeasurementOnDate = (
  dateStr: string,
  type: 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose'
): DayLogEntry | null => {
  const logs = getDayLogsData();
  const log = logs.find(l => l.date === dateStr);
  return log?.entries.find(e => e.type === type) || null;
};

/**
 * Delete a measurement for a specific date and type
 */
export const deleteMeasurement = (
  dateStr: string,
  type: 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose'
): void => {
  const logs = getDayLogsData();
  const logIndex = logs.findIndex(l => l.date === dateStr);

  if (logIndex >= 0) {
    logs[logIndex].entries = logs[logIndex].entries.filter(e => e.type !== type);
    
    // Remove empty logs
    if (logs[logIndex].entries.length === 0) {
      logs.splice(logIndex, 1);
    }
    
    saveDayLogs(logs);
  }
};

// ==========================================
// HEALTH GOALS OPERATIONS
// ==========================================

/**
 * Get all health goals from localStorage
 */
export const getHealthGoals = (): HealthGoals => {
  const metrics = getStorageItem('healthMetrics', healthMetricsSchema);
  
  return {
    goalWeight: metrics?.goalWeight ? parseFloat(metrics.goalWeight) : undefined,
    goalSystolic: metrics?.goalSystolic ? parseInt(metrics.goalSystolic) : undefined,
    goalDiastolic: metrics?.goalDiastolic ? parseInt(metrics.goalDiastolic) : undefined,
    goalLDL: metrics?.goalLDL ? parseFloat(metrics.goalLDL) : undefined,
    goalHDL: metrics?.goalHDL ? parseFloat(metrics.goalHDL) : undefined,
    goalHbA1c: metrics?.goalHbA1c ? parseFloat(metrics.goalHbA1c) : undefined,
    goalFastingGlucose: metrics?.goalFastingGlucose ? parseFloat(metrics.goalFastingGlucose) : undefined,
  };
};

/**
 * Save a specific health goal
 */
export const saveHealthGoal = (
  goalKey: keyof HealthGoals,
  value: number | undefined
): void => {
  const metrics = getStorageItem('healthMetrics', healthMetricsSchema) || {};
  
  // Map goal keys to healthMetrics schema keys
  const keyMap: Record<keyof HealthGoals, string> = {
    goalWeight: 'goalWeight',
    goalSystolic: 'goalSystolic',
    goalDiastolic: 'goalDiastolic',
    goalLDL: 'goalLDL',
    goalHDL: 'goalHDL',
    goalHbA1c: 'goalHbA1c',
    goalFastingGlucose: 'goalFastingGlucose',
  };

  const storageKey = keyMap[goalKey];
  if (value !== undefined) {
    (metrics as any)[storageKey] = value.toString();
  } else {
    delete (metrics as any)[storageKey];
  }

  localStorage.setItem('healthMetrics', JSON.stringify(metrics));
};

/**
 * Save multiple health goals at once
 */
export const saveHealthGoals = (goals: Partial<HealthGoals>): void => {
  Object.entries(goals).forEach(([key, value]) => {
    saveHealthGoal(key as keyof HealthGoals, value);
  });
};

// ==========================================
// HELPER FUNCTIONS FOR FORM PRE-FILL
// ==========================================

/**
 * Get latest height from localStorage (stored in healthMetrics for static data)
 */
export const getLatestHeight = (): string | undefined => {
  // Height is static, stored in healthMetrics
  const metrics = getStorageItem('healthMetrics', healthMetricsSchema);
  return metrics?.height;
};

/**
 * Save height to healthMetrics (static data, not time-series)
 */
export const saveHeight = (height: string): void => {
  const metrics = getStorageItem('healthMetrics', healthMetricsSchema) || {};
  (metrics as any).height = height;
  localStorage.setItem('healthMetrics', JSON.stringify(metrics));
};

/**
 * Get form pre-fill data for health metrics flow
 * Combines latest measurements from dayLogs with goals from healthMetrics
 */
export const getHealthMetricsFormData = () => {
  const latestWeight = getLatestMeasurement('weight');
  const latestBP = getLatestMeasurement('bloodPressure');
  const latestFats = getLatestMeasurement('bloodFats');
  const latestGlucose = getLatestMeasurement('bloodGlucose');
  const goals = getHealthGoals();
  const height = getLatestHeight();

  return {
    // Latest measurements
    height,
    weight: latestWeight?.value?.toString(),
    bloodPressure: latestBP ? {
      systolic: latestBP.value.toString(),
      diastolic: latestBP.value2?.toString(),
      date: latestBP.date,
    } : undefined,
    bloodFats: latestFats ? {
      ldl: latestFats.value.toString(),
      hdl: latestFats.value2?.toString(),
      triglycerides: latestFats.value3?.toString(),
      date: latestFats.date,
    } : undefined,
    bloodGlucose: latestGlucose ? {
      hba1c: latestGlucose.value.toString(),
      fastingGlucose: latestGlucose.value2?.toString(),
      date: latestGlucose.date,
    } : undefined,
    // Goals
    ...goals,
  };
};
