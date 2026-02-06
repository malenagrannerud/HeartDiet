import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ButtonBackForward } from "@/components/ButtonBackForward";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { pageContainer, standardCard, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { healthMetricsSchema } from "@/lib/schemas";
import { CheckBoxSkipNow } from "@/components/CheckBoxSkipNow";

interface WeightPageProps {
  onNext: (data: { weight: string; goalWeight: string }) => void;
  onSkip: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const WeightPage = ({ onNext, onSkip, onBack, currentStep, totalSteps }: WeightPageProps) => {
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    const healthData = getStorageItem('healthMetrics', healthMetricsSchema);
    if (healthData?.weight) {
      setWeight(healthData.weight);
    }
    if (healthData?.goalWeight) {
      setGoalWeight(healthData.goalWeight);
    }
  }, []);

  const handleContinue = () => {
    if (weight) {
      onNext({ weight, goalWeight });
    } else if (isSkipped) {
      onSkip();
    }
  };

  const isValid = weight !== "" || isSkipped;

  return (
    <div className={pageContainer}>
      <div className="mb-30">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
          <Card className={standardCard}>
            <div className="p-10 space-y-10">
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
              
              <CheckBoxSkipNow
                isSkipped={isSkipped}
                setIsSkipped={setIsSkipped}
              />
            </div>
          </Card>
      </section>

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