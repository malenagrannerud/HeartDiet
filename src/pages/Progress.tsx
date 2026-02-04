import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Pill } from "lucide-react";
import { pageTitle, pageContainer, headerContainer, pagePadding, standardSpacing } from "@/lib/design-tokens";
import { getDayLogs } from "@/lib/tip-completion";
import { getStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, selectedMedicationsSchema, healthMetricsSchema, type DayLog } from "@/lib/schemas";
import { safeParseFloat, safeParseInt } from "@/lib/health-validators";
import { medications } from "@/data/medications";
import { HealthInfoCard } from "@/components/HealthInfoCard";
import { ProgressChart } from "@/pages/ProgChartComponent";

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
  const [goalBloodPressure, setGoalBloodPressure] = useState<{ systolic: number; diastolic: number } | undefined>();
  const [goalBloodFats, setGoalBloodFats] = useState<{ ldl?: number; hdl?: number } | undefined>();
  const [goalBloodGlucose, setGoalBloodGlucose] = useState<{ hba1c?: number; fastingGlucose?: number } | undefined>();

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