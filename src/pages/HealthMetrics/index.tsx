import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHealthMetricsFlow } from "@/hooks/use-health-metrics-flow";
import { CurrentMeasurements } from "./CurrentMeasurements";
import { BloodPressure } from "./BloodPressure";
import { BloodFats } from "./BloodFats";
import { BloodGlucose } from "./BloodGlucose";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { useToast } from "@/hooks/use-toast";
import { ExtendedHealthMetrics } from "@/lib/schemas";
import { sectionHeading, headerContainer, pageContainer, pagePadding } from "@/lib/design-tokens";
import { useSaveHealthMetric, useGetHealthMetrics } from '@/hooks/useHealthMetrics';

const HealthMetricsFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pages, totalSteps } = useHealthMetricsFlow();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // NEW: Replace getStorageItem with useQuery
  const { data: metricsData } = useGetHealthMetrics();
  // NEW: Replace setStorageItem with useMutation
  const saveMetric = useSaveHealthMetric();
  
  // Get current page from pages array
  const currentPage = pages[currentPageIndex];
  const currentStep = currentPageIndex + 1;

  const saveData = async (data: Partial<ExtendedHealthMetrics>) => {
    // NEW: Replace setStorageItem with mutation.mutateAsync
    await saveMetric.mutateAsync({
      height: parseFloat(data.height || '0'),
      weight: parseFloat(data.weight || '0'),
      systolic: data.bloodPressure ? parseInt(data.bloodPressure.systolic) : null,
      diastolic: data.bloodPressure ? parseInt(data.bloodPressure.diastolic) : null,
      bp_date: data.bloodPressure?.date || null,
      ldl: data.bloodFats?.ldl ? parseFloat(data.bloodFats.ldl) : null,
      hdl: data.bloodFats?.hdl ? parseFloat(data.bloodFats.hdl) : null,
      triglycerides: data.bloodFats?.triglycerides ? parseFloat(data.bloodFats.triglycerides) : null,
      knows_ldl: data.bloodFats?.knowsLDL || null,
      hba1c: data.bloodGlucose?.hba1c ? parseFloat(data.bloodGlucose.hba1c) : null,
      fasting_glucose: data.bloodGlucose?.fastingGlucose ? parseFloat(data.bloodGlucose.fastingGlucose) : null,
    });
  };

  const handleNext = async (pageData: any) => {
    // Save the data based on the current page
    switch (currentPage.id) {
      case 'current-measurements':
        await saveData({ height: pageData.height, weight: pageData.weight });
        break;
      case 'blood-pressure':
        await saveData({ 
          bloodPressure: {
            systolic: pageData.systolic,
            diastolic: pageData.diastolic,
            date: pageData.date,
          }
        });
        break;
      case 'blood-fats':
        await saveData({ bloodFats: pageData });
        break;
      case 'blood-glucose':
        await saveData({ bloodGlucose: pageData });
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
    // Move to next page without saving
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      finishFlow();
    }
  };

  const finishFlow = () => {
    toast({
      title: "Hälsomått sparade",
      description: "Dina mätningar har sparats i databasen.",
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
