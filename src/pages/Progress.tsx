import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth } from "date-fns";
import { sv } from "date-fns/locale";
import { Heart, Pill, Plus } from "lucide-react";
import { tips } from "@/data/tips";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { pageTitle, pageSubtitle, pageContainer, headerContainer, pagePadding, standardSpacing, cardTextSmall, bodyTextBald } from "@/lib/design-tokens";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getDayLogs } from "@/lib/tip-completion";
import { getStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, markedTipsSchema, selectedMedicationsSchema, healthMetricsSchema, extendedHealthMetricsSchema } from "@/lib/schemas";
import { medications } from "@/data/medications";
import { StatsBox } from "@/components/StatsBox";
import { HealthInfoCard } from "@/components/HealthInfoCard";
import { getCurrentDate } from "@/lib/simulated-date";
import { ProgressChart } from "@/components/ProgressChart";
import { WeeklyProgressTable } from "@/components/WeeklyProgressTable";

interface DayLog {
  date: string;
  entries: {
    type: 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose' | 'tip';
    value: number;
    value2?: number;
    value3?: number;
    tipId?: number;
  }[];
}

const healthPriorityLabels: Record<string, string> = {
  cholesterol: "Sänk mitt kolesterol",
  bloodPressure: "Sänk mitt blodtryck",
  diabetes: "Minska risken för diabetes typ 2",
  weight: "Viktbalans",
  general: "Förebygga hjärt- och kärlsjukdom"
};


