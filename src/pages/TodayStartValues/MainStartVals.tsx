import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeightPage } from "./Height";
import { WeightPage } from "./Weight";
import { BloodPressure } from "./BloodPressure";
import { BloodFats } from "./BloodFats";
import { BloodGlucose } from "./BloodGlucose";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { ButtonAbort } from "@/components/ButtonAbort";
import { useToast } from "@/hooks/use-toast";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { completedActivitiesSchema, healthMetricsSchema, HealthMetrics, DayLog } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion";
import { sectionHeading, headerContainer, pageContainer, pagePadding } from "@/lib/design-tokens";
import { getCurrentDate } from "@/lib/simulated-date";
import { format } from "date-fns";
import { safeParseFloat, safeParseInt, HEALTH_RANGES } from "@/lib/health-validators";

const TOTAL_STEPS = 5;

// Helper functions
const normalizeDate = (dateInput: string | Date, fallback: string): string => {
  if (!dateInput) return fallback;
  
  if (dateInput instanceof Date) {
    return format(dateInput, 'yyyy-MM-dd');
  }
  
  if (dateInput.includes('T')) {
    return format(new Date(dateInput), 'yyyy-MM-dd');
  }
  
  return dateInput;
};

const isValidRange = (value: number | undefined, range: { min: number; max: number }) => {
  return value !== undefined && value >= range.min && value <= range.max;
};

const createDayLogEntry = (type: string, value: any, value2?: any, value3?: any) => ({
  type,
  value,
  ...(value2 !== undefined && { value2 }),
  ...(value3 !== undefined && { value3 }),
  timestamp: new Date().toISOString()
});

const addEntryToDayLogs = (logs: DayLog[], dateStr: string, entry: any) => {
  const existingLogIndex = logs.findIndex(log => log.date === dateStr);
  
  if (existingLogIndex >= 0) {
    logs[existingLogIndex].entries = logs[existingLogIndex].entries.filter(e => e.type !== entry.type);
    logs[existingLogIndex].entries.push(entry);
  } else {
    logs.push({ date: dateStr, entries: [entry] });
  }
};

const HealthMetricsFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [metricsData, setMetricsData] = useState<Partial<HealthMetrics>>({});

  useEffect(() => {
    const existing = getStorageItem('healthMetrics', healthMetricsSchema);
    if (existing) {
      setMetricsData(existing);
    }
  }, []);

  const currentStep = currentPageIndex + 1;

  const saveData = (data: Partial<HealthMetrics>) => {
    const updated = {
      ...metricsData,
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    setMetricsData(updated);
    
    const success = setStorageItem('healthMetrics', updated, healthMetricsSchema);
    if (!success) {
      try {
        localStorage.setItem('healthMetrics', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save health metrics:', e);
      }
    }
  };

  // Page handlers
  const handleHeightData = (pageData: any, today: string, existingLogs: DayLog[]) => {
    saveData({ height: pageData.height });
  };

  const handleWeightData = (pageData: any, today: string, existingLogs: DayLog[]) => {
    saveData({ 
      weight: pageData.weight, 
      goalWeight: pageData.goalWeight 
    });
    
    const weight = safeParseFloat(pageData.weight);
    if (isValidRange(weight, HEALTH_RANGES.weight)) {
      addEntryToDayLogs(existingLogs, today, createDayLogEntry('weight', weight));
    }
  };

  const handleBloodPressureData = (pageData: any, today: string, existingLogs: DayLog[]) => {
    const bpDate = normalizeDate(pageData.date, today);
    
    saveData({ 
      systolic: pageData.systolic,
      diastolic: pageData.diastolic,
      bloodPressureDate: bpDate,
    });
    
    const systolic = safeParseInt(pageData.systolic);
    const diastolic = safeParseInt(pageData.diastolic);
    if (isValidRange(systolic, HEALTH_RANGES.systolic) && 
        isValidRange(diastolic, HEALTH_RANGES.diastolic)) {
      addEntryToDayLogs(existingLogs, bpDate, 
        createDayLogEntry('bloodPressure', systolic, diastolic));
    }
  };

  const handleBloodFatsData = (pageData: any, today: string, existingLogs: DayLog[]) => {
    const bloodFatsDate = normalizeDate(pageData.date, today);
    
    saveData({ 
      ldl: pageData.ldl,
      hdl: pageData.hdl,
      triglycerides: pageData.triglycerides,
      bloodFatsDate,
    });
    
    const ldl = safeParseFloat(pageData.ldl);
    if (isValidRange(ldl, HEALTH_RANGES.ldl)) {
      const hdl = safeParseFloat(pageData.hdl);
      const triglycerides = safeParseFloat(pageData.triglycerides);
      addEntryToDayLogs(existingLogs, bloodFatsDate, 
        createDayLogEntry('bloodFats', ldl, 
          isValidRange(hdl, HEALTH_RANGES.hdl) ? hdl : undefined,
          isValidRange(triglycerides, HEALTH_RANGES.triglycerides) ? triglycerides : undefined
        ));
    }
  };

  const handleBloodGlucoseData = (pageData: any, today: string, existingLogs: DayLog[]) => {
    const bloodGlucoseDate = normalizeDate(pageData.date, today);
    
    saveData({ 
      hba1c: pageData.hba1c,
      fastingGlucose: pageData.fastingGlucose,
      bloodGlucoseDate,
    });
    
    const hba1c = safeParseFloat(pageData.hba1c);
    const fastingGlucose = safeParseFloat(pageData.fastingGlucose);
    
    const validHba1c = isValidRange(hba1c, HEALTH_RANGES.hba1c);
    const validFasting = isValidRange(fastingGlucose, HEALTH_RANGES.fastingGlucose);
    
    if (validHba1c || validFasting) {
      addEntryToDayLogs(existingLogs, bloodGlucoseDate, 
        createDayLogEntry('bloodGlucose', 
          validHba1c ? hba1c : (validFasting ? fastingGlucose : 0),
          validFasting ? fastingGlucose : undefined
        ));
    }
  };

  const handleNext = (pageData: any) => {
    const today = format(getCurrentDate(), 'yyyy-MM-dd');
    const existingLogs = JSON.parse(localStorage.getItem('dayLogs') || '[]');
    
    const handlers = [
      handleHeightData,
      handleWeightData,
      handleBloodPressureData,
      handleBloodFatsData,
      handleBloodGlucoseData
    ];
    
    if (currentPageIndex < handlers.length) {
      handlers[currentPageIndex](pageData, today, existingLogs);
    }
    
    localStorage.setItem('dayLogs', JSON.stringify(existingLogs));
    goToNextPage();
  };

  const goToNextPage = () => {
    if (currentPageIndex < TOTAL_STEPS - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      finishFlow();
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleSkip = goToNextPage;
  const handleBack = goToPreviousPage;

  const finishFlow = () => {
    const completedActivities = getStorageItem('completedActivities', completedActivitiesSchema) || [];
    const activities = Array.isArray(completedActivities) ? completedActivities : [];
    const existingActivity = activities.find(a => a.id === 'health-metrics');
    if (!existingActivity) {
      activities.push({
        id: 'health-metrics',
        title: 'Hälsomått',
        completedDate: new Date().toISOString(),
        type: 'health-metrics'
      });
      setStorageItem('completedActivities', activities, completedActivitiesSchema);
    }

    markCardCompleted('health-metrics');

    toast({
      title: "Startvärden sparade",
      description: "Dina mätningar har sparats. Ändra eller lägg till under 'Mina sidor'",
    });

    navigate('/app/today');
  };

  // Render the appropriate page based on current index
  const renderCurrentPage = () => {
    switch (currentPageIndex) {
      case 0:
        return (
          <HeightPage
            onNext={handleNext}
            onSkip={handleSkip}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        );
      case 1:
        return (
          <WeightPage
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        );
      case 2:
        return (
          <BloodPressure
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        );
      case 3:
        return (
          <BloodFats
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        );
      case 4:
        return (
          <BloodGlucose
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={pageContainer}>
      <div className={`${headerContainer} min-h-[120px] py-6`}>
        {currentPageIndex === 0 ? (
          <BackToTodayButton />
        ) : (
          <ButtonAbort className="absolute right-4 top-4" />
        )}
      </div>

      <main className={pagePadding}>
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default HealthMetricsFlow;