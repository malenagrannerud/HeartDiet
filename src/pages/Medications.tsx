import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { sectionHeading, cardTitle, cardText, standardCard, headerContainer, primaryButton, pageContainer, pagePadding, bodyText, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, completedActivitiesSchema, selectedMedicationsSchema } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion";
import { medications, searchMedications } from "@/data/medications";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Pill, Search, X } from "lucide-react";

const Medications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedications, setSelectedMedications] = useState<Array<{ id: string; name: string; addedDate: string }>>([]);
  const [saveAlertOpen, setSaveAlertOpen] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  useEffect(() => {
    const savedMeds = getStorageItem('selectedMedications', selectedMedicationsSchema);
    if (savedMeds && savedMeds.length > 0) {
      // Filter out any invalid entries
      const validMeds = savedMeds.filter(m => m.id && m.name && m.addedDate);
      setSelectedMedications(validMeds as Array<{ id: string; name: string; addedDate: string }>);
      setHasExistingData(true);
    }
  }, []);

  const handleMedicationSelect = (medId: string) => {
    // Check if already selected
    if (selectedMedications.some(m => m.id === medId)) {
      toast({
        title: "Redan tillagt",
        description: "Detta läkemedel finns redan i din lista.",
        variant: "destructive"
      });
      return;
    }

    const medication = medications.find(m => m.id === medId);
    if (!medication) return;

    const newMed = {
      id: medication.id,
      name: medication.name,
      addedDate: new Date().toISOString()
    };

    setSelectedMedications(prev => [...prev, newMed]);
    setSearchQuery(""); // Clear search after selection
  };

  const handleRemoveMedication = (medId: string) => {
    setSelectedMedications(prev => prev.filter(m => m.id !== medId));
  };

  const handleSaveClick = () => {
    if (hasExistingData && selectedMedications.length > 0) {
      setSaveAlertOpen(true);
    } else {
      confirmSave();
    }
  };

  const confirmSave = () => {
    // Save selected medications
    setStorageItem('selectedMedications', selectedMedications, selectedMedicationsSchema);
    
    // Also update healthPriorities for backward compatibility
    const existingData = getStorageItem('healthPriorities', healthPrioritiesSchema) || { priorities: [], medications: [] };
    const medicationIds = selectedMedications.map(m => m.id);
    const data = {
      priorities: existingData.priorities || [],
      medications: medicationIds
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
    
    markCardCompleted('medications');
    
    toast({
      title: "Läkemedel sparade",
      description: "Dina val har sparats.",
    });
    
    setSaveAlertOpen(false);
    navigate('/app/today');
  };

  // Filter medications based on search query
  const filteredMedications = searchQuery.length > 0 
    ? searchMedications(searchQuery)
    : medications;

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
              Sök och välj läkemedel du tar regelbundet. Vi visar dig vilka livsmedel du eventuellt bör undvika eller vara försiktig med.
            </p>

            {/* Search box */}
            <Card className={`${standardCard} p-4`}>
              <Command className="border-0 shadow-none">
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput 
                    placeholder="Sök läkemedel..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    className="border-0 focus:ring-0"
                  />
                </div>
                {searchQuery.length > 0 && (
                  <CommandList className="max-h-[300px]">
                    <CommandEmpty>Inget läkemedel hittades.</CommandEmpty>
                    <CommandGroup>
                      {filteredMedications.map((med) => (
                        <CommandItem
                          key={med.id}
                          value={med.id}
                          onSelect={() => handleMedicationSelect(med.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold">{med.name}</span>
                            <span className="text-sm text-muted-foreground">{med.category}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                )}
              </Command>
            </Card>

            {/* Selected medications list */}
            {selectedMedications.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    Mina läkemedel ({selectedMedications.length})
                  </h2>
                </div>
                
                <div className="space-y-2">
                  {selectedMedications.map((med) => {
                    const fullMed = medications.find(m => m.id === med.id);
                    return (
                      <Card key={med.id} className={`${standardCard} p-4`}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <Pill className="h-5 w-5 text-primary flex-shrink-0" />
                            <div className="flex-1">
                              <div className={cardTitle}>
                                {med.name}
                              </div>
                              {fullMed && (
                                <p className={cardText}>
                                  {fullMed.category}
                                  {fullMed.foodInteractions.length > 0 && 
                                    ` • ${fullMed.foodInteractions.length} livsmedelsinteraktion${fullMed.foodInteractions.length > 1 ? 'er' : ''}`
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMedication(med.id)}
                            className="flex-shrink-0"
                            aria-label={`Ta bort ${med.name}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
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
