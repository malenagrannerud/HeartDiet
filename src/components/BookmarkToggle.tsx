import { Bookmark } from "lucide-react";
import { colors } from "@/lib/design-tokens";

interface BookmarkToggleProps {
  isSelected: boolean;
  onClick?: () => void;
  className?: string;
}

export const BookmarkToggle = ({ isSelected, onClick, className = "" }: BookmarkToggleProps) => {
  return (
    <div 
      className={`flex items-center justify-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      <Bookmark 
        size={28}
        className={isSelected ? "text-white" : "text-gray-400"}
        fill={isSelected ? colors.selection.primary : "none"}
        stroke={isSelected ? colors.selection.primary : "currentColor"}
        strokeWidth={2}
      />
    </div>
  );
};
