// pages/TipPages/fruit.tsx
import { useState, useEffect } from "react";
import { UserPlan } from "@/data/tips";
import { pageContainer, headerContainer, pagePadding, sectionHeading, sectionHeading2, bodyText, bodyTextBald, tipCardColors, sectionSubheading2, standardSpacing, bodyWhen, bodyHow} from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanFormDialog } from "@/components/UserPlanFormDialog";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";
import DottedList from "@/components/DottedList";
import ExampleCard from "@/components/exCard";
import { AddPlanButton } from "@/components/AddPlanButton";
import { Apple } from "lucide-react";
import { useMedicationInteractions } from "@/hooks/use-medication-interactions";
import { MedCardCompact } from "@/components/MedCardCompact";
import { useHealthGoalTips } from "@/hooks/use-health-goal-tips";
import { HealthGoalCardCompact } from "@/components/HealthGoalCardCompact";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import fruitsImage from './assets/fg.png'; // or the renamed file


const FruitPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const medicationInteractions = useMedicationInteractions(1); // tipId: 1 for Fruit
  const healthGoalTips = useHealthGoalTips(1);

  useEffect(() => {
    const savedPlans = localStorage.getItem('userPlans-fruit');
    if (savedPlans) {
      setUserPlans(JSON.parse(savedPlans));
    }
  }, []);

  const handleSavePlan = (plan: UserPlan) => {
    let updatedPlans;
    
    if (editingIndex !== null) {
      // Editing existing plan
      updatedPlans = [...userPlans];
      updatedPlans[editingIndex] = plan;
    } else {
      // Adding new plan
      updatedPlans = [...userPlans, plan];
    }
    
    setUserPlans(updatedPlans);
    setEditingIndex(null);
    localStorage.setItem('userPlans-fruit', JSON.stringify(updatedPlans));
  };

  const handleDeletePlan = (index: number) => {
    const updatedPlans = userPlans.filter((_, i) => i !== index);
    setUserPlans(updatedPlans);
    localStorage.setItem('userPlans-fruit', JSON.stringify(updatedPlans));
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
      <header className={`${headerContainer} ${tipCardColors.green}`}>
        <BackToTodayButton />
        <div className="flex items-center justify-between">
          <h1 className={sectionHeading}>Fem om dagen</h1>
          <Apple className="h-8 w-8" />
        </div>
      </header>

      <main className={`${pagePadding} ${standardSpacing.pageContent}`}>
        <p className={sectionSubheading2}>
          Att äta minst fem nävar frukter och grönsaker varje dag hjälper dig att må bättre och minska risken för hjärt-kärlsjukdom. 
          Välj olika sorter och färger för att få i dej alla näringsämnen 
        </p>

        <div> 
          <p className={bodyText}>Till dina fem om dagen räknas</p>
          <DottedList items={[
            "Rotfrukter",
            "Frukt - färska och frysta",
            "Bär - färska och frysta", 
            "Grönsaker - färska, frysta och i maten du lagar",
          ]} />
          <img 
            src={fruitsImage}
            alt="Illustration av olika frukter och grönsaker"
            className="my-4 max-w-full rounded-lg" 
          />
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
          <h2 className={sectionHeading2}>Varför minst fem om dagen?</h2>
          <p className={bodyText}>
            Du mår bättre med ett bättre humör och mindre trötthet eftersom frukt och grönt ger
          </p>
           <Accordion type="multiple" className="mt-4">
             
            <AccordionItem value="immune">
              <AccordionTrigger className={bodyText}> • Stärkt immunförsvar </AccordionTrigger>
              <AccordionContent className={bodyText}>
                Antioxidanter som C-vitamin, E-vitamin och betakaroten skyddar kroppens celler mot skador från fria radikaler. 
                Detta minskar inflammation och oxidativ stress, som är kopplade till hjärtsjukdom, cancer och åldrande. 
                Färgrika grönsaker och frukter innehåller mest antioxidanter.

                C-vitamin	ökar produktionen av vita blodkroppar (lymfocyter och fagocyter). 
                C-vitaminrika frukter/grönsaker är svartvinbär, röd paprika, grön paprika och kiwi, broccoli, jordgubbar.
                
                E-vitamin	skyddar celmembran och förstärker immuncellers svar, speciellt viktigt vid åldrande.
                E-vitaminrika frukter/grönsaker är soltorkade tomater (4,3 mg), spenat (kokt) (2,1 mg), mangold (1,9 mg), avokado (1,7 mg), kiwi / broccoli (ca 1,5 mg)

                A-vitamin / Betakaroten	är avgörande för slemhinnornas hälsa (första försvarslinjen i näsa, lungor, tarm). 
                Reglerar immunceller.	
                A-vitamin finns i sötpotatis, morötter, mangold / spenat, röda paprikor, mango / aprikos

                Flavonoider & övriga antioxidanter reglerar immunresponsen, minskar inflammatorisk stress, och kan hindra virus från att fästa till celler.	
                Finns i bär, druvor, grönt te, citrusfrukt, lök, broccoli.
            
              </AccordionContent>
            </AccordionItem>
             
            <AccordionItem value="energy">
              <AccordionTrigger className={bodyText}> • Energi </AccordionTrigger>
              <AccordionContent className={bodyText}>
                Naturliga Sockerarter + Fibrer	Ger långsam, jämn frisättning av energi. Fibrerna bromsar nedbrytningen och förhindrar energi- och blodsockerkraschar.	Äpplen, päron, bär, morötter, sötpotatis.
                
                B-Vitaminer (B1, B2, B3, B6)	Avgörande för att omvandla mat till energi (ATP) i cellernas kraftverk (mitokondrierna). Utan B-vitaminer fastnar näringen.	Bladgrönsaker, banan, avokado, baljväxter, fullkorn.
                
                Magnesium	Aktiverar de enzymer som behövs för att skapa energi. Dessutom hjälper det musklerna att slappna av, vilket sparar energi.	Spenat, mangold, banan, avokado, baljväxter, nötter.
                
                Järn	bär syret i blodet till cellerna. Spinat, mangold, linser, pumpakärnor, torkade aprikoser.
              </AccordionContent>
            </AccordionItem>
             
            <AccordionItem value="bloodsugar">
              <AccordionTrigger className={bodyText}> • Blodsockerreglering</AccordionTrigger>
              <AccordionContent className={bodyText}>
                
              </AccordionContent>
            </AccordionItem>
             
          </Accordion>
        </div>

        
        <div> 
          <p className={bodyText}>Frukt och grönt minskar risken för hjärtsjukdom eftersom de </p>
          <Accordion type="multiple" className="mt-4">
            
            <AccordionItem value="bloodpressure">
              <AccordionTrigger className={bodyText}> • Sänker blodtrycket</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Kalium och nitrater vidgar blodkärlen och sänker blodtrycket. <br />
                Kalium motverkar effekterna av natrium (salt) och hjälper blodkärlen att slappna av.  
                Kalum finns i bananer, apelsiner, spenat och potatis, fast potatis inte räknas som frukt och grönt. 
                
                
                
                <br />
                Nitrater vidgar blodkärlen. 
                Nitrater finns i bland annat ruccola, spenat, rödbetor, romansallad och selleri.
                Ät en näve per dag för att uppnå och upprätthålla en blodtryckssänkande effekten.
                Nitrater är vattenlösliga. Ät dem råa eller lätt tillagade.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="inflammantion">
              <AccordionTrigger className={bodyText}> • Minskar inflammation</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Antioxidanter som C-vitamin, E-vitamin och betakaroten skyddar kroppens celler mot skador från fria radikaler. Detta minskar inflammation och oxidativ stress, som är kopplade till hjärtsjukdom, cancer och åldrande. Färgrika grönsaker och frukt innehåller mest antioxidanter.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="LDL cholesterole">
              <AccordionTrigger className={bodyText}> • Sänker kolesterolet</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Kalium motverkar effekterna av natrium (salt) och hjälper blodkärlen att slappna av, vilket sänker blodtrycket. Bananer, apelsiner, spenat och potatis är rika på kalium. Ett högre kaliumintag är kopplat till lägre risk för stroke och hjärtsjukdom.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="vessels">
              <AccordionTrigger className={bodyText}> • Förbättrar blodkärlens funktion</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Kalium motverkar effekterna av natrium (salt) och hjälper blodkärlen att slappna av, vilket sänker blodtrycket. Bananer, apelsiner, spenat och potatis är rika på kalium. Ett högre kaliumintag är kopplat till lägre risk för stroke och hjärtsjukdom.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="weight">
              <AccordionTrigger className={bodyText}> • Håller vikten</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Kalium motverkar effekterna av natrium (salt) och hjälper blodkärlen att slappna av, vilket sänker blodtrycket. Bananer, apelsiner, spenat och potatis är rika på kalium. Ett högre kaliumintag är kopplat till lägre risk för stroke och hjärtsjukdom.
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>
        </div>

        <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att tänka ut när och hur du ska äta dina fem om dagen kan du lättare modifiera en plan som passar dej. 
            Ett exempel på hur man kan planera in sina fem om dagen: 
          </p>
        </div>
       
        <div className="mt-2 space-y-2">
                <ExampleCard 
                  goal="En smoothie/dag (ca 2 nävar)"
                  when="Frukost: måndag-fredag"
                  how="Har frysta bär och bananer hemma"
                  reminder="Har bananerna i skål på bordet"
                />

                <ExampleCard 
                  goal="Grönt på smörgåsen (ca 1 näve)"
                  when="Frukost, varje dag"
                  how="Skivar gurka / tomat / paprika färdigt i kylskåpet"
                  reminder="Bild på kylskåpet"
                />

                <ExampleCard 
                  goal="Sallad varje dag (ca 2 nävar)"
                  when="Lunch och middag"
                  how="Förbereder råkostsallad för hela veckan. Varierar med vinjägretter"
                  reminder="-"
                />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="mb-4">
            <h2 className={sectionHeading2}> Plan </h2>
            <p className={bodyText}>
              Ändra din plan eller planer så många gånger du behöver tills det fungerar för dej
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
                tipId={1}
                initialPlan={editingIndex !== null ? userPlans[editingIndex] : undefined}
                onSave={handleSavePlan}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <UserPlanForm
              tipId={1}
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

export default FruitPage;
