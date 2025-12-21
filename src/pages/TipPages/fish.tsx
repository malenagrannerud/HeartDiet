import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionHeading2,  sectionSubheading2, bodyText, tipCardColors, standardSpacing } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanFormDialog } from "@/components/UserPlanFormDialog";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import ExampleCard from "@/components/exCard";
import { AddPlanButton } from "@/components/AddPlanButton";
import { Fish } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCardCompact } from "@/components/MedCardCompact";
import { useHealthGoalTips } from "@/hooks/use-health-goal-tips";
import { HealthGoalCardCompact } from "@/components/HealthGoalCardCompact";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useTipUserPlans } from "@/hooks/use-tip-user-plans";

const FishPage = () => {
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
  } = useTipUserPlans('fish');
  const medicationInteractions = useMedicationInteractions(3); // tipId: 3 for Fish
  const healthGoalTips = useHealthGoalTips(3);

  return (
    <div className={pageContainer}>
      <header className={`${headerContainer} ${tipCardColors.cyan}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>Fisk och skaldjur</h1>
          <Fish className="h-8 w-8" />
        </div>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        <p className={sectionSubheading2}>
          Att äta fisk och skaldjur 3 gånger i veckan minskar risken för flera folksjukdomar. De innehåller många näringsämnen som det kan vara svårt att få tillräckligt av        
        </p>
        
        <div> 
          <p className={bodyText}>För att äta fisk och skaldjur kan du till exempel äta </p>
          <DottedList items={[
            "Smörgåspålägg. Till exempel: makrill i tomat, sill eller tonfisk på burk",
            "Soppor och grytor",
            "Hel, grillad fisk",
            "Burgare och panerad fisk",
            "Sallader",
            "Sushi"
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
          <p className={bodyText}>Ät fet fisk minst en gång av dina tre </p>
          <DottedList items={[
            "Fet fisk: Lax, makrill, sill, sardiner",
            "Mager fisk: Torsk, kolja, rödspätta",
            "Skaldjur: Räkor, musslor, kräftor"
          ]} />
        </div>

        <div> 
          <h2 className={sectionHeading2}>Varför fisk och skaldjur?</h2>
          <p className={bodyText}>
            Fisk och skaldjur är rika på omega-3-fettsyror, protein och viktiga vitaminer som stödjer hjärthälsa och hjärnfunktion.
          </p>
      
          
          <Accordion type="multiple" className="mt-1">
            <AccordionItem value="omega3-heart">
              <AccordionTrigger className={bodyText}>Minskar risk för hjärtinfarkt och stroke</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Omega-3-fettsyrorna EPA och DHA från fet fisk sänker triglycerider, minskar inflammation, 
                stabiliserar hjärtrytmen och förhindrar blodproppar. 
                Studier visar att regelbunden fiskkonsumtion kan minska risken för hjärtinfarkt med upp till 30-40%. 
                Minst en portion fet fisk per vecka rekommenderas för optimal hjärthälsa.
                Fet fisk som lax, makrill och sill är bland de bästa naturliga källorna till D-vitamin. 
                D-vitamin stärker benhälsan, immunförsvaret och kan minska risken för hjärtsjukdom och 
                vissa cancerformer. Eftersom solen inte ger tillräckligt med D-vitamin i nordliga länder, 
                är fisk extra viktig här.

              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="brain">
              <AccordionTrigger className={bodyText}>Stödjer hjärnans utveckling och funktion</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Hjärnan består till stor del av fett, och omega-3-fettsyror är avgörande för hjärncellernas struktur och funktion. DHA från fisk stödjer kognitiv funktion, minne och inlärning. Regelbunden fiskkonsumtion är kopplad till lägre risk för demens och depression, samt bättre kognitiv hälsa i ålderdomen.
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>
        </div>

         <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att tänka ut när och hur du ska äta fisk och skaldjur tre gånger per vecka, kan du lättare modifiera en plan som passar dej.
          </p>
        </div>
       
        <div className="mt-2 space-y-2">
                <ExampleCard 
                  goal="Fet fisk en gång (1 gång)"
                  when="Lunch - Tisdagar"
                  how="Laga nytt recept på lax"
                  reminder="Kalender"
                />

                <ExampleCard 
                  goal="Äta makrill en gång / v."
                  when="Frukost - Måndagar"
                  how="Makrill på burk på toast"
                  reminder="Kalender"
                />

                <ExampleCard 
                  goal="Skaldjur en gång / v."
                  when="Middag-fredagar"
                  how="Moule marinere, pommes frites, aioli"
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
                tipId={3}
                initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                onSave={handleSavePlan}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <UserPlanForm
              tipId={3}
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

export default FishPage;
