import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Heart } from "lucide-react";
import { pageTitle, pageSubtitle, pageContainer, headerContainer, pagePadding, standardSpacing } from "@/lib/design-tokens";
import { useToast } from "@/hooks/use-toast";
import { getDayLogs } from "@/lib/tip-completion";
import { getStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, markedTipsSchema, selectedMedicationsSchema, healthMetricsSchema, type DayLog } from "@/lib/schemas";
import { validateWeight, validateSystolic, validateDiastolic, validateLDL, validateHDL, validateTriglycerides, validateHbA1c, validateFastingGlucose, safeParseFloat, safeParseInt } from "@/lib/health-validators";
import { medications } from "@/data/medications";
import { HealthInfoCard } from "@/components/HealthInfoCard";
import { getCurrentDate } from "@/lib/simulated-date";
import { ProgressChart } from "@/pages/ProgressChart";
import { SaveConfirmationDialog } from "@/components/AlertSaveDataProgress";
import { GoalEditDialog } from "./ProgressTableDialogs.tsx/EditGoalDialog";
import { BloodGlucoseDialog } from "./ProgressTableDialogs.tsx/ProgrBloodSugarDialog";
import { WeightDialog } from "./ProgressTableDialogs.tsx/ProgrWeightDialog";
import { BloodPressureDialog } from "./ProgressTableDialogs.tsx/ProgrBPDialog";
import { BloodFatsDialog } from "./ProgressTableDialogs.tsx/ProgrBloodFatDialog";

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

  // Load health priorities, medications, and day logs from localStorage
  useEffect(() => {
    // Load day logs for charts
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

    // Load health metrics for goals with safe parsing
    const metrics = getStorageItem('healthMetrics', healthMetricsSchema);
    if (metrics) {
      const goalW = safeParseFloat(metrics.goalWeight);
      if (goalW !== undefined) setGoalWeight(goalW);
      
      const goalSys = safeParseInt(metrics.goalSystolic);
      const goalDia = safeParseInt(metrics.goalDiastolic);
      if (goalSys !== undefined && goalDia !== undefined) {
        setGoalBloodPressure({ systolic: goalSys, diastolic: goalDia });
      }
      
      const goalL = safeParseFloat(metrics.goalLDL);
      if (goalL !== undefined) setGoalBloodFats(prev => ({ ...prev, ldl: goalL }));
      
      const goalH = safeParseFloat(metrics.goalHDL);
      if (goalH !== undefined) setGoalBloodFats(prev => ({ ...prev, hdl: goalH }));
      
      const goalHba = safeParseFloat(metrics.goalHbA1c);
      if (goalHba !== undefined) setGoalBloodGlucose(prev => ({ ...prev, hba1c: goalHba }));
      
      const goalFG = safeParseFloat(metrics.goalFastingGlucose);
      if (goalFG !== undefined) setGoalBloodGlucose(prev => ({ ...prev, fastingGlucose: goalFG }));
    }
  }, []);

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
    // Validate optional fields if provided
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
        title: "Kolesterolvärden raderade",
        description: `Kolesterol för ${format(selectedDate, 'd MMMM', { locale: sv })} har raderats`,
      });
    }
    
    setBloodFatsDialogOpen(false);
    setExistingBloodFatsEntry(null);
  };

  const handleSaveBloodGlucose = () => {
    const hasHba1c = hba1cInput.trim().length > 0;
    const hasFasting = fastingGlucoseInput.trim().length > 0;
    
    if (!hasHba1c && !hasFasting) {
      toast({
        title: "Ogiltigt värde",
        description: "Ange minst ett blodsockervärde",
        variant: "destructive"
      });
      return;
    }
    
    if (hasHba1c) {
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
    
    if (hasFasting) {
      const fastingValidation = validateFastingGlucose(fastingGlucoseInput);
      if (!fastingValidation.valid) {
        toast({
          title: "Ogiltigt fasteblodsocker",
          description: fastingValidation.error || "Ange ett giltigt fasteblodsockervärde",
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

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
          <h1 className={pageTitle}>Mina värden</h1>
      </header>
      
      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>

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
            
            <ProgressChart 
              type="bloodFats" 
              dayLogs={dayLogs}
              goalBloodFats={goalBloodFats}
              onMoreClick={() => navigate('/app/progress/bloodFats')}
            />
            <ProgressChart 
              type="bloodGlucose" 
              dayLogs={dayLogs}
              goalBloodGlucose={goalBloodGlucose}
              onMoreClick={() => navigate('/app/progress/bloodGlucose')}
            />
          </div>

          {/* Health Goals Card */}
          <div className="grid grid-cols-1 gap-6 mt-6">
            <HealthInfoCard
              icon={Heart}
              title="Mina hälsomål"
              items={priorities.map((id) => ({ id, label: healthPriorityLabels[id] }))}
              emptyMessage="Inga mål valda ännu"
              onClick={() => navigate('/app/health-goals?returnTo=/app/progress')}
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