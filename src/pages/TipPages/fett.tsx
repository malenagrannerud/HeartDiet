import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionHeading2, sectionSubheading2, bodyText, tipCardColors, standardSpacing } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanFormDialog } from "@/components/UserPlanFormDialog";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import ExampleCard from "@/components/exCard";
import { AddPlanButton } from "@/components/AddPlanButton";
import { Droplets } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCardCompact } from "@/components/MedCardCompact";
import { useHealthGoalTips } from "@/hooks/use-health-goal-tips";
import { HealthGoalCardCompact } from "@/components/HealthGoalCardCompact";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useTipUserPlans } from "@/hooks/use-tip-user-plans";

const FettPage = () => {
  const {
    userPlans,
    editingIndex,
    isDialogOpen,
    setIsDialogOpen,
    handleSavePlan,
    handleDeletePlan,
    handleEditPlan,
    handleAddPlan,
    handleCancelEdit,
  } = useTipUserPlans('fett');
  const medicationInteractions = useMedicationInteractions(4); // tipId: 4 for Fett
  const healthGoalTips = useHealthGoalTips(4);

  return (
    <div className={pageContainer}>
      <header className={`${headerContainer} ${tipCardColors.yellow}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>Rätt fett</h1>
          <Droplets className="h-8 w-8" />
        </div>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        <p className={sectionSubheading2}>
          Att välja rätt typ av fett skyddar hjärtat och sänker kolesterolet med 30%. 
          Byt mättat fett mot omättat fett för bättre hälsa
        </p>

        <div>
          <p className={bodyText}>Omättade fetter är bra för hjärtat och hjälper till att sänka kolesterolet.  </p>
          <DottedList items={[
            "Omättade fetter: Olivolja (extra virgin), rapsolja, avokado, fet fisk, nötter och frön",
            "Mättade fetter: Smör och hårt matfett, feta mejeriproukter (grädde, crème fraiche), fett kött och charkuterier, kokosolja och palmolja   ",
          ]} />
        </div>


        <div>
          <p className={bodyText}> Byt ut det mättade fettet där du kan </p>
          <DottedList items={[
            <span key="1">Stekning och bakning: Smör <span className="text-purple-600 text-xl">→</span> olivolja eller rapsolja (100g smör <span className="text-purple-600 text-xl">↔</span> 80g olja)</span>,
            <span key="2">På smörgås: Smör <span className="text-purple-600 text-xl">→</span> avokado, hummus eller olivolja</span>,
            <span key="3">Grilla: Kött <span className="text-purple-600 text-xl">→</span> lax</span>,
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
          <h2 className={sectionHeading2}>Varför rätt fett?</h2>
          <p className={bodyText}> Rätt fett skyddar mot hjärt-kärlsjukdom efter som de </p>
          
          <Accordion type="multiple" className="mt-4">
            <AccordionItem value="ldl">
              <AccordionTrigger className={bodyText}>Minskar risken för åderförkalkning</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Omättade fetter, särskilt fleromättade fetter som finns i fisk och nötter, 
                hjälper levern att ta bort LDL-kolesterol från blodet. 
                De ersätter också mättat fett i kosten, vilket i sig höjer LDL. 
                Studier visar att ersätta mättat fett med omättat fett kan sänka LDL-kolesterolet med upp till 10%.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hdl">
              <AccordionTrigger className={bodyText}>Höjer HDL-kolesterol</AccordionTrigger>
              <AccordionContent className={bodyText}>
                HDL-kolesterol kallas "det goda kolesterolet" eftersom det transporterar bort kolesterol
                 från blodkärlen tillbaka till levern där det bryts ner. 
                 Detta minskar risken för plackbildning i artärerna. 
                 Omättade fetter, särskilt från olivolja och nötter, hjälper till att höja HDL-nivåerna.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="omega3">
              <AccordionTrigger className={bodyText}>Anti-inflammatoriskt</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Omega-3-fettsyror, särskilt EPA och DHA från fet fisk, har kraftfulla anti-inflammatoriska egenskaper.
                 De motverkar kronisk inflammation som kan skada blodkärl och öka risken för hjärtsjukdom. 
                 Omega-3 minskar också produktionen av inflammatoriska ämnen i kroppen.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <h2 className={sectionHeading2}>Planera för att börja äta rätt fett</h2>
          <p className={bodyText}>
            Genom att tänka ut när och hur du ska byta till nyttigare fetter, kan du lättare modifiera en plan som passar dej
          </p>
        </div>

        <div className="mt-2 space-y-2">
          <ExampleCard 
            goal="Byt smör mot flytande matfett"
            when="Varje måltid"
            how="Har rapsolja/olivolja framme på köksbordet"
            reminder="Klisterlapp på smörpaketet"
          />

          <ExampleCard 
            goal="Äta nötter som mellanmål (30 g / dag)"
            when="Eftermiddag kl 15"
            how="Portionerar ut i små burkar för veckan"
            reminder="Alarm mobil"
          />

          <ExampleCard 
            goal="Tillaga mat med rapsolja istället för smör"
            when="Middagstillagning"
            how="Ställer fram rapsoljan, stoppar undan smöret"
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
                tipId={4}
                initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                onSave={handleSavePlan}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <UserPlanForm
              tipId={4}
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

export default FettPage;
