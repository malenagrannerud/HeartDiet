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
   */
  const handleSaveEntry = () => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingLog = dayLogs.find(log => log.date === dateStr);
    const newEntries = existingLog ? [...existingLog.entries] : [];

    if (entryType === 'tip') {
      selectedTipIds.forEach(tipId => {
        newEntries.push({ 
          type: 'tip', 
          value: 1,
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
   */
  const handleDeleteEntry = (entryIndex: number) => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingLog = dayLogs.find(log => log.date === dateStr);
    
    if (existingLog) {
      const updatedEntries = existingLog.entries.filter((_, index) => index !== entryIndex);
      let updatedLogs;
      
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

  const daysThisMonth = getDaysWithGoalThisMonth(date);
  const currentStreak = getCurrentStreak();

  return (
    <div className={`${pageContainer} ${pagePadding} space-y-6`}>
      <header className="flex items-start justify-between">
        <div>
          <h1 className={pageTitle}>Mina sidor</h1>
          <p className={pageSubtitle}>Följ dina framsteg & redigera loggar</p>
        </div>
      </header>

      {/* Fixed Calendar Section */}
      <div className="pt-6 pb-0 flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              setDate(newDate);
              handleDayClick(newDate);
            }
          }}
          locale={sv}
          modifiers={{
            achievement: achievementDays,
            weight: weightDays,
            bloodPressure: bloodPressureDays,
            today: new Date()
          }}
          modifiersClassNames={{
            achievement: "achievement-day",
            today: "today-day",
            weight: "weight-day", 
            bloodPressure: "bp-day"
          }}
          className="rounded-md border"
        />
      </div>

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

      <ProgressStats 
        daysThisMonth={daysThisMonth}
        currentStreak={currentStreak}
      />

      <ProgressCharts dayLogs={dayLogs} />

      {/* Debug Information */}
      <div className="fixed bottom-4 left-4 bg-black text-white p-2 text-xs z-50">
        Tips: {dayLogs.filter(log => log.entries.some(entry => entry.type === 'tip')).length} days
        <br />
        Achievement Days: {achievementDays.length}
        <br />
        Last Tip: {dayLogs.filter(log => log.entries.some(entry => entry.type === 'tip')).slice(-1)[0]?.date || 'None'}
      </div>

      {/* Add minimal CSS fixes */}
      <style>{`
        /* Fix for achievement days - ensure text is visible */
        .achievement-day button {
          position: relative;
          background-color: rgb(16 185 129) !important; /* emerald-500 */
          color: white !important;
          font-weight: bold;
        }
        
        /* Today's date styling */
        .today-day button {
          font-weight: bold;
          border: 2px solid #2563eb !important; /* blue-600 */
        }
        
        /* Ensure selected date is visible */
        .rdp-day_selected button {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
        }
        
        /* Fix for weight and BP indicator positioning */
        .weight-day button::before,
        .bp-day button::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          z-index: 10;
        }
        
        .weight-day button::before {
          background-color: #000;
        }
        
        .bp-day button::before {
          background-color: #e11d48; /* rose-600 */
        }
      `}</style>
    </div>
  );
};

export default Progress;