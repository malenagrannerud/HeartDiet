import { bodyText } from "@/lib/design-tokens";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <p className={`${bodyText} text-muted-foreground`}>
        Steg {currentStep} av {totalSteps}
      </p>
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              index < currentStep ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
