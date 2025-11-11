import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { tips } from "@/data/tips";
import TipCard from "@/components/TipCard";
import { pageTitle, sectionHeading, sectionSubheading, cardTitle, cardText, standardCard, interactiveCard, pageContainer, headerContainer, pagePadding, standardSpacing, cardTitleSmall, pageSubtitle, sectionSubheading2 } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { markedTipsSchema } from "@/lib/schemas";


interface MarkedTip {
  id: number;
  markedDate: string;
  color: string;
}

const Today = () => {
  const navigate = useNavigate();
  const [markedTips, setMarkedTips] = useState<MarkedTip[]>([]);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [healthPrioritiesCompleted, setHealthPrioritiesCompleted] = useState(false);
  const [healthMetricsCompleted, setHealthMetricsCompleted] = useState(false);

  useEffect(() => {
    const savedTips = getStorageItem('markedTips', markedTipsSchema);
    if (savedTips) {
      setMarkedTips(savedTips as MarkedTip[]);
    }
    
    // Check completion status
    setTutorialCompleted(localStorage.getItem('tutorialCompleted') === 'true');
    setHealthPrioritiesCompleted(localStorage.getItem('healthPrioritiesCompleted') === 'true');
    setHealthMetricsCompleted(localStorage.getItem('healthMetricsCompleted') === 'true');
  }, []);

  const markedTipsList = tips.filter(tip => markedTips.some(mt => mt.id === tip.id));

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
              
            <Card 
                className={interactiveCard}
                onClick={() => navigate('/app/tutorial')}
                aria-label="Gå till tutorial"
                >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={cardTitle}>Så fungerar appen</h4>
                    <div className={`flex items-center gap-2 ${cardTitleSmall}`}>
                      <Clock size={14} strokeWidth={2.5} />
                      <span>5 min</span>
                    </div>
                  </div>
                </div>
            </Card>
          
            <Card 
                className={interactiveCard}
                onClick={() => navigate('/app/health-priorities')}
                aria-label="Gå till mina hälsoprioriteringar"
                >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={cardTitle}>Anpassa tips efter mina mål</h4>
                    <div className={`flex items-center gap-2 ${cardTitleSmall}`}>
                      <Clock size={14} strokeWidth={2.5} />
                      <span>4 min</span>
                    </div>
                  </div>
                </div>
            </Card>
              
            <Card 
                className={interactiveCard}
                onClick={() => navigate('/app/health-metrics')}
                aria-label="Gå till hälsomätningar"
                >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={cardTitle}>Vikt och blodtryck</h4>
                  </div>
                </div>
            </Card>
          </section>

          <section>
              <h3 className={`${sectionHeading} ${standardSpacing.sectionContent}`}>
                Mina tips den här veckan
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
                <p className={sectionSubheading2}>Välj ett eller två tips för veckan under "Tips"</p>
              )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Today;