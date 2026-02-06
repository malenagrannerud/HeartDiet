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

interface BloodFatsProps {
  onNext: (data: { 
    ldl?: string; 
    hdl?: string; 
    triglycerides?: string; 
    date?: string 
  }) => void;
  onSkip: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const BloodFats = ({ onNext, onSkip, onBack, currentStep, totalSteps }: BloodFatsProps) => {
  const [ldl, setLdl] = useState("");
  const [hdl, setHdl] = useState("");
  const [triglycerides, setTriglycerides] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    const data = getStorageItem('healthMetrics', healthMetricsSchema);
    
    if (data) {
      setLdl(data.ldl || "");
      setHdl(data.hdl || "");
      setTriglycerides(data.triglycerides || "");
      
      if (data.bloodFatsDate) {
        setDate(new Date(data.bloodFatsDate));
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
      
      if (ldl) data.ldl = ldl;
      if (hdl) data.hdl = hdl;
      if (triglycerides) data.triglycerides = triglycerides;
      
      onNext(data);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (isSkipped) setIsSkipped(false);
  };

  const isValid = isSkipped || ldl !== "" || hdl !== "" || triglycerides !== "";

  return (
    <div className={pageContainer}>
      <div className="mb-30">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
          <Card className={standardCard}>
            <div className="p-10 space-y-10">
              <div className="space-y-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Dina blodfetter?</h1>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-lg font-medium">LDL-kolesterol (mmol/L)</div>
                    <Input
                      id="ldl"
                      type="number"
                      step="0.1"
                      value={ldl}
                      onChange={(e) => handleInputChange(setLdl, e.target.value)}
                      placeholder="Ex: 3.5"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-lg font-medium">HDL-kolesterol (mmol/L)</div>
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
                    <div className="text-lg font-medium">Triglycerider (mmol/L)</div>
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