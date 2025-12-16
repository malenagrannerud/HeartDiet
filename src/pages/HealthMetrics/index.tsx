import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentMeasurements } from "./CurrentMeasurements";
import { BloodPressure } from "./BloodPressure";
import { BloodFats } from "./BloodFats";
import { BloodGlucose } from "./BloodGlucose";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { useToast } from "@/hooks/use-toast";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { extendedHealthMetricsSchema, completedActivitiesSchema, ExtendedHealthMetrics, healthMetricsSchema, DayLog } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion";
import { sectionHeading, headerContainer, pageContainer, pagePadding } from "@/lib/design-tokens";
import { format } from "date-fns";

const TOTAL_STEPS = 4; // Total nr of pages in assessment workflow

const HealthMetricsFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [metricsData, setMetricsData] = useState<Partial<ExtendedHealthMetrics>>({});

  useEffect(() => {
    const existing = getStorageItem('extendedHealthMetrics', extendedHealthMetricsSchema);
    if (existing) {
      setMetricsData(existing);
    }
  }, []);

  const pageTitles = ['Längd & vikt', 'Blodtryck', 'Blodfetter', 'Blodsocker'];
  const currentStep = currentPageIndex + 1;

  const saveData = (data: Partial<ExtendedHealthMetrics>) => {
    const updated = {
      ...metricsData,
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    setMetricsData(updated);
    const success = setStorageItem('extendedHealthMetrics', updated, extendedHealthMetricsSchema);
    if (!success) {       // Fallback: save without schema validation
      try {
        localStorage.setItem('extendedHealthMetrics', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save health metrics:', e);
      }
    }
  };


/**
 * Handles progression through health assessment flow with dual data storage strategy
 * @param {Object} pageData - Data collected from current assessment page
 * @param {number} currentPageIndex - Zero-based index tracking current assessment step
 * @param {Function} saveData - Primary data persistence to app state
 * @param {Function} finishFlow - Completion callback after final assessment
 * @param {Function} setCurrentPageIndex - Navigation controller for assessment steps
 */
const handleNext = (pageData: any) => {
  const today = format(new Date(), 'yyyy-MM-dd'); // ISO format ensures consistent date comparison
  
  // Get existing dayLogs
  const existingLogs = JSON.parse(localStorage.getItem('dayLogs') || '[]'); // Retrieve time-series data for chart visualization
  
  switch (currentPageIndex) {
    case 0: // Current measurements (height, weight, goalWeight)
      saveData({ height: pageData.height, weight: pageData.weight, goalWeight: pageData.goalWeight });
      
      // Also save to dayLogs for Progress chart
      if (pageData.weight) {
        const weight = parseFloat(pageData.weight);
        if (weight > 0) {
          // Add weight entry to dayLogs
          addEntryToDayLogs(existingLogs, today, { type: 'weight', value: weight }); // Weight tracking for progress visualization
        }
      }
      break;
      
    case 1: // Blood pressure
      const bpDate = pageData.date || today; // Allow historical entries with custom date override
      saveData({ 
        bloodPressure: {
          systolic: pageData.systolic,
          diastolic: pageData.diastolic,
          date: bpDate, // Store measurement date for time-series analysis
        }
      });
      
      if (pageData.systolic && pageData.diastolic) {  // Also save to dayLogs
        addEntryToDayLogs(existingLogs, bpDate, { 
          type: 'bloodPressure', 
          value: parseInt(pageData.systolic), 
          value2: parseInt(pageData.diastolic) // Store both values for dual-line chart display
        });
      }
      break;
      
    case 2: // Blood fats
      const bloodFatsDate = pageData.date || today;
      saveData({ bloodFats: pageData });
      
      // Also save to dayLogs
      if (pageData.ldl) { // LDL used as primary indicator for lipid tracking
        addEntryToDayLogs(existingLogs, bloodFatsDate, { 
          type: 'bloodFats', 
          value: parseFloat(pageData.ldl), // Primary lipid metric
          value2: pageData.hdl ? parseFloat(pageData.hdl) : undefined, // Optional HDL cholesterol
          value3: pageData.triglycerides ? parseFloat(pageData.triglycerides) : undefined // Optional triglycerides
        });
      }
      break;
      
    case 3: // Blood glucose
      const bloodGlucoseDate = pageData.date || today;
      saveData({ bloodGlucose: pageData });
      
      // Also save to dayLogs
      if (pageData.hba1c || pageData.fastingGlucose) { // Accept either long-term or immediate glucose metrics
        addEntryToDayLogs(existingLogs, bloodGlucoseDate, { 
          type: 'bloodGlucose', 
          value: pageData.hba1c ? parseFloat(pageData.hba1c) : (parseFloat(pageData.fastingGlucose) || 0), // Prioritize HbA1c for diabetes monitoring
          value2: pageData.fastingGlucose ? parseFloat(pageData.fastingGlucose) : undefined // Store immediate reading if available
        });
      }
      break;
  }
  
  // Save updated dayLogs
  localStorage.setItem('dayLogs', JSON.stringify(existingLogs)); // Persist chart data updates

  // Continue to next step or finish
  if (currentPageIndex < TOTAL_STEPS - 1) { // Check if more assessment pages remain
    setCurrentPageIndex(currentPageIndex + 1); // Advance to next health metric category
  } else {
    finishFlow(); // Complete assessment workflow
  }
};

/**  Helper function to add entry to dayLogs. Manages time-series data structure ensuring single entry per metric type per day
 * @param {DayLog[]} logs - Array of daily health metric logs
 * @param {string} dateStr - Date identifier for the log entry
 * @param {any} entry - Health metric data to store
 */
  const addEntryToDayLogs = (logs: DayLog[], dateStr: string, entry: any) => {
  const existingLogIndex = logs.findIndex(log => log.date === dateStr); // Check for existing daily log
  
  if (existingLogIndex >= 0) {
    // Remove existing entry of same type
    logs[existingLogIndex].entries = logs[existingLogIndex].entries.filter(e => e.type !== entry.type); // Prevent duplicate metric types per day
    logs[existingLogIndex].entries.push(entry); // Update with latest measurement
  } else {
    logs.push({ date: dateStr, entries: [entry] }); // Create new daily log entry
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
      title: "Hälsomått sparade",
      description: "Dina mätningar har sparats.",
    });
    navigate('/app/today');
  };

  return (
    <div className={pageContainer}>
      <div className={headerContainer}>
        {currentPageIndex === 0 && <BackToTodayButton />}
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
