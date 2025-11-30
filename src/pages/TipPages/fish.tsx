import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionHeading2,  sectionSubheading2, bodyText, tipCardColors, standardSpacing } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanFormDialog } from "@/components/UserPlanFormDialog";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import ExampleCard from "@/components/exCard";
import { AddPlanButton } from "@/components/AddPlanButton";
import { Fish } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCard } from "@/components/MedCard";

const FishPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const medicationInteractions = useMedicationInteractions(3); // tipId: 3 for Fish

  useEffect(() => {
    const savedPlans = localStorage.getItem('userPlans-fish');
    if (savedPlans) {
      setUserPlans(JSON.parse(savedPlans));
    }
  }, []);

  const handleSavePlan = (plan: UserPlan) => {
    let updatedPlans;
    
    if (editingIndex !== null) {
      updatedPlans = [...userPlans];
      updatedPlans[editingIndex] = plan;
    } else {
      updatedPlans = [...userPlans, plan];
    }
    
    setUserPlans(updatedPlans);
    setEditingIndex(null);
    localStorage.setItem('userPlans-fish', JSON.stringify(updatedPlans));
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    localStorage.setItem('userPlans-fish', JSON.stringify(updatedPlans));
  };

  const handleEditPlan = (index: number) => {
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleAddPlan = () => {
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsDialogOpen(false);
  };

  return (
    <div className={pageContainer}>
      <header className={`${headerContainer} ${tipCardColors.cyan}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>Fisk och skaldjur</h1>
          <Fish className="h-8 w-8" />
        </div>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        {/* Medication warnings */}
        {medicationInteractions.length > 0 && (
          <div className="space-y-3 mb-6">
            {medicationInteractions.map(({ medication, interaction }) => (
              <MedCard 
                key={`${medication.id}-${interaction.tipId}`}
                medication={medication}
                interaction={interaction}
              />
            ))}
          </div>
        )}

        <p className={sectionSubheading2}>
          Att äta fisk och skaldjur 3 gånger i veckan minskar risken för flera folksjukdomar. De innehåller många näringsämnen som det kan vara svårt att få tillräckligt av        
        </p>
        
        <div> 
          <p className={bodyText}>För att äta fisk och skaldjur kan du till exempel äta </p>
          <DottedList items={[
            "Smörgåspålägg. Till exempel: makrill i tomat, sill eller tonfisk på burk",
            "Soppor och grytor",
            "Hel, grillad fisk",
            "Burgare och panerad fisk",
            "Sallader",
            "Sushi"
          ]} />
        </div>

        <div>  
          <p className={bodyText}>Ät fet fisk minst en gång av dina tre </p>
          <DottedList items={[
            "Fet fisk: Lax, makrill, sill, sardiner",
            "Mager fisk: Torsk, kolja, rödspätta",
            "Skaldjur: Räkor, musslor, kräftor"
          ]} />
        </div>

        <div> 
          <h2 className={sectionHeading2}>Varför fisk och skaldjur?</h2>
          <p className={bodyText}>
            Fisk och skaldjur är rika på omega-3-fettsyror, protein och viktiga vitaminer som stödjer hjärthälsa och hjärnfunktion.
          </p>
          <DottedList items={[
            "Minskar risk för hjärtinfarkt och stroke",
            "Stödjer hjärnans utveckling och funktion",
            "Rik källa till D-vitamin och jod",
            "Innehåller högkvalitativt protein",
            "Anti-inflammatoriska egenskaper"
          ]} />
        </div>

         <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att tänka ut när och hur du ska äta fisk och skaldjur tre gånger per vecka, kan du lättare modifiera en plan som passar dej.
          </p>
        </div>
       
        <div className="mt-2 space-y-2">
                <ExampleCard 
                  goal="Fet fisk en gång (1 gång)"
                  when="Lunch - Tisdagar"
                  how="Laga nytt recept på lax"
                  reminder="Kalender"
                />

                <ExampleCard 
                  goal="Äta makrill en gång / v."
                  when="Frukost - Måndagar"
                  how="Makrill på burk på toast"
                  reminder="Kalender"
                />

                <ExampleCard 
                  goal="Skaldjur en gång / v."
                  when="Middag-fredagar"
                  how="Moule marinere, pommes frites, aioli"
                  reminder="-"
                />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="mb-4">
            <h2 className={sectionHeading2}>Mina planer</h2>
            <p className={bodyText}>
              Ändra din plan så många gånger du behöver tills den fungerar för dej            
            </p>
          </div>

          {userPlans.length > 0 ? (
            <>
              <UserPlanDisplay
                plans={userPlans}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlan}
              />
              <AddPlanButton
                onClick={handleAddPlan}
                canAddMorePlans={userPlans.length < 10}
              />
              <UserPlanFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                tipId={3}
                initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                onSave={handleSavePlan}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <UserPlanForm
              tipId={3}
              initialPlan={undefined}
              onSave={handleSavePlan}
              onCancel={handleCancelEdit}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default FishPage;
