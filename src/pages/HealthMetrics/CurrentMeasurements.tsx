import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { SkipButton } from "./components/SkipButton";
import { standardCard, cardTitle, bodyText, primaryButton, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { extendedHealthMetricsSchema } from "@/lib/schemas";

interface CurrentMeasurementsProps {
  onNext: (data: { height: string; weight: string }) => void;
  onSkip: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CurrentMeasurements = ({ onNext, onSkip, currentStep, totalSteps }: CurrentMeasurementsProps) => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const data = getStorageItem('extendedHealthMetrics', extendedHealthMetricsSchema);
    if (data) {
      setHeight(data.height || "");
      setWeight(data.weight || "");
    }
  }, []);

  const handleContinue = () => {
    if (height && weight) {
      onNext({ height, weight });
    }
  };

  const isValid = height !== "" && weight !== "";

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
            </div>
          </Card>
        </div>
      </section>

      <section className={standardSpacing.sectionContent}>
        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            disabled={!isValid}
            className={primaryButton}
          >
            Fortsätt
          </Button>
          <SkipButton onClick={onSkip} />
        </div>
      </section>
    </div>
  );
};
