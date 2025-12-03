import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
    }
  };

  const isValid = systolic !== "" && diastolic !== "";

  return (
    <div className={standardSpacing.pageContent}>
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
        <h2 className={cardTitle}>Blodtryck</h2>
        
        <EducationalHint 
          context="Eftersom du jobbar med ditt blodtryck, låt oss få ditt startvärde"
          message="Hälsosamt mål är under 120/80 mmHg"
        />

        <div className={standardSpacing.cardList}>
          <Card className={standardCard}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolic">Systoliskt (övre)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    placeholder="120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diastolic">Diastoliskt (nedre)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
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
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                      locale={sv}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                variant="ghost"
                onClick={onSkip}
                className="w-full text-muted-foreground"
              >
                Senare
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className={standardSpacing.sectionContent}>
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
            disabled={!isValid}
            className={`flex-1 ${primaryButton}`}
          >
            Nästa
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};
