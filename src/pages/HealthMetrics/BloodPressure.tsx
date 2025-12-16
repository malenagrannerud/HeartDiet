import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckBoxSkipNow } from "@/components/CheckBoxSkipNow";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon} from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { CardInfoHint } from "@/components/CardInfoHint";
import { ButtonBackForward } from "@/components/ButtonBackForward";
import { standardCard, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { extendedHealthMetricsSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface BloodPressureProps {
  onNext: (data: { systolic: string; diastolic: string; date: string }) => void;
  onSkip: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const BloodPressure = ({ onNext, onSkip, onBack, currentStep, totalSteps }: BloodPressureProps) => {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    const data = getStorageItem('extendedHealthMetrics', extendedHealthMetricsSchema);
    if (data?.bloodPressure) {
      setSystolic(data.bloodPressure.systolic || "");
      setDiastolic(data.bloodPressure.diastolic || "");
      if (data.bloodPressure.date) {
        setDate(new Date(data.bloodPressure.date));
      }
    }
  }, []);

  const handleContinue = () => {
    if (systolic && diastolic) {
      onNext({ 
        systolic, 
        diastolic, 
        date: date.toISOString() 
      });
    } else if (isSkipped) {   // If skipped, just go to next step without data
      onSkip();
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    // If user starts typing after skipping, un-mark as skipped
    if (isSkipped) setIsSkipped(false);
  };

  const isValid = (systolic !== "" && diastolic !== "") || isSkipped;

  return (
    <div className={standardSpacing.pageContent}>
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
        <div className={standardSpacing.cardList}>
          
          <CardInfoHint
            context="Referensvärden - mätning på mottagning"
            message="Normalvärden är satta till under 140/90 mmHg"
          />
       
          <CardInfoHint
            context="Referensvärden - mätning hemma"
            message="Normalvärden är satta till under 135/85 mmHg"
          />
        </div>  
      </section>
      
      <section className={standardSpacing.sectionContent}>
                    <Card className={standardCard}>
                      <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="systolic">Systoliskt (mmHg)</Label>
                            <Input
                              id="systolic"
                              type="number"
                              value={systolic}
                              onChange={(e) => handleInputChange(setSystolic, e.target.value)}
                              placeholder="120"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="diastolic">Diastoliskt (mmHg)</Label>
                            <Input
                              id="diastolic"
                              type="number"
                              value={diastolic}
                              onChange={(e) => handleInputChange(setDiastolic, e.target.value)}
                              placeholder="80"
                            />
                          </div>
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
                                    if (isSkipped) setIsSkipped(false);       // If user selects date after skipping, un-mark as skipped
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
                    </Card>
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
