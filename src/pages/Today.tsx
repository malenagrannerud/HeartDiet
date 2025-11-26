import { useState, useEffect } from "react";
import { StartCard } from "@/components/StartCard";
import { Clock, BookOpen, FileEdit } from "lucide-react"; 
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { tips } from "@/data/tips";
import TipCard from "@/components/TipCard";
import { pageTitle, sectionHeading, cardTitle, interactiveCard, pageContainer, headerContainer, pagePadding, standardSpacing, cardTitleSmall, pageSubtitle, sectionSubheading2, bodyTextBald, bodyBaldSub} from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { markedTipsSchema } from "@/lib/schemas";
import HealthPrioritiesImage from "@/assets/fill.png"; 
import { 
  isCardCompletedToday, 
  cleanupOldCompletions,
  getCardsToHide,
  type CardId 
} from "@/lib/card-completion";
import { Button } from "@/components/ui/button";
import { CheckBoxLeft } from "@/components/CheckBoxLeft";
import { isTipCompletedToday, toggleTipCompletion } from "@/lib/tip-completion";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getCurrentDate, advanceDay } from "@/lib/simulated-date";

interface MarkedTip {
  id: number;
  markedDate: string;
  color: string;
}

const Today = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [markedTips, setMarkedTips] = useState<MarkedTip[]>([]);
  const [completionStatus, setCompletionStatus] = useState({
    tutorial: false,
    healthGoals: false,
    medications: false,
    healthMetrics: false
  });
  const [hiddenCards, setHiddenCards] = useState({
    tutorial: false,
    healthGoals: false,
    medications: false,
    healthMetrics: false
  });
  const [tipCompletions, setTipCompletions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Load marked tips
    const savedTips = getStorageItem('markedTips', markedTipsSchema);
    if (savedTips) {
      setMarkedTips(savedTips as MarkedTip[]);
    }
    
    // Load tip completions for today
    const completions: Record<number, boolean> = {};
    tips.forEach(tip => {
      completions[tip.id] = isTipCompletedToday(tip.id);
    });
    setTipCompletions(completions);
    
    // Clean up old completion records
    cleanupOldCompletions();
    
    // Check completion status for styling
    setCompletionStatus({
      tutorial: isCardCompletedToday('tutorial'),
      healthGoals: isCardCompletedToday('health-goals'),
      medications: isCardCompletedToday('medications'),
      healthMetrics: isCardCompletedToday('health-metrics')
    });
    
    // Check which cards to hide (completed on previous days)
    const cardsToHide = getCardsToHide();
    setHiddenCards({
      tutorial: cardsToHide['tutorial'],
      healthGoals: cardsToHide['health-goals'],
      medications: cardsToHide['medications'],
      healthMetrics: cardsToHide['health-metrics']
    });
    
    // Set up midnight check to hide completed cards
    const now = getCurrentDate();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    
    const midnightTimer = setTimeout(() => {
      const newCardsToHide = getCardsToHide();
      setHiddenCards({
        tutorial: newCardsToHide['tutorial'],
        healthGoals: newCardsToHide['health-goals'],
        medications: newCardsToHide['medications'],
        healthMetrics: newCardsToHide['health-metrics']
      });
      // Reset completion status for new day
      setCompletionStatus({
        tutorial: false,
        healthGoals: false,
        medications: false,
        healthMetrics: false
      });
    }, timeUntilMidnight);
    
    return () => clearTimeout(midnightTimer);
  }, []);

  const markedTipsList = tips.filter(tip => markedTips.some(mt => mt.id === tip.id));

  // Map tip IDs to their individual page routes
  const tipPageRoutes: Record<number, string> = {
    1: '/app/TipPages/fruit',
    2: '/app/TipPages/fullkorn',
    3: '/app/TipPages/fish',
  };

  // Handler for when user navigates to a card
  const handleCardNavigation = (cardId: CardId, path: string) => {
    navigate(path);
  };

  const handleTipClick = (tipId: number) => {
    const route = tipPageRoutes[tipId];
    if (route) {
      navigate(route);
    }
  };

  const handleTipCheckboxToggle = (tipId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = toggleTipCompletion(tipId);
    setTipCompletions(prev => ({
      ...prev,
      [tipId]: newStatus
    }));
    
    const tipTitle = tips.find(t => t.id === tipId)?.title || "Tips";
    toast({
      title: newStatus ? "Tips markerat som gjort!" : "Tips avmarkerat",
      description: newStatus ? `${tipTitle} har sparats för idag` : `${tipTitle} har tagits bort`,
    });
  };

  // Check if all start cards are hidden
  const allStartCardsHidden = hiddenCards.tutorial && hiddenCards.healthGoals && hiddenCards.medications && hiddenCards.healthMetrics;

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
          <h1 className={pageTitle}>Idag</h1>
          <p className={pageSubtitle}>Dagens fokus</p>

           {/* TEMPORARY RESET BUTTON - REMOVE LATER
              <Button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="bg-red-500 text-white p-2 text-sm mt-2"
              >
                🔄 Reset All Data (Testing)
              </Button>
              
               TEMPORARY TEST BUTTON - REMOVE LATER
              <Button 
                onClick={() => {
                  // Advance the simulated date by one day
                  advanceDay();
                  
                  console.log('Advanced to next day');
                  
                  // Reload the page to reflect the new "today"
                  window.location.reload();
                }}
                className="bg-blue-500 text-white p-2 text-sm"
              >
                🔄 Test Next Day
              </Button>
              */}
      </header>

      <main className={pagePadding}>
         <div className={standardSpacing.pageContent}>
            <section className={standardSpacing.sectionContent}>
              <h3 className={bodyTextBald}>Starta här</h3>
        
              {allStartCardsHidden ? (
                <p className={bodyBaldSub}>Alla dina kurser är avklarade. Fokusera på att implementera en ny hälsosam vana!</p>
              ) : (
                <div className="space-y-1">
                  {!hiddenCards.tutorial && (
                    <div className="flex gap-4 items-center">
                      <CheckBoxLeft isCompleted={completionStatus.tutorial} />
                      <div className="flex-1">
                        <StartCard
                          isHidden={false}
                          title="Så fungerar appen"
                          icon={<BookOpen size={12} strokeWidth={2.5} />}
                          label="Kurs"
                          time="5 min"
                          onClick={() => handleCardNavigation('tutorial', '/app/tutorial')}
                          ariaLabel="Gå till tutorial"
                        />
                      </div>
                    </div>
                  )}
                  
                  {!hiddenCards.tutorial && !hiddenCards.healthGoals && (
                    <div className="flex gap-4">
                      <div className="w-5 flex justify-center">
                        <div className="w-0.5 h-2 border-l-2 border-dashed border-gray-300" />
                      </div>
                    </div>
                  )}

                  {!hiddenCards.healthGoals && (
                    <div className="flex gap-4 items-center">
                      <CheckBoxLeft isCompleted={completionStatus.healthGoals} />
                      <div className="flex-1">
                        <StartCard
                          isHidden={false}
                          title="Hälsomål"
                          icon={<FileEdit size={12} strokeWidth={2.5} />}
                          label="Formulär"
                          time="2 min"
                          onClick={() => handleCardNavigation('health-goals', '/app/health-goals')}
                          ariaLabel="Gå till hälsomål"
                          hasImage={true}
                          imageSrc={HealthPrioritiesImage}
                          imageAlt="Health goals illustration"
                        />
                      </div>
                    </div>
                  )}
                  
                  {!hiddenCards.healthGoals && !hiddenCards.medications && (
                    <div className="flex gap-4">
                      <div className="w-5 flex justify-center">
                        <div className="w-0.5 h-2 border-l-2 border-dashed border-gray-300" />
                      </div>
                    </div>
                  )}

                  {!hiddenCards.medications && (
                    <div className="flex gap-4 items-center">
                      <CheckBoxLeft isCompleted={completionStatus.medications} />
                      <div className="flex-1">
                        <StartCard
                          isHidden={false}
                          title="Läkemedel"
                          icon={<FileEdit size={12} strokeWidth={2.5} />}
                          label="Formulär"
                          time="1 min"
                          onClick={() => handleCardNavigation('medications', '/app/medications')}
                          ariaLabel="Gå till läkemedel"
                        />
                      </div>
                    </div>
                  )}
                  
                  {!hiddenCards.medications && !hiddenCards.healthMetrics && (
                    <div className="flex gap-4">
                      <div className="w-5 flex justify-center">
                        <div className="w-0.5 h-2 border-l-2 border-dashed border-gray-300" />
                      </div>
                    </div>
                  )}

                  {!hiddenCards.healthMetrics && (
                    <div className="flex gap-4 items-center">
                      <CheckBoxLeft isCompleted={completionStatus.healthMetrics} />
                      <div className="flex-1">
                        <StartCard
                          isHidden={false}
                          title="Vikt och blodtryck"
                          icon={<FileEdit size={12} strokeWidth={2.5} />}
                          label="Formulär"
                          time="5 min"
                          onClick={() => handleCardNavigation('health-metrics', '/app/health-metrics')}
                          ariaLabel="Gå till hälsomätningar"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            <section className={standardSpacing.sectionContent}>
              <h3 className={bodyTextBald}>Mina tips</h3>
              <p className={bodyBaldSub}>Markera ett tips som färdigt genom att klicka i boxen</p>
              {markedTipsList.length > 0 ? (
                <div className="space-y-4">
                  {markedTipsList.map((tip) => (
                    <div key={tip.id} className="flex gap-4 items-center">
                      <div className="flex-1">
                        <TipCard
                          tip={tip}
                          onClick={() => handleTipClick(tip.id)}
                          isCompleted={tipCompletions[tip.id]}
                        />
                      </div>
                      <div 
                        onClick={(e) => handleTipCheckboxToggle(tip.id, e)}
                        className="cursor-pointer"
                      >
                        <Checkbox 
                          checked={tipCompletions[tip.id] || false}
                          className="h-7 w-7 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={bodyBaldSub}>Välj vilka tips du vill göra under "Tips"</p>
              )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Today;
