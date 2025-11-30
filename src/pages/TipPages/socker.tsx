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
import { Candy } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCardCompact } from "@/components/MedCardCompact";
import { useHealthGoalTips } from "@/hooks/use-health-goal-tips";
import { HealthGoalCardCompact } from "@/components/HealthGoalCardCompact";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const SockerPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const medicationInteractions = useMedicationInteractions(11); // tipId: 11 for Socker
  const healthGoalTips = useHealthGoalTips(11);

  useEffect(() => {
    const savedPlans = localStorage.getItem('userPlans-socker');
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
    localStorage.setItem('userPlans-socker', JSON.stringify(updatedPlans));
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    localStorage.setItem('userPlans-socker', JSON.stringify(updatedPlans));
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
      <header className={`${headerContainer} ${tipCardColors.purple}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>Minska på sockret</h1>
          <Candy className="h-8 w-8" />
        </div>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        <p className={sectionSubheading2}>
          Att begränsa tillsatt socker hjälper dig att undvika viktökning, karies och minska risken för typ 2-diabetes och hjärt-kärlsjukdom
        </p>

        <div>
          <h2 className={sectionHeading2}>Vad är tillsatt socker?</h2>
          <p className={bodyText}>Socker som tillsätts vid bearbetning eller hemma, inte naturligt förekommande socker i frukt och mjölk</p>
          <DottedList items={[
            "Vitt socker, farinsocker, muscovadosocker",
            "Honung, sirap, agavesirap",
            "Socker i läsk, saft och energidrycker",
            "Socker i godis, kakor, glass och sötsaker",
            "Gömt socker i såser, dressingar och färdigmat"
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
          <h2 className={sectionHeading2}>Var gömmer sig sockret?</h2>
          <p className={bodyText}>Många produkter innehåller överraskande mycket socker</p>
          <DottedList items={[
            "Läsk och saft: 1 glas = ca 5 sockerbitar",
            "Fruktyoghurt: 1 portion = ca 4 sockerbitar",
            "Ketchup och BBQ-sås: 1 msk = ca 1 sockerbit",
            "Frukostflingor: 1 portion = ca 3-5 sockerbitar",
            "Smoothies på burk: 1 flaska = ca 6-8 sockerbitar",
            "Müslibar: 1 bar = ca 2-3 sockerbitar"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Varför minska på sockret?</h2>
          <p className={bodyText}>För mycket socker leder till</p>
          <DottedList items={[
            "Övervikt: Socker ger energi utan mättnad",
            "Typ 2-diabetes: Överbelastar bukspottkörteln",
            "Karies: Bakterier i munnen trivs på socker",
            "Hjärt-kärlsjukdom: Höjer triglycerider och inflammation",
            "Energidippar: Blodsockertoppar följs av trötthet",
            "Ökad hunger: Socker ger ingen långvarig mättnad"
          ]} />
          
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="diabetes">
              <AccordionTrigger className={bodyText}>Hur leder socker till typ 2-diabetes?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                När du äter mycket socker höjs blodsockret snabbt, vilket tvingar bukspottkörteln att producera mycket insulin. Över tid blir cellerna mindre känsliga för insulin (insulinresistens), och bukspottkörteln måste jobba hårdare. Tillslut kan den inte hänga med, blodsockret förblir högt, och typ 2-diabetes utvecklas. Socker i drycker är särskilt skadligt eftersom det inte ger mättnad.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="energy">
              <AccordionTrigger className={bodyText}>Varför ger socker energidippar?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Socker ger en snabb energikick eftersom det snabbt tas upp i blodet. Men detta triggar en stor insulinfrisättning som snabbt sänker blodsockret igen - ofta till under nivån innan du åt. Detta ger trötthet, dålig koncentration och ökad hunger efter mer socker. Det blir en ond cirkel. Långsamma kolhydrater från fullkorn och baljväxter ger stabil energi utan dippar.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cravings">
              <AccordionTrigger className={bodyText}>Varför är socker så beroendeframkallande?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Socker aktiverar belöningssystemet i hjärnan och frisätter dopamin, precis som droger. Detta skapar en stark koppling mellan socker och välbefinnande. Ju mer socker du äter, desto mer behöver hjärnan för samma belöning. Socker påverkar också hunger- och mättnadshormon, vilket gör att du aldrig blir riktigt mätt. Genom att gradvis minska socker kan du bryta detta beroende.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <h2 className={sectionHeading2}>Så minskar du sockret</h2>
          <p className={bodyText}>Praktiska tips för mindre socker i vardagen</p>
          <DottedList items={[
            "Drick vatten istället för läsk och saft",
            "Välj osötad yoghurt och smaksätt själv med bär",
            "Byt vita bröd mot fullkornsbröd",
            "Ät frukt istället för godis och sötsaker",
            "Läs näringsdeklarationen - undvik produkter där socker är bland de första ingredienserna",
            "Minska gradvis: hälften socker i kaffet, sedan inget"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Naturligt söta alternativ</h2>
          <p className={bodyText}>Tillfredsställ sötsuget med nyttigare alternativ</p>
          <DottedList items={[
            "Färsk frukt: äpplen, bananer, bär",
            "Torkad frukt: dadlar, fikon, aprikoser (i måttliga mängder)",
            "Kanel och vanilj: ger naturlig sötma",
            "Mörk choklad (70%+): mindre socker än mjölkchoklad"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att planera hur du ska minska sockret i din vardag, kan du lättare bygga hälsosamma vanor
          </p>
        </div>

        <div className="mt-2 space-y-2">
          <ExampleCard 
            goal="Drick vatten istället för läsk"
            when="Till alla måltider"
            how="Köper bubbelvatten och citroner"
            reminder="Tar bort läsk från inköpslistan"
          />

          <ExampleCard 
            goal="Osötad yoghurt med bär till frukost"
            when="Varje morgon"
            how="Köper osötad yoghurt och frysta bär"
            reminder="Inköpslista"
          />

          <ExampleCard 
            goal="Frukt som efterrätt istället för glass"
            when="Efter middag"
            how="Har en fruktkorg väl synlig"
            reminder="Köper favorit frukt varje vecka"
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
                tipId={11}
                initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                onSave={handleSavePlan}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <UserPlanForm
              tipId={11}
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

export default SockerPage;
