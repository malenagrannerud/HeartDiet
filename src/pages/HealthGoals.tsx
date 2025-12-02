import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { sectionHeading, cardTitle, standardCard, headerContainer, primaryButton, pageContainer, pagePadding, bodyText } from "@/lib/design-tokens";
import { healthPrioritiesSchema, completedActivitiesSchema } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion"; 
import { standardSpacing } from "@/lib/design-tokens";
import { useHealthGoals, useSaveHealthGoals } from '@/hooks/useHealthGoals';

interface HealthPriority {
  id: string;
  label: string;
}

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
    label: "Förebygg livsstilsrelaterade sjukdomar",
  }
];

const HealthGoals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [saveAlertOpen, setSaveAlertOpen] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  
  const { data: healthGoalsData, isLoading } = useHealthGoals();
  const saveHealthGoalsMutation = useSaveHealthGoals();

  useEffect(() => {
    if (healthGoalsData) {
      setSelectedPriorities(healthGoalsData.priorities || []);
      setHasExistingData(healthGoalsData.priorities && healthGoalsData.priorities.length > 0);
    }
  }, [healthGoalsData]);

  const handlePriorityToggle = (id: string) => {
    setSelectedPriorities(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleSaveClick = () => {
    if (hasExistingData) {
      setSaveAlertOpen(true);
    } else {
      confirmSave();
    }
  };

  const confirmSave = async () => {
    try {
      await saveHealthGoalsMutation.mutateAsync({
        priorities: selectedPriorities,
      });
      
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
      navigate('/app/today');
    } catch (error) {
      toast({
        title: "Fel vid sparande",
        description: "Kunde inte spara dina hälsomål. Försök igen.",
        variant: "destructive"
      });
    }
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

          <section className={standardSpacing.sectionContent}>
            <Button
              onClick={handleSaveClick}
              className={primaryButton}
              aria-label="Spara"
              disabled={isLoading || saveHealthGoalsMutation.isPending}
            >
              {isLoading || saveHealthGoalsMutation.isPending ? "Sparar..." : "Spara mina val"}
            </Button>
          </section>
        </div>
      </main>

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
