/**
 * 
 * @module MatningarHalsomal
 * 
 * @description
 * Page for users to select their health priorities/goals.
 * Features:
 * - List of predefined health goals with checkboxes
 * - Multi-select functionality (users can choose multiple goals)
 * - Persistent storage of selected priorities
 * - Confirmation dialog when overwriting existing data
 * - Integration with completed activities tracking
 * - Navigation back to previous page after save
 * 
 * Goals are saved to localStorage with schema validation.
 * Compatible with both onboarding flow and standalone access.
 * 
 * @requires react - useState, useEffect for state management
 * @requires react-router-dom - Navigation and URL parameters
 * @requires @/components/BackToTodayButton - Navigation back to today
 * @requires @/components/ui/card - Card container
 * @requires @/components/ui/checkbox - Checkbox input
 * @requires @/components/ui/button - Button component
 * @requires @/hooks/use-toast - Toast notifications
 * @requires @/components/ui/alert-dialog - Confirmation dialog
 * @requires @/lib/design-tokens - Design system classes
 * @requires @/lib/storage - Local storage utilities
 * @requires @/lib/schemas - Type validation schemas
 * @requires @/lib/card-completion - Card completion tracking
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { sectionHeading, cardTitle, standardCard, headerContainer, primaryButton, pageContainer, pagePadding, bodyText } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, completedActivitiesSchema } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion"; 
import { standardSpacing } from "@/lib/design-tokens";

/**
 * Health priority item structure
 * 
 * @interface HealthPriority
 * @property {string} id - Unique identifier for the priority
 * @property {string} label - Display label for the priority
 */
interface HealthPriority {
  id: string;
  label: string;
}

/**
 * Available health priorities with display labels
 */
const healthPriorities: HealthPriority[] = [
  {
    id: "cholesterol",
    label: "Hantera mitt kolesterol",
  },
  {
    id: "bloodPressure",
    label: "Hantera mitt blodtryck",
  },
  {
    id: "diabetes",
    label: "Minska risken för diabetes typ 2",
  },
  {
    id: "weight",
    label: "Gå ner i vikt",
  },
  {
    id: "general",
    label: "Bli piggare",
  },
  {
    id: "general2",
    label: "Förebygg hjärt-kärl sjukdomar",
  }
];

/**
 * Health goals selection page component
 * 
 * @component
 * @returns {JSX.Element} Health goals selection page
 * 
 * @example
 * <HealthGoals />
 */
const HealthGoals = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/app/today';
  const { toast } = useToast();
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [saveAlertOpen, setSaveAlertOpen] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  /**
   * Load existing health priorities from localStorage on mount
   */
  useEffect(() => {
    const data = getStorageItem('healthPriorities', healthPrioritiesSchema);
    if (data) {
      setSelectedPriorities(data.priorities || []);
      setHasExistingData(data.priorities && data.priorities.length > 0);
    }
  }, []);

  /**
   * Toggle selection of a health priority
   * 
   * @param {string} id - Priority ID to toggle
   */
  const handlePriorityToggle = (id: string) => {
    setSelectedPriorities(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  /**
   * Handle save button click
   * Shows confirmation dialog if existing data exists
   */
  const handleSaveClick = () => {
    if (hasExistingData) {
      setSaveAlertOpen(true);
    } else {
      confirmSave();
    }
  };

  /**
   * Confirm and save health priorities
   * Saves to localStorage, updates completed activities, and navigates back
   */
  const confirmSave = () => {
    const existingData = getStorageItem('healthPriorities', healthPrioritiesSchema) || { priorities: [], medications: [] };
    const data = {
      priorities: selectedPriorities,
      medications: existingData.medications || []
    };
    setStorageItem('healthPriorities', data, healthPrioritiesSchema);
    localStorage.setItem('healthPrioritiesCompleted', 'true');
    
    // Add to completed activities
    const completedActivities = getStorageItem('completedActivities', completedActivitiesSchema) || [];
    const activities = Array.isArray(completedActivities) ? completedActivities : [];
    const existingActivity = activities.find(a => a.id === 'health-goals');
    if (!existingActivity) {
      activities.push({
        id: 'health-goals',
        title: 'Hälsomål',
        completedDate: new Date().toISOString(),
        type: 'health-goals'
      });
      setStorageItem('completedActivities', activities, completedActivitiesSchema);
    }
    
    markCardCompleted('health-goals');
    
    toast({
      title: "Hälsomål sparade",
      description: "Dina val har sparats.",
    });
    
    setSaveAlertOpen(false);
    navigate(returnTo);
  };

  return (
    <div className={pageContainer}>
      <div className={headerContainer}>
        <BackToTodayButton />
        <h1 className={sectionHeading}>Mina hälsomål</h1>
      </div>
      
      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          <section className={standardSpacing.sectionContent}>
            <p className={bodyText}>Välj de hälsomål som är viktigast för dej</p>
            <div className={standardSpacing.cardList}>
              {healthPriorities.map((priority) => (
                <Card key={priority.id} className={standardCard}>
                  <label className="flex items-start gap-4 cursor-pointer">
                    <div className="flex-1">
                      <div className={`${cardTitle} text-lg mb-1`}>
                        {priority.label}
                      </div>
                    </div>
                    <Checkbox
                      checked={selectedPriorities.includes(priority.id)}
                      onCheckedChange={() => handlePriorityToggle(priority.id)}
                      className="mt-1 h-6 w-6 flex-shrink-0"
                      aria-label={priority.label}
                    />
                  </label>
                </Card>
              ))}
            </div>
          </section>

          {/* Save button */}
          <section className={standardSpacing.sectionContent}>
            <Button
              onClick={handleSaveClick}
              className={primaryButton}
              aria-label="Spara"
            >
              Spara mina val
            </Button>
          </section>
        </div>
      </main>

      {/* Confirmation dialog for overwriting existing data */}
      <AlertDialog open={saveAlertOpen} onOpenChange={setSaveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bekräfta ändringar</AlertDialogTitle>
            <AlertDialogDescription>
              Du har redan sparade hälsomål. Är du säker på att du vill ändra dina val?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>
              Spara ändringar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HealthGoals;