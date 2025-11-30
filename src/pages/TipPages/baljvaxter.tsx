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
import { Sprout } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCardCompact } from "@/components/MedCardCompact";
import { useHealthGoalTips } from "@/hooks/use-health-goal-tips";
import { HealthGoalCardCompact } from "@/components/HealthGoalCardCompact";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const BaljvaxterPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const medicationInteractions = useMedicationInteractions(10); // tipId: 10 for Baljväxter
  const healthGoalTips = useHealthGoalTips(10);

  useEffect(() => {
    const savedPlans = localStorage.getItem('userPlans-baljvaxter');
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
    localStorage.setItem('userPlans-baljvaxter', JSON.stringify(updatedPlans));
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    localStorage.setItem('userPlans-baljvaxter', JSON.stringify(updatedPlans));
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
      <header className={`${headerContainer} ${tipCardColors.orange}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>Ät mer baljväxter</h1>
          <Sprout className="h-8 w-8" />
        </div>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        <p className={sectionSubheading2}>
          Att äta baljväxter flera gånger per vecka ger dig protein, fibrer och viktiga näringsämnen samtidigt som det minskar risken för hjärt-kärlsjukdom och typ 2-diabetes
        </p>

        <div>
          <h2 className={sectionHeading2}>Vad är baljväxter?</h2>
          <p className={bodyText}>Baljväxter är proteinrika växter som växer i baljor</p>
          <DottedList items={[
            "Linser: röda, gröna, bruna, svarta",
            "Bönor: svarta bönor, kidney, cannellini, vita bönor",
            "Kikärtor",
            "Ärtor: gröna ärtor, gula ärtor",
            "Sojabönor och sojaprodukte: tofu, tempeh, edamamebönor",
            "Jordnötter (tekniskt sett en baljväxt)"
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
          <h2 className={sectionHeading2}>Näringsinnehåll</h2>
          <p className={bodyText}>Baljväxter är rika på</p>
          <DottedList items={[
            "Protein: Lika mycket som kött men utan mättat fett",
            "Fibrer: Mättar och stödjer tarmhälsa",
            "Järn: Viktigt för blodbildning",
            "Folat: Nödvändigt för celldelning",
            "Magnesium: Viktigt för muskel- och nervfunktion",
            "Lågt glykemiskt index: Jämnt blodssocker"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Varför äta mer baljväxter?</h2>
          <p className={bodyText}>Baljväxter ger många hälsofördelar</p>
          <DottedList items={[
            "Sänker kolesterol: Lösliga fibrer binder fett i tarmarna",
            "Stabil blodsockernivå: Minskar risk för diabetes",
            "Mättnad: Proteinet och fibrerna håller dig mätt längre",
            "Hjärthälsa: Minskar risk för hjärtinfarkt och stroke",
            "Viktminskning: Låg energitäthet men högt näringsvärde",
            "Hållbart: Bra för miljön jämfört med kött"
          ]} />
          
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="protein">
              <AccordionTrigger className={bodyText}>Hur bra är protein från baljväxter?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Baljväxter innehåller 15-25% protein, vilket är jämförbart med kött men utan mättat fett. Även om de är låga i metionin (en aminosyra), blir proteinintaget komplett när du kombinerar baljväxter med spannmål (ris, pasta, bröd) under dagen. Sojabönor och produkter som tofu innehåller alla essentiella aminosyror och är ett komplett protein.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="satiety">
              <AccordionTrigger className={bodyText}>Varför mättar baljväxter så bra?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Kombinationen av protein, fibrer och långsamma kolhydrater gör att baljväxter håller dig mätt längre. Proteinet signalerar mättnad till hjärnan, fibrerna fyller magen och bromsar magtömningen, och det låga glykemiska indexet ger stabil blodsockernivå utan hunger-dippar. Detta gör baljväxter perfekta för viktkontroll.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sustainability">
              <AccordionTrigger className={bodyText}>Varför är baljväxter bra för miljön?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Baljväxter binder kväve från luften i jorden, vilket minskar behovet av gödsel. De kräver mycket mindre vatten, mark och energi än köttproduktion och ger betydligt lägre koldioxidutsläpp. Att ersätta kött med baljväxter några gånger i veckan är ett av de mest effektiva sätten att minska din klimatpåverkan.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <h2 className={sectionHeading2}>Så kan du äta baljväxter</h2>
          <p className={bodyText}>Enkla sätt att få in baljväxter i maten</p>
          <DottedList items={[
            "Grytor och soppor: linssoppa, chilistuvning med bönor",
            "Sallader: kikärtssallad, bönsallad",
            "Röror och dippar: hummus, böndip",
            "Ersätt kött: bönbiffar, linsbolognese",
            "Som tillbehör: kokta linser eller bönor till kötträtten",
            "Snacks: rostade kikärtor"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Tips för förberedelse</h2>
          <p className={bodyText}>Undvik gasbildning och optimera näringen</p>
          <DottedList items={[
            "Blötlägg torkade baljväxter över natten",
            "Skölj konserverade baljväxter under kallt vatten",
            "Koka i rejält med vatten",
            "Börja med små mängder och öka gradvis",
            "Kombinera med grönsaker och kryddor för bättre smak"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att planera när och hur du ska äta baljväxter, kan du lättare göra dem till en naturlig del av kosten
          </p>
        </div>

        <div className="mt-2 space-y-2">
          <ExampleCard 
            goal="Vegetarisk middag med baljväxter 2 ggr / v."
            when="Måndag och torsdag"
            how="Lagar linssoppa, chilistuvning, curry"
            reminder="Veckans meny på kylskåpet"
          />

          <ExampleCard 
            goal="Hummus som mellanmål eller pålägg"
            when="Lunch 3 ggr / v."
            how="Köper eller gör egen hummus"
            reminder="Inköpslista"
          />

          <ExampleCard 
            goal="Blanda bönor i köttfärssåsen"
            when="När jag lagar köttfärssås"
            how="Har konserverade bönor i skafferiet"
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
                tipId={10}
                initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                onSave={handleSavePlan}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <UserPlanForm
              tipId={10}
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

export default BaljvaxterPage;
