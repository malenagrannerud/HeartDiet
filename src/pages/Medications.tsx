import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { sectionHeading, cardTitle, cardText, standardCard, headerContainer, primaryButton, pageContainer, pagePadding, bodyText } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, completedActivitiesSchema } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion"; 
import { standardSpacing } from "@/lib/design-tokens";

interface Medication {
  id: string;
  label: string;
  description: string;
  subOptions?: { id: string; label: string; description: string }[];
}

const medications: Medication[] = [
  {
    id: "warfarin",
    label: "Waran (Warfarin)",
    description: "Blodförtunnande medicin"
  },
  {
    id: "doac",
    label: "DOAC (blodförtunnande)",
    description: "Till exempel: Eliquis, Xarelto"
  },
  {
    id: "bloodPressureMeds",
    label: "Blodtrycksmedicin",
    description: "",
    subOptions: [
      {
        id: "ace",
        label: "ACE-hämmare",
        description: "Till exempel: Ramipril, Enalapril"
      },
      {
        id: "diuretics",
        label: "Diuretika",
        description: "Till exempel: Hydroklorotiazid"
      }
    ]
  },
  {
    id: "statins",
    label: "Kolesterolmedicin",
    description: "Till exempel: Atorvastatin, Simvastatin"
  },
  {
    id: "metformin",
    label: "Metformin",
    description: "Blodsockermedicin"
  }
];

const Medications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [saveAlertOpen, setSaveAlertOpen] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  useEffect(() => {
    const data = getStorageItem('healthPriorities', healthPrioritiesSchema);
    if (data) {
      setSelectedMedications(data.medications || []);
      setHasExistingData(data.medications && data.medications.length > 0);
    }
  }, []);

  const handleMedicationToggle = (id: string) => {
    setSelectedMedications(prev => 
      prev.includes(id) 
        ? prev.filter(m => m !== id)
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

  const confirmSave = () => {
    // Load existing data and update only medications
    const existingData = getStorageItem('healthPriorities', healthPrioritiesSchema) || { priorities: [], medications: [] };
    const data = {
      priorities: existingData.priorities || [],
      medications: selectedMedications
    };
    setStorageItem('healthPriorities', data, healthPrioritiesSchema);
    
    // Add to completed activities if not already there
    const completedActivities = getStorageItem('completedActivities', completedActivitiesSchema) || [];
    const activities = Array.isArray(completedActivities) ? completedActivities : [];
    const existingActivity = activities.find(a => a.id === 'medications');
    if (!existingActivity) {
      activities.push({
        id: 'medications',
        title: 'Läkemedel',
        completedDate: new Date().toISOString(),
        type: 'medications'
      });
      setStorageItem('completedActivities', activities, completedActivitiesSchema);
    }
    
    markCardCompleted('health-priorities');
    
    toast({
      title: "Läkemedel sparade",
      description: "Dina val har sparats.",
    });
    
    setSaveAlertOpen(false);
    navigate('/app/today');
  };

  return (
    <div className={pageContainer}>
      <div className={headerContainer}>
        <BackToTodayButton />
        <h1 className={sectionHeading}>Läkemedel</h1>
      </div>
      
      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          <section className={standardSpacing.sectionContent}>
            <p className={bodyText}>
              Markera läkemedel du tar regelbundet. Då kan vi påminna dej om livsmedel som du evenutellt bör undvika.
            </p>
            <div className={standardSpacing.cardList}>
              {medications.map((medication) => (
                <Card key={medication.id} className={standardCard}>
                  <label className="flex items-start gap-4 cursor-pointer">
                    <Checkbox
                      checked={selectedMedications.includes(medication.id)}
                      onCheckedChange={() => handleMedicationToggle(medication.id)}
                      className="mt-1 h-6 w-6 flex-shrink-0"
                      aria-label={medication.label}
                    />
                    <div className="flex-1">
                      <div className={`${cardTitle} text-lg mb-1`}>
                        {medication.label}
                      </div>
                      {medication.description && (
                        <p className={cardText}>
                          {medication.description}
                        </p>
                      )}
                    </div>
                  </label>
                  
                  {medication.subOptions && selectedMedications.includes(medication.id) && (
                    <div className="ml-10 mt-4 space-y-3">
                      {medication.subOptions.map((subOption) => (
                        <label key={subOption.id} className="flex items-start gap-3 cursor-pointer">
                          <Checkbox
                            checked={selectedMedications.includes(subOption.id)}
                            onCheckedChange={() => handleMedicationToggle(subOption.id)}
                            className="mt-1 h-5 w-5 flex-shrink-0"
                            aria-label={subOption.label}
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-base text-foreground">
                              {subOption.label}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {subOption.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>

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

      <AlertDialog open={saveAlertOpen} onOpenChange={setSaveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bekräfta ändringar</AlertDialogTitle>
            <AlertDialogDescription>
              Du har redan sparade läkemedel. Är du säker på att du vill ändra dina val?
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

export default Medications;