// pages/TipPages/fruit.tsx
import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionHeading2, bodyText, bodyTextBald, tipCardColors, sectionSubheading2, standardSpacing} from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import ExampleCard from "@/components/exCard";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";

const FruitPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const savedPlans = localStorage.getItem('userPlans-fruit');
    if (savedPlans) {
      setUserPlans(JSON.parse(savedPlans));
    }
  }, []);

  const handleSavePlan = (plan: UserPlan) => {
    let updatedPlans;
    
    if (editingIndex !== null) {
      // Editing existing plan
      updatedPlans = [...userPlans];
      updatedPlans[editingIndex] = plan;
    } else {
      // Adding new plan
      updatedPlans = [...userPlans, plan];
    }
    
    setUserPlans(updatedPlans);
    setIsEditing(false);
    setEditingIndex(null);
    localStorage.setItem('userPlans-fruit', JSON.stringify(updatedPlans));
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    localStorage.setItem('userPlans-fruit', JSON.stringify(updatedPlans));
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
      <header className={`${headerContainer} ${tipCardColors.green}`}>
        <BackToTodayButton />
        <h1 className={sectionHeading}>Fem om dagen</h1>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        <p className={sectionSubheading2}>
          Att äta minst fem nävar frukter och grönsaker varje dag hjälper dig att må bättre och minska risken för hjärt-kärlsjukdom. Välj olika sorter och färger för att få i dej alla näringsämnen 
        </p>

        <div> 
          <p className={bodyText}>Till dina fem om dagen räknas</p>
          <DottedList items={[
            "Rotfrukter",
            "Frukt - färska och frysta",
            "Bär - färska och frysta", 
            "Grönsaker - färska, frysta och i maten du lagar",
          ]} />
        </div>

        <div> 
          <h2 className={sectionHeading2}>Varför minst fem om dagen?</h2>
          <p className={bodyText}>
            Du mår bättre med ett bättre humör och mindre trötthet eftersom frukt och grönt ger
          </p>
          <DottedList items={[
            "Stärkt immunförsvar: Vitaminer & mineraler boostar energi och immunförsvar",
            "Energi: Antioxidanter minskar inflammation i kroppen", 
            "Blodsockerreglering: Det ger jämnare energi"
          ]} />
        </div>

        <div> 
          <p className={bodyText}>
            Frukt och grönt minskar risken för hjärtsjukdom eftersom de
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
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att tänka ut <span className={bodyWhen}>när</span> och <span className={bodyHow}>hur</span> du ska äta dina fem om dagen, kan du lättare modifiera en plan som passar dej.
          </p>
        </div>
       
        <div>
          <p className={bodyWhen}>Frukost</p>
          
          <p className={bodyHow}>Topping till gröt/musli/yoghurt/flingor</p>
          <p className={bodyText}>Toppa med blåbär, hallon, banan eller äppelskivor. Addera någon krydda för lite smak såsom kanel eller kardemumma.</p>

          <p className={bodyHow}>Smörgåspålägg</p>
          <p className={bodyText}>Lägg till gurkskiva eller paprika.</p>

          <p className={bodyHow}>Bananpannkaka</p>
          <p className={bodyText}>Mosa en banan och blanda med två ägg och stek.</p>

          <p className={bodyHow}>Smoothie</p>
          <p className={bodyText}>Blanda yoghurt eller kvarg och en skvätt mjölk med olika frukter och bär, lägg även till spenat - det kommer inte smaka något. Tips på grönsaker och frukt som är goda i smoothies kan vara grönkål, avokado, citron, banan, apelsin, eller mango.</p>

          <p className={bodyHow}>Smoothie-bowl</p>
          <p className={bodyText}>Istället för att dricka smoothie - servera i en skål och toppa därefter med bär, nötter eller granola.</p>
        </div>


        <div>
          <div className="mt-8 pt-6 border-t border-border">
            <div className="mb-4">
              <h2 className={sectionHeading2}>Min plan</h2>
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

            {isEditing && (
              <div className="mb-6 p-6 border border-border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-4">
                  {editingIndex !== null ? 'Redigera plan' : 'Skapa ny plan'}
                </h3>
                <UserPlanForm
                  tipId={1}
                  initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                  onSave={handleSavePlan}
                  onCancel={handleCancelEdit}
                />
              </div>
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
        </div>
      </main>
    </div>
  );
};

export default FruitPage;
