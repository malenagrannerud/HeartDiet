// pages/TipPages/fish.tsx
import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionHeading2, bodyText, tipCardColors, standardSpacing } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";

const FishPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [isEditing, setIsEditing] = useState(true);
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
          Att äta fisk och skaldjur 2-3 gånger i veckan minskar risken för flera folksjukdomar. De innehåller många näringsämnen som det kan vara svårt att få tillräckligt av        
        </p>

        <div>  
          <p className={bodyText}>
            Ät fisk 2-3 gånger per vecka, varav minst en gång fet fisk som lax, makrill eller sill.
          </p>
          <DottedList items={[
            "Fet fisk: Lax, makrill, sill, sardiner",
            "Mager fisk: Torsk, kolja, rödspätta",
            "Skaldjur: Räkor, musslor, kräftor"
          ]} />
        </div>

        <div> 
          <h2 className={sectionHeading2}>Varför fisk och skaldjur 2-3 gånger?</h2>
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

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="mb-4">
            <h2 className={sectionHeading2}>Mina planer</h2>
            <p className={bodyText}>
              Ändra planen eller delplaner så många gånger du behöver tills den fungerar för dej
            </p>
          </div>

          {userPlans.length > 0 && (
            <UserPlanDisplay
              plans={userPlans}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
            />
          )}

          {isEditing && (
            <UserPlanForm
              tipId={3}
              initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
              onSave={handleSavePlan}
              onCancel={handleCancelEdit}
            />
          )}

          {canAddMorePlans && (
            <Button
              onClick={handleAddNewPlan}
              className="flex items-center gap-2 mt-6"
              variant={userPlans.length === 0 ? "default" : "outline"}
            >
              <Plus size={16} />
              Lägg till plan
            </Button>
          )}

          {!canAddMorePlans && (
            <p className="text-sm text-muted-foreground mt-4">
              Du har nått max antal planer (10)
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default FishPage;
