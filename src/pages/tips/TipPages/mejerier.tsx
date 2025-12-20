import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tipCardColorsText";
import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionHeading2, sectionSubheading2, bodyText, tipCardColors, standardSpacing } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanFormDialog } from "@/components/UserPlanFormDialog";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import ExampleCard from "@/components/exCard";
import { AddPlanButton } from "@/components/AddPlanButton";
import { Milk } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCardCompact } from "@/components/MedCardCompact";
import { useHealthGoalTips } from "@/hooks/use-health-goal-tips";
import { HealthGoalCardCompact } from "@/components/HealthGoalCardCompact";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const MejerierPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const medicationInteractions = useMedicationInteractions(5); // tipId: 5
  const healthGoalTips = useHealthGoalTips(5);

  useEffect(() => {
    const savedPlans = localStorage.getItem('userPlans-mejerier');
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
    localStorage.setItem('userPlans-mejerier', JSON.stringify(updatedPlans));
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    localStorage.setItem('userPlans-mejerier', JSON.stringify(updatedPlans));
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
      <header className={`${headerContainer} ${tipCardColors.lightblue}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>Mer magra mejerier</h1>
          <Milk className="h-8 w-8" />
        </div>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        <p className={sectionSubheading2}>
          Att äta 5 dl mjölk eller yoghurt och 2-3 skivor ost varje dag ger dig viktiga näringsämnen samtidigt som magra alternativ minskar mättat fett
        </p>

        <div>
          <h2 className={sectionHeading2}>Mejeriets näringsvärden</h2>
          <p className={bodyText}>Mjölkprodukter är en viktig källa till</p>
          <DottedList items={[
            "Kalcium: Stärker skelettet och tänderna",
            "Protein: Bygger och reparerar vävnader",
            "Vitamin D: Hjälper kroppen ta upp kalcium",
            "Vitamin B12: Viktigt för nervsystemet",
            "Jod: Nödvändigt för sköldkörtelns funktion"
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
          <h2 className={sectionHeading2}>Välj magra alternativ</h2>
          <p className={bodyText}>För att minska mättat fett, välj</p>
          <DottedList items={[
            "Lättmjölk eller mellanmjölk (0,5-1,5% fett)",
            "Lättfil och lättyoghurt",
            "Kvarg och keso",
            "Ost med max 17% fett",
            "Lättglass istället för vanlig glass"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Varför magra mejerier?</h2>
          <p className={bodyText}>Magra mejerier ger hälsofördelar</p>
          <DottedList items={[
            "Starka ben: Kalcium och D-vitamin förebygger benskörhet",
            "Lägre kolesterol: Mindre mättat fett skyddar hjärtat",
            "Viktminskning: Lägre energiinnehåll men lika mättande",
            "Muskelunderhåll: Högkvalitativt protein bevarar muskelmassa",
            "Blodtrycksreglering: Kalcium kan hjälpa sänka blodtrycket"
          ]} />
          
          <Accordion type="multiple" className="mt-4">
            <AccordionItem value="calcium">
              <AccordionTrigger className={bodyText}>Varför är kalcium så viktigt för benhälsan?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                99% av kroppens kalcium finns i skelettet och tänderna. Kalcium bygger och stärker benstrukturen, särskilt viktigt under uppväxten och för att förhindra benskörhet senare i livet. Om du inte får tillräckligt med kalcium från kosten tar kroppen kalcium från skelettet, vilket försvagar benen. Mejeriproukter är den bästa källan eftersom kalciumet är lättupptagligt.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="protein">
              <AccordionTrigger className={bodyText}>Hur hjälper mjölkprotein musklerna?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Mjölkprotein innehåller alla essentiella aminosyror som kroppen behöver för att bygga och reparera muskler. Vassleprotein är snabbt upptaget och idealiskt efter träning, medan kasein frisätts långsamt och ger långvarig mättnad. Med stigande ålder blir protein extra viktigt för att behålla muskelmassa och förhindra sarkopeni (muskelförlust).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="low-fat">
              <AccordionTrigger className={bodyText}>Varför välja magra mejerier?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Magra mejeriprodukte ger samma mängd kalcium, protein och vitaminer som feta varianter men med mindre mättat fett och kalorier. Mättat fett höjer LDL-kolesterol och ökar risken för hjärtsjukdom. Genom att välja lättmjölk, lättfil och magert ost får du all näring utan negativa effekter på kolesterolet. Detta hjälper också viktkontroll.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att tänka ut när och hur du ska äta magra mejerier, kan du lättare modifiera en plan som passar dej
          </p>
        </div>

        <div className="mt-2 space-y-2">
          <ExampleCard 
            goal="Dricka 2,5 dl lättmjölk / dag"
            when="Frukost och mellanmål"
            how="Köper lättmjölk istället för standardmjölk"
            reminder="Inköpslista"
          />

          <ExampleCard 
            goal="Äta fil med frukost (2 dl)"
            when="Frukost dagligen"
            how="Har alltid lättfil hemma"
            reminder="Skriver på inköpslistan när det tar slut"
          />

          <ExampleCard 
            goal="Ostsmörgås till lunch (2 skivor 17% ost)"
            when="Lunch måndag-fredag"
            how="Har magert pålägg i kylen"
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
                tipId={5}
                initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                onSave={handleSavePlan}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <UserPlanForm
              tipId={5}
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

export default MejerierPage;
