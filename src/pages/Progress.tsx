import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth } from "date-fns";
import { sv } from "date-fns/locale";
import { Heart, Pill } from "lucide-react";
import { tips } from "@/data/tips";
import { pageTitle, pageSubtitle, pageContainer, headerContainer, pagePadding, standardSpacing, cardTextSmall, bodyTextSmallBold } from "@/lib/design-tokens";
import { useToast } from "@/hooks/use-toast";
import { getDayLogs } from "@/lib/tip-completion";
import { getStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, markedTipsSchema, selectedMedicationsSchema, healthMetricsSchema } from "@/lib/schemas";
import { medications } from "@/data/medications";
import { StatsBox } from "@/components/ProgressStatsBox";
import { HealthInfoCard } from "@/components/HealthInfoCard";
import { getCurrentDate } from "@/lib/simulated-date";
import { ProgressChart } from "@/pages/ProgressChart";
import { WeeklyProgressTable } from "@/pages/ProgressTable";
import { SaveConfirmationDialog } from "@/components/AlertSaveDataProgress";
import { GoalEditDialog } from "./ProgressTableDialogs.tsx/EditGoalDialog";
import { BloodGlucoseDialog } from "./ProgressTableDialogs.tsx/ProgrBloodSugarDialog";
import { WeightDialog } from "./ProgressTableDialogs.tsx/ProgrWeightDialog";
import { BloodPressureDialog } from "./ProgressTableDialogs.tsx/ProgrBPDialog";
import { BloodFatsDialog } from "./ProgressTableDialogs.tsx/ProgrBloodFatDialog";

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
  cholesterol: "Hantera mitt kolesterol",
  bloodPressure: "Hantera mitt blodtryck",
  diabetes: "Minska risken för diabetes typ 2",
  weight: "Viktbalans",
  general: "Bli piggare", 
  general2: "Förebygg livsstilsrelaterade sjukdomar" 
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
  const [goalBloodFats, setGoalBloodFats] = useState<{ ldl?: number; hdl?: number } | undefined>();
  const [goalBloodGlucose, setGoalBloodGlucose] = useState<{ hba1c?: number; fastingGlucose?: number } | undefined>();
  const [showBloodFats, setShowBloodFats] = useState(false);
  const [showBloodGlucose, setShowBloodGlucose] = useState(false);
  const [expandedChart, setExpandedChart] = useState<'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose' | null>(null);
  
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

  // Goal editing dialog state
  const [goalEditDialogOpen, setGoalEditDialogOpen] = useState(false);
  const [goalEditType, setGoalEditType] = useState<'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose' | null>(null);
  const [goalWeightInput, setGoalWeightInput] = useState("");
  const [goalSystolicInput, setGoalSystolicInput] = useState("");
  const [goalDiastolicInput, setGoalDiastolicInput] = useState("");
  const [goalLDLInput, setGoalLDLInput] = useState("");
  const [goalHDLInput, setGoalHDLInput] = useState("");
  const [goalHbA1cInput, setGoalHbA1cInput] = useState("");
  const [goalFastingGlucoseInput, setGoalFastingGlucoseInput] = useState("");

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
      if (metrics.goalLDL) {
        setGoalBloodFats(prev => ({ ...prev, ldl: parseFloat(metrics.goalLDL!) }));
      }
      if (metrics.goalHDL) {
        setGoalBloodFats(prev => ({ ...prev, hdl: parseFloat(metrics.goalHDL!) }));
      }
      if (metrics.goalHbA1c) {
        setGoalBloodGlucose(prev => ({ ...prev, hba1c: parseFloat(metrics.goalHbA1c!) }));
      }
      if (metrics.goalFastingGlucose) {
        setGoalBloodGlucose(prev => ({ ...prev, fastingGlucose: parseFloat(metrics.goalFastingGlucose!) }));
      }
    }

    // Determine if we should show blood fats and blood glucose charts
    // Show chart if: user has relevant goal/medication OR has already logged values
    const hasSavedBloodFats = logs.some((l) => l?.entries?.some((e: any) => e.type === 'bloodFats'));
    const hasSavedBloodGlucose = logs.some((l) => l?.entries?.some((e: any) => e.type === 'bloodGlucose'));

    // Show blood fats if: user has cholesterol goal OR takes statin medication OR has values
    const hasCholesterolGoal = data?.priorities.includes('cholesterol');
    const hasStatinMedication = savedMeds ? savedMeds.some(savedMed => {
      if (!savedMed.id) return false;
      const medicationInfo = medications.find(med => med.id === savedMed.id);
      if (!medicationInfo) return false;
      return medicationInfo.category.includes('Statin');
    }) : false;
    setShowBloodFats(Boolean(hasCholesterolGoal || hasStatinMedication || hasSavedBloodFats));

    // Show blood glucose if: user has diabetes goal OR takes diabetes medication OR has values
    const hasDiabetesGoal = data?.priorities.includes('diabetes');
    const hasDiabetesMedication = savedMeds ? savedMeds.some(savedMed => {
      if (!savedMed.id) return false;
      const medicationInfo = medications.find(med => med.id === savedMed.id);
      if (!medicationInfo) return false;
      return medicationInfo.category.includes('Diabetesmedicin');
    }) : false;
    setShowBloodGlucose(Boolean(hasDiabetesGoal || hasDiabetesMedication || hasSavedBloodGlucose));
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


  const handleSaveGoal = () => {
    const metrics = getStorageItem('healthMetrics', healthMetricsSchema) || {};
    
    if (goalEditType === 'weight') {
      const weight = parseFloat(goalWeightInput);
      if (!weight || weight <= 0) {
        toast({
          title: "Ogiltigt värde",
          description: "Ange ett giltigt målvikt",
          variant: "destructive"
        });
        return;
      }
      metrics.goalWeight = goalWeightInput;
      setGoalWeight(weight);
      toast({
        title: "Målvikt uppdaterad",
        description: `Ny målvikt: ${weight} kg`,
      });
    } else if (goalEditType === 'bloodPressure') {
      const systolic = parseInt(goalSystolicInput);
      const diastolic = parseInt(goalDiastolicInput);
      if (!systolic || systolic <= 0 || !diastolic || diastolic <= 0) {
        toast({
          title: "Ogiltigt värde",
          description: "Ange giltiga blodtrycksvärden",
          variant: "destructive"
        });
        return;
      }
      metrics.goalSystolic = goalSystolicInput;
      metrics.goalDiastolic = goalDiastolicInput;
      setGoalBloodPressure({ systolic, diastolic });
      toast({
        title: "Målblodtryck uppdaterat",
        description: `Nytt målblodtryck: ${systolic}/${diastolic} mmHg`,
      });
    } else if (goalEditType === 'bloodFats') {
      const ldl = goalLDLInput ? parseFloat(goalLDLInput) : undefined;
      const hdl = goalHDLInput ? parseFloat(goalHDLInput) : undefined;
      if (!ldl && !hdl) {
        toast({
          title: "Ogiltigt värde",
          description: "Ange minst ett kolesterolvärde",
          variant: "destructive"
        });
        return;
      }
      if (ldl) metrics.goalLDL = goalLDLInput;
      if (hdl) metrics.goalHDL = goalHDLInput;
      setGoalBloodFats({ ldl, hdl });
      toast({
        title: "Kolesterolmål uppdaterade",
        description: ldl && hdl ? `LDL: ${ldl}, HDL: ${hdl}` : ldl ? `LDL: ${ldl}` : `HDL: ${hdl}`,
      });
    } else if (goalEditType === 'bloodGlucose') {
      const hba1c = goalHbA1cInput ? parseFloat(goalHbA1cInput) : undefined;
      const fasting = goalFastingGlucoseInput ? parseFloat(goalFastingGlucoseInput) : undefined;
      if (!hba1c && !fasting) {
        toast({
          title: "Ogiltigt värde",
          description: "Ange minst ett blodsockervärde",
          variant: "destructive"
        });
        return;
      }
      if (hba1c) metrics.goalHbA1c = goalHbA1cInput;
      if (fasting) metrics.goalFastingGlucose = goalFastingGlucoseInput;
      setGoalBloodGlucose({ hba1c, fastingGlucose: fasting });
      toast({
        title: "Blodsockermål uppdaterade",
        description: hba1c && fasting ? `HbA1c: ${hba1c}, Faste: ${fasting}` : hba1c ? `HbA1c: ${hba1c}` : `Faste: ${fasting}`,
      });
    }
    
    localStorage.setItem('healthMetrics', JSON.stringify(metrics));
    setGoalEditDialogOpen(false);
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

          {/* Charts */}
          <div className="flex flex-col gap-6">
            <ProgressChart 
              type="bloodPressure" 
              dayLogs={dayLogs} 
              goalBloodPressure={goalBloodPressure}
              onMoreClick={() => navigate('/app/progress/bloodPressure')}
            />
            <ProgressChart 
              type="weight" 
              dayLogs={dayLogs} 
              goalWeight={goalWeight}
              onMoreClick={() => navigate('/app/progress/weight')}
            />
            {showBloodFats && (
              <ProgressChart 
                type="bloodFats" 
                dayLogs={dayLogs}
                goalBloodFats={goalBloodFats}
                onMoreClick={() => navigate('/app/progress/bloodFats')}
              />
            )}
            {showBloodGlucose && (
              <ProgressChart 
                type="bloodGlucose" 
                dayLogs={dayLogs}
                goalBloodGlucose={goalBloodGlucose}
                onMoreClick={() => navigate('/app/progress/bloodGlucose')}
              />
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
        <WeightDialog
          open={weightDialogOpen}
          onOpenChange={setWeightDialogOpen}
          selectedDate={selectedDate}
          weightInput={weightInput}
          onWeightInputChange={setWeightInput}
          existingWeightEntry={existingWeightEntry}
          onSave={handleSaveWeight}
          onDelete={handleDeleteWeight}
          onCancel={() => setWeightDialogOpen(false)}
        />

        {/* Dialog for blood pressure */}
        <BloodPressureDialog
          open={bpDialogOpen}
          onOpenChange={setBpDialogOpen}
          selectedDate={selectedDate}
          systolicInput={systolicInput}
          onSystolicInputChange={setSystolicInput}
          diastolicInput={diastolicInput}
          onDiastolicInputChange={setDiastolicInput}
          existingBPEntry={existingBPEntry}
          onSave={handleSaveBloodPressure}
          onDelete={handleDeleteBloodPressure}
          onCancel={() => setBpDialogOpen(false)}
        />

        {/* Dialog for blood fats */}
        <BloodFatsDialog
          open={bloodFatsDialogOpen}
          onOpenChange={setBloodFatsDialogOpen}
          bloodFatsDateInput={bloodFatsDateInput}
          onBloodFatsDateInputChange={setBloodFatsDateInput}
          ldlInput={ldlInput}
          onLdlInputChange={setLdlInput}
          hdlInput={hdlInput}
          onHdlInputChange={setHdlInput}
          triglyceridesInput={triglyceridesInput}
          onTriglyceridesInputChange={setTriglyceridesInput}
          existingBloodFatsEntry={existingBloodFatsEntry}
          onSave={handleSaveBloodFats}
          onDelete={handleDeleteBloodFats}
          onCancel={() => setBloodFatsDialogOpen(false)}
        />

         {/* Dialog for blood glucose */}
        <BloodGlucoseDialog  
          open={bloodGlucoseDialogOpen}
          onOpenChange={setBloodGlucoseDialogOpen}
          bloodGlucoseDateInput={bloodGlucoseDateInput}
          onBloodGlucoseDateInputChange={setBloodGlucoseDateInput}
          hba1cInput={hba1cInput}
          onHba1cInputChange={setHba1cInput}
          fastingGlucoseInput={fastingGlucoseInput}
          onFastingGlucoseInputChange={setFastingGlucoseInput}
          existingBloodGlucoseEntry={existingBloodGlucoseEntry}
          onSave={handleSaveBloodGlucose}
          onDelete={handleDeleteBloodGlucose}
          onCancel={() => setBloodGlucoseDialogOpen(false)}
        />

           {/* Goal Edit Dialog */}
              <GoalEditDialog
                open={goalEditDialogOpen}
                onOpenChange={setGoalEditDialogOpen}
                goalEditType={goalEditType}
                goalWeightInput={goalWeightInput}
                onGoalWeightInputChange={setGoalWeightInput}
                goalSystolicInput={goalSystolicInput}
                onGoalSystolicInputChange={setGoalSystolicInput}
                goalDiastolicInput={goalDiastolicInput}
                onGoalDiastolicInputChange={setGoalDiastolicInput}
                goalLDLInput={goalLDLInput}
                onGoalLDLInputChange={setGoalLDLInput}
                goalHDLInput={goalHDLInput}
                onGoalHDLInputChange={setGoalHDLInput}
                goalHbA1cInput={goalHbA1cInput}
                onGoalHbA1cInputChange={setGoalHbA1cInput}
                goalFastingGlucoseInput={goalFastingGlucoseInput}
                onGoalFastingGlucoseInputChange={setGoalFastingGlucoseInput}
                onSave={handleSaveGoal}
                onCancel={() => setGoalEditDialogOpen(false)}
              />

          {/* Save Confirmation Alert */}
          <SaveConfirmationDialog
              open={saveAlertOpen}
              onOpenChange={setSaveAlertOpen}
              pendingEntry={pendingEntry}
              selectedDate={selectedDate}
              onConfirm={confirmSaveEntry}
              onCancel={() => setPendingEntry(null)}
            />
        </div>  
      </main>
    </div>
  );
};

export default Progress;
