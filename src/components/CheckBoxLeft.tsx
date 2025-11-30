import { Check } from "lucide-react";
import { colors } from "@/lib/design-tokens";

interface CheckBoxLeftProps {
  isCompleted: boolean;
  className?: string;
}

export const CheckBoxLeft = ({ isCompleted, className = "" }: CheckBoxLeftProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {isCompleted ? (
        <div 
          className="w-5 h-5 border-2 rounded-full flex items-center justify-center"
          style={{ 
            borderColor: colors.completion.primary, 
            backgroundColor: colors.completion.primary 
          }}
        >
          <Check size={14} className="text-white" strokeWidth={3} />
        </div>
      ) : (
        <div className="w-5 h-5 border-2 border-gray-400 rounded-full bg-white" />
      )}
    </div>
  );
};