const Progress = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(getCurrentDate(), { weekStartsOn: 1 })
  );
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [bpDialogOpen, setBpDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weightInput, setWeightInput] = useState("");
  const [systolicInput, setSystolicInput] = useState("");
  const [diastolicInput, setDiastolicInput] = useState("");
  const [existingWeightEntry, setExistingWeightEntry] = useState<number | null>(null);
  const [existingBPEntry, setExistingBPEntry] = useState<{systolic: number, diastolic: number} | null>(null);
  const [saveAlertOpen, setSaveAlertOpen] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<{
    type: 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose';
    weight?: string;
    systolic?: string;
    diastolic?: string;
    ldl?: string;
    hdl?: string;
    triglycerides?: string;
    hba1c?: string;
    fastingGlucose?: string;
    date?: string;
  } | null>(null);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<Array<{ id?: string; name?: string; addedDate?: string }>>([]);
  const [markedTipIds, setMarkedTipIds] = useState<number[]>([]);
  const [goalWeight, setGoalWeight] = useState<number | undefined>();
  const [goalBloodPressure, setGoalBloodPressure] = useState<{ systolic: number; diastolic: number } | undefined>();
  const [showBloodFats, setShowBloodFats] = useState(false);
  const [showBloodGlucose, setShowBloodGlucose] = useState(false);
  
  // Blood fats dialog state
  const [bloodFatsDialogOpen, setBloodFatsDialogOpen] = useState(false);
  const [ldlInput, setLdlInput] = useState("");
  const [hdlInput, setHdlInput] = useState("");
  const [triglyceridesInput, setTriglyceridesInput] = useState("");
  const [bloodFatsDateInput, setBloodFatsDateInput] = useState("");
  const [existingBloodFatsEntry, setExistingBloodFatsEntry] = useState<{ldl: number, hdl?: number, triglycerides?: number} | null>(null);
  
  // Blood glucose dialog state
  const [bloodGlucoseDialogOpen, setBloodGlucoseDialogOpen] = useState(false);
  const [hba1cInput, setHba1cInput] = useState("");
  const [fastingGlucoseInput, setFastingGlucoseInput] = useState("");
  const [bloodGlucoseDateInput, setBloodGlucoseDateInput] = useState("");
  const [existingBloodGlucoseEntry, setExistingBloodGlucoseEntry] = useState<{hba1c?: number, fastingGlucose?: number} | null>(null);

  // Load day logs and health priorities from localStorage
  useEffect(() => {
    const logs = getDayLogs();
    setDayLogs(logs);

    const data = getStorageItem('healthPriorities', healthPrioritiesSchema);
    if (data) {
      setPriorities(data.priorities || []);
    }

    // Load medications from new format
    const savedMeds = getStorageItem('selectedMedications', selectedMedicationsSchema);
    if (savedMeds) {
      setSelectedMedications(savedMeds);
    }

    const markedTips = getStorageItem('markedTips', markedTipsSchema);
    if (markedTips) {
      setMarkedTipIds(markedTips.map(tip => tip.id));
    }

    // Load health metrics for goals
    const metrics = getStorageItem('healthMetrics', healthMetricsSchema);
    if (metrics) {
      if (metrics.goalWeight) {
        setGoalWeight(parseFloat(metrics.goalWeight));
      }
      if (metrics.goalSystolic && metrics.goalDiastolic) {
        setGoalBloodPressure({
          systolic: parseInt(metrics.goalSystolic),
          diastolic: parseInt(metrics.goalDiastolic)
        });
      }
    }

    // Determine if we should show blood fats and blood glucose charts
    // Show blood fats if: user has cholesterol goal OR takes statin medication
    const hasCholesterolGoal = data?.priorities.includes('cholesterol');
    const hasStatinMedication = savedMeds ? savedMeds.some(savedMed => {
      if (!savedMed.id) return false;
      const medicationInfo = medications.find(med => med.id === savedMed.id);
      if (!medicationInfo) return false;
      return medicationInfo.category.includes('Statin');
    }) : false;
    setShowBloodFats(hasCholesterolGoal || hasStatinMedication);

    // Show blood glucose if: user has diabetes goal OR takes diabetes medication
    const hasDiabetesGoal = data?.priorities.includes('diabetes');
    const hasDiabetesMedication = savedMeds ? savedMeds.some(savedMed => {
      if (!savedMed.id) return false;
      const medicationInfo = medications.find(med => med.id === savedMed.id);
      if (!medicationInfo) return false;
      return medicationInfo.category.includes('Diabetesmedicin');
    }) : false;
    setShowBloodGlucose(hasDiabetesGoal || hasDiabetesMedication);
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
    setSelectedDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    
    if (type === 'bloodFats') {
      openBloodFatsDialog(date);
      return;
    }
    
    if (type === 'bloodGlucose') {
      openBloodGlucoseDialog(date);
      return;
    }
    
    if (type === 'weight') {
      const weightEntry = log?.entries.find(e => e.type === 'weight');
      if (weightEntry) {
        setWeightInput(weightEntry.value.toString());
        setExistingWeightEntry(weightEntry.value);
      } else {
        setWeightInput("");
        setExistingWeightEntry(null);
      }
      setWeightDialogOpen(true);
    } else {
      const bpEntry = log?.entries.find(e => e.type === 'bloodPressure');
      if (bpEntry && bpEntry.value2) {
        setSystolicInput(bpEntry.value.toString());
        setDiastolicInput(bpEntry.value2.toString());
        setExistingBPEntry({ systolic: bpEntry.value, diastolic: bpEntry.value2 });
      } else {
        setSystolicInput("");
        setDiastolicInput("");
        setExistingBPEntry(null);
      }
      setBpDialogOpen(true);
    }
  };

  const handleSaveWeight = () => {
    if (!selectedDate) return;
    const kg = parseFloat(weightInput) || 0;
    if (kg <= 0) {
      toast({
        title: "Ogiltigt värde",
        description: "Ange ett giltigt viktvärde",
        variant: "destructive"
      });
      return;
    }
    setPendingEntry({ type: 'weight', weight: weightInput });
    setSaveAlertOpen(true);
  };

  const handleSaveBloodPressure = () => {
    if (!selectedDate) return;
    const systolic = parseInt(systolicInput) || 0;
    const diastolic = parseInt(diastolicInput) || 0;
    if (systolic <= 0 || diastolic <= 0) {
      toast({
        title: "Ogiltigt värde",
        description: "Ange giltiga blodtrycksvärden",
        variant: "destructive"
      });
      return;
    }
    setPendingEntry({ type: 'bloodPressure', systolic: systolicInput, diastolic: diastolicInput });
    setSaveAlertOpen(true);
  };

  const handleDeleteWeight = () => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingLog = dayLogs.find(log => log.date === dateStr);
    
    if (existingLog) {
      const updatedEntries = existingLog.entries.filter(e => e.type !== 'weight');
      const updatedLogs = dayLogs.filter(log => log.date !== dateStr);
      
      if (updatedEntries.length > 0) {
        updatedLogs.push({ date: dateStr, entries: updatedEntries });
      }
      
      setDayLogs(updatedLogs);
      localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
      
      toast({
        title: "Vikt raderad",
        description: `Vikt för ${format(selectedDate, 'd MMMM', { locale: sv })} har raderats`,
      });
    }
    
    setWeightDialogOpen(false);
    setExistingWeightEntry(null);
  };

  const handleDeleteBloodPressure = () => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingLog = dayLogs.find(log => log.date === dateStr);
    
    if (existingLog) {
      const updatedEntries = existingLog.entries.filter(e => e.type !== 'bloodPressure');
      const updatedLogs = dayLogs.filter(log => log.date !== dateStr);
      
      if (updatedEntries.length > 0) {
        updatedLogs.push({ date: dateStr, entries: updatedEntries });
      }
      
      setDayLogs(updatedLogs);
      localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
      
      toast({
        title: "Blodtryck raderat",
        description: `Blodtryck för ${format(selectedDate, 'd MMMM', { locale: sv })} har raderats`,
      });
    }
    
    setBpDialogOpen(false);
    setExistingBPEntry(null);
  };

  const openBloodFatsDialog = (date?: Date) => {
    const targetDate = date || getCurrentDate();
    setSelectedDate(targetDate);
    setBloodFatsDateInput(format(targetDate, 'yyyy-MM-dd'));
    
    const dateStr = format(targetDate, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    const bloodFatsEntry = log?.entries.find(e => e.type === 'bloodFats');
    
    if (bloodFatsEntry) {
      setLdlInput(bloodFatsEntry.value.toString());
      setHdlInput(bloodFatsEntry.value2?.toString() || "");
      setTriglyceridesInput(bloodFatsEntry.value3?.toString() || "");
      setExistingBloodFatsEntry({
        ldl: bloodFatsEntry.value,
        hdl: bloodFatsEntry.value2,
        triglycerides: bloodFatsEntry.value3
      });
    } else {
      setLdlInput("");
      setHdlInput("");
      setTriglyceridesInput("");
      setExistingBloodFatsEntry(null);
    }
    setBloodFatsDialogOpen(true);
  };

  const handleSaveBloodFats = () => {
    const ldl = parseFloat(ldlInput);
    if (!ldl || ldl <= 0) {
      toast({
        title: "Ogiltigt värde",
        description: "Ange minst LDL-kolesterol",
        variant: "destructive"
      });
      return;
    }
    setPendingEntry({ 
      type: 'bloodFats', 
      ldl: ldlInput,
      hdl: hdlInput || undefined,
      triglycerides: triglyceridesInput || undefined,
      date: bloodFatsDateInput
    });
    setSaveAlertOpen(true);
  };

  const handleDeleteBloodFats = () => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingLog = dayLogs.find(log => log.date === dateStr);
    
    if (existingLog) {
      const updatedEntries = existingLog.entries.filter(e => e.type !== 'bloodFats');
      const updatedLogs = dayLogs.filter(log => log.date !== dateStr);
      
      if (updatedEntries.length > 0) {
        updatedLogs.push({ date: dateStr, entries: updatedEntries });
      }
      
      setDayLogs(updatedLogs);
      localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
      
      toast({
        title: "Kolesterolvärden raderade",
        description: `Kolesterol för ${format(selectedDate, 'd MMMM', { locale: sv })} har raderats`,
      });
    }
    
    setBloodFatsDialogOpen(false);
    setExistingBloodFatsEntry(null);
  };

  const openBloodGlucoseDialog = (date?: Date) => {
    const targetDate = date || getCurrentDate();
    setSelectedDate(targetDate);
    setBloodGlucoseDateInput(format(targetDate, 'yyyy-MM-dd'));
    
    const dateStr = format(targetDate, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    const bloodGlucoseEntry = log?.entries.find(e => e.type === 'bloodGlucose');
    
    if (bloodGlucoseEntry) {
      setHba1cInput(bloodGlucoseEntry.value.toString());
      setFastingGlucoseInput(bloodGlucoseEntry.value2?.toString() || "");
      setExistingBloodGlucoseEntry({
        hba1c: bloodGlucoseEntry.value,
        fastingGlucose: bloodGlucoseEntry.value2
      });
    } else {
      setHba1cInput("");
      setFastingGlucoseInput("");
      setExistingBloodGlucoseEntry(null);
    }
    setBloodGlucoseDialogOpen(true);
  };

  const handleSaveBloodGlucose = () => {
    const hba1c = parseFloat(hba1cInput);
    const fasting = parseFloat(fastingGlucoseInput);
    if ((!hba1c || hba1c <= 0) && (!fasting || fasting <= 0)) {
      toast({
        title: "Ogiltigt värde",
        description: "Ange minst ett blodsockervärde",
        variant: "destructive"
      });
      return;
    }
    setPendingEntry({ 
      type: 'bloodGlucose',
      hba1c: hba1cInput || undefined,
      fastingGlucose: fastingGlucoseInput || undefined,
      date: bloodGlucoseDateInput
    });
    setSaveAlertOpen(true);
  };

  const handleDeleteBloodGlucose = () => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingLog = dayLogs.find(log => log.date === dateStr);
    
    if (existingLog) {
      const updatedEntries = existingLog.entries.filter(e => e.type !== 'bloodGlucose');
      const updatedLogs = dayLogs.filter(log => log.date !== dateStr);
      
      if (updatedEntries.length > 0) {
        updatedLogs.push({ date: dateStr, entries: updatedEntries });
      }
      
      setDayLogs(updatedLogs);
      localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
      
      toast({
        title: "Blodsockervärden raderade",
        description: `Blodsocker för ${format(selectedDate, 'd MMMM', { locale: sv })} har raderats`,
      });
    }
    
    setBloodGlucoseDialogOpen(false);
    setExistingBloodGlucoseEntry(null);
  };

  const confirmSaveEntry = () => {
    if (!pendingEntry) return;
    
    // Use the custom date from pendingEntry if available (for blood fats/glucose), otherwise use selectedDate
    const targetDate = pendingEntry.date ? new Date(pendingEntry.date) : selectedDate;
    if (!targetDate) return;
    
    const dateStr = format(targetDate, 'yyyy-MM-dd');
    const existingLog = dayLogs.find(log => log.date === dateStr);
    const newEntries = existingLog ? [...existingLog.entries].filter(e => e.type !== pendingEntry.type) : [];

    if (pendingEntry.type === 'weight' && pendingEntry.weight) {
      const kg = parseFloat(pendingEntry.weight);
      newEntries.push({ type: 'weight', value: kg });
    } else if (pendingEntry.type === 'bloodPressure' && pendingEntry.systolic && pendingEntry.diastolic) {
      const systolic = parseInt(pendingEntry.systolic);
      const diastolic = parseInt(pendingEntry.diastolic);
      newEntries.push({ 
        type: 'bloodPressure', 
        value: systolic, 
        value2: diastolic 
      });
    } else if (pendingEntry.type === 'bloodFats' && pendingEntry.ldl) {
      const ldl = parseFloat(pendingEntry.ldl);
      const hdl = pendingEntry.hdl ? parseFloat(pendingEntry.hdl) : undefined;
      const triglycerides = pendingEntry.triglycerides ? parseFloat(pendingEntry.triglycerides) : undefined;
      newEntries.push({ 
        type: 'bloodFats', 
        value: ldl,
        value2: hdl,
        value3: triglycerides
      });
    } else if (pendingEntry.type === 'bloodGlucose') {
      const hba1c = pendingEntry.hba1c ? parseFloat(pendingEntry.hba1c) : undefined;
      const fasting = pendingEntry.fastingGlucose ? parseFloat(pendingEntry.fastingGlucose) : undefined;
      newEntries.push({ 
        type: 'bloodGlucose', 
        value: hba1c || fasting || 0,
        value2: fasting
      });
    }
    
    const updatedLogs = dayLogs.filter(log => log.date !== dateStr);
    updatedLogs.push({ date: dateStr, entries: newEntries });
    setDayLogs(updatedLogs);
    localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
    
    const typeLabels = {
      weight: 'Vikt',
      bloodPressure: 'Blodtryck',
      bloodFats: 'Kolesterolvärden',
      bloodGlucose: 'Blodsockervärden'
    };
    
    toast({
      title: "Data sparad",
      description: `${typeLabels[pendingEntry.type]} har sparats för ${format(targetDate, 'd MMMM', { locale: sv })}`,
    });
    
    setWeightDialogOpen(false);
    setBpDialogOpen(false);
    setBloodFatsDialogOpen(false);
    setBloodGlucoseDialogOpen(false);
    setSaveAlertOpen(false);
    setPendingEntry(null);
    setExistingWeightEntry(null);
    setExistingBPEntry(null);
    setExistingBloodFatsEntry(null);
    setExistingBloodGlucoseEntry(null);
  };

  const getDaysWithGoalThisMonth = () => {
    const monthStart = startOfMonth(getCurrentDate());
    const monthEnd = endOfMonth(getCurrentDate());
    return dayLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= monthStart && logDate <= monthEnd && 
             log.entries.some(entry => entry.type === 'tip');
    }).length;
  };

  const getCurrentStreak = () => {
    if (dayLogs.length === 0) {
      return 0;
    }
    
    // Get all days with tips, sorted chronologically
    const daysWithTips = dayLogs
      .filter(log => log.entries.some(entry => entry.type === 'tip'))
      .map(log => log.date)
      .sort();
    
    if (daysWithTips.length === 0) {
      return 0;
    }
    
    let maxStreak = 0;
    let currentStreak = 1;
    
    // Go through all days and find the longest consecutive sequence
    for (let i = 1; i < daysWithTips.length; i++) {
      const prevDate = new Date(daysWithTips[i - 1]);
      const currDate = new Date(daysWithTips[i]);
      
      // Calculate difference in days
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        // Consecutive day
        currentStreak++;
      } else {
        // Streak broken, check if current was the longest
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }
    
    // Don't forget to check the last streak
    maxStreak = Math.max(maxStreak, currentStreak);
    
    return maxStreak;
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

  const daysThisMonth = getDaysWithGoalThisMonth();
  const currentStreak = getCurrentStreak();

  return (
    <div className={pageContainer}>
      
      <header className={headerContainer}>
          <h1 className={pageTitle}>Mina sidor</h1>
          <p className={pageSubtitle}>Följ dina framsteg och logga data</p>
      </header>
      
      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>

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

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <StatsBox>
              <div className="flex flex-col gap-4">
                <div>
                  <div className={bodyTextBald}>Klarade dagar</div>
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
                  <div className={bodyTextBald}>Klarade dagar i rad</div>
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

          {/* Charts */}
          <div className="flex flex-col gap-6">
            <ProgressChart type="bloodPressure" dayLogs={dayLogs} goalBloodPressure={goalBloodPressure} />
            <ProgressChart type="weight" dayLogs={dayLogs} goalWeight={goalWeight} />
            {showBloodFats && (
              <div className="relative">
                <ProgressChart type="bloodFats" dayLogs={dayLogs} />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-4 right-4 z-10"
                  onClick={() => openBloodFatsDialog()}
                >
                  <Plus className="h-4 w-4 mr-1" /> Lägg till
                </Button>
              </div>
            )}
            {showBloodGlucose && (
              <div className="relative">
                <ProgressChart type="bloodGlucose" dayLogs={dayLogs} />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-4 right-4 z-10"
                  onClick={() => openBloodGlucoseDialog()}
                >
                  <Plus className="h-4 w-4 mr-1" /> Lägg till
                </Button>
              </div>
            )}
          </div>

          {/* Health Goals and Medications Cards */}
          <div className="grid grid-cols-2 gap-6">
            <HealthInfoCard
              icon={Heart}
              title="Mina hälsomål"
              items={priorities.map((id) => ({ id, label: healthPriorityLabels[id] }))}
              emptyMessage="Inga mål valda ännu"
              onClick={() => navigate('/app/health-goals')}
            />

            <HealthInfoCard
              icon={Pill}
              title="Mina läkemedel"
              items={selectedMedications.map((med) => ({ id: med.id || '', label: med.name || '' }))}
              emptyMessage="Inga läkemedel valda ännu"
              onClick={() => navigate('/app/medications')}
            />
          </div>

          {/* Dialog for weight */}
          <Dialog open={weightDialogOpen} onOpenChange={setWeightDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {existingWeightEntry ? 'Ändra vikt' : 'Lägg till vikt'} för {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: sv })}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {existingWeightEntry && (
                  <div className="p-3 bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Nuvarande värde:</p>
                    <p className="text-lg font-semibold">{existingWeightEntry} kg</p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="weight-input" className="text-base mb-2 block">Vikt (kg)</Label>
                  <Input
                    id="weight-input"
                    type="number"
                    step="0.1"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    placeholder="Ange vikt i kg"
                    className="w-full"
                  />
                </div>
              </div>

              <DialogFooter className="gap-3">
                {existingWeightEntry && (
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteWeight} 
                    className="text-base py-6"
                  >
                    Radera
                  </Button>
                )}
                <Button variant="outline" onClick={() => setWeightDialogOpen(false)} className="text-base py-6">
                  Avbryt
                </Button>
                <Button onClick={handleSaveWeight} className="text-base py-6">
                  Spara
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog for blood pressure */}
          <Dialog open={bpDialogOpen} onOpenChange={setBpDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {existingBPEntry ? 'Ändra blodtryck' : 'Lägg till blodtryck'} för {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: sv })}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {existingBPEntry && (
                  <div className="p-3 bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Nuvarande värde:</p>
                    <p className="text-lg font-semibold">{existingBPEntry.systolic}/{existingBPEntry.diastolic} mmHg</p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="systolic-input" className="text-base mb-2 block">Systoliskt (övre värde)</Label>
                    <Input
                      id="systolic-input"
                      type="number"
                      value={systolicInput}
                      onChange={(e) => setSystolicInput(e.target.value)}
                      placeholder="T.ex. 120"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="diastolic-input" className="text-base mb-2 block">Diastoliskt (nedre värde)</Label>
                    <Input
                      id="diastolic-input"
                      type="number"
                      value={diastolicInput}
                      onChange={(e) => setDiastolicInput(e.target.value)}
                      placeholder="T.ex. 80"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-3">
                {existingBPEntry && (
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteBloodPressure} 
                    className="text-base py-6"
                  >
                    Radera
                  </Button>
                )}
                <Button variant="outline" onClick={() => setBpDialogOpen(false)} className="text-base py-6">
                  Avbryt
                </Button>
                <Button onClick={handleSaveBloodPressure} className="text-base py-6">
                  Spara
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog for blood fats */}
          <Dialog open={bloodFatsDialogOpen} onOpenChange={setBloodFatsDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {existingBloodFatsEntry ? 'Ändra kolesterolvärden' : 'Lägg till kolesterolvärden'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="bloodfats-date-input" className="text-base mb-2 block">Datum för mätning</Label>
                  <Input
                    id="bloodfats-date-input"
                    type="date"
                    value={bloodFatsDateInput}
                    onChange={(e) => setBloodFatsDateInput(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="ldl-input" className="text-base mb-2 block">LDL-kolesterol (mmol/L) *</Label>
                  <Input
                    id="ldl-input"
                    type="number"
                    step="0.1"
                    value={ldlInput}
                    onChange={(e) => setLdlInput(e.target.value)}
                    placeholder="T.ex. 3.5"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hdl-input" className="text-base mb-2 block">HDL-kolesterol (mmol/L)</Label>
                  <Input
                    id="hdl-input"
                    type="number"
                    step="0.1"
                    value={hdlInput}
                    onChange={(e) => setHdlInput(e.target.value)}
                    placeholder="T.ex. 1.3"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="triglycerides-input" className="text-base mb-2 block">Triglycerider (mmol/L)</Label>
                  <Input
                    id="triglycerides-input"
                    type="number"
                    step="0.1"
                    value={triglyceridesInput}
                    onChange={(e) => setTriglyceridesInput(e.target.value)}
                    placeholder="T.ex. 1.7"
                    className="w-full"
                  />
                </div>
              </div>
              
              <DialogFooter className="gap-3">
                {existingBloodFatsEntry && (
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteBloodFats} 
                    className="text-base py-6"
                  >
                    Radera
                  </Button>
                )}
                <Button variant="outline" onClick={() => setBloodFatsDialogOpen(false)} className="text-base py-6">
                  Avbryt
                </Button>
                <Button onClick={handleSaveBloodFats} className="text-base py-6">
                  Spara
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog for blood glucose */}
          <Dialog open={bloodGlucoseDialogOpen} onOpenChange={setBloodGlucoseDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {existingBloodGlucoseEntry ? 'Ändra blodsockervärden' : 'Lägg till blodsockervärden'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="bloodglucose-date-input" className="text-base mb-2 block">Datum för mätning</Label>
                  <Input
                    id="bloodglucose-date-input"
                    type="date"
                    value={bloodGlucoseDateInput}
                    onChange={(e) => setBloodGlucoseDateInput(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hba1c-input" className="text-base mb-2 block">HbA1c (mmol/mol)</Label>
                  <Input
                    id="hba1c-input"
                    type="number"
                    step="1"
                    value={hba1cInput}
                    onChange={(e) => setHba1cInput(e.target.value)}
                    placeholder="T.ex. 48"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Målvärde är vanligtvis under 52 mmol/mol</p>
                </div>
                
                <div>
                  <Label htmlFor="fasting-glucose-input" className="text-base mb-2 block">Fasteblodsocker (mmol/L)</Label>
                  <Input
                    id="fasting-glucose-input"
                    type="number"
                    step="0.1"
                    value={fastingGlucoseInput}
                    onChange={(e) => setFastingGlucoseInput(e.target.value)}
                    placeholder="T.ex. 5.5"
                    className="w-full"
                  />
                </div>
              </div>
              
              <DialogFooter className="gap-3">
                {existingBloodGlucoseEntry && (
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteBloodGlucose} 
                    className="text-base py-6"
                  >
                    Radera
                  </Button>
                )}
                <Button variant="outline" onClick={() => setBloodGlucoseDialogOpen(false)} className="text-base py-6">
                  Avbryt
                </Button>
                <Button onClick={handleSaveBloodGlucose} className="text-base py-6">
                  Spara
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Save Confirmation Alert */}
          <AlertDialog open={saveAlertOpen} onOpenChange={setSaveAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Granska innan du sparar</AlertDialogTitle>
                <AlertDialogDescription>
                  Kontrollera att uppgifterna stämmer:
                </AlertDialogDescription>
              </AlertDialogHeader>
              {pendingEntry && (
                <div className="my-4 space-y-3 bg-muted/50 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Datum:</span>
                    <span className="text-sm font-medium">
                      {pendingEntry.date 
                        ? format(new Date(pendingEntry.date), 'd MMMM yyyy', { locale: sv })
                        : selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: sv })
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Typ:</span>
                    <span className="text-sm font-medium">
                      {pendingEntry.type === 'weight' && 'Vikt'}
                      {pendingEntry.type === 'bloodPressure' && 'Blodtryck'}
                      {pendingEntry.type === 'bloodFats' && 'Kolesterolvärden'}
                      {pendingEntry.type === 'bloodGlucose' && 'Blodsockervärden'}
                    </span>
                  </div>
                  {pendingEntry.type === 'weight' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Värde:</span>
                      <span className="text-sm font-medium">{pendingEntry.weight} kg</span>
                    </div>
                  )}
                  {pendingEntry.type === 'bloodPressure' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Värde:</span>
                      <span className="text-sm font-medium">{pendingEntry.systolic}/{pendingEntry.diastolic} mmHg</span>
                    </div>
                  )}
                  {pendingEntry.type === 'bloodFats' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">LDL:</span>
                        <span className="text-sm font-medium">{pendingEntry.ldl} mmol/L</span>
                      </div>
                      {pendingEntry.hdl && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">HDL:</span>
                          <span className="text-sm font-medium">{pendingEntry.hdl} mmol/L</span>
                        </div>
                      )}
                      {pendingEntry.triglycerides && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Triglycerider:</span>
                          <span className="text-sm font-medium">{pendingEntry.triglycerides} mmol/L</span>
                        </div>
                      )}
                    </>
                  )}
                  {pendingEntry.type === 'bloodGlucose' && (
                    <>
                      {pendingEntry.hba1c && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">HbA1c:</span>
                          <span className="text-sm font-medium">{pendingEntry.hba1c} mmol/mol</span>
                        </div>
                      )}
                      {pendingEntry.fastingGlucose && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Fasteblodsocker:</span>
                          <span className="text-sm font-medium">{pendingEntry.fastingGlucose} mmol/L</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setPendingEntry(null)}>Avbryt</AlertDialogCancel>
                <AlertDialogAction onClick={confirmSaveEntry}>
                  Spara
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>  
      </main>
    </div>
  );
};

export default Progress;
