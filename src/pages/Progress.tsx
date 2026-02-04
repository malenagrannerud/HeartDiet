import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Pill } from "lucide-react";
import { Card } from "@/components/ui/card"; // ADD THIS
import { Button } from "@/components/ui/button"; // ADD THIS
import { pageTitle, pageContainer, headerContainer, pagePadding, standardSpacing } from "@/lib/design-tokens";
import { getDayLogs } from "@/lib/tip-completion";
import { getStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, selectedMedicationsSchema, healthMetricsSchema, type DayLog } from "@/lib/schemas";
import { safeParseFloat, safeParseInt } from "@/lib/health-validators";
import { medications } from "@/data/medications";
import { HealthInfoCard } from "@/components/HealthInfoCard";
import { BloodPressureMiniChart } from "./ProgressPages/bloodPressure";
import { WeightMiniChart } from "./ProgressPages/weight";
import { BloodFatsMiniChart } from "./ProgressPages/bloodFat";
import { BloodSugarMiniChart } from "./ProgressPages/bloodSugar";

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
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<Array<{ id?: string; name?: string; addedDate?: string }>>([]);
  const [goalWeight, setGoalWeight] = useState<number | undefined>();
  const [goalSystolic, setGoalSystolic] = useState<number | undefined>();
  const [goalDiastolic, setGoalDiastolic] = useState<number | undefined>();
  const [goalLDL, setGoalLDL] = useState<number | undefined>();
  const [goalHDL, setGoalHDL] = useState<number | undefined>();
  const [goalHbA1c, setGoalHbA1c] = useState<number | undefined>();
  const [goalFastingGlucose, setGoalFastingGlucose] = useState<number | undefined>();

  // Load data for charts and health info
  useEffect(() => {
    // Load day logs for charts
    const logs = getDayLogs();
    setDayLogs(logs);

    // Load health priorities
    const data = getStorageItem('healthPriorities', healthPrioritiesSchema);
    if (data) {
      setPriorities(data.priorities || []);
    }

    // Load medications
    const savedMeds = getStorageItem('selectedMedications', selectedMedicationsSchema);
    if (savedMeds) {
      setSelectedMedications(savedMeds);
    }

    // Load health metrics for goals
    const metrics = getStorageItem('healthMetrics', healthMetricsSchema);
    if (metrics) {
      // Weight
      const goalW = safeParseFloat(metrics.goalWeight);
      if (goalW !== undefined) setGoalWeight(goalW);
      
      // Blood Pressure
      const goalSys = safeParseInt(metrics.goalSystolic);
      const goalDia = safeParseInt(metrics.goalDiastolic);
      if (goalSys !== undefined) setGoalSystolic(goalSys);
      if (goalDia !== undefined) setGoalDiastolic(goalDia);
      
      // Blood Fats
      const goalL = safeParseFloat(metrics.goalLDL);
      const goalH = safeParseFloat(metrics.goalHDL);
      if (goalL !== undefined) setGoalLDL(goalL);
      if (goalH !== undefined) setGoalHDL(goalH);
      
      // Blood Glucose
      const goalHba = safeParseFloat(metrics.goalHbA1c);
      const goalFG = safeParseFloat(metrics.goalFastingGlucose);
      if (goalHba !== undefined) setGoalHbA1c(goalHba);
      if (goalFG !== undefined) setGoalFastingGlucose(goalFG);
    }
  }, []);

  // Format medications for display
  const medicationItems = selectedMedications
    .map(savedMed => {
      if (!savedMed.id) return null;
      const medicationInfo = medications.find(med => med.id === savedMed.id);
      if (!medicationInfo) return null;
      return {
        id: savedMed.id,
        label: medicationInfo.name
      };
    })
    .filter(Boolean) as Array<{ id: string; label: string }>;

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
        <h1 className={pageTitle}>Mina värden</h1>
      </header>
      
      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          {/* 4 Charts - Click "Detaljer" to navigate to detail pages */}
          <div className="flex flex-col gap-6">
            <BloodPressureMiniChart 
              dayLogs={dayLogs}
              goalSystolic={goalSystolic}
              goalDiastolic={goalDiastolic}
              onMoreClick={() => navigate('/app/progress/bloodPressure')}
            />

            <WeightMiniChart 
              dayLogs={dayLogs}
              goalWeight={goalWeight}
              onMoreClick={() => navigate('/app/progress/weight')}
            />
            
            <BloodFatsMiniChart 
              dayLogs={dayLogs}
              goalLDL={goalLDL}
            
              onMoreClick={() => navigate('/app/progress/bloodFats')}
            />
            
            <BloodSugarMiniChart 
              dayLogs={dayLogs}
              goalHbA1c={goalHbA1c}
              goalFastingGlucose={goalFastingGlucose}
              onMoreClick={() => navigate('/app/progress/bloodGlucose')}
            />
          </div>

          {/* Health Goals Card - Click to edit */}
          <div className="grid grid-cols-1 gap-6 mt-6">
            <HealthInfoCard
              icon={Heart}
              title="Mina hälsomål"
              items={priorities.map((id) => ({ id, label: healthPriorityLabels[id] }))}
              emptyMessage="Inga mål valda ännu"
              onClick={() => navigate('/app/health-goals?returnTo=/app/progress')}
            />
          </div>

          {/* Medications Card - Click to edit */}
          {medicationItems.length > 0 && (
            <div className="grid grid-cols-1 gap-6 mt-6">
              <HealthInfoCard
                icon={Pill}
                title="Mina mediciner"
                items={medicationItems}
                emptyMessage="Inga mediciner registrerade"
                onClick={() => navigate('/app/medications?returnTo=/app/progress')}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Progress;