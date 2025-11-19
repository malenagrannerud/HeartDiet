// pages/TipPages/fruit.tsx
import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading2, bodyText, bodyTextBald } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";

const FruitPage = () => {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    const savedPlan = localStorage.getItem('userPlan-fruit');
    if (savedPlan) {
      setUserPlan(JSON.parse(savedPlan));
      setIsEditing(false);
    }
  }, []);

  const handleSavePlan = (plan: UserPlan) => {
    setUserPlan(plan);
    setIsEditing(false);
    localStorage.setItem('userPlan-fruit', JSON.stringify(plan));
  };

  const handleDeletePlan = () => {
    setUserPlan(null);
    setIsEditing(true);
    localStorage.removeItem('userPlan-fruit');
  };

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
        <BackToTodayButton />
      </header>

      <main className={pagePadding}>
        {/* Your custom content */}
        <p className={bodyText}>
          Att äta minst fem nävar frukter och grönsaker varje dag hjälper dig att må bättre samtidigt som det minskar risken för hjärt-kärlsjukdom. Välj olika sorter och färger! Längst ner får du ett verktyg för att skriva din egna plan för hur rådet blir din vana.
        </p>

        <h2 className={sectionHeading2}>Hur mycket är fem nävar om dagen?</h2>
        <p className={bodyText}>Till dina fem om dagen räknas:</p>
        <DottedList items={[
          "Rotfrukter",
          "Frukt",
          "Bär", 
          "Grönsaker i maten du lagar",
          "Frysta grönsaker"
        ]} />

        <h2 className={sectionHeading2}>Må bättre</h2>
        <p className={bodyText}>
          Du mår bättre med ett bättre humör och mindre trötthet eftersom frukt och grönt ger ett:
        </p>
        <DottedList items={[
          "Stärkt immunförsvar: Vitaminer & mineraler boostar energi och immunförsvar",
          "Bättre energi: Antioxidanter minskar inflammation i kroppen", 
          "Bättre blodsockerreglering: Det ger jämnare energi"
        ]} />

        <h2 className={sectionHeading2}>Skydd mot hjärtsjukdom</h2>
        <p className={bodyText}>
          Frukt och grönt minskar risken för hjärtsjukdom eftersom de innehåller ämnen som:
        </p>
        <DottedList items={[
          "Sänker blodtrycket: Kalium och nitrater vidgar blodkärlen",
          "Minskar inflammation: Antioxidanter skyddar kärlväggarna",
          "Sänker kolesterolet: Fibrer binder fett i tarmarna",
          "Förbättrar blodkärlens funktion: På grund av C-vitamin och flavonoider",
          "Håller vikten: På grund av låg energitäthet och mättande fibrer"
        ]} />

        <h2 className={sectionHeading2}>Ät dina fem om dagen</h2>
        <p className={bodyText}>
          Genom att tänka ut NÄR? och HUR? du ska få i dej dina fem om dagen, kan du lättare modifiera en plan som passar dej. Några exempel:
        </p>

        {/* Habits Examples */}
        <div className="mt-4 space-y-4">
          <div className="bg-secondary/20 border border-secondary/30 p-4 rounded-lg">
            <p className={bodyTextBald}>NÄR: Jag äter en frukt eller en näve bär i samband med frukost</p>
            <p className={bodyText}>HUR: Jag handlar veckans frukter på söndagar och har bär i frysen</p>
            <p className={bodyText}>PÅMINNELSE: Jag sätter en lapp på kylskåpet</p>
          </div>
          <div className="bg-secondary/20 border border-secondary/30 p-4 rounded-lg">
            <p className={bodyTextBald}>NÄR: Jag äter en skopa sallad till lunch och middag</p>
            <p className={bodyText}>HUR: Jag förbereder en råkostsallad med vinjägrett och har den redo i kylskåpet</p>
            <p className={bodyText}>PÅMINNELSE: Jag lägger in en påminnelse i kalendern</p>
          </div>
        </div>

        {/* User Plan Section */}
        <div className="mt-8 pt-6 border-t border-border">
          <h2 className={sectionHeading2}>Min plan</h2>
          <p className={bodyText}>
            Planen kan du ändra i så många gånger du behöver, tills den fungerar för dej
          </p>
          
          {isEditing ? (
            <UserPlanForm
              tipId={1} // Use the actual tip ID
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

export default FruitPage;