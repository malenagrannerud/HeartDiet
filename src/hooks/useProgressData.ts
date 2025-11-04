// src/hooks/useProgressData.ts
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { DayLog } from "@/types/progress";

export const useProgressData = () => {
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [achievementDays, setAchievementDays] = useState<Date[]>([]);
  const [weightDays, setWeightDays] = useState<Date[]>([]);
  const [bloodPressureDays, setBloodPressureDays] = useState<Date[]>([]);

  // Load day logs from localStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem('dayLogs');
    let logs: DayLog[] = [];
    
    if (savedLogs) {
      const parsed = JSON.parse(savedLogs);
      const migratedLogs = parsed.map((log: any) => {
        if (log.entries) {
          return log;
        } else if (log.fruitGrams !== undefined) {
          return {
            date: log.date,
            entries: [{ type: 'tip' as const, value: log.fruitGrams, tipId: 1 }]
          };
        }
        return log;
      });
      logs = migratedLogs;
    } else {
      // Demo data
      const demoLogs: DayLog[] = [
        { 
          date: '2025-10-10', 
          entries: [
            { type: 'weight', value: 75 },
            { type: 'bloodPressure', value: 120, value2: 80 }
          ] 
        },
        { 
          date: '2025-10-15', 
          entries: [
            { type: 'weight', value: 74.5 }
          ] 
        },
        { 
          date: '2025-10-22', 
          entries: [
            { type: 'bloodPressure', value: 118, value2: 78 }
          ] 
        }
      ];
      logs = demoLogs;
    }

    // Load health metrics from HealthMetrics page
    const savedHealthMetrics = localStorage.getItem('healthMetrics');
    if (savedHealthMetrics) {
      const metrics = JSON.parse(savedHealthMetrics);
      const metricsDate = format(new Date(metrics.date), 'yyyy-MM-dd');
      
      const existingLog = logs.find(log => log.date === metricsDate);
      
      if (existingLog) {
        const hasWeight = existingLog.entries.some(e => e.type === 'weight');
        if (!hasWeight && metrics.weight) {
          existingLog.entries.push({ 
            type: 'weight', 
            value: parseFloat(metrics.weight) 
          });
        }
        
        const hasBP = existingLog.entries.some(e => e.type === 'bloodPressure');
        if (!hasBP && metrics.systolic && metrics.diastolic) {
          existingLog.entries.push({ 
            type: 'bloodPressure', 
            value: parseInt(metrics.systolic), 
            value2: parseInt(metrics.diastolic) 
          });
        }
      } else {
        const newEntries: DayLog['entries'] = [];
        
        if (metrics.weight) {
          newEntries.push({ 
            type: 'weight', 
            value: parseFloat(metrics.weight) 
          });
        }
        
        if (metrics.systolic && metrics.diastolic) {
          newEntries.push({ 
            type: 'bloodPressure', 
            value: parseInt(metrics.systolic), 
            value2: parseInt(metrics.diastolic) 
          });
        }
        
        if (newEntries.length > 0) {
          logs.push({ date: metricsDate, entries: newEntries });
        }
      }
      
      localStorage.setItem('dayLogs', JSON.stringify(logs));
    }
    
    setDayLogs(logs);
  }, []);

  // Update achievement days based on day logs
  useEffect(() => {
    const achievedDays = dayLogs
      .filter(log => {
        return log.entries && log.entries.some(entry => 
          entry.type === 'tip' && entry.value >= 500
        );
      })
      .map(log => new Date(log.date));
    setAchievementDays(achievedDays);

    const weightLogDays = dayLogs
      .filter(log => log.entries && log.entries.some(entry => entry.type === 'weight'))
      .map(log => new Date(log.date));
    setWeightDays(weightLogDays);

    const bpLogDays = dayLogs
      .filter(log => log.entries && log.entries.some(entry => entry.type === 'bloodPressure'))
      .map(log => new Date(log.date));
    setBloodPressureDays(bpLogDays);
  }, [dayLogs]);

  const updateDayLogs = (newLogs: DayLog[]) => {
    setDayLogs(newLogs);
    localStorage.setItem('dayLogs', JSON.stringify(newLogs));
  };

  return {
    dayLogs,
    achievementDays,
    weightDays,
    bloodPressureDays,
    updateDayLogs
  };
};