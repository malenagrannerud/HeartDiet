// pages/TipPages/fruit.tsx
import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionSubheading, sectionHeading2, bodyText, bodyTextBald, tipCardColors, sectionSubheading2, standardSpacing } from "@/lib/design-tokens";
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
      <header className={`${headerContainer} ${tipCardColors.green}`}>
        <BackToTodayButton />
        <h1 className={sectionHeading}>Fem om dagen</h1>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        <p className={sectionSubheading2}>
          Att äta minst fem nävar frukter och grönsaker varje dag hjälper dig att må bättre och minska risken för hjärt-kärlsjukdom. Välj olika sorter och färger! 
        </p>

        <div> 
          <h2 className={sectionHeading2}>Hur mycket är fem nävar om dagen?</h2>
          <p className={bodyText}>Till dina fem om dagen räknas:</p>
          <DottedList items={[
            "Rotfrukter",
            "Frukt",
            "Bär", 
            "Grönsaker i maten du lagar",
            "Frysta grönsaker"
          ]} />
        </div>

        <div> 
          <h2 className={sectionHeading2}>Må bättre</h2>
          <p className={bodyText}>
            Du mår bättre med ett bättre humör och mindre trötthet eftersom frukt och grönt ger:
          </p>
          <DottedList items={[
            "Stärkt immunförsvar: Vitaminer & mineraler boostar energi och immunförsvar",
            "Energi: Antioxidanter minskar inflammation i kroppen", 
            "Blodsockerreglering: Det ger jämnare energi"
          ]} />
        </div>

        <div> 
          <h2 className={sectionHeading2}>Skydd mot hjärtsjukdom</h2>
          <p className={bodyText}>
            Frukt och grönt minskar risken för hjärtsjukdom eftersom de:
          </p>
          <DottedList items={[
            "Sänker blodtrycket: Kalium och nitrater vidgar blodkärlen",
            "Minskar inflammation: Antioxidanter skyddar kärlväggarna",
            "Sänker kolesterolet: Fibrer binder fett i tarmarna",
            "Förbättrar blodkärlens funktion: På grund av C-vitamin och flavonoider",
            "Håller vikten: På grund av låg energitäthet och mättande fibrer"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Ät dina fem om dagen</h2>
          <p className={bodyText}>
            Genom att tänka ut när och hur du ska få i dej dina fem om dagen, kan du lättare modifiera en plan som passar dej. Några exempel:
          </p>
        </div>


        <div className="mt-4 space-y-4">
          <div className="bg-secondary/20 border border-secondary/30 p-4 rounded-lg">
            <p className={bodyText}> Mål: Äta två nävar bär (2/5) </p>
            <p className={bodyText}> När: Frukost </p>
            <p className={bodyText}> Hur: Dricker en smoothie till min smörgås. Jag har frysta blåbär och hallon hemma. Handlar detta på söndagar</p>
            <p className={bodyText}> Påminnelse: Jag sätter en påminnelse att handla frukt i min telefon </p>
          </div>

          <div className="bg-secondary/20 border border-secondary/30 p-4 rounded-lg">
            <p className={bodyText}> Mål: Äta en näve sallad (3/5) </p>
            <p className={bodyText}> När: Lunch </p>
            <p className={bodyText}> Hur: Jag förbereder en råkostsallad med vinjägrett och har den redo i kylskåpet</p>
            <p className={bodyText}> Påminnelse: Jag sätter en påminnelse att handla rotfrukter i min telefon </p>
          </div>

          <div className="bg-secondary/20 border border-secondary/30 p-4 rounded-lg">
            <p className={bodyText}> Mål: Äta en frukt (4/5) </p>
            <p className={bodyText}> När: Mellanmål, kl 15.00 </p>
            <p className={bodyText}> Hur: Jag har ett äpple i väskan</p>
            <p className={bodyText}> Påminnelse: Larm i min telefon </p>
          </div>

          <div className="bg-secondary/20 border border-secondary/30 p-4 rounded-lg">
            <p className={bodyText}> Mål: Äta en näve sallad (5/5) </p>
            <p className={bodyText}> När: Middag </p>
            <p className={bodyText}> Hur: Jag förbereder en råkostsallad med vinjägrett och har den redo i kylskåpet</p>
            <p className={bodyText}> Påminnelse: Jag sätter en påminnelse att handla rotfrukter i min telefon </p>
          </div>
        </div>

        <div>
          <div className="mt-8 pt-6 border-t border-border">
            <h2 className={sectionHeading2}>Min plan</h2>
            <p className={bodyText}>
              Ändra planen så många gånger du behöver, tills den fungerar för dej
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
        </div>
      </main>
    </div>
  );
};

export default FruitPage;