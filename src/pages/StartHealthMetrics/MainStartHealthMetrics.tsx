import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentMeasurements } from "./WeightHeight";
import { BloodPressure } from "./BloodPressure";
import { BloodFats } from "./BloodFats";
import { BloodGlucose } from "./BloodGlucose";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { ButtonAbort } from "@/components/ButtonAbort";
import { useToast } from "@/hooks/use-toast";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { completedActivitiesSchema, healthMetricsSchema, HealthMetrics, DayLog } from "@/lib/schemas"; // CHANGED
import { markCardCompleted } from "@/lib/card-completion";
import { sectionHeading, headerContainer, pageContainer, pagePadding } from "@/lib/design-tokens";
import { getCurrentDate } from "@/lib/simulated-date";
import { format } from "date-fns";

const TOTAL_STEPS = 4; // Total nr of pages in assessment workflow

const HealthMetricsFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [metricsData, setMetricsData] = useState<Partial<HealthMetrics>>({}); // CHANGED

  useEffect(() => {
    const existing = getStorageItem('healthMetrics', healthMetricsSchema);
    if (existing) {
      setMetricsData(existing);
    }
  }, []);

  const pageTitles = ['Längd & vikt', 'Blodtryck', 'Blodfetter', 'Blodsocker'];
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

const handleNext = (pageData: any) => {
  const today = format(getCurrentDate(), 'yyyy-MM-dd');
  const existingLogs = JSON.parse(localStorage.getItem('dayLogs') || '[]');
  
  switch (currentPageIndex) {
    case 0: // Current measurements (height, weight, goalWeight)
      saveData({ 
        height: pageData.height, 
        weight: pageData.weight, 
        goalWeight: pageData.goalWeight 
      });
      
      if (pageData.weight) {
        const weight = parseFloat(pageData.weight);
        if (weight > 0) {
          addEntryToDayLogs(existingLogs, today, { type: 'weight', value: weight });
        }
      }
      break;
      
    case 1: // Blood pressure
      const bpDateRaw = pageData.date || today;
      const bpDate = bpDateRaw.includes('T') ? format(new Date(bpDateRaw), 'yyyy-MM-dd') : bpDateRaw;
      
      saveData({ 
        systolic: pageData.systolic,
        diastolic: pageData.diastolic,
        bloodPressureDate: bpDate,
      });
      
      if (pageData.systolic && pageData.diastolic) {
        addEntryToDayLogs(existingLogs, bpDate, { 
          type: 'bloodPressure', 
          value: parseInt(pageData.systolic), 
          value2: parseInt(pageData.diastolic)
        });
      }
      break;
      
    case 2: // Blood fats
      const bloodFatsDateRaw = pageData.date || today;
      const bloodFatsDate = bloodFatsDateRaw.includes('T') ? format(new Date(bloodFatsDateRaw), 'yyyy-MM-dd') : bloodFatsDateRaw;
      
      saveData({ 
        knowsLDL: pageData.knowsLDL,
        ldl: pageData.ldl,
        hdl: pageData.hdl,
        triglycerides: pageData.triglycerides,
        bloodFatsDate: bloodFatsDate,
      });
      
      if (pageData.ldl) {
        addEntryToDayLogs(existingLogs, bloodFatsDate, { 
          type: 'bloodFats', 
          value: parseFloat(pageData.ldl),
          value2: pageData.hdl ? parseFloat(pageData.hdl) : undefined,
          value3: pageData.triglycerides ? parseFloat(pageData.triglycerides) : undefined
        });
      }
      break;
      
    case 3: // Blood glucose
      const bloodGlucoseDateRaw = pageData.date || today;
      const bloodGlucoseDate = bloodGlucoseDateRaw.includes('T') ? format(new Date(bloodGlucoseDateRaw), 'yyyy-MM-dd') : bloodGlucoseDateRaw;
      
      saveData({ 
        hba1c: pageData.hba1c,
        fastingGlucose: pageData.fastingGlucose,
        bloodGlucoseDate: bloodGlucoseDate,
      });
      
      if (pageData.hba1c || pageData.fastingGlucose) {
        addEntryToDayLogs(existingLogs, bloodGlucoseDate, { 
          type: 'bloodGlucose', 
          value: pageData.hba1c ? parseFloat(pageData.hba1c) : (parseFloat(pageData.fastingGlucose) || 0),
          value2: pageData.fastingGlucose ? parseFloat(pageData.fastingGlucose) : undefined
        });
      }
      break;
  }
  
  localStorage.setItem('dayLogs', JSON.stringify(existingLogs));

  if (currentPageIndex < TOTAL_STEPS - 1) {
    setCurrentPageIndex(currentPageIndex + 1);
  } else {
    finishFlow();
  }
};

const addEntryToDayLogs = (logs: DayLog[], dateStr: string, entry: any) => {
  const existingLogIndex = logs.findIndex(log => log.date === dateStr);
  
  if (existingLogIndex >= 0) {
    logs[existingLogIndex].entries = logs[existingLogIndex].entries.filter(e => e.type !== entry.type);
    logs[existingLogIndex].entries.push(entry);
  } else {
    logs.push({ date: dateStr, entries: [entry] });
  }
};

  const handleSkip = () => {
    if (currentPageIndex < TOTAL_STEPS - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      finishFlow();
    }
  };

  const handleBack = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

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

  return (
    <div className={pageContainer}>
      <div className={headerContainer}>
        {currentPageIndex === 0 ? (
          <BackToTodayButton />
        ) : (
          <ButtonAbort className="absolute right-4 top-4" />
        )}
        <h1 className={sectionHeading}>{pageTitles[currentPageIndex]}</h1>
      </div>

      <main className={pagePadding}>
        {currentPageIndex === 0 && (
          <CurrentMeasurements
            onNext={handleNext}
            onSkip={handleSkip}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        )}
        {currentPageIndex === 1 && (
          <BloodPressure
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        )}
        {currentPageIndex === 2 && (
          <BloodFats
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        )}
        {currentPageIndex === 3 && (
          <BloodGlucose
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        )}
      </main>
    </div>
  );
};

export default HealthMetricsFlow;