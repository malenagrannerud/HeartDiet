import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
<<<<<<< HEAD
import { pageTitle, sectionHeading, cardTitle, cardText, standardCard, headerContainer, backButton, primaryButton, pageContainer, pagePadding, standardSpacing, bodyText, sectionSubheading } from "@/lib/design-tokens";
=======
import { heading, pageTitle, sectionHeading, cardTitle, cardText, standardCard, headerContainer, backButton, primaryButton, pageContainer, pagePadding, standardSpacing, bodyText } from "@/lib/design-tokens";
>>>>>>> bc4f4ca54a132e6cce8b4bb778d754f9a7e00821
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, completedActivitiesSchema } from "@/lib/schemas";

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
    description: "Få påminnelser och alternativ för att hålla koll på saltet."
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
    label: "Inget ovanstående",
    description: "Ge mig tips för att förebygga hjärt- och kärlsjukdom och bli piggare"
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
      title: 'Anpassa tips efter mina mål',
      completedDate: new Date().toISOString(),
      type: 'health-priorities'
    });
    setStorageItem('completedActivities', activities, completedActivitiesSchema);
    
    toast({
      title: "Inställningar sparade",
      description: "Dina val har sparats och appen anpassas efter dina mål.",
    });
    
    navigate('/app/today');
  };

  return (
    <div className={pageContainer}>
      {/* HEADER CONTAINER */}
      <header className={headerContainer}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate('/app/today')}
            className={backButton}
            aria-label="Tillbaka"
          >
            <ArrowLeft size={28} className="text-foreground" />
          </Button>
          <h1 className={sectionHeading}>Anpassa tips efter mina mål</h1>
        </div>
        <p className={sectionSubheading}>
          Bocka i dina mål och mediciner du tar. Då anpassas tips till dej. Du kan ändra detta när som helst under "Inställningar".
        </p>
      </header>

      {/* FIRST PAGE PADDING: Health Priorities Section */}
      <div className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          <section className={standardSpacing.sectionContent}>
            <h2 className={heading}>Hjälp mej att:</h2>
            <div className={standardSpacing.cardList}>
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
                      <div className={cardTitle}>
                        {priority.label}
                      </div>
                      {priority.description && (
                        <p className={cardText}>
                          {priority.description}
                        </p>
                      )}
                    </div>
                  </label>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* SECOND PAGE PADDING: Medications Section */}
      <div className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          <section className={standardSpacing.sectionContent}>
            <h2 className={sectionHeading}>Läkemedel</h2>
            <p className={cardText}>
              Markera de läkemedel du tar regelbundet.
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
                      <div className={cardTitle}>
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
                    <div className={standardSpacing.sectionContent}>
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
    </div>
  );
};

export default HealthPriorities;