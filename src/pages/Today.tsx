import { useState, useEffect } from "react";
import { Clock, Check, Square, CheckSquare } from "lucide-react"; // Added checkbox icons
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
        </header>

        <main className={pagePadding}>
         <div className={standardSpacing.pageContent}>
          <section className={standardSpacing.sectionContent}>
            <h3 className={sectionHeading}>Starta här</h3>
              
            {!hiddenCards.tutorial && (
              <Card 
                className={`${interactiveCard} ${completionStatus.tutorial ? 'bg-green-50 border-green-200' : ''}`}
                onClick={() => handleCardNavigation('tutorial', '/app/tutorial')}
                aria-label="Gå till tutorial"
                >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <div className="flex-shrink-0">
                      {completionStatus.tutorial ? (
                        <CheckSquare size={20} className="text-green-600" fill="currentColor" />
                      ) : (
                        <Square size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className={cardTitle}>Så fungerar appen</h4>
                      <div className={`flex items-center gap-2 ${cardTitleSmall}`}>
                        <Clock size={14} strokeWidth={2.5} />
                        <span>5 min</span>
                      </div>
                    </div>
                  </div>
                  {completionStatus.tutorial && (
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Check size={16} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </Card>
            )}

            {!hiddenCards.healthPriorities && (
              <Card 
                className={`${interactiveCard} ${completionStatus.healthPriorities ? 'bg-green-50 border-green-200' : ''} relative overflow-hidden`}
                onClick={() => handleCardNavigation('health-priorities', '/app/health-priorities')}
                aria-label="Gå till mina hälsoprioriteringar"
                >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 z-20">
                      {completionStatus.healthPriorities ? (
                        <CheckSquare size={20} className="text-green-600" fill="currentColor" />
                      ) : (
                        <Square size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={cardTitle}>Mina mål</h4>
                      <div className={`flex items-center gap-2 ${cardTitleSmall}`}>
                        <Clock size={14} strokeWidth={2.5} />
                        <span>4 min</span>
                      </div>
                    </div>
                  </div>
                  {completionStatus.healthPriorities && (
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 z-20">
                      <Check size={16} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
                
                {/* Background image covering 1/3 of card on right side */}
                <img 
                  src={HealthPrioritiesImage}
                  alt="Health goals illustration"
                  className="absolute right-0 top-0 h-full w-1/3 object-cover z-0"
                />
              </Card>
            )}
              
            {!hiddenCards.healthMetrics && (
              <Card 
                className={`${interactiveCard} ${completionStatus.healthMetrics ? 'bg-green-50 border-green-200' : ''}`}
                onClick={() => handleCardNavigation('health-metrics', '/app/health-metrics')}
                aria-label="Gå till hälsomätningar"
                >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <div className="flex-shrink-0">
                      {completionStatus.healthMetrics ? (
                        <CheckSquare size={20} className="text-green-600" fill="currentColor" />
                      ) : (
                        <Square size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className={cardTitle}>Vikt och blodtryck</h4>
                    </div>
                  </div>
                  {completionStatus.healthMetrics && (
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Check size={16} className="text-white" strokeWidth={3} />
                    </div>
                  )}
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