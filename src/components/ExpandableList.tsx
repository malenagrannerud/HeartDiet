import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

export interface ExpandableListItem {
  title: string;
  description: string;
}

interface ExpandableListProps {
  items: ExpandableListItem[];
  defaultOpen?: boolean;
  buttonText?: {
    showMore: string;
    showLess: string;
  };
}

const ExpandableList = ({ 
  items, 
  defaultOpen = false,
  buttonText = { showMore: "Visa mer", showLess: "Visa mindre" }
}: ExpandableListProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className="text-primary mt-1">•</span>
            <div>
              <span className="font-semibold">{item.title}:</span>{" "}
              <span className="text-muted-foreground">{item.description}</span>
            </div>
          </li>
        ))}
      </ul>
      
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-4 text-primary hover:text-primary/80"
        >
          {isOpen ? (
            <>
              {buttonText.showLess}
              <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              {buttonText.showMore}
              <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-3 mt-3">
        {/* Extra content goes here if needed */}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ExpandableList;
