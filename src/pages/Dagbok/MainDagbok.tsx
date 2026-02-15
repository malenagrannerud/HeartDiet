import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDays, subWeeks, addWeeks, startOfWeek, isSameDay } from "date-fns";
import { sv } from "date-fns/locale";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { dayLogsSchema, completedTipsSchema, markedTipsSchema } from "@/lib/schemas";
import { getCurrentDate } from "@/lib/simulated-date";
import { LoggCalender } from "@/components/LoggCalender";

export const MainDagbok = () => {
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = getCurrentDate();
    return startOfWeek(today, { weekStartsOn: 1 });
  });

  // Load data from storage
  const [dayLogs, setDayLogs] = useState(() => 
    getStorageItem('dayLogs', dayLogsSchema) || []
  );
  
  const [completedTips, setCompletedTips] = useState(() => 
    getStorageItem('completedTips', completedTipsSchema) || []
  );
  
  const [markedTips, setMarkedTips] = useState(() => 
    getStorageItem('markedTips', markedTipsSchema) || []
  );

  const weekDates = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeekStart, i)
  );

  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const handleCurrentWeek = () => {
    const today = getCurrentDate();
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
  };

  const handleTipToggle = (tipId: number, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const completionId = `${tipId}-${dateStr}`;
    
    setCompletedTips(prev => {
      const newCompleted = prev.includes(completionId)
        ? prev.filter(id => id !== completionId)
        : [...prev, completionId];
      
      setStorageItem('completedTips', newCompleted, completedTipsSchema);
      return newCompleted;
    });
  };

  const isTipCompletedOnDate = (tipId: number, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const completionId = `${tipId}-${dateStr}`;
    return completedTips.includes(completionId);
  };

  const hasMetricOnDate = (date: Date, metricType: string) => {
    const dateStr = date.toISOString().split('T')[0];
    const log = dayLogs.find(l => l.date === dateStr);
    return log?.entries.some(e => e.type === metricType) || false;
  };

  const handleOpenDialog = (date: Date, type: 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose') => {
    const routes = {
      weight: '/app/progress/weight',
      bloodPressure: '/app/progress/bloodPressure',
      bloodFats: '/app/progress/bloodFats',
      bloodGlucose: '/app/progress/bloodGlucose'
    };
    navigate(routes[type]);
  };

  const isToday = (date: Date) => {
    const today = getCurrentDate();
    return isSameDay(date, today);
  };

  return (
    <div className="p-4">
      <LoggCalender
        weekDates={weekDates}
        dayLogs={dayLogs}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onCurrentWeek={handleCurrentWeek}
        onTipToggle={handleTipToggle}
        onOpenDialog={handleOpenDialog}
        isTipCompletedOnDate={isTipCompletedOnDate}
        hasWeightOnDate={(date) => hasMetricOnDate(date, 'weight')}
        hasBloodPressureOnDate={(date) => hasMetricOnDate(date, 'bloodPressure')}
        hasBloodFatsOnDate={(date) => hasMetricOnDate(date, 'bloodFats')}
        hasBloodGlucoseOnDate={(date) => hasMetricOnDate(date, 'bloodGlucose')}
        isToday={isToday}
        markedTipIds={markedTips}
      />
    </div>
  );
};