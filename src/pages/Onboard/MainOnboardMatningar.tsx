/**
 * 
 * @module MainOnboardMatningar
 * 
 * @requires react - useState, useEffect for state management
 * @requires react-router-dom - Navigation
 * @requires ./OnboardHeight - Height input page
 * @requires ./OnboardWeight - Weight input page
 * @requires ./OnboardBloodPressure - Blood pressure input page
 * @requires ./OnboardBloodFats - Blood fats input page
 * @requires ./OnboardBloodGlucose - Blood glucose input page
 * @requires @/components/BackToTodayButton - Navigation back to today
 * @requires @/components/ButtonAbort - Cancel/abort button
 * @requires @/hooks/use-toast - Toast notifications
 * @requires @/lib/storage - Local storage utilities
 * @requires @/lib/schemas - Type validation schemas
 * @requires @/lib/card-completion - Card completion tracking
 * @requires @/lib/design-tokens - Design system classes
 * @requires @/lib/simulated-date - Date utilities
 * @requires date-fns - Date formatting
 * @requires @/lib/health-validators - Health data validation
 * 
 * @description
 * Multi-step wizard for collecting initial health metrics from users.
 * 5-step flow: Height → Weight → Blood Pressure → Blood Fats → Blood Glucose.
 * Saves data to localStorage and marks health metrics card as completed when finished.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeightPage } from "./OnboardHeight";
import { WeightPage } from "./OnboardWeight";
import { BloodPressure } from "./OnboardBloodPressure";
import { BloodFats } from "./OnboardBloodFats";
import { BloodGlucose } from "./OnboardBloodGlucose";
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

/** Total number of steps in the onboarding flow */
const TOTAL_STEPS = 5;

/** Page titles for header display */
const pageTitles = ['Längd', 'Vikt', 'Blodtryck', 'Blodfetter', 'Blodsocker'];

/**
 * Normalizes various date formats to YYYY-MM-DD string
 * 
 * @param {string | Date} dateInput - Input date (string, ISO string, or Date object)
 * @param {string} fallback - Fallback date string if input is invalid
 * @returns {string} Normalized date in YYYY-MM-DD format
 */
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

/**
 * Adds or updates an entry in day logs
 * 
 * @param {DayLog[]} logs - Existing day logs array
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {any} entry - Entry to add
 */
const addEntryToDayLogs = (logs: DayLog[], dateStr: string, entry: any) => {
  const existingLogIndex = logs.findIndex(log => log.date === dateStr);
  
  if (existingLogIndex >= 0) {
    logs[existingLogIndex].entries = logs[existingLogIndex].entries.filter(e => e.type !== entry.type);
    logs[existingLogIndex].entries.push({
      ...entry,
      timestamp: new Date().toISOString()
    });
  } else {
    logs.push({ 
      date: dateStr, 
      entries: [{
        ...entry,
        timestamp: new Date().toISOString()
      }] 
    });
  }
};

/**
 * Health Metrics Onboarding Flow Component
 * 
 * @component
 * @returns {JSX.Element} Multi-step wizard for health metrics
 */
const HealthMetricsFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [metricsData, setMetricsData] = useState<Partial<HealthMetrics>>({});

  /**
   * Load existing health metrics from storage on mount
   */
  useEffect(() => {
    const existing = getStorageItem('healthMetrics', healthMetricsSchema);
    if (existing) {
      setMetricsData(existing);
    }
  }, []);

  const currentStep = currentPageIndex + 1;

  /**
   * Saves health metrics data to state and localStorage
   * 
   * @param {Partial<HealthMetrics>} data - New data to merge with existing
   */
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

  /**
   * Main handler for next button clicks from all pages
   * Routes data to appropriate page handler based on current index
   * 
   * @param {any} pageData - Data from current page
   */
  const handleNext = (pageData: any) => {
    const today = format(getCurrentDate(), 'yyyy-MM-dd');
    const existingLogs = JSON.parse(localStorage.getItem('dayLogs') || '[]');
    
    switch (currentPageIndex) {
      case 0: // Height only
        saveData({ height: pageData.height });
        break;
        
      case 1: // Weight and goal weight
        saveData({ 
          weight: pageData.weight, 
          goalWeight: pageData.goalWeight 
        });
        
        if (pageData.weight) {
          const weight = safeParseFloat(pageData.weight);
          if (weight !== undefined && 
              weight >= HEALTH_RANGES.weight.min && 
              weight <= HEALTH_RANGES.weight.max) {
            addEntryToDayLogs(existingLogs, today, { 
              type: 'weight', 
              value: weight 
            });
          }
        }
        break;
        
      case 2: // Blood pressure
        const bpDate = normalizeDate(pageData.date, today);
        
        saveData({ 
          systolic: pageData.systolic,
          diastolic: pageData.diastolic,
          bloodPressureDate: bpDate,
        });
        
        if (pageData.systolic && pageData.diastolic) {
          const systolic = safeParseInt(pageData.systolic);
          const diastolic = safeParseInt(pageData.diastolic);
          if (systolic !== undefined && diastolic !== undefined &&
              systolic >= HEALTH_RANGES.systolic.min && systolic <= HEALTH_RANGES.systolic.max &&
              diastolic >= HEALTH_RANGES.diastolic.min && diastolic <= HEALTH_RANGES.diastolic.max) {
            addEntryToDayLogs(existingLogs, bpDate, { 
              type: 'bloodPressure', 
              value: systolic, 
              value2: diastolic
            });
          }
        }
        break;
        
      case 3: // Blood fats
        const bloodFatsDate = normalizeDate(pageData.date, today);
        
        saveData({ 
          ldl: pageData.ldl,
          hdl: pageData.hdl,
          triglycerides: pageData.triglycerides,
          bloodFatsDate,
        });
        
        if (pageData.ldl) {
          const ldl = safeParseFloat(pageData.ldl);
          if (ldl !== undefined && ldl >= HEALTH_RANGES.ldl.min && ldl <= HEALTH_RANGES.ldl.max) {
            const hdl = safeParseFloat(pageData.hdl);
            const triglycerides = safeParseFloat(pageData.triglycerides);
            addEntryToDayLogs(existingLogs, bloodFatsDate, { 
              type: 'bloodFats', 
              value: ldl,
              value2: (hdl !== undefined && hdl >= HEALTH_RANGES.hdl.min && hdl <= HEALTH_RANGES.hdl.max) ? hdl : undefined,
              value3: (triglycerides !== undefined && triglycerides >= HEALTH_RANGES.triglycerides.min && triglycerides <= HEALTH_RANGES.triglycerides.max) ? triglycerides : undefined
            });
          }
        }
        break;
        
      case 4: // Blood glucose
        const bloodGlucoseDate = normalizeDate(pageData.date, today);
        
        saveData({ 
          hba1c: pageData.hba1c,
          fastingGlucose: pageData.fastingGlucose,
          bloodGlucoseDate,
        });
        
        if (pageData.hba1c || pageData.fastingGlucose) {
          const hba1c = safeParseFloat(pageData.hba1c);
          const fastingGlucose = safeParseFloat(pageData.fastingGlucose);
          
          const validHba1c = hba1c !== undefined && hba1c >= HEALTH_RANGES.hba1c.min && hba1c <= HEALTH_RANGES.hba1c.max;
          const validFasting = fastingGlucose !== undefined && fastingGlucose >= HEALTH_RANGES.fastingGlucose.min && fastingGlucose <= HEALTH_RANGES.fastingGlucose.max;
          
          if (validHba1c || validFasting) {
            addEntryToDayLogs(existingLogs, bloodGlucoseDate, { 
              type: 'bloodGlucose', 
              value: validHba1c ? hba1c : (validFasting ? fastingGlucose : 0),
              value2: validFasting ? fastingGlucose : undefined
            });
          }
        }
        break;
    }
    
    localStorage.setItem('dayLogs', JSON.stringify(existingLogs));

    // Navigate to next page or finish
    if (currentPageIndex < TOTAL_STEPS - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      finishFlow();
    }
  };

  /**
   * Handle skip button click
   * Moves to next page or finishes flow
   */
  const handleSkip = () => {
    if (currentPageIndex < TOTAL_STEPS - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      finishFlow();
    }
  };

  /**
   * Handle back button click
   * Moves to previous page
   */
  const handleBack = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  /**
   * Completes the onboarding flow
   * Marks health metrics card as completed and redirects to today view
   */
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
      {/* Header with page title and navigation */}
      <div className={headerContainer}>
        {currentPageIndex === 0 ? (
          <BackToTodayButton />
        ) : (
          <ButtonAbort className="absolute right-4 top-4" />
        )}
        <h1 className={sectionHeading}>{pageTitles[currentPageIndex]}</h1>
      </div>

      {/* Main content - render current page */}
      <main className={pagePadding}>
        {currentPageIndex === 0 && (
          <HeightPage
            onNext={handleNext}
            onSkip={handleSkip}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        )}
        {currentPageIndex === 1 && (
          <WeightPage
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        )}
        {currentPageIndex === 2 && (
          <BloodPressure
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        )}
        {currentPageIndex === 3 && (
          <BloodFats
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        )}
        {currentPageIndex === 4 && (
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