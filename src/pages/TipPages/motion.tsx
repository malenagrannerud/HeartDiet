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
import { Footprints } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCardCompact } from "@/components/MedCardCompact";
import { useHealthGoalTips } from "@/hooks/use-health-goal-tips";
import { HealthGoalCard } from "@/components/HealthGoalCard";

const MotionPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const medicationInteractions = useMedicationInteractions(9); // tipId: 9 for Motion
  const healthGoalTips = useHealthGoalTips(9);

  useEffect(() => {
    const savedPlans = localStorage.getItem('userPlans-motion');
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
    localStorage.setItem('userPlans-motion', JSON.stringify(updatedPlans));
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    localStorage.setItem('userPlans-motion', JSON.stringify(updatedPlans));
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
      <header className={`${headerContainer} ${tipCardColors.lightgreen}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>30 min om dagen</h1>
          <Footprints className="h-8 w-8" />
        </div>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        {/* Health goal tips */}
        {healthGoalTips.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className={sectionHeading2}>Personliga tips baserat på dina hälsomål</h3>
            {healthGoalTips.map((tip) => (
              <HealthGoalCard key={`${tip.goalId}-${tip.tipId}`} tip={tip} />
            ))}
          </div>
        )}

        <p className={sectionSubheading2}>
          Att röra på dej minst 30 minuter varje dag stärker hjärtat, sänker blodtrycket och minskar risken för hjärt-kärlsjukdom, stroke och typ 2-diabetes
        </p>

        <div>
          <h2 className={sectionHeading2}>Vad räknas som fysisk aktivitet?</h2>
          <p className={bodyText}>Aktiviteter som får pulsen upp och andningen att öka</p>
          <DottedList items={[
            "Snabbgång eller promenad i rask takt",
            "Cykling",
            "Simning",
            "Dans",
            "Trädgårdsarbete",
            "Städning och tyngre hushållsarbete",
            "Träning på gym eller hemma"
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

        <div>
          <h2 className={sectionHeading2}>Varför 30 minuter om dagen?</h2>
          <p className={bodyText}>Regelbunden fysisk aktivitet ger många hälsofördelar</p>
          <DottedList items={[
            "Stärker hjärtat: Minskar risk för hjärtinfarkt med 30-50%",
            "Sänker blodtrycket: Hjälper blodkärlen att slappna av",
            "Förbättrar blodsockret: Minskar risk för typ 2-diabetes",
            "Stärker benen: Förebygger benskörhet",
            "Bättre psykisk hälsa: Minskar stress, oro och depression",
            "Hjälper viktminskning: Ökar energiförbrukningen"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Intensitet</h2>
          <p className={bodyText}>Du behöver inte springa maraton - måttlig intensitet räcker</p>
          <DottedList items={[
            "Måttlig intensitet: Du andas snabbare men kan prata i hela meningar",
            "Kan promenera, cykla lugnt, eller dansa",
            "Dela upp i 10-minuterspass om det passar bättre",
            "Varje steg räknas - ta trapporna, gå av bussen tidigare",
            "Kombinera med muskelträning 2 gånger per vecka för bästa effekt"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Tips för att komma igång</h2>
          <p className={bodyText}>Så ökar du din fysiska aktivitet</p>
          <DottedList items={[
            "Börja smått - 10 minuter är bättre än ingenting",
            "Gör det roligt - välj aktiviteter du tycker om",
            "Boka in det - sätt en fast tid i kalendern",
            "Ta med en vän - socialt och motiverande",
            "Sätt upp ett stegmål - 10 000 steg om dagen",
            "Bygg in aktivitet i vardagen - cykla till jobbet, gå i lunchen"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att planera när och hur du ska röra på dej 30 minuter varje dag, kan du lättare bygga en hållbar rutin
          </p>
        </div>

        <div className="mt-2 space-y-2">
          <ExampleCard 
            goal="Promenera 30 min / dag"
            when="Efter jobbet kl 17:00"
            how="Går en rond i området"
            reminder="Kalenderbokning"
          />

          <ExampleCard 
            goal="Cykla till jobbet (15 min x 2)"
            when="Måndag, onsdag, fredag"
            how="Lagar cykeln, köper cykelkorg"
            reminder="Lägger fram cykelkläder kvällen innan"
          />

          <ExampleCard 
            goal="Gympa hemma 30 min"
            when="Tisdag och torsdag morgon kl 07:00"
            how="Följer träningsprogram på YouTube"
            reminder="Alarm"
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
                tipId={9}
                initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                onSave={handleSavePlan}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <UserPlanForm
              tipId={9}
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

export default MotionPage;
