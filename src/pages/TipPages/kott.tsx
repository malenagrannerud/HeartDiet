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
import { Beef } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCardCompact } from "@/components/MedCardCompact";
import { useHealthGoalTips } from "@/hooks/use-health-goal-tips";
import { HealthGoalCard } from "@/components/HealthGoalCard";

const KottPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const medicationInteractions = useMedicationInteractions(6); // tipId: 6
  const healthGoalTips = useHealthGoalTips(6);

  useEffect(() => {
    const savedPlans = localStorage.getItem('userPlans-kott');
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
    localStorage.setItem('userPlans-kott', JSON.stringify(updatedPlans));
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    localStorage.setItem('userPlans-kott', JSON.stringify(updatedPlans));
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
      <header className={`${headerContainer} ${tipCardColors.darkrose}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>Rött och bearbetat kött</h1>
          <Beef className="h-8 w-8" />
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
          Att begränsa rött och bearbetat kött till max 500 g per vecka minskar risken för hjärt-kärlsjukdom, typ 2-diabetes och vissa cancerformer
        </p>

        <div>
          <h2 className={sectionHeading2}>Vad är rött kött?</h2>
          <p className={bodyText}>Rött kött kommer från däggdjur</p>
          <DottedList items={[
            "Nötkött",
            "Fläskkött",
            "Lammkött",
            "Älg och viltkött",
            "Kalvkött"
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
          <h2 className={sectionHeading2}>Vad är bearbetat kött?</h2>
          <p className={bodyText}>Kött som bearbetats för längre hållbarhet</p>
          <DottedList items={[
            "Korv: falukorv, grillkorv, isterband",
            "Charkuterier: skinka, salami, bacon",
            "Rökt och saltad kött",
            "Konserverat kött",
            "Köttbullar och färdigmat med kött"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Varför begränsa?</h2>
          <p className={bodyText}>Att äta mindre rött och bearbetat kött minskar risken för</p>
          <DottedList items={[
            "Hjärt-kärlsjukdom: Mättat fett höjer kolesterolet",
            "Tjocktarmscancer: Särskilt vid bearbetat kött",
            "Typ 2-diabetes: Bearbetat kött ökar risken",
            "Övervikt: Ofta högt energiinnehåll",
            "Högt blodtryck: På grund av högt saltinnehåll i bearbetat kött"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Alternativ till rött kött</h2>
          <p className={bodyText}>Ersätt med proteinrika alternativ</p>
          <DottedList items={[
            "Fisk och skaldjur",
            "Kyckling och kalkon",
            "Baljväxter: linser, bönor, kikärtor",
            "Ägg",
            "Vegetariska alternativ: tofu, tempeh, Quorn"
          ]} />
        </div>

        <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att planera dina måltider och byta ut några köttmåltider, kan du lättare nå målet på max 500 g per vecka
          </p>
        </div>

        <div className="mt-2 space-y-2">
          <ExampleCard 
            goal="Vegetarisk middag 3 ggr / v."
            when="Måndag, onsdag, fredag"
            how="Planerar veckomeny med baljväxtsrätter"
            reminder="Veckans meny på kylskåpet"
          />

          <ExampleCard 
            goal="Fisk istället för kött 2 ggr / v."
            when="Tisdag och torsdag"
            how="Handlar färdig fisk att laga snabbt"
            reminder="Kalender"
          />

          <ExampleCard 
            goal="Kyckling istället för nöt"
            when="Lördags middag"
            how="Provar nya kycklingrecept"
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
                tipId={6}
                initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                onSave={handleSavePlan}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <UserPlanForm
              tipId={6}
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

export default KottPage;
