// pages/TipPages/fullkorn.tsx
import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionHeading2, sectionSubheading2, bodyText, tipCardColors, standardSpacing } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanFormDialog } from "@/components/UserPlanFormDialog";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import ExampleCard from "@/components/exCard";
import { AddPlanButton } from "@/components/AddPlanButton";
import { Wheat } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCardCompact } from "@/components/MedCardCompact";
import { useHealthGoalTips } from "@/hooks/use-health-goal-tips";
import { HealthGoalCardCompact } from "@/components/HealthGoalCardCompact";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FullkornPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const medicationInteractions = useMedicationInteractions(2); // tipId: 2 for Fullkorn
  const healthGoalTips = useHealthGoalTips(2);

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
      <header className={`${headerContainer} ${tipCardColors.amber}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>Fyll på med fullkorn</h1>
          <Wheat className="h-8 w-8" />
        </div>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        <p className={sectionSubheading2}>
          Att äta minst 90 g fullkorn varje dag hjälper dig att må bättre samtidigt som det minskar risken för hjärt-kärlsjukdomar, vissa typer av cancer samt typ2-diabetes
        </p>

        <div> 
          <p className={bodyText}>Fullkorn är ett sädeskorn som innehåller alla sina tre delar: kli, grodd och frövita. Detta gäller även om kornet har krossats eller malts till ett fullkornsmjöl. Till skillnad från vitt mjöl, där de näringsrika delarna kli och grodd har tagits bort, innehåller fullkornsprodukter mer fibrer, vitaminer och mineraler.</p>
          <p> Fullkorn kommer ifrån bland annat</p>
          <DottedList items={[
                            "Vete, råg, korn och havre",
                            "Ris",
                            "Majs", 
                            "Hirs, teff och durra",
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
          <h2 className={sectionHeading2}>Varför minst 90 g om dagen?</h2>
          <p>Du mår bättre av fullkorn eftersom det bidrar till</p>
          <DottedList items={[
            "Stärkt immunförsvar: C-vitamin och zink stärker skyddet mot infektioner",
            "Mer energi: B-vitaminer omvandlar mat till energi och bekämpar trötthet",
            "Muskelfunktion: Magnesium är viktigt för muskelavslappning och energiproduktion",
            "Benhälsa: Vitamin K stärker skelettet och förbättrar blodkoagulering",
            "Syretransport: Järn förhindrar trötthet genom att transportera syre i blodet"
          ]} />
        </div>

        <div>
          <p>Fullkorn skyddar mot sjukdom eftersom det bidrar till</p>
          <DottedList items={[
            "Sänkt blodtryck: Kalium och magnesium i fullkorn hjälper blodkärlen att slappna av",
            "Lägre kolesterol: Lösliga fibrer binder sig med gallsyror och sänker LDL-kolesterolet",
            "Minskad inflammation: Antioxidanter i fullkorn skyddar kärlväggarna från skador",
            "Förbättrad blodsockerreglering: Långsamma kolhydrater förhindrar blodsockertoppar som skadar kärlen",
            "Hälsosam vikt: Fibrer (betaglukaner) mättar och hjälper dig att upprätthålla en normal vikt",
            "Bättre blodfetter: Omega-3-fettsyror i vissa fullkornsprodukter gynnar hjärtat"
          ]} />
          
          <Accordion type="multiple" className="mt-4">
            <AccordionItem value="fiber">
              <AccordionTrigger className={bodyText}>Hur minskar fibrer från fullkorn kolesterolet?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Fullkorn innehåller betaglukaner, lösliga fibrer som binder kolesterol och gallsyror i tarmen. Detta tvingar kroppen att använda mer kolesterol från blodet för att producera nya gallsyror. Studier visar att 3 gram betaglukaner per dag (ca 90 g havregryn) kan sänka LDL-kolesterolet med 5-10%.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="blood-sugar">
              <AccordionTrigger className={bodyText}>Varför ger fullkorn stabil blodsockernivå?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Fullkornsprodukter har ett lågt glykemiskt index (GI), vilket betyder att de bryts ner långsamt och ger en jämn blodsockerkurva. Detta förhindrar blodsockertoppar och dalar som skadar blodkärlen och ökar risken för diabetes. Fibrer och hela kornets struktur bromsar nedbrytningen av kolhydrater.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="nutrients">
              <AccordionTrigger className={bodyText}>Vilka näringsämnen finns i fullkorn?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Fullkorn innehåller B-vitaminer (energiomsättning), järn (syretransport), magnesium (muskel- och nervfunktion), zink (immunförsvar), selen (antioxidant) och vitamin E. Kliet (yttre skalet) innehåller fibrer och mineraler, medan grodden innehåller nyttiga fetter och vitaminer. Dessa näringsämnen försvinner när kornet raffineras till vitt mjöl.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att tänka ut när och hur du ska äta dina 90g / dag, kan du lättare modifiera en plan som passar dej. Några exempel:
          </p>
        </div>

        <div className="mt-2 space-y-2">
                <ExampleCard 
                  goal="Äta en tallrik gröt / dag (ca 35 g)"
                  when="Frukost: måndag-fredag"
                  how="Har goda toppings redo i kylskåpet"
                  reminder="Ställer fram havregrynen varje kväll"
                />

                <ExampleCard 
                  goal="Äta två knäckebröd / dag (ca 25 g)"
                  when="Lunch: måndag-fredag"
                  how=" Har knäckebrödkorg på bordet"
                  reminder="Skriver på inköpslistan"
                />
                
                <ExampleCard 
                  goal="Blanda pasta med fullkornspasta (ca 30 g )"
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
                tipId={2}
                initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                onSave={handleSavePlan}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <UserPlanForm
              tipId={2}
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

export default FullkornPage;
