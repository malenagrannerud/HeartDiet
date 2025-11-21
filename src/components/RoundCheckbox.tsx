import { Check } from "lucide-react";

interface RoundCheckboxProps {
  isCompleted: boolean;
  onToggle?: () => void;
  className?: string;
}

export const RoundCheckbox = ({ isCompleted, onToggle, className = "" }: RoundCheckboxProps) => {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
    >
      {isCompleted ? (
        <div className="w-6 h-6 border-2 border-green-600 rounded-full flex items-center justify-center bg-white">
          <Check size={14} className="text-green-600" strokeWidth={3} />
        </div>
      ) : (
        <div className="w-6 h-6 border-2 border-gray-400 rounded-full bg-white" />
      )}
    </div>
  );
};
