import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { EducationalHint } from "./components/EducationalHint";
import { SkipButton } from "./components/SkipButton";
import { standardCard, cardTitle, bodyText, primaryButton, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { extendedHealthMetricsSchema } from "@/lib/schemas";

interface BloodFatsProps {
  onNext: (data: { knowsLDL: string; ldl?: string; hdl?: string; triglycerides?: string }) => void;
  onSkip: () => void;
  currentStep: number;
  totalSteps: number;
}

export const BloodFats = ({ onNext, onSkip, currentStep, totalSteps }: BloodFatsProps) => {
  const [knowsLDL, setKnowsLDL] = useState<string>("unknown");
  const [ldl, setLdl] = useState("");
  const [hdl, setHdl] = useState("");
  const [triglycerides, setTriglycerides] = useState("");

  useEffect(() => {
    const data = getStorageItem('extendedHealthMetrics', extendedHealthMetricsSchema);
    if (data?.bloodFats) {
      setKnowsLDL(data.bloodFats.knowsLDL || "unknown");
      setLdl(data.bloodFats.ldl || "");
      setHdl(data.bloodFats.hdl || "");
      setTriglycerides(data.bloodFats.triglycerides || "");
    }
  }, []);

  const handleContinue = () => {
    const data: any = { knowsLDL };
    if (knowsLDL === 'detailed') {
      data.ldl = ldl;
      data.hdl = hdl;
      data.triglycerides = triglycerides;
    }
    onNext(data);
  };

  return (
    <div className={standardSpacing.pageContent}>
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
        <h2 className={cardTitle}>Blodfetter</h2>
        
        <EducationalHint 
          context="Eftersom du jobbar med kolesterolet, låt oss få ditt startvärde"
          message="Detta hjälper oss ge bättre rekommendationer"
        />

        <div className={standardSpacing.cardList}>
          <Card className={standardCard}>
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Vet du dina kolesterolvärden?</Label>
                <RadioGroup value={knowsLDL} onValueChange={setKnowsLDL}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="detailed" id="detailed" />
                    <Label htmlFor="detailed" className="font-normal cursor-pointer">
                      Jag vet mitt LDL
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="just-high" id="just-high" />
                    <Label htmlFor="just-high" className="font-normal cursor-pointer">
                      Jag vet bara att det är högt
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unknown" id="unknown" />
                    <Label htmlFor="unknown" className="font-normal cursor-pointer">
                      Jag vet inte
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {knowsLDL === 'detailed' && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="ldl">LDL-kolesterol (mmol/L)</Label>
                    <Input
                      id="ldl"
                      type="number"
                      step="0.1"
                      value={ldl}
                      onChange={(e) => setLdl(e.target.value)}
                      placeholder="Ex: 3.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hdl">HDL-kolesterol (mmol/L) - frivilligt</Label>
                    <Input
                      id="hdl"
                      type="number"
                      step="0.1"
                      value={hdl}
                      onChange={(e) => setHdl(e.target.value)}
                      placeholder="Ex: 1.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="triglycerides">Triglycerider (mmol/L) - frivilligt</Label>
                    <Input
                      id="triglycerides"
                      type="number"
                      step="0.1"
                      value={triglycerides}
                      onChange={(e) => setTriglycerides(e.target.value)}
                      placeholder="Ex: 1.7"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>

      <section className={standardSpacing.sectionContent}>
        <div className="space-y-3">
          <Button
            onClick={handleContinue}
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
