import { useState, useEffect } from "react";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, subDays } from "date-fns";
import { sv } from "date-fns/locale";
import { pageTitle, pageSubtitle, pageContainer, headerContainer, pagePadding, standardSpacing, cardTextSmall, bodyTextSmallBold } from "@/lib/design-tokens";
import { StatsBox } from "@/components/ProgressStatsBox";
import { useToast } from "@/hooks/use-toast";
import { getDayLogs } from "@/lib/tip-completion";
import { getStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, markedTipsSchema, selectedMedicationsSchema, healthMetricsSchema, type DayLog } from "@/lib/schemas";
import { validateWeight, validateSystolic, validateDiastolic, validateLDL, validateHDL, validateTriglycerides, validateHbA1c, validateFastingGlucose, safeParseFloat, safeParseInt } from "@/lib/health-validators";
import { medications } from "@/data/medications";
import { tips } from "@/data/tips";
import { getCurrentDate } from "@/lib/simulated-date";
import { WeeklyProgressTable } from "@/pages/ProgressTable";
import { SaveConfirmationDialog } from "@/components/AlertSaveDataProgress";
import { GoalEditDialog } from "./ProgressTableDialogs.tsx/EditGoalDialog";
import { BloodGlucoseDialog } from "./ProgressTableDialogs.tsx/ProgrBloodSugarDialog";
import { WeightDialog } from "./ProgressTableDialogs.tsx/ProgrWeightDialog";
import { BloodPressureDialog } from "./ProgressTableDialogs.tsx/ProgrBPDialog";
import { BloodFatsDialog } from "./ProgressTableDialogs.tsx/ProgrBloodFatDialog";

