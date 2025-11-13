 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { sv } from "date-fns/locale";
import { pageTitle, pageSubtitle, pageContainer, pagePadding } from "@/lib/design-tokens";

import { useProgress } from "@/hooks/use-progress";
import { ProgressDialog } from "@/components/ProgressDialog";
import { ProgressStats } from "@/components/ProgressStats";
import { ProgressCharts } from "@/components/ProgressCharts";

/**
 * Progress Tracking Page
 * Main component for displaying and managing user progress
 * Features:
 * - Interactive calendar with achievement indicators
 * - Statistics for completed days and streaks
 * - Charts for weight and blood pressure trends
 * - Dialog for logging new entries and editing existing ones
 */
const Progress = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [entryType, setEntryType] = useState<'weight' | 'bloodPressure' | 'tip'>('tip');
  const [selectedTipIds, setSelectedTipIds] = useState<number[]>([]);
  const [weightInput, setWeightInput] = useState("");
  const [systolicInput, setSystolicInput] = useState("");
  const [diastolicInput, setDiastolicInput] = useState("");

  // Use custom hook for progress state management
  const {
    dayLogs,
    setDayLogs,
    achievementDays,
    weightDays,
    bloodPressureDays,
    getCurrentStreak,
    getDaysWithGoalThisMonth
  } = useProgress();

  /**
   * Handles calendar day clicks to open the entry dialog
   * @param clickedDate The date that was clicked on the calendar
   */
  const handleDayClick = (clickedDate: Date | undefined) => {
    const dateToUse = clickedDate || new Date();
    setSelectedDate(dateToUse);
    setEntryType('tip');
    setSelectedTipIds([]);
    setWeightInput("");
    setSystolicInput("");
    setDiastolicInput("");
    setDialogOpen(true);
  };

  /**
   * Saves a new entry or updates existing entries for the selected date
   * Handles all three entry types: tips, weight, and blood pressure
   */
  const handleSaveEntry = () => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingLog = dayLogs.find(log => log.date === dateStr);
    const newEntries = existingLog ? [...existingLog.entries] : [];

    // Add new entries based on entry type
    if (entryType === 'tip') {
      selectedTipIds.forEach(tipId => {
        newEntries.push({ 
          type: 'tip', 
          value: 1, // Mark as completed
          tipId: tipId 
        });
      });
    } else if (entryType === 'weight') {
      const kg = parseFloat(weightInput) || 0;
      if (kg > 0) newEntries.push({ type: 'weight', value: kg });
    } else if (entryType === 'bloodPressure') {
      const systolic = parseInt(systolicInput) || 0;
      const diastolic = parseInt(diastolicInput) || 0;
      if (systolic > 0 && diastolic > 0) newEntries.push({ 
        type: 'bloodPressure', 
        value: systolic, 
        value2: diastolic 
      });
    }
    
    // Update day logs if new entries were added
    if (newEntries.length > (existingLog?.entries.length || 0)) {
      const updatedLogs = dayLogs.filter(log => log.date !== dateStr);
      updatedLogs.push({ date: dateStr, entries: newEntries });
      setDayLogs(updatedLogs);
      localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
    }
    
    setDialogOpen(false);
    setSelectedTipIds([]);
  };

  /**
   * Deletes a specific entry from the selected date
   * @param entryIndex Index of the entry to delete
   */
  const handleDeleteEntry = (entryIndex: number) => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingLog = dayLogs.find(log => log.date === dateStr);
    
    if (existingLog) {
      const updatedEntries = existingLog.entries.filter((_, index) => index !== entryIndex);
      let updatedLogs;
      
      // Remove entire day log if no entries remain, otherwise update entries
      if (updatedEntries.length === 0) {
        updatedLogs = dayLogs.filter(log => log.date !== dateStr);
      } else {
        updatedLogs = dayLogs.map(log => 
          log.date === dateStr ? { ...log, entries: updatedEntries } : log
        );
      }
      
      setDayLogs(updatedLogs);
      localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
    }
  };

  // Calculate statistics for display
  const daysThisMonth = getDaysWithGoalThisMonth(date);
  const currentStreak = getCurrentStreak();

  return (
    <div className={`${pageContainer} ${pagePadding} space-y-6`}>
      {/* Page Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className={pageTitle}>Mina sidor</h1>
          <p className={pageSubtitle}>Följ dina framsteg & redigera loggar</p>
        </div>
      </header>

      {/* Interactive Calendar */}
      <div className="pt-6 pb-0 flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDayClick}
          locale={sv}
          modifiers={{
            achievement: achievementDays,
            weight: weightDays,
            bloodPressure: bloodPressureDays
          }}
          modifiersClassNames={{
            achievement: "relative before:content-[''] before:absolute before:inset-[8px] before:bg-emerald-500 before:rounded-full before:z-10 !text-blue-900 font-bold"
          }}
          modifiersStyles={{
            achievement: { backgroundColor: "transparent" }
          }}
          components={{
            DayContent: (props) => {
              const hasWeight = weightDays.some(d => isSameDay(d, props.date));
              const hasBP = bloodPressureDays.some(d => isSameDay(d, props.date));
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute top-0.5 left-0.5 flex flex-col gap-1">
                    {hasBP && <span className="text-[10px] leading-none text-rose-600">♥</span>}
                    {hasWeight && <span className="text-[10px] leading-none text-black-900">⚖</span>}
                  </div>
                  <span className="relative z-10">{props.date.getDate()}</span>
                </div>
              );
            }
          }}
        />
      </div>

      {/* Entry Dialog */}
      <ProgressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
        entryType={entryType}
        onEntryTypeChange={setEntryType}
        selectedTipIds={selectedTipIds}
        onSelectedTipIdsChange={setSelectedTipIds}
        weightInput={weightInput}
        onWeightInputChange={setWeightInput}
        systolicInput={systolicInput}
        onSystolicInputChange={setSystolicInput}
        diastolicInput={diastolicInput}
        onDiastolicInputChange={setDiastolicInput}
        dayLogs={dayLogs}
        onSaveEntry={handleSaveEntry}
        onDeleteEntry={handleDeleteEntry}
      />

      {/* Progress Statistics */}
      <ProgressStats 
        daysThisMonth={daysThisMonth}
        currentStreak={currentStreak}
      />

      {/* Progress Charts */}
      <ProgressCharts dayLogs={dayLogs} />

      {/* Debug Information - Remove in production */}
      <div className="fixed bottom-4 left-4 bg-black text-white p-2 text-xs z-50">
        Tips: {dayLogs.filter(log => log.entries.some(entry => entry.type === 'tip')).length} days
        <br />
        Achievement Days: {achievementDays.length}
        <br />
        Last Tip: {dayLogs.filter(log => log.entries.some(entry => entry.type === 'tip')).slice(-1)[0]?.date || 'None'}
      </div>
    </div>
  );
};

export default Progress;