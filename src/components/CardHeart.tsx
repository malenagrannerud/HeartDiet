import { bodyText } from "@/lib/design-tokens";
import iconImage from "@/assets/icon.png";

interface CardHeartProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeart = ({ children, className = "" }: CardHeartProps) => {
  return (
    <div className={`bg-[#FCFAF7] p-5 rounded-lg border-2 border-border flex items-start gap-3 ${className}`}>
      <img 
        src={iconImage} 
        alt="Tips icon" 
        className="w-6 h-6 flex-shrink-0"
      />
      <p className={bodyText}>
        {children}
      </p>
    </div>
  );
};

export default CardHeart;
