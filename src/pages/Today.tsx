import { useState, useEffect } from "react";
import { StartCard } from "@/components/StartCard";
import { BookOpen, ChevronRight, FileEdit } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { tips } from "@/data/tips";
import TipCard from "@/components/TipCard";
import { pageTitle, pageContainer, headerContainer, pagePadding, standardSpacing, pageSubtitle, bodyTextBald, bodyBaldSub } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { markedTipsSchema } from "@/lib/schemas";
import HealthPrioritiesImage from "@/assets/formManBrown.png"; 
import FormManOrange from "@/assets/formManOrange.png"; 
import ReadLady from "@/assets/readLady.png"; 
import { 
  isCardCompletedToday, 
  cleanupOldCompletions,
  getCardsToHide,
  type CardId 
} from "@/lib/card-completion";
import { CheckBoxLeft } from "@/components/CheckBoxLeft";
import { isTipCompletedToday, toggleTipCompletion } from "@/lib/tip-completion";
import { useToast } from "@/hooks/use-toast";
import { getCurrentDate } from "@/lib/simulated-date";
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

  useEffect(() => {
    const savedTips = getStorageItem('markedTips', markedTipsSchema);
    if (savedTips) {
      setMarkedTips(savedTips as MarkedTip[]);
    }
    
    const completions: Record<number, boolean> = {};
    tips.forEach(tip => {
      completions[tip.id] = isTipCompletedToday(tip.id);
    });
    setTipCompletions(completions);
    
    cleanupOldCompletions();
    
    setCompletionStatus({
      tutorial: isCardCompletedToday('tutorial'),
      healthGoals: isCardCompletedToday('health-goals'),
      medications: isCardCompletedToday('medications'),
      healthMetrics: isCardCompletedToday('health-metrics')
    });
    
    const cardsToHide = getCardsToHide();
    setHiddenCards({
      tutorial: cardsToHide['tutorial'],
      healthGoals: cardsToHide['health-goals'],
      medications: cardsToHide['medications'],
      healthMetrics: cardsToHide['health-metrics']
    });
    
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

return (
  <div className={pageContainer}>
    <header className={headerContainer}>
      <h1 className={pageTitle}>Idag</h1>
      <p className={pageSubtitle}>Välkommen Rosita</p>
    </header>

    <main className={`${pagePadding} pb-24`}>
      <div className={standardSpacing.pageContent}>
        
        <section className={standardSpacing.sectionContent}>
          <h3 className={bodyTextBald}>Dagens mål</h3>
          
          <div className="space-y-3">
            {markedTipsList.length > 0 ? (
              markedTipsList.map(tip => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  onClick={() => handleTipClick(tip.id)}
                  isCompleted={tipCompletions[tip.id] || false}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Inga tips valda för idag</p>
                <button
                  onClick={() => navigate('/app/tips')}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <BookOpen size={18} />
                  Välj tips här
                </button>
              </div>
            )}
          </div>
        </section>

        <section className={standardSpacing.sectionContent}>
          {/* Empty section as requested */}
        </section>

      </div>

      <div className="fixed bottom-20 left-0 right-0 p-4 bg-transparent z-10">        
        <button
          onClick={() => navigate('/app/food-diary')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-md transition-all duration-200 active:scale-95 flex items-center justify-between"
          aria-label="Gå till matdagbok"
        >
          <div className="flex-1 text-center">
            <span>Skriv i min dagbok</span>
          </div>
          <ChevronRight size={24} strokeWidth={3} className="opacity-90" />
        </button>
      </div>
    </main>
  </div>
);
}
 
export default Today;