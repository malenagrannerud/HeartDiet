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
      className={`flex items-center gap-3 text-[#212658] mb-4 ${backButton} ${className}`}
      aria-label="Gå tillbaka till idag"
    >
      <ArrowLeft size={28} />
      <span className="text-lg font-semibold">Tillbaka</span>
    </button>


  );
};