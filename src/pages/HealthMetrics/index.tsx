import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentMeasurements } from "./CurrentMeasurements";
import { BloodPressure } from "./BloodPressure";
import { BloodFats } from "./BloodFats";
import { BloodGlucose } from "./BloodGlucose";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { useToast } from "@/hooks/use-toast";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { extendedHealthMetricsSchema, completedActivitiesSchema, ExtendedHealthMetrics, healthMetricsSchema } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion";
import { sectionHeading, headerContainer, pageContainer, pagePadding } from "@/lib/design-tokens";

const TOTAL_STEPS = 4;

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

  const pageTitles = ['Basmätningar', 'Blodtryck', 'Blodfetter', 'Blodsocker'];
  const currentStep = currentPageIndex + 1;

  const saveData = (data: Partial<ExtendedHealthMetrics>) => {
    const updated = {
      ...metricsData,
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    setMetricsData(updated);
    const success = setStorageItem('extendedHealthMetrics', updated, extendedHealthMetricsSchema);
    if (!success) {
      // Fallback: save without schema validation
      try {
        localStorage.setItem('extendedHealthMetrics', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save health metrics:', e);
      }
    }
  };

  const handleNext = (pageData: any) => {
    switch (currentPageIndex) {
      case 0: // Current measurements
        saveData({ height: pageData.height, weight: pageData.weight, goalWeight: pageData.goalWeight });
        // Also save goalWeight to healthMetrics for Progress page
        const existingHealthMetrics = getStorageItem('healthMetrics', healthMetricsSchema);
        if (existingHealthMetrics) {
          setStorageItem('healthMetrics', { ...existingHealthMetrics, goalWeight: pageData.goalWeight }, healthMetricsSchema);
        }
        break;
      case 1: // Blood pressure
        saveData({ 
          bloodPressure: {
            systolic: pageData.systolic,
            diastolic: pageData.diastolic,
            date: pageData.date,
          }
        });
        break;
      case 2: // Blood fats
        saveData({ bloodFats: pageData });
        break;
      case 3: // Blood glucose
        saveData({ bloodGlucose: pageData });
        break;
    }

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
