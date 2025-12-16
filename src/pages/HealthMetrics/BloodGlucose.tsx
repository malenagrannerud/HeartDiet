import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { CardInfoHint } from "@/components/CardInfoHint";
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
  const [isSkipped, setIsSkipped] = useState(false);

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
    if (hba1c || fastingGlucose) {
      // Save actual data
      const data: any = { date: date.toISOString() };
      if (hba1c) data.hba1c = hba1c;
      if (fastingGlucose) data.fastingGlucose = fastingGlucose;
      onNext(data);
    } else if (isSkipped) {
      // If skipped, just skip without saving data
      onSkip();
    }
  };


  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    // If user starts typing after skipping, un-mark as skipped
    if (isSkipped) setIsSkipped(false);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      // If user selects date after skipping, un-mark as skipped
      if (isSkipped) setIsSkipped(false);
    }
  };

  // Spara button is enabled if user has entered data OR marked as skipped
  const isValid = isSkipped || hba1c !== "" || fastingGlucose !== "";

  return (
    <div className={standardSpacing.pageContent}>
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
        <h2 className={cardTitle}>Blodsocker</h2>
        
        <CardInfoHint 
          context="Info"
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
                  onChange={(e) => handleInputChange(setHba1c, e.target.value)}
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
                  onChange={(e) => handleInputChange(setFastingGlucose, e.target.value)}
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
                      onSelect={handleDateChange}
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

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="skip-bloodglucose"
                  checked={isSkipped}
                  onCheckedChange={(checked) => setIsSkipped(checked === true)}
                />
                <Label htmlFor="skip-bloodglucose" className="cursor-pointer text-muted-foreground">
                  Senare
                </Label>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className={standardSpacing.sectionContent}>
        {/* Tillbaka and Spara horizontally aligned under the card */}
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
            disabled={!isValid}
            className={`flex-1 ${primaryButton}`}
          >
            <Check className="mr-2 h-4 w-4" />
            Spara
          </Button>
        </div>
      </section>
    </div>
  );
};
