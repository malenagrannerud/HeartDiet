import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface MoreButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const MoreButton = ({ 
  label = "Detaljer", 
  onClick,
  className 
}: MoreButtonProps) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full",
        "hover:bg-primary/90 transition-colors inline-flex items-center gap-1",
        className
      )}
    >
      {label}
      <ChevronRight size={14} />
    </button>
  );
};
