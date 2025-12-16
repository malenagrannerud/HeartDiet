import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { backButton } from "@/lib/design-tokens";

interface BackToTodayButtonProps {
  className?: string;
}

export const BackToTodayButton = ({ 
  className = ''
}: BackToTodayButtonProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`h-10 w-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors ${className}`}
      aria-label="Gå tillbaka till idag"
    >
      <ArrowLeft size={24} className="text-[#212658] stroke-[2.5]" />
    </button>
  );
};