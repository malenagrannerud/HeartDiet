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
import { UtensilsCrossed } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCardCompact } from "@/components/MedCardCompact";
import { useHealthGoalTips } from "@/hooks/use-health-goal-tips";
import { HealthGoalCardCompact } from "@/components/HealthGoalCardCompact";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const LagomPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const medicationInteractions = useMedicationInteractions(8); // tipId: 8 for Lagom
  const healthGoalTips = useHealthGoalTips(8);

  useEffect(() => {
    const savedPlans = localStorage.getItem('userPlans-lagom');
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
    localStorage.setItem('userPlans-lagom', JSON.stringify(updatedPlans));
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    localStorage.setItem('userPlans-lagom', JSON.stringify(updatedPlans));
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
      <header className={`${headerContainer} ${tipCardColors.lightpurple}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>Lagom är bäst</h1>
          <UtensilsCrossed className="h-8 w-8" />
        </div>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        <p className={sectionSubheading2}>
          Att äta lagom portioner och lyssna på kroppens hunger- och mättnadssignaler hjälper dig att hålla en hälsosam vikt och undvika övervikt
        </p>

        <div>
          <h2 className={sectionHeading2}>Vad är lagom portioner?</h2>
          <p className={bodyText}>Använd tallriksmodellen som guide</p>
          <DottedList items={[
            "Halva tallriken: grönsaker och rotfrukter",
            "En fjärdedel: potatis, pasta, ris eller bröd",
            "En fjärdedel: kött, fisk, ägg eller baljväxter",
            "Ett glas: vatten, mjölk eller lättdryck",
            "Dessert: frukt eller bär"
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
          <h2 className={sectionHeading2}>Lyssna på kroppen</h2>
          <p className={bodyText}>Signaler att uppmärksamma</p>
          <DottedList items={[
            "Ät när du är hungrig - inte av vana eller tristess",
            "Ät långsamt och tugga ordentligt",
            "Sluta äta när du känner dig lagom mätt - inte proppmätt",
            "Vänta 20 minuter innan du tar mer - det tar tid för mättnadssignalerna att nå hjärnan",
            "Undvik distraktion vid måltid - ät vid bordet, inte framför TV:n"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Varför lagom portioner?</h2>
          <p className={bodyText}>Fördelarna med att äta lagom</p>
          <DottedList items={[
            "Hälsosam vikt: Förebygger övervikt och fetma",
            "Bättre matsmältning: Kroppen hinner bryta ner maten ordentligt",
            "Stabil energi: Undvik blodsockertoppar och dalar",
            "Minskar risk för sjukdom: Övervikt ökar risk för diabetes, hjärtsjukdom och cancer",
            "Bättre relation till mat: Mindre skuldkänslor och mer glädje"
          ]} />
          
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="satiety">
              <AccordionTrigger className={bodyText}>Varför tar det 20 minuter att känna mättnad?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Mättnadssignaler från magen och tarmen tar tid att nå hjärnan. Hormonet leptin som signalerar mättnad frigörs gradvis under måltiden. När du äter snabbt hinner du äta för mycket innan mättnadssignalerna når fram. Genom att äta långsamt och tugga ordentligt ger du kroppen tid att registrera mättnad och du äter därför mindre.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="plate-model">
              <AccordionTrigger className={bodyText}>Hur fungerar tallriksmodellen?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Tallriksmodellen hjälper dig att få rätt proportioner: halva tallriken grönsaker ger fibrer och mättnad med låg energitäthet, en fjärdedel kolhydrater ger energi, och en fjärdedel protein bygger och reparerar vävnader. Denna fördelning ger balanserad näring, mättnad och hjälper viktkontrollen. Använd en mindre tallrik för automatiskt mindre portioner.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="mindful-eating">
              <AccordionTrigger className={bodyText}>Vad är medvetet ätande?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Medvetet ätande innebär att fokusera helt på måltiden utan distraktion från TV, mobil eller dator. Du är uppmärksam på matens smak, lukt och konsistens, och lyssnar på kroppens hunger- och mättnadssignaler. Detta leder till mindre överätning, bättre matsmältning och en sundare relation till mat. Ät vid bordet och njut av varje tugga.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <h2 className={sectionHeading2}>Tips för lagom portioner</h2>
          <p className={bodyText}>Så kan du äta mindre utan att känna dig hungrig</p>
          <DottedList items={[
            "Använd mindre tallrikar - det lurar hjärnan att tro du äter mer",
            "Drick ett glas vatten innan måltiden",
            "Börja med grönsaker - fyller i magen med låg energi",
            "Lämna inte serveringsskålarna på bordet",
            "Portionera ut maten i köket istället för vid bordet",
            "Ha inte obegränsat med snacks framme hemma"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att planera hur du ska äta lagom portioner, kan du lättare bygga hälsosamma matvanor
          </p>
        </div>

        <div className="mt-2 space-y-2">
          <ExampleCard 
            goal="Använd tallriksmodellen vid lunch och middag"
            when="Alla måltider"
            how="Sätter upp bild på tallriksmodellen i köket"
            reminder="Bild på kylskåpet"
          />

          <ExampleCard 
            goal="Vänta 20 min innan jag tar mer mat"
            when="Middag"
            how="Ställer timer på telefonen"
            reminder="Alarm"
          />

          <ExampleCard 
            goal="Äta långsammare och tugga mer"
            when="Alla måltider"
            how="Lägger ifrån mej bestick mellan tuggorna"
            reminder="Berättar familjen"
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
                tipId={8}
                initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                onSave={handleSavePlan}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <UserPlanForm
              tipId={8}
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

export default LagomPage;
