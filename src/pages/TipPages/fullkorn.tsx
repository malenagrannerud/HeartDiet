// pages/TipPages/fullkorn.tsx
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
import { useTipUserPlans } from "@/hooks/use-tip-user-plans";
import ArrowExchange from "@/components/ArrowExchange";



const FullkornPage = () => {
  const {
    userPlans, editingIndex, isDialogOpen, setIsDialogOpen,
    handleSavePlan, handleDeletePlan, handleEditPlan, handleAddPlan, handleCancelEdit,
  } = useTipUserPlans('fullkorn');
  const medicationInteractions = useMedicationInteractions(2);
  const healthGoalTips = useHealthGoalTips(2);

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
          Att äta minst 90 g fullkorn varje dag hjälper dig att må bättre samtidigt som det minskar risken för hjärt-kärlsjukdomar, 
          vissa typer av cancer samt typ2-diabetes
        </p>

        <div> 
          <p className={bodyText}>Fullkorn är ett sädeskorn som innehåller alla sina tre delar: kli, grodd och frövita. 
            Detta gäller även om kornet har krossats eller malts till ett fullkornsmjöl. Till skillnad från vitt mjöl, 
            där de näringsrika delarna kli och grodd har tagits bort, innehåller fullkornsprodukter mer fibrer, 
            vitaminer och mineraler.</p>
          <p className={bodyText}>Fullkorn kommer ifrån bland annat</p>
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
              <p className={bodyText}>Ett par exempel på vart du kan få dina fullkorn</p>
               <DottedList items={[
                <span key="havre">Yoghurt<ArrowExchange /> Havregryn (100% fullkorn). En portion är ca 35 g</span>,
                <span key="bread">Vitt bröd <ArrowExchange /> Knäckebröd (100% fullkorn). 2 skivor är ca 24 g</span>,
                <span key="bread2">Vitt bröd<ArrowExchange /> Fullkornsbröd (20 - 70%). 2 skivor är ca 12 g</span>,
                <span key="musli">Musli<ArrowExchange /> Fullkornsmusli, osötad (80% fullkorn). En portion är ca 30 g</span>,
                <span key="pasta1">Pasta <ArrowExchange /> Fullkornspasta (55% fullkorn). En portion är ca 40 g</span>,
                <span key="pasta2">Pasta <ArrowExchange /> Mathavre (55% fullkorn). En portion är ca 40 g</span>,
                <span key="flour">Vitt mjöl <ArrowExchange /> Mjöl på fullkorn (100% fullkorn)</span>
              ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Varför minst 90 g om dagen?</h2>
          <p className={bodyText}>Du mår bättre av fullkorn eftersom det bidrar till</p>

          <Accordion type="multiple" className="mt-1">
            <AccordionItem value="immune">
              <AccordionTrigger className={bodyText}>Stärkt immunförsvar</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Fullkorn innehåller betaglukaner, lösliga fibrer som binder kolesterol och gallsyror i tarmen. 
                Detta tvingar kroppen att använda mer kolesterol från blodet för att producera nya gallsyror. 
                Studier visar att 3 gram betaglukaner per dag (ca 90 g havregryn) kan sänka LDL-kolesterolet med 5-10%.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="energi">
              <AccordionTrigger className={bodyText}>Mer energi</AccordionTrigger>
              <AccordionContent className={bodyText}>
                B-vitaminer omvandlar mat till energi och bekämpar trötthet. 
                Magnesium är viktigt för muskelavslappning och energiproduktion. 
                Järn förhindrar trötthet genom att transportera syre i blodet 
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <p className={bodyText}>Fullkorn skyddar mot sjukdom genom att det bidrar till</p>

          <Accordion type="multiple" className="mt-0">
            <AccordionItem value="fiber">
              <AccordionTrigger className={bodyText}>Sänkt kolesterol</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Fullkorn innehåller betaglukaner, lösliga fibrer som binder kolesterol och gallsyror i tarmen. Detta tvingar kroppen att använda mer kolesterol från blodet för att producera nya gallsyror. Studier visar att 3 gram betaglukaner per dag (ca 90 g havregryn) kan sänka LDL-kolesterolet med 5-10%.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="blood-sugar">
              <AccordionTrigger className={bodyText}>Stabil blodsockernivå</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Fullkornsprodukter har ett lågt glykemiskt index (GI), vilket betyder att de bryts ner långsamt och ger en jämn blodsockerkurva. Detta förhindrar blodsockertoppar och dalar som skadar blodkärlen och ökar risken för diabetes. Fibrer och hela kornets struktur bromsar nedbrytningen av kolhydrater.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="nutrients">
              <AccordionTrigger className={bodyText}>Sänkt blodtryck</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Sänkt blodtryck: Kalium och magnesium i fullkorn hjälper blodkärlen att slappna av, Minskad inflammation: Antioxidanter i fullkorn skyddar kärlväggarna från skador.
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
            how="Har knäckebrödkorg på bordet"
            reminder="Skriver på inköpslistan"
          />
          
          <ExampleCard 
            goal="Blanda pasta med fullkornspasta (ca 30 g)"
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
