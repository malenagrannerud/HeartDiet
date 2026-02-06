import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { pageContainer, standardCard, standardSpacing } from "@/lib/design-tokens";
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
    if (healthData?.height) {
      setHeight(healthData.height);
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
    <div className={pageContainer}>
      <div className="mb-30">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

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
              
              <CheckBoxSkipNow
                isSkipped={isSkipped}
                setIsSkipped={setIsSkipped}
              />
            </div>
          </Card>
      </section>

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