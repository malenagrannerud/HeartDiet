import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsBoxProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const StatsBox = ({ children, onClick, className }: StatsBoxProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border bg-background",
        onClick && "cursor-pointer hover:border-primary/50 transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
};
