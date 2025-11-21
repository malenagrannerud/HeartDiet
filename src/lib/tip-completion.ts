import { format } from 'date-fns';

export interface DayLog {
  date: string;
  entries: {
    type: 'weight' | 'bloodPressure' | 'tip';
    value: number;
    value2?: number;
    tipId?: number;
  }[];
}

const DAY_LOGS_KEY = 'dayLogs';

export const getDayLogs = (): DayLog[] => {
  try {
    const saved = localStorage.getItem(DAY_LOGS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const setDayLogs = (logs: DayLog[]): void => {
  localStorage.setItem(DAY_LOGS_KEY, JSON.stringify(logs));
};

export const isTipCompletedToday = (tipId: number): boolean => {
  const logs = getDayLogs();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLog = logs.find(log => log.date === today);
  
  if (!todayLog) return false;
  
  return todayLog.entries.some(
    entry => entry.type === 'tip' && entry.tipId === tipId && entry.value === 1
  );
};

export const toggleTipCompletion = (tipId: number): boolean => {
  const logs = getDayLogs();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLog = logs.find(log => log.date === today);
  
  if (!todayLog) {
    // Create new log for today with this tip
    const newLog: DayLog = {
      date: today,
      entries: [{ type: 'tip', value: 1, tipId }]
    };
    setDayLogs([...logs, newLog]);
    return true; // Now completed
  }
  
  // Check if tip is already logged today
  const tipIndex = todayLog.entries.findIndex(
    entry => entry.type === 'tip' && entry.tipId === tipId
  );
  
  if (tipIndex >= 0) {
    // Remove the tip completion
    todayLog.entries.splice(tipIndex, 1);
    
    if (todayLog.entries.length === 0) {
      // Remove the entire day log if no entries left
      const updatedLogs = logs.filter(log => log.date !== today);
      setDayLogs(updatedLogs);
    } else {
      // Update the day log
      const updatedLogs = logs.map(log => 
        log.date === today ? todayLog : log
      );
      setDayLogs(updatedLogs);
    }
    return false; // Now uncompleted
  } else {
    // Add tip completion
    todayLog.entries.push({ type: 'tip', value: 1, tipId });
    const updatedLogs = logs.map(log => 
      log.date === today ? todayLog : log
    );
    setDayLogs(updatedLogs);
    return true; // Now completed
  }
};
