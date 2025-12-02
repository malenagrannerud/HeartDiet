import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHealthMetricsFlow } from "@/hooks/use-health-metrics-flow";
import { CurrentMeasurements } from "./CurrentMeasurements";
import { BloodPressure } from "./BloodPressure";
import { BloodFats } from "./BloodFats";
import { BloodGlucose } from "./BloodGlucose";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { useToast } from "@/hooks/use-toast";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { extendedHealthMetricsSchema, completedActivitiesSchema, ExtendedHealthMetrics } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion";
import { sectionHeading, headerContainer, pageContainer, pagePadding } from "@/lib/design-tokens";

const HealthMetricsFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pages, totalSteps } = useHealthMetricsFlow();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [metricsData, setMetricsData] = useState<Partial<ExtendedHealthMetrics>>({});

  useEffect(() => {
    // Load existing data
    const existing = getStorageItem('extendedHealthMetrics', extendedHealthMetricsSchema);
    if (existing) {
      setMetricsData(existing);
    }
  }, []);

  const currentPage = pages[currentPageIndex];
  const currentStep = currentPageIndex + 1;

  const saveData = (data: Partial<ExtendedHealthMetrics>) => {
    const updated = {
      ...metricsData,
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    setMetricsData(updated);
    setStorageItem('extendedHealthMetrics', updated, extendedHealthMetricsSchema);
  };

  const handleNext = (pageData: any) => {
    // Save the data based on the current page
    switch (currentPage.id) {
      case 'current-measurements':
        saveData({ height: pageData.height, weight: pageData.weight });
        break;
      case 'blood-pressure':
        saveData({ 
          bloodPressure: {
            systolic: pageData.systolic,
            diastolic: pageData.diastolic,
            date: pageData.date,
          }
        });
        break;
      case 'blood-fats':
        saveData({ bloodFats: pageData });
        break;
      case 'blood-glucose':
        saveData({ bloodGlucose: pageData });
        break;
    }

    // Move to next page or finish
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      finishFlow();
    }
  };

  const handleSkip = () => {
    // Move to next page or finish without saving current page data
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      finishFlow();
    }
  };

  const finishFlow = () => {
    // Mark as completed
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
        <BackToTodayButton />
        <h1 className={sectionHeading}>{currentPage.title}</h1>
      </div>

      <main className={pagePadding}>
        {currentPage.id === 'current-measurements' && (
          <CurrentMeasurements
            onNext={handleNext}
            onSkip={handleSkip}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}
        {currentPage.id === 'blood-pressure' && (
          <BloodPressure
            onNext={handleNext}
            onSkip={handleSkip}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}
        {currentPage.id === 'blood-fats' && (
          <BloodFats
            onNext={handleNext}
            onSkip={handleSkip}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}
        {currentPage.id === 'blood-glucose' && (
          <BloodGlucose
            onNext={handleNext}
            onSkip={handleSkip}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}
      </main>
    </div>
  );
};

export default HealthMetricsFlow;
