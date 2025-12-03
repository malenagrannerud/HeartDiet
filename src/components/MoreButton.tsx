import { cn } from "@/lib/utils";

interface MoreButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const MoreButton = ({ 
  label = "Mer", 
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
        "hover:bg-primary/90 transition-colors",
        className
      )}
    >
      {label}
    </button>
  );
};
