import { bodyTextSmall } from "@/lib/design-tokens";
import iconImage from "@/assets/icon.png"; // Import your icon image

interface CardHeartProps {
  altText: string;
  className?: string;
}

const CardHeart = ({ altText, className = "" }: CardHeartProps) => {
  return (
    <div className={`sm:w-1/3 flex items-start justify-center sm:justify-end ${className}`}>
      <div className="relative w-full max-w-[140px] sm:max-w-[160px]">
        {/* Your icon.png image */}
        <img 
          src={iconImage} 
          alt={altText} 
          className="w-full h-auto border-2 border-gray-300 shadow-md"
        />
        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <p className={`${bodyTextSmall} text-center text-gray-400 bg-white/80 px-1 py-0.5`}>
            {altText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardHeart;
