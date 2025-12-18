import { ReactNode } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export interface AccordionItemType {
  value: string;
  title: string;        // Changed from 'trigger' to 'title'
  content: string;      // Changed from ReactNode to string for simpler usage
}

interface AccTipsProps {
  items: AccordionItemType[];
  accordionType?: "single" | "multiple";
  defaultOpenValue?: string | string[];
  allowCollapse?: boolean;
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  onOpenChange?: (value: string | string[]) => void;
}

export function AccTips({
  items,
  accordionType = "multiple",
  defaultOpenValue,
  allowCollapse = true,
  className = "",
  itemClassName = "",
  triggerClassName = "",
  contentClassName = "",
  onOpenChange,
}: AccTipsProps) {
  
  // Render differently based on type
  if (accordionType === "single") {
    return (
      <Accordion
        type="single"
        collapsible={allowCollapse}
        defaultValue={typeof defaultOpenValue === 'string' ? defaultOpenValue : undefined}
        className={className}
        onValueChange={onOpenChange}
      >
        {items.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            className={itemClassName}
          >
            <AccordionTrigger className={triggerClassName}>
              {item.title}
            </AccordionTrigger>
            <AccordionContent className={contentClassName}>
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }
  
  // Type is "multiple"
  return (
    <Accordion
      type="multiple"
      defaultValue={Array.isArray(defaultOpenValue) ? defaultOpenValue : []}
      className={className}
      onValueChange={onOpenChange}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className={itemClassName}
        >
          <AccordionTrigger className={triggerClassName}>
            {item.title}
          </AccordionTrigger>
          <AccordionContent className={contentClassName}>
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default AccTips;