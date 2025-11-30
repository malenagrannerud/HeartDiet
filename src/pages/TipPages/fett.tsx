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
import { Droplets } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCard } from "@/components/MedCard";
import { useHealthGoalTips } from "@/hooks/use-health-goal-tips";
import { HealthGoalCard } from "@/components/HealthGoalCard";

const FettPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const medicationInteractions = useMedicationInteractions(4); // tipId: 4 for Fett
  const healthGoalTips = useHealthGoalTips(4);

  useEffect(() => {
    const savedPlans = localStorage.getItem('userPlans-fett');
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
    localStorage.setItem('userPlans-fett', JSON.stringify(updatedPlans));
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    localStorage.setItem('userPlans-fett', JSON.stringify(updatedPlans));
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
      <header className={`${headerContainer} ${tipCardColors.yellow}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>Rätt fett</h1>
          <Droplets className="h-8 w-8" />
        </div>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        {medicationInteractions.length > 0 && (
          <div className="space-y-3 mb-6">
            {medicationInteractions.map(({ medication, interaction }) => (
              <MedCard key={`${medication.id}-${interaction.tipId}`} medication={medication} interaction={interaction} />
            ))}
          </div>
        )}

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
          Att välja rätt typ av fett skyddar hjärtat och sänker kolesterolet. Byt mättat fett mot omättat fett för bättre hälsa
        </p>

        <div>
          <h2 className={sectionHeading2}>Goda fetter - omättade</h2>
          <p className={bodyText}>Dessa fetter är bra för hjärtat och hjälper till att sänka kolesterolet</p>
          <DottedList items={[
            "Flytande matfetter: rapsolja, olivolja, solrosolja",
            "Flytande matfett på smörgås",
            "Nötter och frön: mandel, valnötter, cashew, solrosfrön",
            "Fet fisk: lax, makrill, sill",
            "Avokado"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Undvik mättat fett</h2>
          <p className={bodyText}>Begränsa dessa eftersom de höjer det onda kolesterolet (LDL)</p>
          <DottedList items={[
            "Smör och hårt matfett",
            "Feta mejeriproukter: grädde, crème fraiche",
            "Fett kött och charkuterier",
            "Kokosolja och palmolja",
            "Bakverk och sötsaker med mycket smör"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Varför rätt fett?</h2>
          <p className={bodyText}>Omättade fetter ger flera hälsofördelar</p>
          <DottedList items={[
            "Sänker LDL-kolesterol: Minskar risken för åderförkalkning",
            "Höjer HDL-kolesterol: Det 'goda' kolesterolet som skyddar hjärtat",
            "Anti-inflammatoriskt: Omega-3 minskar inflammation i kroppen",
            "Sänker blodtryck: Bidrar till friskare blodkärl",
            "Hjärnhälsa: Omega-3 är viktigt för hjärnans funktion"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att tänka ut hur du ska byta till nyttigare fetter, kan du lättare modifiera en plan som passar dej
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
