import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleListItem {
  title: string;
  content: string;
}

interface CollapsibleListProps {
  items: CollapsibleListItem[];
}

export const CollapsibleList = ({ items }: CollapsibleListProps) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border-b border-border pb-2">
          <button
            onClick={() => toggleItem(index)}
            className="flex items-start justify-between w-full text-left py-2 hover:opacity-80 transition-opacity"
          >
            <span className="font-medium text-foreground pr-2">{item.title}</span>
            {openItems.has(index) ? (
              <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
            )}
          </button>
          {openItems.has(index) && (
            <p className="text-sm text-muted-foreground pb-2 animate-accordion-down">
              {item.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
