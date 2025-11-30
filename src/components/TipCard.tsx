import { Card } from "@/components/ui/card";
import { Tip } from "@/data/tips";
import { cardTitle } from "@/lib/design-tokens";
import { cardTitleSmall } from "@/lib/design-tokens";
import { standardSpacing } from "@/lib/design-tokens";
import * as Icons from "lucide-react";

interface TipCardProps {
  tip: Tip;
  onClick: () => void;
  isCompleted?: boolean;
}

const TipCard = ({ tip, onClick, isCompleted = false }: TipCardProps) => {
  const IconComponent = Icons[tip.icon as keyof typeof Icons] as React.ComponentType<any>;
  
  return (
    <Card
      className={`p-5 hover:shadow-md transition-all cursor-pointer active:scale-[0.98] ${tip.color} border-0 shadow-none min-h-[80px] ${
        isCompleted ? 'opacity-60' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-4">
        <div className={standardSpacing.cardList}>
          <h3 className={cardTitle}>{tip.title}</h3>
          <div className={cardTitleSmall}>
            {tip.freq} 
          </div>
        </div>
        {IconComponent && <IconComponent className="w-8 h-8 shrink-0 opacity-70" />}
      </div>
    </Card>
  );
};

export default TipCard;
