// pages/TipPages/fish.tsx
import { useState, useEffect } from "react";
import { UserPlan } from "../data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionHeading2, bodyText } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import { sectionHeading } from "../../lib/design-tokens";

const FishPage = () => {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    const savedPlan = localStorage.getItem('userPlan-fish');
    if (savedPlan) {
      setUserPlan(JSON.parse(savedPlan));
      setIsEditing(false);
    }
  }, []);

  const handleSavePlan = (plan: UserPlan) => {
    setUserPlan(plan);
    setIsEditing(false);
    localStorage.setItem('userPlan-fish', JSON.stringify(plan));
  };

  const handleDeletePlan = () => {
    setUserPlan(null);
    setIsEditing(true);
    localStorage.removeItem('userPlan-fish');
  };

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
        <BackToTodayButton />
        <h1 className={sectionHeading}>Fisk och skaldjur</h1>
      </header>

      <main className={pagePadding}>
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

        <h2 className={sectionHeading2}>Rekommendation</h2>
        <p className={bodyText}>
          Ät fisk 2-3 gånger per vecka, varav minst en gång fet fisk som lax, makrill eller sill.
        </p>
        <DottedList items={[
          "Fet fisk: Lax, makrill, sill, sardiner",
          "Mager fisk: Torsk, kolja, rödspätta",
          "Skaldjur: Räkor, musslor, kräftor"
        ]} />

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className={sectionHeading2}>Min plan</h2>
          <p className={bodyText}>
            Planen kan du ändra i så många gånger du behöver, tills den fungerar för dej
          </p>
          
          {isEditing ? (
            <UserPlanForm
              tipId={3}
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

export default FishPage;
