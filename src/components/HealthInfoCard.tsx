import { LucideIcon } from "lucide-react";
import { StatsBox } from "@/components/StatsBox";
import { MoreButton } from "@/components/MoreButton";
import { bodyTextBald, cardTextSmallBold, cardTextSmall } from "@/lib/design-tokens";

interface HealthInfoCardProps {
  icon: LucideIcon;
  title: string;
  items: Array<{ id: string; label: string }>;
  emptyMessage: string;
  onClick: () => void;
  buttonLabel?: string;
}

export const HealthInfoCard = ({ 
  icon: Icon, 
  title, 
  items, 
  emptyMessage, 
  onClick,
  buttonLabel = "Ändra"
}: HealthInfoCardProps) => {
  return (
    <StatsBox>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded">
            <Icon size={20} className="text-primary" />
          </div>
          <div>
            <div className={bodyTextBald}>{title}</div>
          </div>
        </div>
        {items.length > 0 ? (
          <div className="space-y-1">
            {items.map((item) => (
              <p key={item.id} className={cardTextSmallBold}>
                • {item.label}
              </p>
            ))}
          </div>
        ) : (
          <p className={cardTextSmall}>{emptyMessage}</p>
        )}
        <div className="flex justify-end">
          <MoreButton label={buttonLabel} onClick={onClick} />
        </div>
      </div>
    </StatsBox>
  );
};
