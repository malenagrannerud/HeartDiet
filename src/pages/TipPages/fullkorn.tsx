// pages/TipPages/fullkorn.tsx
import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading2, bodyText, tipCardColors } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const FullkornPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const savedPlans = localStorage.getItem('userPlans-fullkorn');
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
    localStorage.setItem('userPlans-fullkorn', JSON.stringify(updatedPlans));
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    localStorage.setItem('userPlans-fullkorn', JSON.stringify(updatedPlans));
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
      <header className={`${headerContainer} ${tipCardColors.amber}`}>
        <BackToTodayButton />
        <h1 className="text-3xl font-bold text-foreground">Fyll på med fullkorn</h1>
      </header>

      <main className={pagePadding}>
        <h2 className={sectionHeading2}>Varför fullkorn?</h2>
        <p className={bodyText}>
          Fullkorn innehåller hela spannmålskornet med fibrer, vitaminer och mineraler som ger långvarig mättnadskänsla och jämn energi.
        </p>
        <DottedList items={[
          "Sänker risken för hjärt-kärlsjukdomar",
          "Förbättrar blodsockerbalansen",
          "Bidrar till en hälsosam tarmflora",
          "Ger långvarig mättnad"
        ]} />

        <h2 className={sectionHeading2}>Exempel på fullkornsprodukter</h2>
        <DottedList items={[
          "Fullkornsbröd och knäckebröd",
          "Havregryn och müsli",
          "Fullkornsris och bulgur",
          "Fullkornspasta",
          "Quinoa och råg"
        ]} />

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={sectionHeading2}>Mina planer</h2>
              <p className={bodyText}>
                Ändra planen eller delplaner så många gånger du behöver tills den fungerar för dej
              </p>
            </div>
            {!isEditing && canAddMorePlans && (
              <Button
                onClick={handleAddNewPlan}
                className="flex items-center gap-2"
                size="sm"
              >
                <Plus size={16} />
                Lägg till plan
              </Button>
            )}
          </div>

          {userPlans.length > 0 && !isEditing && (
            <UserPlanDisplay
              plans={userPlans}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
            />
          )}

          {isEditing && (
            <UserPlanForm
              tipId={2}
              initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
              onSave={handleSavePlan}
              onCancel={handleCancelEdit}
            />
          )}

          {userPlans.length === 0 && !isEditing && (
            <div className="text-center py-8">
              <p className={bodyText}>Du har inga sparade planer än</p>
              <Button
                onClick={handleAddNewPlan}
                className="mt-4 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                Skapa din första plan
              </Button>
            </div>
          )}

          {!canAddMorePlans && !isEditing && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Du har nått max antal planer (10)
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default FullkornPage;
