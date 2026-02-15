/**
 * 
 * @module OnboardBloodPressure
 * 
 * @requires react - useState, useEffect for state management
 * @requires @/components/ButtonBackForward - Navigation buttons
 * @requires @/components/ui/card - Card container
 * @requires @/components/ui/input - Text input field
 * @requires @/components/ui/button - Button component
 * @requires @/components/CheckBoxSkipNow - Skip checkbox
 * @requires @/components/ui/calendar - Date picker calendar
 * @requires @/components/ui/popover - Popover for date picker
 * @requires lucide-react - Calendar icon
 * @requires date-fns - Date formatting with Swedish locale
 * @requires ./ProgressIndicator - Step progress display
 * @requires @/lib/design-tokens - Design system classes
 * @requires @/lib/storage - Local storage utilities
 * @requires @/lib/schemas - Type validation schemas
 * @requires @/lib/utils - Utility functions (cn for classNames)
 * 
 * @description
 * Form component for collecting systolic and diastolic bp
 * Part of onboarding flow. Both values are required unless skipped.
 * Includes date picker for when measurement was taken.
 */

import { useState, useEffect } from "react";
import { ButtonBackForward } from "@/components/ButtonBackForward";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckBoxSkipNow } from "@/components/CheckBoxSkipNow";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ProgressIndicator } from "./ProgressIndicator";
import { pageContainer, standardCard, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { healthMetricsSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/**
 * Props for the BloodPressure component
 * 
 * @interface BloodPressureProps
 * @property {Function} onNext - Callback when continuing with data
 * @property {Function} onSkip - Callback when skipping step
 * @property {Function} onBack - Callback for back navigation
 * @property {number} currentStep - Current step number in flow
 * @property {number} totalSteps - Total steps in flow
 */
interface BloodPressureProps {
  onNext: (data: { systolic: string; diastolic: string; date?: string }) => void;
  onSkip: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

/**
 * Blood pressure measurement form component
 * 
 * @component
 * @param {BloodPressureProps} props - Component props
 * @returns {JSX.Element} Blood pressure form with input fields
 * 
 * @example
 * <BloodPressure
 *   onNext={(data) => saveBloodPressure(data)}
 *   onSkip={() => goToNextStep()}
 *   onBack={() => goToPreviousStep()}
 *   currentStep={2}
 *   totalSteps={6}
 * />
 */
export const BloodPressure = ({ onNext, onSkip, onBack, currentStep, totalSteps }: BloodPressureProps) => {
  // Form state
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isSkipped, setIsSkipped] = useState(false);

  /**
   * Load saved data from storage on mount
   */
  useEffect(() => {
    const data = getStorageItem('healthMetrics', healthMetricsSchema);
    
    if (data) {
      setSystolic(data.systolic || "");
      setDiastolic(data.diastolic || "");
      
      if (data.bloodPressureDate) {
        setDate(new Date(data.bloodPressureDate));
      }
    }
  }, []);

  /**
   * Handle continue button click
   * Passes data to parent or triggers skip
   */
  const handleContinue = () => {
    if (isSkipped) {
      onSkip();
    } else {
      const data: any = { 
        systolic,
        diastolic,
        date: date.toISOString()
      };
      onNext(data);
    }
  };

  /**
   * Handle input field changes
   * Updates field value and clears skip state if active
   * 
   * @param {React.Dispatch<React.SetStateAction<string>>} setter - State setter function
   * @param {string} value - New input value
   */
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (isSkipped) setIsSkipped(false);
  };

  /**
   * Form validation
   * Valid if skipped OR both systolic AND diastolic have values
   * Both are required when not skipping
   */
  const isValid = isSkipped || (systolic !== "" && diastolic !== "");

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
            <div className="space-y-10">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Ditt blodtryck?</h1>
              
              {/* Input fields */}
              <div className="space-y-4">
                {/* Systolic input */}
                <div className="space-y-2">
                  <div className="text-lg font-medium">Övertryck (systoliskt)</div>
                  <Input
                    id="systolic"
                    type="number"
                    value={systolic}
                    onChange={(e) => handleInputChange(setSystolic, e.target.value)}
                    placeholder="Ex: 120"
                    autoFocus
                  />
                </div>

                {/* Diastolic input */}
                <div className="space-y-2">
                  <div className="text-lg font-medium">Undertryck (diastoliskt)</div>
                  <Input
                    id="diastolic"
                    type="number"
                    value={diastolic}
                    onChange={(e) => handleInputChange(setDiastolic, e.target.value)}
                    placeholder="Ex: 80"
                  />
                </div>

                {/* Date picker */}
                <div className="space-y-2">
                  <div className="text-lg font-medium">När mättes det?</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: sv }) : "Välj datum"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          if (newDate) {
                            setDate(newDate);
                            if (isSkipped) setIsSkipped(false);
                          }
                        }}
                        initialFocus
                        locale={sv}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
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