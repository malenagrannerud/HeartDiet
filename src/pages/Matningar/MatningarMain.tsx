/**
 * Progress page component for displaying health metrics and goals
 * 
 * @module MatingarMain.tsx
 * 
 * @description
 * Main progress page showing all health measurements and goals.
 * Features:
 * - Health priorities card with user's selected health goals
 * - Charts for each metric type (blood pressure, weight, blood fats, blood glucose)
 * - Click navigation to detailed views for each metric
 * - Persistent loading of health metrics, priorities, and goals from localStorage
 * 
 * Charts are always displayed regardless of data availability.
 * 
 * @requires react - useState, useEffect for state management
 * @requires react-router-dom - Navigation
 * @requires lucide-react - Heart icon
 * @requires @/lib/design-tokens - Design system classes
 * @requires @/lib/tip-completion - Day logs data
 * @requires @/lib/storage - Local storage utilities
 * @requires @/lib/schemas - Type validation schemas
 * @requires @/lib/health-validators - Safe parsing utilities
 * @requires @/components/HealthInfoCard - Health priorities card
 * @requires @/pages/Matningar/MatningarPlotsMain - Chart component
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { pageTitle, pageSubtitle, pageContainer, headerContainer, pagePadding, standardSpacing } from "@/lib/design-tokens";
import { getDayLogs } from "@/lib/tip-completion";
import { getStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, selectedMedicationsSchema, healthMetricsSchema, type DayLog } from "@/lib/schemas";
import { safeParseFloat, safeParseInt } from "@/lib/health-validators";
import { HealthInfoCard } from "@/components/HealthInfoCard";
import { ProgressChart } from "@/pages/Matningar/PlotsComponents";

/**
 * Mapping of health priority IDs to display labels
 */
const healthPriorityLabels: Record<string, string> = {
  cholesterol: "Hantera mitt kolesterol",
  bloodPressure: "Hantera mitt blodtryck",
  diabetes: "Minska risken för diabetes typ 2",
  weight: "Viktbalans",
  general: "Bli piggare", 
  general2: "Förebygg livsstilsrelaterade sjukdomar" 
};

/**
 * Progress page component
 * 
 * @component
 * @returns {JSX.Element} Progress page with health metrics and charts
 * 
 * @example
 * <Progress />
 */
const Progress = () => {
  const navigate = useNavigate();
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [goalWeight, setGoalWeight] = useState<number | undefined>();
  const [goalBloodPressure, setGoalBloodPressure] = useState<{ systolic: number; diastolic: number } | undefined>();
  const [goalBloodFats, setGoalBloodFats] = useState<{ ldl?: number; hdl?: number } | undefined>();
  const [goalBloodGlucose, setGoalBloodGlucose] = useState<{ hba1c?: number; fastingGlucose?: number } | undefined>();

  /**
   * Load day logs and health priorities from localStorage on mount
   */
  useEffect(() => {
    const logs = getDayLogs();
    setDayLogs(logs);

    const data = getStorageItem('healthPriorities', healthPrioritiesSchema);
    if (data) {
      setPriorities(data.priorities || []);
    }

    // Load medications from new format
    const savedMeds = getStorageItem('selectedMedications', selectedMedicationsSchema);

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

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
        <h1 className={pageTitle}>Mina mätningar</h1>
        <p className={pageSubtitle}>Se och redigera dina mätningar och mål</p>
      </header>

      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          {/* Health priorities card */}
          <div className="grid grid-cols-1 gap-6">
            <HealthInfoCard
              icon={Heart}
              title="Mitt hälsomål"
              items={priorities.map((id) => ({ id, label: healthPriorityLabels[id] }))}
              emptyMessage="Inga mål valda ännu"
              onClick={() => navigate('/app/health-goals?returnTo=/app/progress')}
            />
          </div>

          {/* Charts section - always displayed */}
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
        </div>  
      </main>
    </div>
  );
};

export default Progress;