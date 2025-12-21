import { cardTextSmallBold } from "@/lib/design-tokens";
import iconImage from "@/assets/icon.png";

interface CardHeartProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeart = ({ children, className = "" }: CardHeartProps) => {
  return (
    <div className={`bg-[#FCFAF7] p-3 border-2 flex items-start gap-2 ${className}`}>
      <img 
        src={iconImage} 
        alt="Tips icon" 
        className="w-5 h-5 flex-shrink-0"
      />
      <p className={cardTextSmallBold}>
        {children}
      </p>
    </div>
  );
};

export default CardHeart;