const Dagbok = () => {
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
  const [markedTipIds, setMarkedTipIds] = useState<number[]>([]);
  
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

  // Load day logs
  useEffect(() => {
    const logs = getDayLogs();
    setDayLogs(logs);

    const markedTips = getStorageItem('markedTips', markedTipsSchema);
    if (markedTips) {
      setMarkedTipIds(markedTips.map(tip => tip.id));
    }
  }, []);

  // Calculate stats
  const getDaysWithGoalThisMonth = (): number => {
    const today = getCurrentDate();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return daysInMonth.filter(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const log = dayLogs.find(l => l.date === dateStr);
      return log?.entries.some(entry => entry.type === 'tip');
    }).length;
  };

  const getCurrentStreak = (): number => {
    let streak = 0;
    let currentDate = getCurrentDate();
    
    while (true) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const log = dayLogs.find(l => l.date === dateStr);
      const hasTipEntry = log?.entries.some(entry => entry.type === 'tip');
      
      if (hasTipEntry) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const daysThisMonth = getDaysWithGoalThisMonth();
  const currentStreak = getCurrentStreak();

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
        existingLog.entries.splice(tipEntryIndex, 1);
        if (existingLog.entries.length === 0) {
          updatedLogs.splice(existingLogIndex, 1);
        }
        toast({
          title: "Tips avmarkerat",
          description: `${tips.find(t => t.id === tipId)?.title} har avmarkerats`,
        });
      } else {
        existingLog.entries.push({ type: 'tip', value: 1, tipId });
        toast({
          title: "Tips markerat som gjort!",
          description: `${tips.find(t => t.id === tipId)?.title} har markerats`,
        });
      }
    } else {
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
    return format(date, 'yyyy-MM-dd') === format(getCurrentDate(), 'yyyy-MM-dd');
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
    const validation = validateWeight(weightInput);
    if (!validation.valid) {
      toast({
        title: "Ogiltigt värde",
        description: validation.error || "Ange ett giltigt viktvärde",
        variant: "destructive"
      });
      return;
    }
    setPendingEntry({ type: 'weight', weight: weightInput });
    setSaveAlertOpen(true);
  };

  const handleSaveBloodPressure = () => {
    if (!selectedDate) return;
    const sysValidation = validateSystolic(systolicInput);
    const diaValidation = validateDiastolic(diastolicInput);
    if (!sysValidation.valid) {
      toast({
        title: "Ogiltigt systoliskt värde",
        description: sysValidation.error || "Ange ett giltigt systoliskt värde",
        variant: "destructive"
      });
      return;
    }
    if (!diaValidation.valid) {
      toast({
        title: "Ogiltigt diastoliskt värde",
        description: diaValidation.error || "Ange ett giltigt diastoliskt värde",
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
    const ldlValidation = validateLDL(ldlInput);
    if (!ldlValidation.valid) {
      toast({
        title: "Ogiltigt LDL-värde",
        description: ldlValidation.error || "Ange ett giltigt LDL-kolesterolvärde",
        variant: "destructive"
      });
      return;
    }
    if (hdlInput.trim()) {
      const hdlValidation = validateHDL(hdlInput);
      if (!hdlValidation.valid) {
        toast({
          title: "Ogiltigt HDL-värde",
          description: hdlValidation.error || "Ange ett giltigt HDL-kolesterolvärde",
          variant: "destructive"
        });
        return;
      }
    }
    if (triglyceridesInput.trim()) {
      const trigValidation = validateTriglycerides(triglyceridesInput);
      if (!trigValidation.valid) {
        toast({
          title: "Ogiltigt triglyceridvärde",
          description: trigValidation.error || "Ange ett giltigt triglyceridvärde",
          variant: "destructive"
        });
        return;
      }
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
        title: "Blodvärden raderade",
        description: `Kolesterolvärden för ${format(selectedDate, 'd MMMM', { locale: sv })} har raderats`,
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
      setHba1cInput(bloodGlucoseEntry.value?.toString() || "");
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
    if (!hba1cInput.trim() && !fastingGlucoseInput.trim()) {
      toast({
        title: "Inget värde angivet",
        description: "Ange minst ett blodsockervärde",
        variant: "destructive"
      });
      return;
    }
    if (hba1cInput.trim()) {
      const hba1cValidation = validateHbA1c(hba1cInput);
      if (!hba1cValidation.valid) {
        toast({
          title: "Ogiltigt HbA1c-värde",
          description: hba1cValidation.error || "Ange ett giltigt HbA1c-värde",
          variant: "destructive"
        });
        return;
      }
    }
    if (fastingGlucoseInput.trim()) {
      const fgValidation = validateFastingGlucose(fastingGlucoseInput);
      if (!fgValidation.valid) {
        toast({
          title: "Ogiltigt fasteblodsocker-värde",
          description: fgValidation.error || "Ange ett giltigt fasteblodsocker-värde",
          variant: "destructive"
        });
        return;
      }
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
        description: `Blodsockervärden för ${format(selectedDate, 'd MMMM', { locale: sv })} har raderats`,
      });
    }
    
    setBloodGlucoseDialogOpen(false);
    setExistingBloodGlucoseEntry(null);
  };

  const confirmSaveEntry = () => {
    if (!pendingEntry || !selectedDate) return;
    
    const dateStr = pendingEntry.date || format(selectedDate, 'yyyy-MM-dd');
    const existingLogIndex = dayLogs.findIndex(log => log.date === dateStr);
    let updatedLogs = [...dayLogs];

    const newEntry: any = {
      type: pendingEntry.type,
      value: 0
    };

    if (pendingEntry.type === 'weight') {
      newEntry.value = parseFloat(pendingEntry.weight!);
    } else if (pendingEntry.type === 'bloodPressure') {
      newEntry.value = parseInt(pendingEntry.systolic!);
      newEntry.value2 = parseInt(pendingEntry.diastolic!);
    } else if (pendingEntry.type === 'bloodFats') {
      newEntry.value = parseFloat(pendingEntry.ldl!);
      if (pendingEntry.hdl) newEntry.value2 = parseFloat(pendingEntry.hdl);
      if (pendingEntry.triglycerides) newEntry.value3 = parseFloat(pendingEntry.triglycerides);
    } else if (pendingEntry.type === 'bloodGlucose') {
      if (pendingEntry.hba1c) newEntry.value = parseFloat(pendingEntry.hba1c);
      if (pendingEntry.fastingGlucose) newEntry.value2 = parseFloat(pendingEntry.fastingGlucose);
    }

    if (existingLogIndex >= 0) {
      const filteredEntries = updatedLogs[existingLogIndex].entries.filter(
        e => e.type !== pendingEntry.type
      );
      updatedLogs[existingLogIndex].entries = [...filteredEntries, newEntry];
    } else {
      updatedLogs.push({
        date: dateStr,
        entries: [newEntry]
      });
    }

    setDayLogs(updatedLogs);
    localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
    
    const typeLabels = {
      weight: 'Vikt',
      bloodPressure: 'Blodtryck',
      bloodFats: 'Kolesterolvärden',
      bloodGlucose: 'Blodsockervärden'
    };
    
    toast({
      title: `${typeLabels[pendingEntry.type]} sparad`,
      description: `Data för ${format(new Date(dateStr), 'd MMMM', { locale: sv })} har sparats`,
    });
    
    setWeightDialogOpen(false);
    setBpDialogOpen(false);
    setBloodFatsDialogOpen(false);
    setBloodGlucoseDialogOpen(false);
    setSaveAlertOpen(false);
    setPendingEntry(null);
  };

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
        <h1 className={pageTitle}>Dagbok</h1>
        <p className={pageSubtitle}>Logga dina dagliga aktiviteter</p>
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
                  <div className="w-16 h-16 bg-accent flex items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{daysThisMonth}</span>
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
                  <div className="w-16 h-16 bg-muted flex items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{currentStreak}</span>
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

export default Dagbok;
