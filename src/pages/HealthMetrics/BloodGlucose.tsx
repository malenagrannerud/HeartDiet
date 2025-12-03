import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { EducationalHint } from "./components/EducationalHint";
import { standardCard, cardTitle, bodyText, primaryButton, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { extendedHealthMetricsSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface BloodGlucoseProps {
  onNext: (data: { hba1c?: string; fastingGlucose?: string; date?: string }) => void;
  onSkip: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const BloodGlucose = ({ onNext, onSkip, onBack, currentStep, totalSteps }: BloodGlucoseProps) => {
  const [hba1c, setHba1c] = useState("");
  const [fastingGlucose, setFastingGlucose] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const data = getStorageItem('extendedHealthMetrics', extendedHealthMetricsSchema);
    if (data?.bloodGlucose) {
      setHba1c(data.bloodGlucose.hba1c || "");
      setFastingGlucose(data.bloodGlucose.fastingGlucose || "");
      if (data.bloodGlucose.date) {
        setDate(new Date(data.bloodGlucose.date));
      }
    }
  }, []);

  const handleSave = () => {
    const data: any = { date: date.toISOString() };
    if (hba1c) data.hba1c = hba1c;
    if (fastingGlucose) data.fastingGlucose = fastingGlucose;
    onNext(data);
  };

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

              <p className={`${bodyText} text-muted-foreground text-sm`}>
                Fyll i det värde du känner till. Du behöver inte ha båda.
              </p>

              <div className="pt-4 border-t space-y-3">
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
                    onClick={handleSave}
                    className={`flex-1 ${primaryButton}`}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Spara
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
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
