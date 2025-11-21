import { Card } from "@/components/ui/card";
import { Tip } from "@/data/tips";
import { cardTitle } from "@/lib/design-tokens";
import { cardTitleSmall } from "@/lib/design-tokens";
import { standardSpacing } from "@/lib/design-tokens";
import { CheckBoxLeft } from "./CheckBoxLeft";

interface TipCardProps {
  tip: Tip;
  onClick: () => void;
  isCompleted?: boolean;
  onToggleComplete?: (e: React.MouseEvent) => void;
}

const TipCard = ({ tip, onClick, isCompleted = false, onToggleComplete }: TipCardProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div onClick={onToggleComplete}>
        <CheckBoxLeft isCompleted={isCompleted} />
      </div>
      <Card
        className={`flex-1 p-5 hover:shadow-md transition-all cursor-pointer active:scale-[0.98] ${tip.color} border-0 shadow-none min-h-[80px]`}
        onClick={onClick}
      >
        <div className={standardSpacing.cardList}>
          <h3 className={cardTitle}>{tip.title}</h3>
          <div className={cardTitleSmall}>
            {tip.freq} 
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TipCard;
