import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { tips } from "@/data/tips";
import { pageTitle, sectionHeading, cardText, backButton, pageContainer, headerContainer, pagePadding, bodyText, bodyTextBald } from "@/lib/design-tokens";
import { Button } from "@/components/ui/button";

const TipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tip = tips.find((t) => t.id === Number(id));

  if (!tip) {
    return <div>Tip not found</div>;
  }

  return (
    <div className={pageContainer}>
     
      <header 
        className={headerContainer}
        style={{ backgroundColor: tip.color }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className={`${backButton} flex gap-3`}
          >
          <ArrowLeft size={28} className="text-foreground" />
          <span className="text-lg font-semibold text-foreground">Tillbaka</span>
        </Button>
        <h2 className={sectionHeading}>{tip.title}</h2>
      </header>
        
      <div className={pagePadding}>
        <p className={`text-foreground leading-relaxed text-lg`}>{tip.detailedInfo}</p>

        <div className="space-y-4 pt-4">
          {tip.steps.map((step, index) => (
            <div key={index} className="space-y-2">
              <h3 className={bodyTextBald}>
                Steg {index + 1}
              </h3>
              <p className={bodyText}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TipDetail;
