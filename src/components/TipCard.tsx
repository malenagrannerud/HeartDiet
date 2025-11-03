import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Tip } from "@/data/tips";

interface TipCardProps {
  tip: Tip;
  isMarked: boolean;
  onToggleMark: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const TipCard = ({ tip, isMarked, onToggleMark, onClick }: TipCardProps) => {
  return (
    <Card
      /* STANDARDIZATION: 
         - Padding: p-5 (consistent with all cards)
         - Font: text-xl for title, text-base for health score (standardized sizes)
         - Min height: min-h-[80px] (consistent with other cards)
         - Colors: Keeps tip-specific colors from tip.color (requirement: tip cards keep their colors)
         - Background: Uses tip.color - NOT light blue (only non-tip cards are light blue)
      */
      className={`p-5 hover:shadow-md transition-all cursor-pointer active:scale-[0.98] ${tip.color} relative border-0 shadow-none min-h-[80px]`}
      onClick={onClick}
    >
      <div
        className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isMarked ? "bg-blue-900 border-blue-900" : "bg-white/50 border-blue-900/30"
        }`}
        onClick={onToggleMark}
      >
        {isMarked && <Check size={16} className="text-white" strokeWidth={3} />}
      </div>
      <div className="pr-8">
        {/* STANDARDIZED FONT: text-xl for card title */}
        <h3 className={`font-semibold text-xl ${tip.textColor} mb-2`}>{tip.title}</h3>
        {/* STANDARDIZED FONT: text-base for health score */}
        <div className="text-blue-900 text-base font-bold">
          {tip.healthScore} poäng
        </div>
      </div>
    </Card>
  );
};

export default TipCard;
