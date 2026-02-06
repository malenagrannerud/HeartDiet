import { useState, useEffect } from "react";
import { ButtonBackForward } from "@/components/ButtonBackForward";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckBoxSkipNow } from "@/components/CheckBoxSkipNow";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { pageContainer, standardCard, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { healthMetricsSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface BloodGlucoseProps {
  onNext: (data: { 
    hba1c?: string; 
    fastingGlucose?: string; 
    date?: string 
  }) => void;
  onSkip: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const BloodGlucose = ({ onNext, onSkip, onBack, currentStep, totalSteps }: BloodGlucoseProps) => {
  const [hba1c, setHba1c] = useState("");
  const [fastingGlucose, setFastingGlucose] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    const data = getStorageItem('healthMetrics', healthMetricsSchema);
    
    if (data) {
      setHba1c(data.hba1c || "");
      setFastingGlucose(data.fastingGlucose || "");
      
      if (data.bloodGlucoseDate) {
        setDate(new Date(data.bloodGlucoseDate));
      }
    }
  }, []);

  const handleContinue = () => {
    if (isSkipped) {
      onSkip();
    } else {
      const data: any = { 
        date: date.toISOString()
      };
      
      if (hba1c) data.hba1c = hba1c;
      if (fastingGlucose) data.fastingGlucose = fastingGlucose;
      
      onNext(data);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (isSkipped) setIsSkipped(false);
  };

  const isValid = isSkipped || hba1c !== "" || fastingGlucose !== "";

  const isLastPage = currentStep === totalSteps;

  return (
    <div className={pageContainer}>
      <div className="mb-30">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
          <Card className={standardCard}>
            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Ditt blodsocker?</h1>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hba1c" className="text-lg font-medium">HbA1c (mmol/mol) - frivilligt</Label>
                    <Input
                      id="hba1c"
                      type="number"
                      step="0.1"
                      value={hba1c}
                      onChange={(e) => handleInputChange(setHba1c, e.target.value)}
                      placeholder="Ex: 42"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fastingGlucose" className="text-lg font-medium">Fastande blodsocker (mmol/L) - frivilligt</Label>
                    <Input
                      id="fastingGlucose"
                      type="number"
                      step="0.1"
                      value={fastingGlucose}
                      onChange={(e) => handleInputChange(setFastingGlucose, e.target.value)}
                      placeholder="Ex: 5.8"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg font-medium">När mättes det? - frivilligt</Label>
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
              </div>
              
              <div className="pt-6 border-t">
                <CheckBoxSkipNow
                  isSkipped={isSkipped}
                  setIsSkipped={setIsSkipped}
                />
              </div>
            </div>
          </Card>
      </section>

      <section className="fixed bottom-24 left-0 right-0 px-4 z-10">
        <div className="flex gap-3">
          {isLastPage ? (
            // Last page: Show Save button
            <div className="max-w-md mx-auto flex gap-3 w-full">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 h-12"
                size="lg"
              >
                Tillbaka
              </Button>
              
              <Button
                onClick={handleContinue}
                disabled={!isValid}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Spara
              </Button>
            </div>
          ) : (
            
            <ButtonBackForward 
              onBack={onBack}
              onForward={handleContinue}
              forwardDisabled={!isValid}
            />
          )}
        </div>
      </section>
    </div>
  );
};