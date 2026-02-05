import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subDays } from "date-fns";
import { Heart } from "lucide-react";
import { pageTitle, pageSubtitle, pageContainer, headerContainer, pagePadding, standardSpacing, cardTextSmall, bodyTextSmallBold } from "@/lib/design-tokens";
import { getDayLogs } from "@/lib/tip-completion";
import { getStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, selectedMedicationsSchema, healthMetricsSchema, type DayLog } from "@/lib/schemas";
import { safeParseFloat, safeParseInt } from "@/lib/health-validators";
import { medications } from "@/data/medications";
import { StatsBox } from "@/components/ProgressStatsBox";
import { HealthInfoCard } from "@/components/HealthInfoCard";
import { getCurrentDate } from "@/lib/simulated-date";
import { ProgressChart } from "@/pages/ProgressChart";

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
  const [goalWeight, setGoalWeight] = useState<number | undefined>();
  const [goalBloodPressure, setGoalBloodPressure] = useState<{ systolic: number; diastolic: number } | undefined>();
  const [goalBloodFats, setGoalBloodFats] = useState<{ ldl?: number; hdl?: number } | undefined>();
  const [goalBloodGlucose, setGoalBloodGlucose] = useState<{ hba1c?: number; fastingGlucose?: number } | undefined>();
  const [showBloodFats, setShowBloodFats] = useState(false);
  const [showBloodGlucose, setShowBloodGlucose] = useState(false);

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

    // Determine if we should show blood fats and blood glucose charts
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

  return (
    <div className={pageContainer}>
      
      <header className={headerContainer}>
          <h1 className={pageTitle}>Mina sidor</h1>
          <p className={pageSubtitle}>Följ dina framsteg</p>
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

          {/* Health Goals Card */}
          <div className="grid grid-cols-1 gap-6">
            <HealthInfoCard
              icon={Heart}
              title="Mina hälsomål"
              items={priorities.map((id) => ({ id, label: healthPriorityLabels[id] }))}
              emptyMessage="Inga mål valda ännu"
              onClick={() => navigate('/app/health-goals?returnTo=/app/progress')}
            />
          </div>
        </div>  
      </main>
    </div>
  );
};

export default Progress;
