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
import { PackageOpen } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCardCompact } from "@/components/MedCardCompact";
import { useHealthGoalTips } from "@/hooks/use-health-goal-tips";
import { HealthGoalCardCompact } from "@/components/HealthGoalCardCompact";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const SaltPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const medicationInteractions = useMedicationInteractions(7); // tipId: 7 for Salt
  const healthGoalTips = useHealthGoalTips(7);

  useEffect(() => {
    const savedPlans = localStorage.getItem('userPlans-salt');
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
    localStorage.setItem('userPlans-salt', JSON.stringify(updatedPlans));
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    localStorage.setItem('userPlans-salt', JSON.stringify(updatedPlans));
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
      <header className={`${headerContainer} ${tipCardColors.graygreen}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>Salt-halt</h1>
          <PackageOpen className="h-8 w-8" />
        </div>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        <p className={sectionSubheading2}>
          Att begränsa salt till max 6 g per dag (ca 1 tesked) sänker blodtrycket och minskar risken för stroke och hjärtsjukdom
        </p>

        <div>
          <h2 className={sectionHeading2}>Var finns saltet?</h2>
          <p className={bodyText}>75% av vårt saltintag kommer från färdigmat och processade livsmedel</p>
          <DottedList items={[
            "Bröd och spannmålsprodukter (20-30%)",
            "Charkuterier och korv",
            "Ost och smör",
            "Färdigrätter och halvfabrikat",
            "Soppor och buljonger",
            "Snacks: chips, nötter, popcorn"
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
          <h2 className={sectionHeading2}>Så minskar du saltet</h2>
          <p className={bodyText}>Praktiska tips för att minska saltintaget</p>
          <DottedList items={[
            "Välj osaltat vid inköp av smör, margarin och nötter",
            "Använd kryddor och örter istället för salt",
            "Läs näringsdeklarationen - välj produkter med lågt saltinnehåll",
            "Laga mat från grunden oftare",
            "Skölj konserverad mat (bönor, linser, majs)",
            "Salta inte maten vid bordet"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Varför minska salt?</h2>
          <p className={bodyText}>För högt saltintag leder till</p>
          <DottedList items={[
            "Högt blodtryck: Salt gör att kroppen lagrar mer vätska",
            "Stroke: Skadade blodkärl i hjärnan",
            "Hjärtinfarkt: Ökad belastning på hjärtat",
            "Njurskador: Njurarna måste arbeta hårdare",
            "Benskörhet: För mycket salt ökar kalciumförlust"
          ]} />
          
          <Accordion type="multiple" className="mt-4">
            <AccordionItem value="blood-pressure">
              <AccordionTrigger className={bodyText}>Hur höjer salt blodtrycket?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Salt (natrium) får kroppen att behålla mer vätska för att späda ut saltet i blodet. Detta ökar blodvolymen, vilket tvingar hjärtat att pumpa hårdare och blodkärlen utsätts för högre tryck. Högt blodtryck skadar kärlväggarna över tid och ökar risken för hjärtinfarkt, stroke och njursjukdom. Att minska salt med 1 g/dag kan sänka blodtrycket med 1-2 mmHg.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="hidden-salt">
              <AccordionTrigger className={bodyText}>Var finns det gömda saltet?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                75% av vårt saltintag kommer inte från saltkaret utan från färdigmat och processade livsmedel. Bröd, ost, charkuterier, korv, färdigrätter, soppor och snacks innehåller ofta mycket salt. Många matvaror smakar inte ens salt trots högt innehåll. Läs näringsdeklarationen - välj produkter med mindre än 0,5 g salt per 100 g. Att laga mat från grunden ger dig kontrollen.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="taste">
              <AccordionTrigger className={bodyText}>Kan smaksinnet anpassa sig till mindre salt?</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Ja! Smaksinnet anpassar sig till lägre saltnivåer inom 2-4 veckor. Minska saltet gradvis så märker du knappt skillnaden, och snart smakar salt mat för salt. Använd kryddor, örter, citron, vitlök och lök för att förstärka smaken istället. Många upplever att mat smakar bättre när de inte överdrivet saltar - de naturliga smakerna kommer fram.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <h2 className={sectionHeading2}>Alternativ till salt</h2>
          <p className={bodyText}>Smaksätt maten med</p>
          <DottedList items={[
            "Örter: basilika, timjan, rosmarin, oregano",
            "Kryddor: paprika, spiskummin, cayennepeppar",
            "Vitlök och lök",
            "Citron och lime",
            "Vinäger"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att planera hur du ska minska saltet i din vardag, kan du lättare nå målet på max 6 g per dag
          </p>
        </div>

        <div className="mt-2 space-y-2">
          <ExampleCard 
            goal="Inte salta vid bordet"
            when="Alla måltider"
            how="Tar bort saltkar från bordet"
            reminder="Berättar familjen"
          />

          <ExampleCard 
            goal="Byta till osaltat smör"
            when="Vid inköp"
            how="Köper osaltat istället"
            reminder="Inköpslista"
          />

          <ExampleCard 
            goal="Krydda med örter istället för salt"
            when="Middagslagning"
            how="Köper färska och torkade örter"
            reminder="Receptkort med kryddtips på kylskåpet"
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
                tipId={7}
                initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                onSave={handleSavePlan}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <UserPlanForm
              tipId={7}
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

export default SaltPage;
