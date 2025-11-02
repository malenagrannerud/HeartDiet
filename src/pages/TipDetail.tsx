import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { tips } from "@/data/tips";
import { pageTitle, sectionHeading, cardText, backButton, pageContainer, pagePadding } from "@/lib/design-tokens";
import { Button } from "@/components/ui/button";

const TipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tip = tips.find((t) => t.id === Number(id));

  if (!tip) {
    return <div>Tip not found</div>;
  }

  return (
    <div className={`${pageContainer} pb-16`}>
      {/* Color Header */}
      <div className={`w-full h-[200px] ${tip.color}`}></div>

      {/* Content - CENTRALIZED STYLES */}
      <div className={`${pagePadding} space-y-6`}>
        {/* Back Button - Using Button component */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className={`${backButton} flex gap-3`}
        >
          <ArrowLeft size={28} className="text-foreground" />
          <span className="text-lg font-semibold text-foreground">Tillbaka</span>
        </Button>

        {/* Title - CENTRALIZED */}
        <h1 className={`${pageTitle} leading-tight`}>{tip.title}</h1>

        {/* Description - CENTRALIZED */}
        <p className={`text-foreground leading-relaxed text-lg`}>{tip.detailedInfo}</p>

        {/* Steps - CENTRALIZED */}
        <div className="space-y-4 pt-4">
          {tip.steps.map((step, index) => (
            <div key={index} className="space-y-2">
              <h3 className={`${sectionHeading} text-xl`}>
                Steg {index + 1}
              </h3>
              <p className={`${cardText} text-base leading-relaxed`}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TipDetail;
