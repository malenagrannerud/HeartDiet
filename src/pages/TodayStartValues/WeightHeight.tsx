import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { standardCard, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { healthMetricsSchema } from "@/lib/schemas";
import { CheckBoxSkipNow } from "@/components/CheckBoxSkipNow";

interface HeightPageProps {
  onNext: (data: { height: string }) => void;
  onSkip: () => void;
  currentStep: number;
  totalSteps: number;
}

export const HeightPage = ({ onNext, onSkip, currentStep, totalSteps }: HeightPageProps) => {
  const [height, setHeight] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {               
    const healthData = getStorageItem('healthMetrics', healthMetricsSchema);
    if (healthData) {
      setHeight(healthData.height || "");
    }
  }, []);

  const handleContinue = () => {
    if (height) {
      onNext({ height });
    } else if (isSkipped) {
      onSkip();
    }
  };

  const isValid = height !== "" || isSkipped;

  return (
    <div className={standardSpacing.pageContent}>
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
        <div className={standardSpacing.cardList}>
          <Card className={standardCard}>
            <div className="space-y-10">
              <div className="space-y-2">
                <Label htmlFor="height">Längd (cm)</Label>
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
                <p className="text-sm text-muted-foreground mt-1">
                  Ange din längd i centimeter
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <div className={standardSpacing.pageContent}>
        <CheckBoxSkipNow
          isSkipped={isSkipped}
          setIsSkipped={setIsSkipped}
        />
      </div>

      <section className="fixed bottom-16 left-0 right-0 px-4 z-10">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            onClick={handleContinue}
            disabled={!isValid}
            className="flex-1 h-10 text-base"
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