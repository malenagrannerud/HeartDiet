import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { EducationalHint } from "./components/EducationalHint";
import { SkipButton } from "./components/SkipButton";
import { standardCard, cardTitle, bodyText, primaryButton, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { extendedHealthMetricsSchema } from "@/lib/schemas";

interface BloodGlucoseProps {
  onNext: (data: { hba1c?: string; fastingGlucose?: string }) => void;
  onSkip: () => void;
  currentStep: number;
  totalSteps: number;
}

export const BloodGlucose = ({ onNext, onSkip, currentStep, totalSteps }: BloodGlucoseProps) => {
  const [hba1c, setHba1c] = useState("");
  const [fastingGlucose, setFastingGlucose] = useState("");

  useEffect(() => {
    const data = getStorageItem('extendedHealthMetrics', extendedHealthMetricsSchema);
    if (data?.bloodGlucose) {
      setHba1c(data.bloodGlucose.hba1c || "");
      setFastingGlucose(data.bloodGlucose.fastingGlucose || "");
    }
  }, []);

  const handleContinue = () => {
    const data: any = {};
    if (hba1c) data.hba1c = hba1c;
    if (fastingGlucose) data.fastingGlucose = fastingGlucose;
    onNext(data);
  };

  const hasValue = hba1c !== "" || fastingGlucose !== "";

  return (
    <div className={standardSpacing.pageContent}>
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
        <h2 className={cardTitle}>Blodsocker</h2>
        
        <EducationalHint 
          context="Eftersom du fokuserar på blodsockret, låt oss se var du står"
          message="Målvärde för HbA1c är vanligtvis under 52 mmol/mol (7%)"
        />

        <div className={standardSpacing.cardList}>
          <Card className={standardCard}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hba1c">HbA1c (mmol/mol eller %)</Label>
                <Input
                  id="hba1c"
                  type="text"
                  value={hba1c}
                  onChange={(e) => setHba1c(e.target.value)}
                  placeholder="Ex: 48 eller 6.5%"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    eller
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fastingGlucose">Fasteblodsocker (mmol/L)</Label>
                <Input
                  id="fastingGlucose"
                  type="number"
                  step="0.1"
                  value={fastingGlucose}
                  onChange={(e) => setFastingGlucose(e.target.value)}
                  placeholder="Ex: 5.6"
                />
              </div>

              <p className={`${bodyText} text-muted-foreground text-sm`}>
                Fyll i det värde du känner till. Du behöver inte ha båda.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className={standardSpacing.sectionContent}>
        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            disabled={!hasValue}
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
