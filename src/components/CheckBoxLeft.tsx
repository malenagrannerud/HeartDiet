import { Square, CheckSquare } from "lucide-react";

interface CheckBoxLeftProps {
  isCompleted: boolean;
  className?: string;
}

export const CheckBoxLeft = ({ isCompleted, className = "" }: CheckBoxLeftProps) => {
  return (
    <div className={`flex-shrink-0 ${className}`}>
      {isCompleted ? (
        <CheckSquare size={20} className="text-green-600" fill="currentColor" />
      ) : (
        <Square size={20} className="text-gray-400" />
      )}
    </div>
  );
};