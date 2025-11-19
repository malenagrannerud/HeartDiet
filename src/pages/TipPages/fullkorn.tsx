// pages/TipPages/fullkorn.tsx
import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading2, bodyText } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";

const FullkornPage = () => {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    const savedPlan = localStorage.getItem('userPlan-fullkorn');
    if (savedPlan) {
      setUserPlan(JSON.parse(savedPlan));
      setIsEditing(false);
    }
  }, []);

  const handleSavePlan = (plan: UserPlan) => {
    setUserPlan(plan);
    setIsEditing(false);
    localStorage.setItem('userPlan-fullkorn', JSON.stringify(plan));
  };

  const handleDeletePlan = () => {
    setUserPlan(null);
    setIsEditing(true);
    localStorage.removeItem('userPlan-fullkorn');
  };

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
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
          <h2 className={sectionHeading2}>Min plan</h2>
          <p className={bodyText}>
            Planen kan du ändra i så många gånger du behöver, tills den fungerar för dej
          </p>
          
          {isEditing ? (
            <UserPlanForm
              tipId={2}
              initialPlan={userPlan || undefined}
              onSave={handleSavePlan}
              onCancel={() => userPlan && setIsEditing(false)}
            />
          ) : (
            <UserPlanDisplay
              plan={userPlan!}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDeletePlan}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default FullkornPage;
