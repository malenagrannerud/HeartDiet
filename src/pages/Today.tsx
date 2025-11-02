import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { tips } from "@/data/tips";
import TipCard from "@/components/TipCard";

import { Button } from "@/components/ui/button";
import { pageTitle, pageSubtitle, sectionHeading, sectionSubheading, cardTitle, cardText, cardTextSmall, standardCard, interactiveCard, pageContainer, pagePadding, iconButton, headerContainer, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { markedTipsSchema, completedActivitiesSchema } from "@/lib/schemas";

interface MarkedTip {
  id: number;
  markedDate: string;
  color: string;
}

interface CompletedActivity {
  id: string;
  title: string;
  completedDate: string;
  type: 'tutorial' | 'health-priorities' | 'health-metrics';
}

const Today = () => {
  const navigate = useNavigate();
  const [markedTips, setMarkedTips] = useState<MarkedTip[]>([]);

  useEffect(() => {
    const savedTips = getStorageItem('markedTips', markedTipsSchema);
    if (savedTips) {
      setMarkedTips(savedTips as MarkedTip[]);
    }
  }, []);

  const markedTipsList = tips.filter(tip => markedTips.some(mt => mt.id === tip.id));

  return (
    <div className={pageContainer}>
      {/* HEADER CONTAINER */}
      <header className={headerContainer}>
        <div>
          <h1 className={pageTitle}>Idag</h1>
        </div>
      </header>

      {/* FIRST PAGE PADDING: Starta här and down */}
      <div className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          <div className={standardSpacing.sectionContent}>
            <h3 className={sectionHeading}>Starta här</h3>
            
            <div className={standardSpacing.cardList}>
              <Card 
                className={interactiveCard}
                onClick={() => navigate('/app/tutorial')}
                aria-label="Gå till tutorial"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={cardTitle}>Så fungerar appen</h4>
                    <div className={cardTextSmall}>
                      ◷ 5 min
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
                    <div className={cardTextSmall}>
                      ◷ 5 min
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
            </div>
          </div>
        </div>
      </div>

      {/* SECOND PAGE PADDING: Mina tips den här veckan and down */}
      <div className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          <div className={standardSpacing.sectionContent}>
            <h3 className={sectionHeading}>Mina tips den här veckan</h3>
            {markedTipsList.length > 0 ? (
              <div className={standardSpacing.cardList}>
                {markedTipsList.map((tip) => (
                  <TipCard
                    key={tip.id}
                    tip={tip}
                    isMarked={true}
                    onToggleMark={(e) => e.stopPropagation()}
                    onClick={() => navigate(`/app/tips/${tip.id}`)}
                  />
                ))}
              </div>
            ) : (
              <p className={sectionSubheading}>Välj ett eller två tips för veckan under "Tips"</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Today;