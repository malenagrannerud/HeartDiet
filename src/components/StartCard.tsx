// components/StartCard.tsx
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface StartCardProps {
  isHidden: boolean;
  title: string;
  icon: React.ReactNode;
  label: string;
  time: string;
  onClick: () => void;
  ariaLabel: string;
  hasImage?: boolean;
  imageSrc?: string;
  imageAlt?: string;
}

export const StartCard = ({
  isHidden,
  title,
  icon,
  label,
  time,
  onClick,
  ariaLabel,
  hasImage = false,
  imageSrc,
  imageAlt,
}: StartCardProps) => {
  if (isHidden) return null;

  return (
    <Card 
      // Applied deeper blue: Blue-100 as base with hover to blue-200
      className="p-5 border-0 shadow-sm bg-blue-100 min-h-[80px] cursor-pointer hover:bg-blue-200 transition-all active:scale-[0.98]"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {/* Text container with vertical centering - adjusted for new padding */}
      <div className={`${hasImage ? 'pr-[33%]' : ''} h-full flex items-center`}>
        <div className="w-full">
          {/* Title with deeper blue text (blue-900) */}
          <h4 className="font-semibold text-lg text-blue-900 mb-2">{title}</h4>
          
          {/* Label/time row with medium blue text (blue-700) */}
          <div className="flex items-center gap-2 text-sm text-blue-700">
            {icon}
            <span>{label}</span>
            <Clock size={12} strokeWidth={2.5} className="text-blue-600" />
            <span>{time}</span>
          </div>
        </div>
      </div>
      
      {hasImage && imageSrc && (
        <div className="absolute right-4 bottom-4 w-1/4 h-20">
          <img 
            src={imageSrc}
            alt={imageAlt || ""}
            className="h-full w-auto object-contain"
          />
        </div>
      )}
    </Card>
  );
};
