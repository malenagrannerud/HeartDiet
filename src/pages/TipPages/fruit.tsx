// pages/TipPages/fruit.tsx
import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionHeading2, bodyText, bodyTextBald, tipCardColors, sectionSubheading2, standardSpacing} from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import ExampleCard from "@/components/exCard";

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
            "Frukt - färska och frysta",
            "Bär - färska och frysta", 
            "Grönsaker - färska, frysta och i maten du lagar",
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

        <div className="mt-2 space-y-2">
                <ExampleCard 
                  goal="Äta två nävar bär (2/5)"
                  when="Frukost"
                  how="Dricker en smoothie till min smörgås. Har frysta blåbär och hallon hemma. "
                  reminder="Lapp på kylskåpet"
                />
                
                <ExampleCard 
                  goal="Äta en näve sallad (3/5)"
                  when="Lunch"
                  how="Jag förbereder en råkostsallad med vinjägrett redo i kylskåpet"
                  reminder="Påminnelse att handla i min telefon"
                />
                
                <ExampleCard 
                  goal="Äta en frukt (4/5)"
                  when="Mellanmål, kl 15.00"
                  how="Jag har ett äpple i väskan"
                  reminder="Larm i min telefon"
                />

                <ExampleCard 
                  goal="Äta en näve sallad (5/5)"
                  when="Middag"
                  how="Jag förbereder en råkostsallad med vinjägrett redo i kylskåpet"
                  reminder="Påminnelse att handla rotfrukter i min telefon"
                  
                />
        </div>

        <div>
          <div className="mt-8 pt-6 border-t border-border">
            <h2 className={sectionHeading2}>Min plan</h2>
            <p className={bodyText}>
              Ändra planen eller delplaner så många gånger du behöver tills den fungerar för dej
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