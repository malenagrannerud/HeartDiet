import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfWeek, addDays } from "date-fns";
import { sv } from "date-fns/locale";
import { tips } from "@/data/tips";
import { pageTitle, pageSubtitle, pageContainer, headerContainer, pagePadding, standardSpacing, bodyTextSmallBold, cardTextSmall } from "@/lib/design-tokens";
import { useToast } from "@/hooks/use-toast";
import { getDayLogs } from "@/lib/tip-completion";
import { getStorageItem } from "@/lib/storage";
import { markedTipsSchema, type DayLog } from "@/lib/schemas";
import { getCurrentDate } from "@/lib/simulated-date";
import { WeeklyProgressTable } from "@/pages/ProgressTable";

const StatsBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">{children}</div>
);

const Dagbok = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(getCurrentDate(), { weekStartsOn: 1 })
  );
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [markedTipIds, setMarkedTipIds] = useState<number[]>([]);

  // Load day logs and marked tips from localStorage
  useEffect(() => {
    const logs = getDayLogs();
    setDayLogs(logs);

    const markedTips = getStorageItem('markedTips', markedTipsSchema);
    if (markedTips) {
      setMarkedTipIds(markedTips.map(tip => tip.id));
    }
  }, []);

  // Generate week dates (Monday to Sunday)
  const weekDates = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeekStart, i)
  );

  const goToPreviousWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(getCurrentDate(), { weekStartsOn: 1 }));
  };

  const isTipCompletedOnDate = (tipId: number, date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    return log?.entries.some(entry => entry.type === 'tip' && entry.tipId === tipId) || false;
  };

  const handleTipToggle = (tipId: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingLogIndex = dayLogs.findIndex(log => log.date === dateStr);
    let updatedLogs = [...dayLogs];

    if (existingLogIndex >= 0) {
      const existingLog = updatedLogs[existingLogIndex];
      const tipEntryIndex = existingLog.entries.findIndex(
        entry => entry.type === 'tip' && entry.tipId === tipId
      );

      if (tipEntryIndex >= 0) {
        // Remove tip
        existingLog.entries.splice(tipEntryIndex, 1);
        if (existingLog.entries.length === 0) {
          updatedLogs.splice(existingLogIndex, 1);
        }
        toast({
          title: "Tips avmarkerat",
          description: `${tips.find(t => t.id === tipId)?.title} har avmarkerats`,
        });
      } else {
        // Add tip
        existingLog.entries.push({ type: 'tip', value: 1, tipId });
        toast({
          title: "Tips markerat som gjort!",
          description: `${tips.find(t => t.id === tipId)?.title} har markerats`,
        });
      }
    } else {
      // Create new log with tip
      updatedLogs.push({
        date: dateStr,
        entries: [{ type: 'tip', value: 1, tipId }]
      });
      toast({
        title: "Tips markerat som gjort!",
        description: `${tips.find(t => t.id === tipId)?.title} har markerats`,
      });
    }

    setDayLogs(updatedLogs);
    localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
  };

  const openAddDataDialog = (date: Date, type: 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose') => {
    // For simplicity, we'll redirect to Progress page with appropriate dialog open
    // You might need to pass state through navigation or use a global state management solution
    navigate('/app/progress');
  };

  const hasWeightOnDate = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    return log?.entries.some(entry => entry.type === 'weight') || false;
  };

  const hasBloodPressureOnDate = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    return log?.entries.some(entry => entry.type === 'bloodPressure') || false;
  };

  const hasBloodFatsOnDate = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    return log?.entries.some(entry => entry.type === 'bloodFats') || false;
  };

  const hasBloodGlucoseOnDate = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    return log?.entries.some(entry => entry.type === 'bloodGlucose') || false;
  };

  const isToday = (date: Date): boolean => {
    const today = getCurrentDate();
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  };

  const calculateCurrentStreak = (): number => {
    let streak = 0;
    const today = getCurrentDate();
    let currentDate = new Date(today);

    while (true) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const log = dayLogs.find(l => l.date === dateStr);
      
      if (log && log.entries.some(entry => entry.type === 'tip')) {
        streak++;
        currentDate = addDays(currentDate, -1);
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateDaysThisMonth = (): number => {
    return dayLogs.filter(log => 
      log.entries.some(entry => entry.type === 'tip')
    ).length;
  };

  const currentStreak = calculateCurrentStreak();
  const daysThisMonth = calculateDaysThisMonth();

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
        <h1 className={pageTitle}>Dagbok</h1>
        <p className={pageSubtitle}>Logga dina dagliga framsteg och mål</p>
      </header>
      
      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>

             {/* Stats */}
                      <div className="grid grid-cols-2 gap-6">
                        <StatsBox>
                          <div className="flex flex-col gap-4">
                            <div>
                              <div className={bodyTextSmallBold}>Klarade dagar totalt</div>
                              <div className={cardTextSmall}>Antal dagar du loggat tips</div>
                            </div>
                            <div className="flex items-center justify-end">
                              <div className="w-16 h-16 bg-emerald-500 flex items-center justify-center">
                                <span className="text-3xl font-bold text-blue-900">{daysThisMonth}</span>
                              </div>
                            </div>
                          </div>
                        </StatsBox>
            
                        <StatsBox>
                          <div className="flex flex-col gap-4">
                            <div>
                              <div className={bodyTextSmallBold}>Klarade dagar i rad</div>
                              <div className={cardTextSmall}>Antal dagar i rad du loggat tips</div>
                            </div>
                            <div className="flex items-center justify-end">
                              <div className="w-16 h-16 bg-blue-100 flex items-center justify-center">
                                <span className="text-3xl font-bold text-blue-900">{currentStreak}</span>
                              </div>
                            </div>
                          </div>
                        </StatsBox>
                      </div>






          <WeeklyProgressTable
            weekDates={weekDates}
            dayLogs={dayLogs}
            onPreviousWeek={goToPreviousWeek}
            onNextWeek={goToNextWeek}
            onCurrentWeek={goToCurrentWeek}
            onTipToggle={handleTipToggle}
            onOpenDialog={openAddDataDialog}
            isTipCompletedOnDate={isTipCompletedOnDate}
            hasWeightOnDate={hasWeightOnDate}
            hasBloodPressureOnDate={hasBloodPressureOnDate}
            hasBloodFatsOnDate={hasBloodFatsOnDate}
            hasBloodGlucoseOnDate={hasBloodGlucoseOnDate}
            isToday={isToday}
            markedTipIds={markedTipIds}
          />
        </div>
      </main>
    </div>
  );
};

export default Dagbok;