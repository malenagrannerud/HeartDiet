/**
 * HealthMetricsFlow - Main controller for health metrics assessment
 * 
 * UNIFIED STORAGE STRATEGY:
 * - dayLogs: All time-series measurements (weight, BP, fats, glucose)
 * - healthMetrics: User-defined goals (goalWeight, goalSystolic, etc.) + static data (height)
 * 
 * This eliminates the previous dual-storage (extendedHealthMetrics + dayLogs) confusion.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentMeasurements } from "./CurrentMeasurements";
import { BloodPressure } from "./BloodPressure";
import { BloodFats } from "./BloodFats";
import { BloodGlucose } from "./BloodGlucose";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { ButtonAbort } from "@/components/ButtonAbort";
import { useToast } from "@/hooks/use-toast";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { completedActivitiesSchema, DayLog } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion";
import { sectionHeading, headerContainer, pageContainer, pagePadding } from "@/lib/design-tokens";
import { getCurrentDate } from "@/lib/simulated-date";
import { format } from "date-fns";
import { 
  addHealthEntry, 
  saveHeight, 
  saveHealthGoal,
  getDayLogsData 
} from "@/lib/health-data";

const TOTAL_STEPS = 4; // Total nr of pages in assessment workflow

const HealthMetricsFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const pageTitles = ['Längd & vikt', 'Blodtryck', 'Blodfetter', 'Blodsocker'];
  const currentStep = currentPageIndex + 1;

  /**
   * Handles progression through health assessment flow
   * Saves data to unified storage (dayLogs for measurements, healthMetrics for goals)
   * 
   * @param pageData - Data collected from current assessment page
   */
  const handleNext = (pageData: any) => {
    const today = format(getCurrentDate(), 'yyyy-MM-dd');
    
    switch (currentPageIndex) {
      case 0: // Current measurements (height, weight, goalWeight)
        // Save height to healthMetrics (static data, not time-series)
        if (pageData.height) {
          saveHeight(pageData.height);
        }
        
        // Save goalWeight to healthMetrics (goal, not measurement)
        if (pageData.goalWeight) {
          saveHealthGoal('goalWeight', parseFloat(pageData.goalWeight));
        }
        
        // Save current weight to dayLogs (time-series measurement)
        if (pageData.weight) {
          const weight = parseFloat(pageData.weight);
          if (weight > 0) {
            addHealthEntry(today, { type: 'weight', value: weight });
          }
        }
        break;
        
      case 1: // Blood pressure
        if (pageData.systolic && pageData.diastolic) {
          // Normalize date format to yyyy-MM-dd for dayLogs consistency
          const bpDateRaw = pageData.date || today;
          const bpDate = bpDateRaw.includes('T') 
            ? format(new Date(bpDateRaw), 'yyyy-MM-dd') 
            : bpDateRaw;
          
          addHealthEntry(bpDate, { 
            type: 'bloodPressure', 
            value: parseInt(pageData.systolic), 
            value2: parseInt(pageData.diastolic)
          });
        }
        break;
        
      case 2: // Blood fats
        if (pageData.ldl) {
          // Normalize date format
          const fatsDateRaw = pageData.date || today;
          const fatsDate = fatsDateRaw.includes('T') 
            ? format(new Date(fatsDateRaw), 'yyyy-MM-dd') 
            : fatsDateRaw;
          
          addHealthEntry(fatsDate, { 
            type: 'bloodFats', 
            value: parseFloat(pageData.ldl),
            value2: pageData.hdl ? parseFloat(pageData.hdl) : undefined,
            value3: pageData.triglycerides ? parseFloat(pageData.triglycerides) : undefined
          });
        }
        break;
        
      case 3: // Blood glucose
        if (pageData.hba1c || pageData.fastingGlucose) {
          // Normalize date format
          const glucoseDateRaw = pageData.date || today;
          const glucoseDate = glucoseDateRaw.includes('T') 
            ? format(new Date(glucoseDateRaw), 'yyyy-MM-dd') 
            : glucoseDateRaw;
          
          addHealthEntry(glucoseDate, { 
            type: 'bloodGlucose', 
            // HbA1c as primary value, fastingGlucose as secondary
            value: pageData.hba1c ? parseFloat(pageData.hba1c) : (parseFloat(pageData.fastingGlucose) || 0),
            value2: pageData.fastingGlucose ? parseFloat(pageData.fastingGlucose) : undefined
          });
        }
        break;
    }

    // Continue to next step or finish
    if (currentPageIndex < TOTAL_STEPS - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      finishFlow();
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

  /**
   * Completes the health metrics flow
   * Marks the card as completed and navigates back to Today page
   */
  const finishFlow = () => {
    // Mark activity as completed
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

    // Mark the card as completed for Today page
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
