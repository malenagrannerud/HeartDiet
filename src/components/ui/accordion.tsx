import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      // Standalone row with more visible gray background
      "bg-gray-100 mb-2 last:mb-0", // Changed from gray-50 to gray-100
      "hover:bg-gray-200 transition-colors",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Base styles - no rounded edges
        "flex flex-1 items-center justify-between py-3 px-4 w-full",
        
        // Colors and states - NON-BOLD text, more visible background
        "text-gray-800", // Removed: font-medium
        "hover:bg-gray-300", // More visible hover
        
        // Active state (open)
        "data-[state=open]:bg-gray-300", // More visible when open
        
        // Chevron animation
        "[&[data-state=open]>svg]:rotate-90",
        
        className,
      )}
      {...props}
    >
      {/* Title - non-bold */}
      <span className="flex-1 pr-4 text-left font-normal">{children}</span> {/* font-normal */}
      
      {/* Right chevron */}
      <ChevronRight 
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200 ease-in-out",
          "text-gray-600" // Slightly darker
        )} 
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden transition-all duration-200 ease-in-out"
    {...props}
  >
    <div className={cn(
      // Light gray content area - no rounded edges
      "py-3 px-4",
      "text-gray-700/90 leading-relaxed font-normal", // Non-bold, slightly darker gray
      "bg-gray-150", // Slightly darker than trigger
      className
    )}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };