import { useState, useEffect } from "react";
import { ButtonBackForward } from "@/components/ButtonBackForward";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

interface BloodPressureProps {
  onNext: (data: { systolic: string; diastolic: string; date?: string }) => void;
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
    const data = getStorageItem('healthMetrics', healthMetricsSchema);
    
    if (data) {
      setSystolic(data.systolic || "");
      setDiastolic(data.diastolic || "");
      
      if (data.bloodPressureDate) {
        setDate(new Date(data.bloodPressureDate));
      }
    }
  }, []);

  const handleContinue = () => {
    if (isSkipped) {
      onSkip();
    } else {
      const data: any = { 
        systolic,
        diastolic,
        date: date.toISOString()
      };
      onNext(data);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (isSkipped) setIsSkipped(false);
  };

  const isValid = isSkipped || (systolic !== "" && diastolic !== "");

  return (
    <div className={pageContainer}>
      <div className="mb-30">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
          <Card className={standardCard}>
            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Ditt blodtryck?</h1>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-lg font-medium">Övertryck (systoliskt)</div>
                    <Input
                      id="systolic"
                      type="number"
                      value={systolic}
                      onChange={(e) => handleInputChange(setSystolic, e.target.value)}
                      placeholder="Ex: 120"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-lg font-medium">Undertryck (diastoliskt)</div>
                    <Input
                      id="diastolic"
                      type="number"
                      value={diastolic}
                      onChange={(e) => handleInputChange(setDiastolic, e.target.value)}
                      placeholder="Ex: 80"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-lg font-medium">När mättes det?</div>
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
              
              <CheckBoxSkipNow
                isSkipped={isSkipped}
                setIsSkipped={setIsSkipped}
              />
            </div>
          </Card>
      </section>

      <section className="fixed bottom-24 left-0 right-0 px-4 z-10">
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