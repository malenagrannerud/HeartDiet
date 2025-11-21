import { Card } from "@/components/ui/card";
import { interactiveCard, cardTitle, cardTitleSmall } from "@/lib/design-tokens";
import { Clock, BookOpen, FileEdit } from "lucide-react"; 

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
  imageAlt
}: StartCardProps) => {
  if (isHidden) return null;

  return (
    <Card 
      className={`${interactiveCard} ${hasImage ? 'relative' : ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <div className="flex items-start gap-3">
        <div className={hasImage ? "flex-1" : ""}>
          <h4 className={cardTitle}>{title}</h4>
          <div className={`flex items-center gap-2 ${cardTitleSmall} mt-2`}>
            {icon}
            <span>{label}</span>
            <Clock size={12} strokeWidth={2.5} />
            <span>{time}</span>
          </div>
        </div>
      </div>
      
      {hasImage && imageSrc && (
        <div className="absolute right-0 top-0 bottom-0 w-1/3 overflow-hidden">
          <img 
            src={imageSrc}
            alt={imageAlt || ""}
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </Card>
  );
};