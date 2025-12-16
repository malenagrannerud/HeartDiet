// src/components/ButtonAbort.tsx
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ButtonAbortProps {
  className?: string;
  onClick?: () => void;
  navigateTo?: string;
}

export const ButtonAbort = ({ 
  className = '',
  onClick,
  navigateTo = '/app/today'
}: ButtonAbortProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(navigateTo);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`h-10 w-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors ${className}`}
      aria-label="Avbryt"
    >
      <X size={24} className="text-[#212658] stroke-[2.5]" />
    </button>
  );
};