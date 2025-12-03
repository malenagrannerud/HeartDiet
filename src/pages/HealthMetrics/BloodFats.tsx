import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { EducationalHint } from "./components/EducationalHint";
import { standardCard, cardTitle, primaryButton, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { extendedHealthMetricsSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    const data = getStorageItem('extendedHealthMetrics', extendedHealthMetricsSchema);
    if (data?.bloodFats) {
      setKnowsLDL(data.bloodFats.knowsLDL || "unknown");
      setLdl(data.bloodFats.ldl || "");
      setHdl(data.bloodFats.hdl || "");
      setTriglycerides(data.bloodFats.triglycerides || "");
      if (data.bloodFats.date) {
        setDate(new Date(data.bloodFats.date));
      }
    }
  }, []);

  const handleContinue = () => {
    const data: any = { knowsLDL, date: date.toISOString() };
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
                          onSelect={(newDate) => newDate && setDate(newDate)}
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

      <section className={standardSpacing.sectionContent}>
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka
            </Button>
            <Button
              onClick={handleContinue}
              className={`flex-1 ${primaryButton}`}
            >
              Nästa
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={onSkip}
            className="w-full"
          >
            Senare
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};
