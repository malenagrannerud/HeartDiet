// src/pages/Progress.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Settings } from "lucide-react";
import { pageTitle, pageSubtitle, iconButton, pageContainer, pagePadding } from "@/lib/design-tokens";
import { Button } from "@/components/ui/button";
import { useProgressData } from "@/hooks/useProgressData";
import { ProgressCalendar } from "@/components/ProgressCalendar";
import { ProgressStats } from "@/components/ProgressStats";
import { ProgressCharts } from "@/components/ProgressCharts";
import { LogEntryDialog } from "@/components/LogEntryDialog";
import { calculateDaysWithGoalThisMonth, calculateCurrentStreak } from "@/lib/progress-utils";

const Progress = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const {
    dayLogs,
    achievementDays,
    weightDays,
    bloodPressureDays,
    updateDayLogs
  } = useProgressData();

  const daysThisMonth = calculateDaysWithGoalThisMonth(achievementDays, date);
  const currentStreak = calculateCurrentStreak(achievementDays);

  const handleDayClick = (clickedDate: Date | undefined) => {
    if (!clickedDate) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clicked = new Date(clickedDate);
    clicked.setHours(0, 0, 0, 0);
    
    if (clicked.getTime() > today.getTime()) return;
    
    setSelectedDate(clickedDate);
    setDialogOpen(true);
  };

  const handleDeleteEntry = (entryIndex: number) => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingLog = dayLogs.find(log => log.date === dateStr);
    
    if (existingLog) {
      const updatedEntries = existingLog.entries.filter((_, index) => index !== entryIndex);
      const updatedLogs = dayLogs.filter(log => log.date !== dateStr);
      
      if (updatedEntries.length > 0) {
        updatedLogs.push({ date: dateStr, entries: updatedEntries });
      }
      
      updateDayLogs(updatedLogs);
    }
  };

  const getExistingEntries = () => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    return log?.entries || [];
  };

  return (
    <div className={`${pageContainer} ${pagePadding} space-y-6`}>
      <header className="flex items-start justify-between">
        <div>
          <h1 className={pageTitle}>Mina sidor</h1>
          <p className={pageSubtitle}>Följ dina framsteg & redigera loggar</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/app/settings')} 
          className={iconButton} 
          aria-label="Inställningar"
        >
          <Settings size={28} className="text-foreground" />
        </Button>
      </header>

      <ProgressCalendar
        date={date}
        onDayClick={handleDayClick}
        achievementDays={achievementDays}
        weightDays={weightDays}
        bloodPressureDays={bloodPressureDays}
      />

      <LogEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
        dayLogs={dayLogs}
        onUpdateDayLogs={updateDayLogs}
        onDeleteEntry={handleDeleteEntry}
        getExistingEntries={getExistingEntries}
      />

      <ProgressStats
        daysThisMonth={daysThisMonth}
        currentStreak={currentStreak}
      />

      <ProgressCharts dayLogs={dayLogs} />
    </div>
  );
};

export default Progress;