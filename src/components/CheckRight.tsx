import { Check } from "lucide-react";
import { colors } from "@/lib/design-tokens";

interface CheckRightProps {
  isChecked: boolean;
  onClick?: () => void;
  className?: string;
}

export const CheckRight = ({ isChecked, onClick, className = "" }: CheckRightProps) => {
  return (
    <div 
      className={`flex items-center justify-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      {isChecked ? (
        <div 
          className="w-7 h-7 border-2 rounded flex items-center justify-center"
          style={{ 
            borderColor: colors.completion.primary, 
            backgroundColor: colors.completion.primary 
          }}
        >
          <Check size={16} className="text-white" strokeWidth={3} />
        </div>
      ) : (
        <div className="w-7 h-7 border-2 border-gray-400 rounded bg-white" />
      )}
    </div>
  );
};