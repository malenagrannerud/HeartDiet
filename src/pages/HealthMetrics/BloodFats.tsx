/**
 * BloodFats Component
 * 
 * Third step in health metrics flow - collects cholesterol/lipid readings.
 * 
 * DATA FLOW:
 * - Loads: Latest blood fats from dayLogs via health-data helpers
 * - Saves: Passed to parent (index.tsx) which saves to dayLogs
 */

import { useState, useEffect } from "react";
import { ButtonBackForward } from "@/components/ButtonBackForward";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckBoxSkipNow } from "@/components/CheckBoxSkipNow";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { standardCard, standardSpacing } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { getLatestMeasurement } from "@/lib/health-data";

interface BloodFatsProps {
  onNext: (data: { knowsLDL: string; ldl?: string; hdl?: string; triglycerides?: string; date?: string }) => void;
  onSkip: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const BloodFats = ({ onNext, onSkip, onBack, currentStep, totalSteps }: BloodFatsProps) => {
  const [knowsLDL, setKnowsLDL] = useState<string>("unknown");
  const [ldl, setLdl] = useState("");
  const [hdl, setHdl] = useState("");
  const [triglycerides, setTriglycerides] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    // Load latest blood fats from dayLogs
    const latestFats = getLatestMeasurement('bloodFats');
    if (latestFats) {
      // If we have detailed data, set knowsLDL to 'detailed'
      setKnowsLDL('detailed');
      setLdl(latestFats.value.toString());
      setHdl(latestFats.value2?.toString() || "");
      setTriglycerides(latestFats.value3?.toString() || "");
      if (latestFats.date) {
        setDate(new Date(latestFats.date));
      }
    }
  }, []);

  const handleContinue = () => {
    if (knowsLDL === 'detailed' && ldl) {
      // Save detailed data
      const data: any = { 
        knowsLDL, 
        date: date.toISOString(),
        ldl,
        hdl: hdl || undefined,
        triglycerides: triglycerides || undefined
      };
      onNext(data);
    } else if (isSkipped) {
      // If skipped, just go to next step without data
      onSkip();
    } else {
      // Save only the knowsLDL selection (not detailed values)
      const data: any = { knowsLDL };
      if (knowsLDL === 'just-high' || knowsLDL === 'unknown') {
        data.date = date.toISOString();
      }
      onNext(data);
    }
  };


  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    // If user starts typing after skipping, un-mark as skipped
    if (isSkipped) setIsSkipped(false);
  };

  const handleRadioChange = (value: string) => {
    setKnowsLDL(value);
    // If user changes radio after skipping, un-mark as skipped
    if (isSkipped) setIsSkipped(false);
  };

  // Nästa button is enabled if:
  // 1. User selected "detailed" AND filled LDL, OR
  // 2. User selected "just-high" or "unknown", OR
  // 3. User clicked "Senare" (isSkipped)
  const isValid = 
    isSkipped || 
    (knowsLDL === 'detailed' && ldl !== "") || 
    knowsLDL === 'just-high' || 
    knowsLDL === 'unknown';

  return (
    <div className={standardSpacing.pageContent}>
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
        <div className={standardSpacing.cardList}>
          <Card className={standardCard}>
            <div className="space-y-10">
              <div className="space-y-10">
                <Label>Vet du dina kolesterolvärden?</Label>
                <RadioGroup value={knowsLDL} onValueChange={handleRadioChange}>
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
                      onChange={(e) => handleInputChange(setLdl, e.target.value)}
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
                      onChange={(e) => handleInputChange(setHdl, e.target.value)}
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
                      onChange={(e) => handleInputChange(setTriglycerides, e.target.value)}
                      placeholder="Ex: 1.7"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>När mättes det?</Label>
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
                              // If user selects date after skipping, un-mark as skipped
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
              )}              
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
