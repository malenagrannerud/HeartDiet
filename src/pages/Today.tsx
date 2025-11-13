import { useState, useEffect } from "react";
import { StartCard } from "@/components/StartCard";
import { Clock, BookOpen, FileEdit } from "lucide-react"; 
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { tips } from "@/data/tips";
import TipCard from "@/components/TipCard";
import { pageTitle, sectionHeading, cardTitle, interactiveCard, pageContainer, headerContainer, pagePadding, standardSpacing, cardTitleSmall, pageSubtitle, sectionSubheading2, bodyTextBald } from "@/lib/design-tokens";
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

interface MarkedTip {
  id: number;
  markedDate: string;
  color: string;
}

const Today = () => {
  const navigate = useNavigate();
  const [markedTips, setMarkedTips] = useState<MarkedTip[]>([]);
  const [completionStatus, setCompletionStatus] = useState({
    tutorial: false,
    healthPriorities: false,
    healthMetrics: false
  });
  const [hiddenCards, setHiddenCards] = useState({
    tutorial: false,
    healthPriorities: false,
    healthMetrics: false
  });

  useEffect(() => {
    // Load marked tips
    const savedTips = getStorageItem('markedTips', markedTipsSchema);
    if (savedTips) {
      setMarkedTips(savedTips as MarkedTip[]);
    }
    
    // Clean up old completion records
    cleanupOldCompletions();
    
    // Check completion status for styling
    setCompletionStatus({
      tutorial: isCardCompletedToday('tutorial'),
      healthPriorities: isCardCompletedToday('health-priorities'),
      healthMetrics: isCardCompletedToday('health-metrics')
    });
    
    // Check which cards to hide (completed on previous days)
    const cardsToHide = getCardsToHide();
    setHiddenCards({
      tutorial: cardsToHide['tutorial'],
      healthPriorities: cardsToHide['health-priorities'],
      healthMetrics: cardsToHide['health-metrics']
    });
    
    // Set up midnight check to hide completed cards
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    
    const midnightTimer = setTimeout(() => {
      const newCardsToHide = getCardsToHide();
      setHiddenCards({
        tutorial: newCardsToHide['tutorial'],
        healthPriorities: newCardsToHide['health-priorities'],
        healthMetrics: newCardsToHide['health-metrics']
      });
      // Reset completion status for new day
      setCompletionStatus({
        tutorial: false,
        healthPriorities: false,
        healthMetrics: false
      });
    }, timeUntilMidnight);
    
    return () => clearTimeout(midnightTimer);
  }, []);

  const markedTipsList = tips.filter(tip => markedTips.some(mt => mt.id === tip.id));

  // Handler for when user navigates to a card
  const handleCardNavigation = (cardId: CardId, path: string) => {
    navigate(path);
  };

  // Check if all start cards are hidden
  const allStartCardsHidden = hiddenCards.tutorial && hiddenCards.healthPriorities && hiddenCards.healthMetrics;

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
          <h1 className={pageTitle}>Idag</h1>
          <p className={pageSubtitle}>Dagens fokus</p>

            {/* TEMPORARY RESET BUTTON - REMOVE LATER */}
                <Button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="bg-red-500 text-white p-2 text-sm mt-2"
                >
                  🔄 Reset All Data (Testing)
                </Button>

                {/* TEMPORARY TEST BUTTON - REMOVE LATER */}
              <Button 
                onClick={() => {
                  const completedCards = JSON.parse(localStorage.getItem('completedCards') || '[]');
                  const today = new Date().toISOString().split('T')[0];
                  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                  
                  console.log('Simulating next day - moving completions from today to yesterday');
                  console.log('Before:', completedCards);
                  
                  // Change today's completions to yesterday's date to simulate passage of time
                  const updatedCards = completedCards.map((card: any) => {
                    if (card.completedDate === today) {
                      return { ...card, completedDate: yesterday };
                    }
                    return card;
                  });
                  
                  localStorage.setItem('completedCards', JSON.stringify(updatedCards));
                  console.log('After (today is now yesterday):', updatedCards);
                  
                  // Now check which cards should be hidden (completed yesterday)
                  const cardsToHide = getCardsToHide();
                  const newCardsToHide = {
                    tutorial: cardsToHide['tutorial'],
                    healthPriorities: cardsToHide['health-priorities'],
                    healthMetrics: cardsToHide['health-metrics'],
                  };
                  
                  console.log('Cards to hide (completed yesterday):', newCardsToHide);
                  
                  setHiddenCards(newCardsToHide);
                  // Reset completion status for the new "today"
                  setCompletionStatus({
                    tutorial: false,
                    healthPriorities: false,
                    healthMetrics: false
                  });
                }}
                className="bg-blue-500 text-white p-2 text-sm"
              >
                🔄 Test Next Day
              </Button>
      </header>

      <main className={pagePadding}>
         <div className={standardSpacing.pageContent}>
            <section className={standardSpacing.sectionContent}>
              <h3 className={bodyTextBald}>Starta här</h3>
              
              {allStartCardsHidden ? (
                <p className={sectionSubheading2}>Alla dina kurser är avklarade. Fokusera på att implementera en ny hälsosam vana!</p>
              ) : (
                <>
                  <StartCard
                    isHidden={hiddenCards.tutorial}
                    isCompleted={completionStatus.tutorial}
                    title="Så fungerar appen"
                    icon={<BookOpen size={12} strokeWidth={2.5} />}
                    label="Kurs"
                    time="5 min"
                    onClick={() => handleCardNavigation('tutorial', '/app/tutorial')}
                    ariaLabel="Gå till tutorial"
                  />

                  <StartCard
                    isHidden={hiddenCards.healthPriorities}
                    isCompleted={completionStatus.healthPriorities}
                    title="Mina mål"
                    icon={<FileEdit size={12} strokeWidth={2.5} />}
                    label="Formulär"
                    time="3 min"
                    onClick={() => handleCardNavigation('health-priorities', '/app/health-priorities')}
                    ariaLabel="Gå till mina hälsoprioriteringar"
                    hasImage={true}
                    imageSrc={HealthPrioritiesImage}
                    imageAlt="Health goals illustration"
                  />

                  <StartCard
                    isHidden={hiddenCards.healthMetrics}
                    isCompleted={completionStatus.healthMetrics}
                    title="Vikt och blodtryck"
                    icon={<FileEdit size={12} strokeWidth={2.5} />}
                    label="Formulär"
                    time="5 min"
                    onClick={() => handleCardNavigation('health-metrics', '/app/health-metrics')}
                    ariaLabel="Gå till hälsomätningar"
                  />
                </>
              )}
            </section>

            <section>
                <h3 className={bodyTextBald }>Mina tips</h3>
                {markedTipsList.length > 0 ? (
                  <div className="space-y-6">
                    {markedTipsList.map((tip) => (
                      <TipCard
                        key={tip.id}
                        tip={tip}
                        isMarked={false}
                        onToggleMark={(e) => e.stopPropagation()}
                        onClick={() => navigate(`/app/tips/${tip.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className={sectionSubheading2}>Välj vilka tips du vill göra under "Tips"</p>
                )}
            </section>
        </div>
      </main>
    </div>
  );
};

export default Today;