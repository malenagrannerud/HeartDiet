import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { bodyText } from "@/lib/design-tokens";

interface CollapsibleListItem {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

interface CollapsibleListProps {
  items: CollapsibleListItem[];
}

export const CollapsibleList = ({ items }: CollapsibleListProps) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <CollapsibleListItem key={index} item={item} />
      ))}
    </div>
  );
};

const CollapsibleListItem = ({ item }: { item: CollapsibleListItem }) => {
  const [isOpen, setIsOpen] = useState(item.defaultOpen ?? false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-start gap-2">
        <span className="mt-1.5 text-foreground">•</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={bodyText}>{item.title}</span>
            <CollapsibleTrigger className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              {isOpen ? (
                <>
                  <span>Göm</span>
                  <ChevronUp className="ml-1 h-3 w-3" />
                </>
              ) : (
                <>
                  <span>Visa</span>
                  <ChevronDown className="ml-1 h-3 w-3" />
                </>
              )}
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-1">
            <p className={`${bodyText} text-muted-foreground`}>{item.content}</p>
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};
