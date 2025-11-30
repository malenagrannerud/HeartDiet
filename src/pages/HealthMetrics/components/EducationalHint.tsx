import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import { bodyText } from "@/lib/design-tokens";

interface EducationalHintProps {
  message: string;
  context?: string;
}

export const EducationalHint = ({ message, context }: EducationalHintProps) => {
  return (
    <Card className="border-info/20 bg-info/5 p-4">
      <div className="flex gap-3">
        <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          {context && (
            <p className={`${bodyText} font-medium text-foreground`}>
              {context}
            </p>
          )}
          <p className={`${bodyText} text-muted-foreground`}>
            {message}
          </p>
        </div>
      </div>
    </Card>
  );
};
