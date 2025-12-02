import { useState, useEffect } from "react";
import { StartCard } from "@/components/StartCard";
import { Clock, BookOpen, FileEdit } from "lucide-react"; 
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { tips } from "@/data/tips";
import TipCard from "@/components/TipCard";
import { pageTitle, sectionHeading, cardTitle, interactiveCard, pageContainer, headerContainer, pagePadding, standardSpacing, cardTitleSmall, pageSubtitle, sectionSubheading2, bodyTextBald, bodyBaldSub, colors} from "@/lib/design-tokens";
import welcomeIllustration from "@/assets/welcome-illustration.png";
import { useLatestHealthMetric } from '@/hooks/useHealthMetrics';
import { useMarkedTips } from '@/hooks/useMarkedTips';
import { useCardCompletion } from '@/hooks/useCardCompletion';
import { isTipCompletedToday, toggleTipCompletion } from "@/lib/tip-completion";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getCurrentDate, advanceDay } from "@/lib/simulated-date";
import { tipPageRoutes } from "@/lib/tip-routes";

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

  // NEW: Replace getStorageItem with useQuery
  const { data: latestHealthMetric, isLoading: healthMetricLoading } = useLatestHealthMetric();
  const { data: markedTipsData, isLoading: markedTipsLoading } = useMarkedTips();
  const { data: cardCompletionData, isLoading: cardCompletionLoading } = useCardCompletion();

  useEffect(() => {
    // NEW: Use marked tips from database
    if (markedTipsData) {
      setMarkedTips(markedTipsData);
    }
    
    // Load tip completions for today
    const completions: Record<number, boolean> = {};
    tips.forEach(tip => {
      completions[tip.id] = isTipCompletedToday(tip.id);
    });
    setTipCompletions(completions);
    
    // NEW: Use card completion data from database
    if (cardCompletionData) {
      // Check completion status for styling
      setCompletionStatus({
        tutorial: isCardCompletedToday('tutorial', cardCompletionData),
        healthGoals: isCardCompletedToday('health-goals', cardCompletionData),
        medications: isCardCompletedToday('medications', cardCompletionData),
        healthMetrics: isCardCompletedToday('health-metrics', cardCompletionData)
      });
      
      // Check which cards to hide (completed on previous days)
      const cardsToHide = getCardsToHide(cardCompletionData);
      setHiddenCards({
        tutorial: cardsToHide['tutorial'],
        healthGoals: cardsToHide['health-goals'],
        medications: cardsToHide['medications'],
        healthMetrics: cardsToHide['health-metrics']
      });
    }
    
    // Set up midnight check to hide completed cards
    const now = getCurrentDate();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    
    const midnightTimer = setTimeout(() => {
      if (cardCompletionData) {
        const newCardsToHide = getCardsToHide(cardCompletionData);
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
      }
    }, timeUntilMidnight);
    
    return () => clearTimeout(midnightTimer);
  }, [markedTipsData, cardCompletionData]);

  const markedTipsList = tips.filter(tip => markedTips.some(mt => mt.id === tip.id));

  // Handler for when user navigates to a card
  const handleCardNavigation = (cardId: string, path: string) => {
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

  // Show loading state while fetching data
  if (healthMetricLoading || markedTipsLoading || cardCompletionLoading) {
    return (
      <div className={pageContainer}>
        <div className="min-h-screen flex items-center justify-center">
          <p>Laddar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
          <h1 className={pageTitle}>Idag</h1>
          <p className={pageSubtitle}>Dagens fokus</p>
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
                      <div className="w-5 flex justify-center">
                        <div className={`w-5 h-5 rounded-full ${completionStatus.tutorial ? 'bg-green-500' : 'bg-gray-200'}`} />
                      </div>
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
                      <div className="w-5 flex justify-center">
                        <div className={`w-5 h-5 rounded-full ${completionStatus.healthGoals ? 'bg-green-500' : 'bg-gray-200'}`} />
                      </div>
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
                          imageSrc={welcomeIllustration}
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
                      <div className="w-5 flex justify-center">
                        <div className={`w-5 h-5 rounded-full ${completionStatus.medications ? 'bg-green-500' : 'bg-gray-200'}`} />
                      </div>
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
                      <div className="w-5 flex justify-center">
                        <div className={`w-5 h-5 rounded-full ${completionStatus.healthMetrics ? 'bg-green-500' : 'bg-gray-200'}`} />
                      </div>
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
              <p className={bodyBaldSub}>
                {markedTipsList.length > 0 
                  ? "Markera ett tips som färdigt genom att klicka i boxen"
                  : "Välj vilka tips du vill göra under \"Tips\""}
              </p>
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
                          className="h-7 w-7 transition-all duration-200"
                          style={{
                            '--primary': '162 95% 31%',
                          } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
          </section>
        </div>
      </main>
    </div>
  );
};

// Helper functions that now accept database data
const isCardCompletedToday = (cardId: string, cardCompletionData: any[]) => {
  const today = getCurrentDate().toISOString().split('T')[0];
  return cardCompletionData?.some(
    (card: any) => card.card_id === cardId && card.completed_date === today
  ) || false;
};

const getCardsToHide = (cardCompletionData: any[]) => {
  const today = getCurrentDate().toISOString().split('T')[0];
  const cardsToHide = {
    tutorial: false,
    'health-goals': false,
    medications: false,
    'health-metrics': false
  };
  
  cardCompletionData?.forEach((card: any) => {
    if (card.completed_date && card.completed_date !== today) {
      if (card.card_id in cardsToHide) {
        cardsToHide[card.card_id as keyof typeof cardsToHide] = true;
      }
    }
  });
  
  return cardsToHide;
};

export default Today;
