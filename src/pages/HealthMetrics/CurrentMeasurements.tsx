import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { standardCard, cardTitle, bodyText, primaryButton, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { extendedHealthMetricsSchema, healthMetricsSchema } from "@/lib/schemas";

interface CurrentMeasurementsProps {
  onNext: (data: { height: string; weight: string; goalWeight: string }) => void;
  onSkip: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CurrentMeasurements = ({ onNext, onSkip, currentStep, totalSteps }: CurrentMeasurementsProps) => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    // Load from extendedHealthMetrics
    const data = getStorageItem('extendedHealthMetrics', extendedHealthMetricsSchema);
    if (data) {
      setHeight(data.height || "");
      setWeight(data.weight || "");
      setGoalWeight(data.goalWeight || "");
    }
    // Also check healthMetrics for goalWeight
    const healthData = getStorageItem('healthMetrics', healthMetricsSchema);
    if (healthData?.goalWeight && !data?.goalWeight) {
      setGoalWeight(healthData.goalWeight);
    }
  }, []);

  const handleContinue = () => {
    if (height && weight) {
      onNext({ height, weight, goalWeight });
    } else if (isSkipped) {
      // If skipped, just go to next step without data
      onSkip();
    }
  };


  const isValid = (height !== "" && weight !== "") || isSkipped;

  return (
    <div className={standardSpacing.pageContent}>
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
        <div className={standardSpacing.cardList}>
          <Card className={standardCard}>
            <div className="space-y-4">
              
              <div className="space-y-2">
                <Label htmlFor="height">Längd (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value);
                    // If user starts typing after skipping, un-mark as skipped
                    if (isSkipped) setIsSkipped(false);
                  }}
                  placeholder="Ex: 175"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Vikt (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    // If user starts typing after skipping, un-mark as skipped
                    if (isSkipped) setIsSkipped(false);
                  }}
                  placeholder="Ex: 85,5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalWeight">Målvikt (kg)</Label>
                <Input
                  id="goalWeight"
                  type="number"
                  step="0.1"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  placeholder="Ex: 70"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="skip-measurements"
                  checked={isSkipped}
                  onCheckedChange={(checked) => setIsSkipped(checked === true)}
                />
                <Label htmlFor="skip-measurements" className="cursor-pointer text-muted-foreground">
                  Senare
                </Label>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Nästa button fixed at the bottom */}
      <section className="fixed bottom-16 left-0 right-0 px-4 z-10">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            onClick={handleContinue}
            disabled={!isValid}
            className="flex-1 h-12 text-base"
            size="lg"
          >
            Nästa
            <ArrowRight className="ml-2 h-5 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};
