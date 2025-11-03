import { useParams, useNavigate } from "react-router-dom";
import { tips } from "@/data/tips";
import { sectionHeading,sectionHeading2, cardText, backButton, pageContainer, pagePadding, bodyText } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";

const TipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tip = tips.find((t) => t.id === Number(id));

  if (!tip) {
    return <div>Tip not found</div>;
  }

  return (
    <div className={pageContainer}>
      <div className={`w-full h-[200px] ${tip.color}`}></div>

      <div className={pagePadding}>
        <BackToTodayButton />
        <h2 className={sectionHeading}>{tip.title}</h2>
        <p className={`text-foreground leading-relaxed text-lg`}>{tip.detailedInfo}</p>

        <div className="space-y-4 pt-4">
          {tip.steps.map((step, index) => (
            <div key={index} className="space-y-2">
              <h3 className={sectionHeading2}>
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
