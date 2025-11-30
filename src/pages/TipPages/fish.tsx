import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionHeading2,  sectionSubheading2, bodyText, tipCardColors, standardSpacing } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanFormDialog } from "@/components/UserPlanFormDialog";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import ExampleCard from "@/components/exCard";
import { AddPlanButton } from "@/components/AddPlanButton";

const FishPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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
    setIsEditing(false);
    setEditingIndex(null);
    localStorage.setItem('userPlans-fish', JSON.stringify(updatedPlans));
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    localStorage.setItem('userPlans-fish', JSON.stringify(updatedPlans));
    
    if (updatedPlans.length === 0) {
      setIsEditing(true);
    }
  };

  const handleEditPlan = (index: number) => {
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleAddNewPlan = () => {
    setEditingIndex(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingIndex(null);
  };

  const canAddMorePlans = userPlans.length < 10;

  return (
    <div className={pageContainer}>
      <header className={`${headerContainer} ${tipCardColors.cyan}`}>
        <BackToTodayButton />
        <h1 className={sectionHeading}>Fisk och skaldjur</h1>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
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

          {userPlans.length > 0 && (
            <UserPlanDisplay
              plans={userPlans}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
            />
          )}

          <UserPlanFormDialog
            open={isEditing}
            onOpenChange={setIsEditing}
            tipId={3}
            initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
            onSave={handleSavePlan}
            onCancel={handleCancelEdit}
          />

          <AddPlanButton 
            onClick={handleAddNewPlan} 
            canAddMorePlans={canAddMorePlans} 
          />
        </div>
      </main>
    </div>
  );
};

export default FishPage;
