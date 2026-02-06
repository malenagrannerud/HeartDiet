//Weight.tsx



import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { standardCard, standardSpacing } from "@/lib/design-tokens";
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
    <div className={standardSpacing.pageContent}>
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
        
          <Card className={standardCard}>
            <div className="p-10 space-y-10">
              <div className="space-y-2">
                <Label htmlFor="weight">Hur mycket väger du (kg)? </Label>
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
                <Label htmlFor="goalWeight">Vilken är din målvikt (kg)?  </Label>
                <Input
                  id="goalWeight"
                  type="number"
                  step="0.1"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  placeholder="80"
                />
              </div>
            </div>
          </Card>
       
      </section>

      <div className="mt-6">
        <CheckBoxSkipNow
          isSkipped={isSkipped}
          setIsSkipped={setIsSkipped}
        />
      </div>

      <section className="fixed bottom-16 left-0 right-0 px-4 z-10">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 h-12"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Tillbaka
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={!isValid}
            className="flex-1 h-12"
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