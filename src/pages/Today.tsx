import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { tips } from "@/data/tips";
import TipCard from "@/components/TipCard";
import { pageTitle, sectionHeading, sectionSubheading, cardTitle, cardText, standardCard, interactiveCard, pageContainer, pagePadding, cardTitleSmall } from "@/lib/design-tokens";
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

  useEffect(() => {
    const savedTips = getStorageItem('markedTips', markedTipsSchema);
    if (savedTips) {
      setMarkedTips(savedTips as MarkedTip[]);
    }
  }, []);

  const markedTipsList = tips.filter(tip => markedTips.some(mt => mt.id === tip.id));

  return (
    /* STANDARDIZATION: space-y-6 for page sections, space-y-4 for card lists */
    <div className={`${pageContainer} ${pagePadding} space-y-6`}>
  {/* STANDARDIZED HEADER */}
  <header className="mb-6">
    <h1 className={pageTitle}>Idag</h1>
  </header>
      {/* STARTA HÄR SECTION */}
      <div className="space-y-4">
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
        
        {/* Step 3 - STANDARDIZED: Uses interactiveCard for consistent styling */}
        <Card 
          className={interactiveCard}
          onClick={() => navigate('/app/health-metrics')}
          aria-label="Gå till hälsomätningar"
        >
          <div className="flex items-start justify-between">
            <div>
              {/* STANDARDIZED FONT: text-xl via cardTitle */}
              <h4 className={cardTitle}>Vikt och blodtryck</h4>
            </div>
          </div>
        </Card>
      </div>

      {/* MINA TIPS SECTION - TipCards keep their specific colors (not light blue) */}
      <div className="space-y-6">
        <h3 className={sectionSubheading}>Mina tips den här veckan</h3>
        {markedTipsList.length > 0 ? (
          <div className="space-y-4">
            {/* STANDARDIZATION: TipCard uses same padding (p-5), fonts (text-xl/text-base), min-h-80px 
                but keeps tip-specific colors (requirement: tip cards keep their colors) */}
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
          <p className={sectionHeading}>Välj ett eller två tips för veckan under "Tips"</p>
        )}
      </div>
    </div>
  );
};

export default Today;
