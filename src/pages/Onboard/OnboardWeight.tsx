/**
 * Weight input page component
 * 
 * @module WeightPage
 * 
 * @requires react - useState, useEffect for state management
 * @requires @/components/ui/card - Card container
 * @requires @/components/ui/input - Text input field
 * @requires @/components/ButtonBackForward - Navigation buttons
 * @requires ./ProgressIndicator - Step progress display
 * @requires @/lib/design-tokens - Design system classes
 * @requires @/lib/storage - Local storage utilities
 * @requires @/lib/schemas - Type validation schemas
 * @requires @/components/CheckBoxSkipNow - Skip checkbox
 * 
 * @description
 * Form component for collecting current weight and goal weight.
 * Part of the health metrics onboarding flow. Both fields are optional
 * when not skipping. Uses Back/Forward navigation buttons.
 */

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ButtonBackForward } from "@/components/ButtonBackForward";
import { ProgressIndicator } from "./ProgressIndicator";
import { pageContainer, standardCard, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { healthMetricsSchema } from "@/lib/schemas";
import { CheckBoxSkipNow } from "@/components/CheckBoxSkipNow";

/**
 * Props for the WeightPage component
 * 
 * @interface WeightPageProps
 * @property {Function} onNext - Callback when continuing with weight data
 * @property {Function} onSkip - Callback when skipping step
 * @property {Function} onBack - Callback for back navigation
 * @property {number} currentStep - Current step number in flow
 * @property {number} totalSteps - Total steps in flow
 */
interface WeightPageProps {
  onNext: (data: { weight: string; goalWeight: string }) => void;
  onSkip: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

/**
 * Weight input page component
 * 
 * @component
 * @param {WeightPageProps} props - Component props
 * @returns {JSX.Element} Weight input form with current and goal weight
 * 
 * @example
 * <WeightPage
 *   onNext={(data) => saveWeight(data)}
 *   onSkip={() => goToNextStep()}
 *   onBack={() => goToPreviousStep()}
 *   currentStep={1}
 *   totalSteps={6}
 * />
 */
export const WeightPage = ({ onNext, onSkip, onBack, currentStep, totalSteps }: WeightPageProps) => {
  // Form state
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);

  /**
   * Load saved weight data from storage on mount
   */
  useEffect(() => {
    const healthData = getStorageItem('healthMetrics', healthMetricsSchema);
    if (healthData?.weight) {
      setWeight(healthData.weight);
    }
    if (healthData?.goalWeight) {
      setGoalWeight(healthData.goalWeight);
    }
  }, []);

  /**
   * Handle continue button click
   * Passes both weight values to parent or triggers skip
   * Current weight is required if not skipping, goal weight is optional
   */
  const handleContinue = () => {
    if (weight) {
      onNext({ weight, goalWeight });
    } else if (isSkipped) {
      onSkip();
    }
  };

  /**
   * Form validation
   * Valid if current weight entered OR skipped
   * Goal weight is always optional
   */
  const isValid = weight !== "" || isSkipped;

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
            {/* Current weight input */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Hur mycket väger du (kg)?</h1>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  if (isSkipped) setIsSkipped(false);
                }}
                placeholder="95,5"
                autoFocus
              />
            </div>

            {/* Goal weight input */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Vilken är din målvikt (kg)?</h1>
              <Input
                id="goalWeight"
                type="number"
                step="0.1"
                value={goalWeight}
                onChange={(e) => setGoalWeight(e.target.value)}
                placeholder="80"
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

      {/* Navigation buttons - fixed at bottom */}
      <section className="fixed bottom-24 left-0 right-0 px-4 z-10">
        <div className="flex gap-3">
          <ButtonBackForward 
            onBack={onBack}
            onForward={handleContinue}
            forwardDisabled={!isValid}
          />
        </div>
      </section>
    </div>
  );
};