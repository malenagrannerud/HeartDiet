/**
 * 
 * @module OnboardHeightPage
 * 
 * @requires react - useState, useEffect for state management
 * @requires @/components/ui/card - Card container
 * @requires @/components/ui/input - Text input field
 * @requires @/components/ui/button - Button component
 * @requires lucide-react - Arrow right icon
 * @requires ./ProgressIndicator - Step progress display
 * @requires @/lib/design-tokens - Design system classes
 * @requires @/lib/storage - Local storage utilities
 * @requires @/lib/schemas - Type validation schemas
 * @requires @/components/CheckBoxSkipNow - Skip checkbox
 * 
 * @description
 * user height in centimeters.
 * Part of onboarding flow. Uses single input field
 * with number type. Includes skip option.
 */

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ProgressIndicator } from "./ProgressIndicator";
import { pageContainer, standardCard, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { healthMetricsSchema } from "@/lib/schemas";
import { CheckBoxSkipNow } from "@/components/CheckBoxSkipNow";

/**
 * Props for the HeightPage component
 * 
 * @interface HeightPageProps
 * @property {Function} onNext - Callback when continuing with height data
 * @property {Function} onSkip - Callback when skipping step
 * @property {number} currentStep - Current step number in flow
 * @property {number} totalSteps - Total steps in flow
 */
interface HeightPageProps {
  onNext: (data: { height: string }) => void;
  onSkip: () => void;
  currentStep: number;
  totalSteps: number;
}

/**
 * Height input page component
 * 
 * @component
 * @param {HeightPageProps} props - Component props
 * @returns {JSX.Element} Height input form
 * 
 * @example
 * <HeightPage
 *   onNext={(data) => saveHeight(data)}
 *   onSkip={() => goToNextStep()}
 *   currentStep={1}
 *   totalSteps={6}
 * />
 */
export const HeightPage = ({ onNext, onSkip, currentStep, totalSteps }: HeightPageProps) => {
  // Form state
  const [height, setHeight] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);

  /**
   * Load saved height from storage on mount
   */
  useEffect(() => {               
    const healthData = getStorageItem('healthMetrics', healthMetricsSchema);
    if (healthData?.height) {
      setHeight(healthData.height);
    }
  }, []);

  /**
   * Handle continue button click
   * Passes height to parent or triggers skip
   */
  const handleContinue = () => {
    if (height) {
      onNext({ height });
    } else if (isSkipped) {
      onSkip();
    }
  };

  /**
   * Form validation
   * Valid if height entered OR skipped
   */
  const isValid = height !== "" || isSkipped;

  return (
    <div className={pageContainer}>
      {/* Progress indicator */}
      <div className="mb-30">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Form section */}
      <section className={standardSpacing.sectionContent}>
        <Card className={standardCard}>
          <div className="p-10 space-y-10">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Hur lång är du (cm)?</h1>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  if (isSkipped) setIsSkipped(false);
                }}
                placeholder="175,5"
                autoFocus
              />
            </div>
            
            {/* Skip checkbox */}
            <CheckBoxSkipNow
              isSkipped={isSkipped}
              setIsSkipped={setIsSkipped}
            />
          </div>
        </Card>
      </section>

      {/* Navigation button - fixed at bottom */}
      <section className="fixed bottom-24 left-0 right-0 px-4 z-10">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleContinue}
            disabled={!isValid}
            className="w-full h-12 text-base"
            size="lg"
          >
            Nästa
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};