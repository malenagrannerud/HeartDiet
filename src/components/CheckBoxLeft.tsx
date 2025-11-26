import { Check } from "lucide-react";

interface CheckBoxLeftProps {
  isCompleted: boolean;
  className?: string;
}

export const CheckBoxLeft = ({ isCompleted, className = "" }: CheckBoxLeftProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {isCompleted ? (
        <div className="w-5 h-5 border-2 border-green-600 rounded-full flex items-center justify-center bg-green-600">
          <Check size={14} className="text-white" strokeWidth={3} />
        </div>
      ) : (
        <div className="w-5 h-5 border-2 border-gray-400 rounded-full bg-white" />
      )}
    </div>
  );
};