import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    const data = getStorageItem('extendedHealthMetrics', extendedHealthMetricsSchema);
    if (data) {
      setHeight(data.height || "");
      setWeight(data.weight || "");
      setGoalWeight(data.goalWeight || "");
    }
    const healthData = getStorageItem('healthMetrics', healthMetricsSchema);
    if (healthData?.goalWeight && !data?.goalWeight) {
      setGoalWeight(healthData.goalWeight);
    }
  }, []);

  const handleContinue = () => {
    onNext({ height, weight, goalWeight });
  };

  return (
    <div className={standardSpacing.pageContent}>
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
        <h2 className={cardTitle}>Basmätningar</h2>
        <p className={bodyText}>Vi börjar med grundläggande mått för att följa din utveckling.</p>

        <div className={standardSpacing.cardList}>
          <Card className={standardCard}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="height">Längd (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Ex: 175"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Nuvarande vikt (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ex: 75.5"
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

              <div className="pt-4 border-t space-y-3">
                <Button
                  onClick={handleContinue}
                  className={`w-full ${primaryButton}`}
                >
                  Nästa
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={onSkip}
                  className="w-full"
                >
                  Senare
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
