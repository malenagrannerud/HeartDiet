// components/StartCard.tsx
import { Card } from "@/components/ui/card";
import { interactiveCard, cardTitle, cardTitleSmall } from "@/lib/design-tokens";
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
      // ONLY CHANGE: Override the background to blue-100, keep all other original classes
      className={`${interactiveCard} bg-blue-100 ${hasImage ? 'relative' : ''} py-3 h-28`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {/* Text container with vertical centering */}
      <div className={`${hasImage ? 'pr-[33%] h-full flex items-center' : 'h-full flex items-center'}`}>
        <div>
          <h4 className={cardTitle}>{title}</h4>
          <div className={`flex items-center gap-2 ${cardTitleSmall} mt-1`}>
            {icon}
            <span>{label}</span>
            <Clock size={12} strokeWidth={2.5} />
            <span>{time}</span>
          </div>
        </div>
      </div>
      
      {/* Image container fixed at bottom with same height */}
      {hasImage && imageSrc && (
        <div className="absolute right-0 bottom-0 w-1/3 h-24">
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
