// pages/TipPages/fullkorn.tsx
import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionHeading2, sectionSubheading2, bodyText, tipCardColors, standardSpacing } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import ExampleCard from "@/components/exCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const FullkornPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [isEditing, setIsEditing] = useState(true);
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
        <h1 className={sectionHeading}>Fyll på med fullkorn</h1>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        <p className={sectionSubheading2}>
          Att äta minst 90 g fullkorn varje dag hjälper dig att må bättre samtidigt som det minskar risken för hjärt-kärlsjukdomar, vissa typer av cancer samt typ2-diabetes
        </p>

        <div> 
        <h2 className={sectionHeading2}>Vad är fullkorn? </h2>
          <p className={bodyText}>Fullkorn är ett sädeskorn som innehåller alla sina tre delar: kli, grodd och frövita. Detta gäller även om kornet har krossats eller malts till ett fullkornsmjöl. Till skillnad från vitt mjöl, där de näringsrika delarna kli och grodd har tagits bort, innehåller fullkornsprodukter mer fibrer, vitaminer och mineraler.</p>
          <p> Fullkorn kommer ifrån bland annat</p>
          <DottedList items={[
                            "Vete, råg, korn och havre",
                            "Ris",
                            "Majs", 
                            "Hirs, teff och durra",
            ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Fullkornsprodukter</h2>
          <p> För att äta 90 g fullkorn kan du till exempel äta: </p>
          <DottedList items={[
            "Havregryn (100% fullkorn). En portion är ca 35 g",
            "Knäckebröd (100% fullkorn). 2 skivor är ca 24 g",
            "Musli (55% fullkorn)",
            "Fullkornsbröd (20 - 70%) fullkorn ",
            "Fullkornspasta (55% fullkorn). En portion är ca 40 g", 
            "Mathavre (55% fullkorn). En portion är ca 40 g", 
            "Mjöl (100% fullkorn)." 
          ]} />
        </div>
    
        <div>
          <h2 className={sectionHeading2}>Må bättre</h2>
          <p>Du mår bättre av fullkorn eftersom det bidrar till</p>
          <DottedList items={[
            "Stärkt immunförsvar: C-vitamin och zink stärker skyddet mot infektioner",
            "Reglerat blodtryck: Kalium reglerar blodtrycket och hjärtats funktion",
            "Mer energi: B-vitaminer omvandlar mat till energi och bekämpar trötthet",
            "Muskelfunktion: Magnesium är viktigt för muskelavslappning och energiproduktion",
            "Benhälsa: Vitamin K stärker skelettet och förbättrar blodkoagulering",
            "Syretransport: Järn förhindrar trötthet genom att transportera syre i blodet"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Skydd mot sjukdom</h2>
          <p>Fullkorn skyddar mot sjukdom eftersom det bidrar till</p>
          <DottedList items={[
            "Sänkt blodtryck: Kalium och magnesium i fullkorn hjälper blodkärlen att slappna av",
            "Lägre kolesterol: Lösliga fibrer binder sig med gallsyror och sänker LDL-kolesterolet",
            "Minskad inflammation: Antioxidanter i fullkorn skyddar kärlväggarna från skador",
            "Förbättrad blodsockerreglering: Långsamma kolhydrater förhindrar blodsockertoppar som skadar kärlen",
            "Hälsosam vikt: Fibrer (betaglukaner) mättar och hjälper dig att upprätthålla en normal vikt",
            "Bättre blodfetter: Omega-3-fettsyror i vissa fullkornsprodukter gynnar hjärtat"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Ät dina 90g om dagen</h2>
          <p className={bodyText}>
            Genom att tänka ut när och hur du ska äta dina 90g / dag, kan du lättare modifiera en plan som passar dej. Några exempel:
          </p>
        </div>

        <div className="mt-2 space-y-2">
                <ExampleCard 
                  goal="Äta en tallrik gröt / dag"
                  when="Frukost: måndag-fredag"
                  how="Har goda toppings redo i kylskåpet"
                  reminder="Ställer fram havregrynen varje kväll"
                />
                
                <ExampleCard 
                  goal="Blanda pastan med hälften fullkornspasta"
                  when="Middag: varje dag"
                  how="Blandar en färdig blandning i skafferiet"
                  reminder="-"
                />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
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
                tipId={2}
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
      </main>
    </div>
  );
};

export default FullkornPage;
