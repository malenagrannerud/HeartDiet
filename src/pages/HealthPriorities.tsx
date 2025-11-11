import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sectionHeading, sectionSubheading, cardTitle, cardText, standardCard, headerContainer, primaryButton, pageContainer, pagePadding, sectionHeading2, bodyText } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, completedActivitiesSchema } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion"; // Add this import

interface HealthPriority {
  id: string;
  label: string;
  description: string;
}

interface Medication {
  id: string;
  label: string;
  description: string;
  subOptions?: { id: string; label: string; description: string }[];
}

const healthPriorities: HealthPriority[] = [
  {
    id: "cholesterol",
    label: "Sänk mitt kolesterol",
    description: "Få tips om hälsosamma fetter och mat som sänker kolesterolet."
  },
  {
    id: "bloodPressure",
    label: "Sänk mitt blodtryck",
    description: "Få alternativ för att hålla koll på saltet."
  },
  {
    id: "diabetes",
    label: "Minska risken för diabetes typ 2",
    description: "Få råd om kolhydrater och socker vid typ 2-diabetes eller metabola syndromet."
  },
  {
    id: "weight",
    label: "Viktbalans",
    description: "Fokus på energibalans genom kost och motion."
  },
  {
    id: "general",
    label: "Inget av ovanstående",
    description: "Ge mig tips för att förebygga hjärt-kärlsjukdom och bli piggare"
  }
];

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

const HealthPriorities = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);

  useEffect(() => {
    const data = getStorageItem('healthPriorities', healthPrioritiesSchema);
    if (data) {
      setSelectedPriorities(data.priorities || []);
      setSelectedMedications(data.medications || []);
    }
  }, []);

  const handlePriorityToggle = (id: string) => {
    setSelectedPriorities(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleMedicationToggle = (id: string) => {
    setSelectedMedications(prev => 
      prev.includes(id) 
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  const handleSave = () => {
    // Save health priorities data
    const data = {
      priorities: selectedPriorities,
      medications: selectedMedications
    };
    setStorageItem('healthPriorities', data, healthPrioritiesSchema);
    localStorage.setItem('healthPrioritiesCompleted', 'true');
    
    // Add to completed activities
    const completedActivities = getStorageItem('completedActivities', completedActivitiesSchema) || [];
    const activities = Array.isArray(completedActivities) ? completedActivities : [];
    activities.push({
      id: 'health-priorities',
      title: 'Mina mål',
      completedDate: new Date().toISOString(),
      type: 'health-priorities'
    });
    setStorageItem('completedActivities', activities, completedActivitiesSchema);
    
    // MARK THE CARD AS COMPLETED - This is the key fix
    markCardCompleted('health-priorities');
    
    toast({
      title: "Inställningar sparade",
      description: "Dina val har sparats och appen anpassas efter dina mål.",
    });
    
    navigate('/app/today');
  };

  return (
    <div className={pageContainer}>
      <div className={headerContainer}>
        
          <BackToTodayButton />
        <h1 className={sectionHeading}>Mina mål</h1>
      <p className={sectionSubheading}>Bocka i dina hälsomål och läkemedel du tar regelbundet. Du kan när som helst ändra detta under "Mina sidor - Inställningar</p>
    </div>
      

      {/* STANDARDIZATION: space-y-6 for sections, space-y-4 for card lists */}
      <div className={`${pagePadding} space-y-6`}>
        <section>
          <h2 className={`${sectionHeading2} mb-4`}>Hälsomål</h2>
          <div className="space-y-4">
            {healthPriorities.map((priority) => (
              <Card key={priority.id} className={standardCard}>
                <label className="flex items-start gap-4 cursor-pointer">
                  <Checkbox
                    checked={selectedPriorities.includes(priority.id)}
                    onCheckedChange={() => handlePriorityToggle(priority.id)}
                    className="mt-1 h-6 w-6 flex-shrink-0"
                    aria-label={priority.label}
                  />
                  <div className="flex-1">
                    <div className={`${cardTitle} text-lg mb-1`}>
                      {priority.label}
                    </div>
                    {priority.description && (
                      <p className={bodyText}>
                        {priority.description}
                      </p>
                    )}
                  </div>
                </label>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className={`${sectionHeading} mb-2`}>Läkemedel</h2>
          <p className={`${cardText} mb-4`}>
            Markera läkemedel du tar regelbundet. Då kan vi påminna dej om livsmedel som du evenutellt bör undvika.
          </p>
          <div className="space-y-4">
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

        <Button
          onClick={handleSave}
          className={primaryButton}
          aria-label="Spara mina val"
        >
          Spara mina val
        </Button>
      </div>
    </div>
  );
};

export default HealthPriorities;