import { Square, Check } from "lucide-react";

interface CheckBoxLeftProps {
  isCompleted: boolean;
  className?: string;
}

export const CheckBoxLeft = ({ isCompleted, className = "" }: CheckBoxLeftProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {isCompleted ? (
        <div className="w-5 h-5 border-2 border-primary rounded flex items-center justify-center bg-background">
          <Check size={14} className="text-primary" strokeWidth={3} />
        </div>
      ) : (
        <div className="w-5 h-5 border-2 border-muted-foreground rounded bg-background" />
      )}
    </div>
  );
};