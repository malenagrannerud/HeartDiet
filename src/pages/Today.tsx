import { useState, useEffect } from "react";
import { Clock, Check, Square, CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { tips } from "@/data/tips";
import TipCard from "@/components/TipCard";
import { pageTitle, sectionHeading, cardTitle, interactiveCard, pageContainer, headerContainer, pagePadding, standardSpacing, cardTitleSmall, pageSubtitle, sectionSubheading2 } from "@/lib/design-tokens";
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
        </header>

        <main className={pagePadding}>
         <div className={standardSpacing.pageContent}>
          <section className={standardSpacing.sectionContent}>
            <h3 className={sectionHeading}>Starta här</h3>
              
            {!hiddenCards.tutorial && (
              <Card 
                className={interactiveCard} 
                onClick={() => handleCardNavigation('tutorial', '/app/tutorial')}
                aria-label="Gå till tutorial"
                >
                <div className="flex items-center gap-3">
                  <CheckBoxLeft isCompleted={completionStatus.tutorial} className="mt-1" />
                  <div>
                    <h4 className={cardTitle}>Så fungerar appen</h4>
                    <div className={`flex items-center gap-2 ${cardTitleSmall}`}>
                      <Clock size={14} strokeWidth={2.5} />
                      <span>5 min</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {!hiddenCards.healthPriorities && (
              <Card 
                className={interactiveCard}
                onClick={() => handleCardNavigation('health-priorities', '/app/health-priorities')}
                aria-label="Gå till mina hälsoprioriteringar"
                >
                <div className="flex items-center gap-3 relative z-10">
                  <CheckBoxLeft isCompleted={completionStatus.healthPriorities} className="mt-1 z-20" />
                  <div className="flex-1">
                    <h4 className={cardTitle}>Mina mål</h4>
                    <div className={`flex items-center gap-2 ${cardTitleSmall}`}>
                      <Clock size={14} strokeWidth={2.5} />
                      <span>4 min</span>
                    </div>
                  </div>
                </div>
                
                {/* Background image covering 1/3 of card on right side */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 overflow-hidden">
                  <img 
                    src={HealthPrioritiesImage}
                    alt="Health goals illustration"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Card>
            )}
              
            {!hiddenCards.healthMetrics && (
              <Card 
                className={interactiveCard} 
                onClick={() => handleCardNavigation('health-metrics', '/app/health-metrics')}
                aria-label="Gå till hälsomätningar"
                >
                <div className="flex items-center gap-3">
                  {/* CheckBoxLeft aligned with text baseline */}
                  <CheckBoxLeft isCompleted={completionStatus.healthMetrics} className="mt-1" />
                  <div>
                    <h4 className={cardTitle}>Vikt och blodtryck</h4>
                  </div>
                </div>
              </Card>
            )}
          </section>

          <section>
              <h3 className={`${sectionHeading} ${standardSpacing.sectionContent}`}>
                Mina tips
              </h3>
              {markedTipsList.length > 0 ? (
                <div className="space-y-4">
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