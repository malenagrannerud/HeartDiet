import { getStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, selectedMedicationsSchema } from "@/lib/schemas";
import { medications } from "@/data/medListAndFoodInteractions";

export interface HealthMetricsPage {
  id: string;
  path: string;
  title: string;
  show: boolean;
}

export const useHealthMetricsFlow = () => {
  // Load user's health goals and medications
  const healthData = getStorageItem('healthPriorities', healthPrioritiesSchema);
  const selectedMeds = getStorageItem('selectedMedications', selectedMedicationsSchema) || [];
  
  // Determine which pages are relevant
  const shouldShowBloodPressure = () => {
    // Check health goals
    const hasBloodPressureGoal = healthData?.priorities.includes('bloodPressure');
    const hasHeartHealthGoal = healthData?.priorities.includes('general2'); // Prevention
    
    // Check medications (ACE-hämmare, Kalciumflödeshämmare, Diuretika)
    const bloodPressureMedCategories = ['ACE-hämmare', 'Kalciumflödeshämmare', 'Diuretika'];
    const hasBPMedication = selectedMeds?.some(m => {
      const med = medications.find(med => med.id === m.id);
      return med && bloodPressureMedCategories.some(cat => med.category.includes(cat));
    });
    
    return hasBloodPressureGoal || hasHeartHealthGoal || hasBPMedication;
  };
  
  const shouldShowBloodFats = () => {
    const hasCholesterolGoal = healthData?.priorities.includes('cholesterol');
    const hasStatinMedication = selectedMeds?.some(m => {
      const med = medications.find(med => med.id === m.id);
      return med && med.category.includes('Statin');
    });
    return hasCholesterolGoal || hasStatinMedication;
  };
  
  const shouldShowBloodGlucose = () => {
    const hasDiabetesGoal = healthData?.priorities.includes('diabetes');
    const hasDiabetesMedication = selectedMeds?.some(m => {
      const med = medications.find(med => med.id === m.id);
      return med && med.category.includes('Diabetes');
    });
    return hasDiabetesGoal || hasDiabetesMedication;
  };
  
  // Build ordered list of pages
  const allPages: HealthMetricsPage[] = [
    { 
      id: 'current-measurements', 
      path: '/app/health-metrics/current-measurements',
      title: 'Basmätningar',
      show: true 
    },
    { 
      id: 'blood-pressure', 
      path: '/app/health-metrics/blood-pressure',
      title: 'Blodtryck',
      show: shouldShowBloodPressure() 
    },
    { 
      id: 'blood-fats', 
      path: '/app/health-metrics/blood-fats',
      title: 'Blodfetter',
      show: shouldShowBloodFats() 
    },
    { 
      id: 'blood-glucose', 
      path: '/app/health-metrics/blood-glucose',
      title: 'Blodsocker',
      show: shouldShowBloodGlucose() 
    },
  ];

  const pages = allPages.filter(p => p.show);
  
  return { pages, totalSteps: pages.length };
};
