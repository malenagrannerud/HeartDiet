import { Check } from "lucide-react";

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
        <div className="w-7 h-7 border-2 border-emerald-500 rounded flex items-center justify-center bg-emerald-500">
          <Check size={16} className="text-white" strokeWidth={3} />
        </div>
      ) : (
        <div className="w-7 h-7 border-2 border-gray-400 rounded bg-white" />
      )}
    </div>
  );
};