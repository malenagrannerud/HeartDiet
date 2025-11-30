// pages/TipPages/fruit.tsx
import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionHeading2, bodyText, bodyTextBald, tipCardColors, sectionSubheading2, standardSpacing, bodyWhen, bodyHow} from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanFormDialog } from "@/components/UserPlanFormDialog";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import ExampleCard from "@/components/exCard";
import { AddPlanButton } from "@/components/AddPlanButton";
import { Apple } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCardCompact } from "@/components/MedCardCompact";
import { useHealthGoalTips } from "@/hooks/use-health-goal-tips";
import { HealthGoalCardCompact } from "@/components/HealthGoalCardCompact";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FruitPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const medicationInteractions = useMedicationInteractions(1); // tipId: 1 for Fruit
  const healthGoalTips = useHealthGoalTips(1);

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
    setIsDialogOpen(true);
  };

  const handleAddPlan = () => {
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsDialogOpen(false);
  };

  return (
    <div className={pageContainer}>
      <header className={`${headerContainer} ${tipCardColors.green}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>Fem om dagen</h1>
          <Apple className="h-8 w-8" />
        </div>
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

        {/* Medication warnings */}
        {medicationInteractions.length > 0 && (
          <div className="space-y-2 mt-4">
            {medicationInteractions.map(({ medication, interaction }) => (
              <MedCardCompact 
                key={`${medication.id}-${interaction.tipId}`}
                medication={medication}
                interaction={interaction}
              />
            ))}
          </div>
        )}

        {/* Health goal tips */}
        {healthGoalTips.length > 0 && (
          <div className="space-y-2 mt-2">
            {healthGoalTips.map((tip) => (
              <HealthGoalCardCompact key={`${tip.goalId}-${tip.tipId}`} tip={tip} />
            ))}
          </div>
        )}

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
          
          <Accordion type="multiple" className="mt-4">
            <AccordionItem value="antioxidants">
              <AccordionTrigger className={bodyTextBald}>Sänker blodtrycket</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Antioxidanter som C-vitamin, E-vitamin och betakaroten skyddar kroppens celler mot skador från fria radikaler. Detta minskar inflammation och oxidativ stress, som är kopplade till hjärtsjukdom, cancer och åldrande. Färgrika grönsaker och frukt innehåller mest antioxidanter.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="fiber">
              <AccordionTrigger className={bodyTextBald}>Minskar inflammation</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Lösliga fibrer från frukt, bär och grönsaker binder sig till kolesterol och gallsyror i tarmen och för ut dem ur kroppen. Detta tvingar levern att använda mer kolesterol för att producera nya gallsyror, vilket sänker kolesterolnivåerna i blodet. Äpplen, bär och havre är särskilt rika på lösliga fibrer.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="potassium">
              <AccordionTrigger className={bodyTextBald}>Sänker kolesterolet</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Kalium motverkar effekterna av natrium (salt) och hjälper blodkärlen att slappna av, vilket sänker blodtrycket. Bananer, apelsiner, spenat och potatis är rika på kalium. Ett högre kaliumintag är kopplat till lägre risk för stroke och hjärtsjukdom.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="potassium">
              <AccordionTrigger className={bodyTextBald}>Förbättrar blodkärlens funktion</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Kalium motverkar effekterna av natrium (salt) och hjälper blodkärlen att slappna av, vilket sänker blodtrycket. Bananer, apelsiner, spenat och potatis är rika på kalium. Ett högre kaliumintag är kopplat till lägre risk för stroke och hjärtsjukdom.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="potassium">
              <AccordionTrigger className={bodyTextBald}>Håller vikten</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Kalium motverkar effekterna av natrium (salt) och hjälper blodkärlen att slappna av, vilket sänker blodtrycket. Bananer, apelsiner, spenat och potatis är rika på kalium. Ett högre kaliumintag är kopplat till lägre risk för stroke och hjärtsjukdom.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>

        <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att tänka ut när och hur du ska äta dina fem om dagen, kan du lättare modifiera en plan som passar dej.
          </p>
        </div>
       
        <div className="mt-2 space-y-2">
                <ExampleCard 
                  goal="En smoothie/dag (ca 2 nävar)"
                  when="Frukost: måndag-fredag"
                  how="Har goda toppings redo i kylskåpet"
                  reminder="Påminnelse kalender"
                />

                <ExampleCard 
                  goal="Grönt på smörgåsen / dag (ca 1 näve)"
                  when="Frukost"
                  how="Skivar gurka / tomat / paprika"
                  reminder="Bild på grönsaker på kylskåpet"
                />

                <ExampleCard 
                  goal="Sallad varje dag (ca 2 nävar)"
                  when="Lunch och middag"
                  how="Förbereder råkostsallad för hela veckan"
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

          {userPlans.length > 0 ? (
            <>
              <UserPlanDisplay
                plans={userPlans}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlan}
              />
              <AddPlanButton
                onClick={handleAddPlan}
                canAddMorePlans={userPlans.length < 10}
              />
              <UserPlanFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                tipId={1}
                initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                onSave={handleSavePlan}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <UserPlanForm
              tipId={1}
              initialPlan={undefined}
              onSave={handleSavePlan}
              onCancel={handleCancelEdit}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default FruitPage;
