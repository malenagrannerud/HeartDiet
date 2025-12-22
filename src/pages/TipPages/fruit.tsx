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
import fruitsImage from './assets/fg.png'; 



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
           <Accordion type="multiple" className="mt-1">
             
            <AccordionItem value="immune">
              <AccordionTrigger className={bodyText}> Stärkt immunförsvar </AccordionTrigger>
              <AccordionContent className={bodyText}>
                Antioxidanter som C-vitamin, E-vitamin och betakaroten skyddar kroppens celler mot skador från fria radikaler. 
                Detta minskar inflammation och oxidativ stress, som är kopplade till hjärtsjukdom, cancer och åldrande. 
                Färgrika grönsaker och frukter innehåller mest antioxidanter.<br /> <br />

                C-vitamin	ökar produktionen av vita blodkroppar (lymfocyter och fagocyter).<br /> 
                C-vitaminrika frukter/grönsaker är svartvinbär, röd paprika, grön paprika och kiwi, broccoli, jordgubbar.
                <br /><br />
                E-vitamin	skyddar celmembran och förstärker immuncellers svar, speciellt viktigt vid åldrande.
                E-vitaminrika frukter/grönsaker är soltorkade tomater (4,3 mg), spenat (kokt) (2,1 mg), mangold (1,9 mg), avokado (1,7 mg), kiwi / broccoli (ca 1,5 mg). 
                <br /><br />

                A-vitamin / Betakaroten	är avgörande för slemhinnornas hälsa (första försvarslinjen i näsa, lungor, tarm). 
                Reglerar immunceller.	
                A-vitamin finns i sötpotatis, morötter, mangold / spenat, röda paprikor, mango / aprikos.
                <br /><br />

                Flavonoider & övriga antioxidanter reglerar immunresponsen, minskar inflammatorisk stress, och kan hindra virus från att fästa till celler.	
                Finns i bär, druvor, grönt te, citrusfrukt, lök, broccoli.
            
              </AccordionContent>
            </AccordionItem>
             
            <AccordionItem value="energy">
              <AccordionTrigger className={bodyText}> Energi </AccordionTrigger>
              <AccordionContent className={bodyText}>
                Du får energi på grund av naturliga sockerarter och fibrer, B-vitaminer, magnesium och järn. 
                <br /> <br />
                Naturliga sockerarter och fibrer	ger långsam, jämn frisättning av energi. 
                Fibrerna bromsar nedbrytningen och förhindrar energi- och blodsockerkraschar.	
               <br /> <br />
                
                B-Vitaminer (B1, B2, B3, B6) är avgörande för att omvandla mat till energi (ATP) i cellernas kraftverk (mitokondrierna). 
                B-vitaminer finns i	Bladgrönsaker, banan, avokado, baljväxter, fullkorn. <br /> <br />
                
                Magnesium	aktiverar de enzymer som behövs för att skapa energi. 
                Dessutom hjälper det musklerna att slappna av, vilket sparar energi.	
                Magnesium finns i spenat, mangold, banan, avokado, baljväxter, nötter. <br /> <br />
                
                Järn	bär syret i blodet till cellerna. Järn finns i spenat, mangold, linser, pumpakärnor och torkade aprikoser.
              </AccordionContent>
            </AccordionItem>
             
            <AccordionItem value="bloodsugar">
              <AccordionTrigger className={bodyText}> Blodsockerreglering  </AccordionTrigger>
              <AccordionContent className={bodyText}>
                Bär, gröna grönsaker och frukt med skal är bäst för blodsockerreglering tack vare högt fiberinnehåll. 
                Undvik juicer, torkad frukt och mycket mogen frukt eller ät dem i små portioner. 
                Nyckeln är att välja hela, ofta bearbetade alternativ och kombinera med protein för blodsockerreglering.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        
        <div> 
          <p className={bodyText}>Frukt och grönt minskar risken för hjärtsjukdom. </p>
          <Accordion type="multiple" className="mt-1">
            
            <AccordionItem value="bloodpressure">
              <AccordionTrigger className={bodyText}> Sänker blodtrycket</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Kalium och nitrater vidgar blodkärlen och sänker blodtrycket. <br /> <br />
                Kalium motverkar effekterna av natrium (salt) och hjälper blodkärlen att slappna av.  
                Kalum finns i bananer, apelsiner, spenat och potatis med skal, fast potatis inte räknas som frukt och grönt. 
                 <br /> <br />
                Nitrater vidgar blodkärlen. 
                Nitrater finns i bland annat ruccola, spenat, rödbetor, romansallad och selleri.
                Ät en näve per dag för att uppnå och upprätthålla en blodtryckssänkande effekten.
                Nitrater är vattenlösliga. Ät dem råa eller lätt tillagade.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="inflammantion">
              <AccordionTrigger className={bodyText}>Minskar inflammation</AccordionTrigger>
              <AccordionContent className={bodyText}>
                Antioxidanter som C-vitamin, E-vitamin och betakaroten skyddar kroppens celler mot skador från fria radikaler. 
                Detta minskar inflammation och oxidativ stress, som är kopplade till hjärtsjukdom, cancer och åldrande. 
                Färgrika grönsaker och frukt innehåller mest antioxidanter.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="LDL cholesterole">
              <AccordionTrigger className={bodyText}> Sänker kolesterolet</AccordionTrigger>
              <AccordionContent className={bodyText}>
              Frukter och grönsaker sänker kolesterol genom att öka fiberintaget. 
              Fiber binder galla (som tillverkas av kolesterol) i tarmarna, 
              så kroppen måste använda mer kolesterol från blodet för att tillverka ny galla. 
              Detta sänker LDL ("ont") kolesterolet.
              <br /> <br />

              Ät hel frukt med skal (inte juice) och många gröna grönsaker. 
              Kombinera gärna med havre, linser och nötter för maximal effekt.
              
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="weight">
              <AccordionTrigger className={bodyText}> Håller vikten</AccordionTrigger>
              <AccordionContent className={bodyText}>
               Frukt och grönsaker minskar inflammation, gör blodkärlen mer flexibla och förhindrar förträngningar 
                – vilket alla tillsammans förstärker och skyddar blodkärlen mot plackbildning.              
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>
        </div>

        <div>
          <h2 className={sectionHeading2}>Nå ditt mål</h2>
          <p className={bodyText}>
            Genom att tänka ut när och hur du ska äta dina fem om dagen kan du lättare modifiera en plan som passar dej. 
            Ett par exempel på hur man kan planera in dina fem om dagen: 
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
