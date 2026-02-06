import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ButtonBackForward } from "@/components/ButtonBackForward";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { ButtonAbort } from "@/components/ButtonAbort";
import { CheckBoxSkipNow } from "@/components/CheckBoxSkipNow";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { CardInfoHint } from "@/components/CardInfoHint";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { standardCard, standardSpacing, sectionHeading, headerContainer, pageContainer, pagePadding } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { healthMetricsSchema, completedActivitiesSchema, HealthMetrics, DayLog } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion";
import { getCurrentDate } from "@/lib/simulated-date";
import { safeParseFloat, safeParseInt, HEALTH_RANGES } from "@/lib/health-validators";
import { cn } from "@/lib/utils";

// ======================== 1. ProgressIndicator Component ========================
const ProgressIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              index < currentStep ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ======================== 2. WeightHeightWizard Component ========================
interface WeightHeightWizardProps {
  onNext: (data: { height: string; weight: string; goalWeight: string }) => void;
  onSkip: () => void;
  currentStep: number;
  totalSteps: number;
}

export const WeightHeightWizard = ({ onNext, onSkip, currentStep, totalSteps }: WeightHeightWizardProps) => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);
  const [currentWizardStep, setCurrentWizardStep] = useState(1);
  const totalWizardSteps = 3;

  useEffect(() => {
    const healthData = getStorageItem('healthMetrics', healthMetricsSchema);
    if (healthData) {
      setHeight(healthData.height || "");
      setWeight(healthData.weight || "");
      setGoalWeight(healthData.goalWeight || "");
    }
  }, []);

  const saveToStorage = () => {
    const existingData = getStorageItem('healthMetrics', healthMetricsSchema) || {};
    const updatedData = {
      ...existingData,
      height: currentWizardStep >= 1 ? height : existingData.height,
      weight: currentWizardStep >= 2 ? weight : existingData.weight,
      goalWeight: currentWizardStep >= 3 ? goalWeight : existingData.goalWeight,
    };
    setStorageItem('healthMetrics', updatedData);
  };

  const handleNextStep = () => {
    if (currentWizardStep < totalWizardSteps) {
      saveToStorage();
      setCurrentWizardStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentWizardStep > 1) {
      setCurrentWizardStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (height && weight) {
      saveToStorage();
      onNext({ height, weight, goalWeight });
    } else if (isSkipped) {
      onSkip();
    }
  };

  const handleSkip = () => {
    setIsSkipped(true);
    saveToStorage();
    onSkip();
  };

  const getStepValidation = () => {
    switch (currentWizardStep) {
      case 1: return height !== "" || isSkipped;
      case 2: return weight !== "" || isSkipped;
      case 3: return (height !== "" && weight !== "") || isSkipped;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentWizardStep) {
      case 1:
        return (
          <div className="space-y-2">
            <Label htmlFor="height">Längd (cm)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => {
                setHeight(e.target.value);
                if (isSkipped) setIsSkipped(false);
              }}
              placeholder="Ex: 175"
              autoFocus
            />
            <p className="text-sm text-muted-foreground mt-1">
              Ange din längd i centimeter
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-2">
            <Label htmlFor="weight">Nuvarande vikt (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                if (isSkipped) setIsSkipped(false);
              }}
              placeholder="Ex: 85,5"
              autoFocus
            />
            <p className="text-sm text-muted-foreground mt-1">
              Ange din nuvarande vikt i kilogram
            </p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-2">
            <Label htmlFor="goalWeight">Målvikt (kg)</Label>
            <Input
              id="goalWeight"
              type="number"
              step="0.1"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
              placeholder="Ex: 70"
              autoFocus
            />
            <p className="text-sm text-muted-foreground mt-1">
              Ange din önskade målvikt i kilogram (frivilligt)
            </p>
          </div>
        );
      default: return null;
    }
  };

  const getStepTitle = () => {
    switch (currentWizardStep) {
      case 1: return "Steg 1 av 3: Ange din längd";
      case 2: return "Steg 2 av 3: Ange din nuvarande vikt";
      case 3: return "Steg 3 av 3: Ange din målvikt";
      default: return "";
    }
  };

  const isValid = getStepValidation();

  return (
    <div className={standardSpacing.pageContent}>
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        <div className="mt-4 mb-2">
          <h2 className="text-lg font-semibold">{getStepTitle()}</h2>
          <div className="mt-2 flex items-center gap-2">
            {Array.from({ length: totalWizardSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full ${
                  index + 1 <= currentWizardStep 
                    ? "bg-primary" 
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <section className={standardSpacing.sectionContent}>
        <div className={standardSpacing.cardList}>
          <Card className={standardCard}>
            <div className="space-y-6">
              {renderStepContent()}
              <div className="flex items-center space-x-2 pt-4">
                <input
                  type="checkbox"
                  id="skipMetrics"
                  checked={isSkipped}
                  onChange={(e) => setIsSkipped(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="skipMetrics" className="text-sm">
                  Hoppa över mått just nu
                </Label>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="fixed bottom-16 left-0 right-0 px-4 z-10">
        <div className="max-w-md mx-auto flex gap-3">
          {currentWizardStep > 1 && (
            <Button
              onClick={handlePreviousStep}
              variant="outline"
              className="flex-1 h-10 text-base"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Tillbaka
            </Button>
          )}
          <Button
            onClick={isSkipped ? handleSkip : handleNextStep}
            disabled={!isValid}
            className={`flex-1 h-10 text-base ${currentWizardStep === 1 ? 'col-span-2' : ''}`}
            size="lg"
          >
            {currentWizardStep === totalWizardSteps 
              ? (isSkipped ? 'Hoppa över' : 'Slutför') 
              : 'Nästa'}
            {!isSkipped && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      </section>
    </div>
  );
};

// ======================== 3. BloodPressure Component ========================
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
    if (systolic && diastolic) {
      onNext({ 
        systolic, 
        diastolic, 
        date: date.toISOString() 
      });
    } else if (isSkipped) {
      onSkip();
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
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

// ======================== 4. BloodGlucose Component ========================
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
    const data = getStorageItem('healthMetrics', healthMetricsSchema);
    if (data) {
      setHba1c(data.hba1c || "");
      setFastingGlucose(data.fastingGlucose || "");
      if (data.bloodGlucoseDate) {
        setDate(new Date(data.bloodGlucoseDate));
      }
    }
  }, []);

  const handleSave = () => {
    if (hba1c || fastingGlucose) {
      const data: any = { date: date.toISOString() };
      if (hba1c) data.hba1c = hba1c;
      if (fastingGlucose) data.fastingGlucose = fastingGlucose;
      onNext(data);
    } else if (isSkipped) {
      onSkip();
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (isSkipped) setIsSkipped(false);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      if (isSkipped) setIsSkipped(false);
    }
  };

  const isValid = isSkipped || hba1c !== "" || fastingGlucose !== "";

  return (
    <div className={standardSpacing.pageContent}>
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
        <CardInfoHint 
          context="Referensvärden P-Glukos (fP-Glukos)"
          message="Normalvärden är satta till 4,0 till 6,0 mmol/L"
        />
      </section>

      <section className={standardSpacing.sectionContent}>
        <div className={standardSpacing.cardList}>
          <Card className={standardCard}>
            <div className="space-y-10">
              <div className="space-y-1">
                <Label htmlFor="fastingGlucose">P-Glukos (mmol/L)</Label>
                <Input
                  id="fastingGlucose"
                  type="number"
                  step="0.1"
                  value={fastingGlucose}
                  onChange={(e) => handleInputChange(setFastingGlucose, e.target.value)}
                  placeholder="Ex: 5.6"
                />
              </div>

              <div className="space-y-1">
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
            onForward={handleSave}
            forwardDisabled={!isValid}
            forwardLabel="Spara"
          />
        </div>
      </section>
    </div>
  );
};

// ======================== 5. BloodFats Component ========================
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
    const data = getStorageItem('healthMetrics', healthMetricsSchema);
    if (data) {
      setKnowsLDL(data.knowsLDL || "unknown");
      setLdl(data.ldl || "");
      setHdl(data.hdl || "");
      setTriglycerides(data.triglycerides || "");
      if (data.bloodFatsDate) {
        setDate(new Date(data.bloodFatsDate));
      }
    }
  }, []);

  const handleContinue = () => {
    if (knowsLDL === 'detailed' && ldl) {
      const data: any = { 
        knowsLDL, 
        date: date.toISOString(),
        ldl,
        hdl: hdl || undefined,
        triglycerides: triglycerides || undefined
      };
      onNext(data);
    } else if (isSkipped) {
      onSkip();
    } else {
      const data: any = { knowsLDL };
      if (knowsLDL === 'just-high' || knowsLDL === 'unknown') {
        data.date = date.toISOString();
      }
      onNext(data);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (isSkipped) setIsSkipped(false);
  };

  const handleRadioChange = (value: string) => {
    setKnowsLDL(value);
    if (isSkipped) setIsSkipped(false);
  };

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

// ======================== 6. MAIN HealthMetricsFlow Component ========================
export const HealthMetricsFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [metricsData, setMetricsData] = useState<Partial<HealthMetrics>>({});

  useEffect(() => {
    const existing = getStorageItem('healthMetrics', healthMetricsSchema);
    if (existing) {
      setMetricsData(existing);
    }
  }, []);

  const pageTitles = ['Längd & vikt', 'Blodtryck', 'Blodfetter', 'Blodsocker'];
  const currentStep = currentPageIndex + 1;
  const TOTAL_STEPS = 4;

  const saveData = (data: Partial<HealthMetrics>) => {
    const updated = {
      ...metricsData,
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    setMetricsData(updated);
    
    const success = setStorageItem('healthMetrics', updated, healthMetricsSchema);
    if (!success) {
      try {
        localStorage.setItem('healthMetrics', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save health metrics:', e);
      }
    }
  };

  const handleNext = (pageData: any) => {
    const today = format(getCurrentDate(), 'yyyy-MM-dd');
    const existingLogs = JSON.parse(localStorage.getItem('dayLogs') || '[]');
    
    switch (currentPageIndex) {
      case 0: // Current measurements (height, weight, goalWeight)
        saveData({ 
          height: pageData.height, 
          weight: pageData.weight, 
          goalWeight: pageData.goalWeight 
        });
        
        if (pageData.weight) {
          const weight = safeParseFloat(pageData.weight);
          if (weight !== undefined && weight >= HEALTH_RANGES.weight.min && weight <= HEALTH_RANGES.weight.max) {
            addEntryToDayLogs(existingLogs, today, { type: 'weight', value: weight });
          }
        }
        break;
        
      case 1: // Blood pressure
        const bpDateRaw = pageData.date || today;
        const bpDate = bpDateRaw.includes('T') ? format(new Date(bpDateRaw), 'yyyy-MM-dd') : bpDateRaw;
        
        saveData({ 
          systolic: pageData.systolic,
          diastolic: pageData.diastolic,
          bloodPressureDate: bpDate,
        });
        
        if (pageData.systolic && pageData.diastolic) {
          const systolic = safeParseInt(pageData.systolic);
          const diastolic = safeParseInt(pageData.diastolic);
          if (systolic !== undefined && diastolic !== undefined &&
              systolic >= HEALTH_RANGES.systolic.min && systolic <= HEALTH_RANGES.systolic.max &&
              diastolic >= HEALTH_RANGES.diastolic.min && diastolic <= HEALTH_RANGES.diastolic.max) {
            addEntryToDayLogs(existingLogs, bpDate, { 
              type: 'bloodPressure', 
              value: systolic, 
              value2: diastolic
            });
          }
        }
        break;
        
      case 2: // Blood fats
        const bloodFatsDateRaw = pageData.date || today;
        const bloodFatsDate = bloodFatsDateRaw.includes('T') ? format(new Date(bloodFatsDateRaw), 'yyyy-MM-dd') : bloodFatsDateRaw;
        
        saveData({ 
          knowsLDL: pageData.knowsLDL,
          ldl: pageData.ldl,
          hdl: pageData.hdl,
          triglycerides: pageData.triglycerides,
          bloodFatsDate: bloodFatsDate,
        });
        
        if (pageData.ldl) {
          const ldl = safeParseFloat(pageData.ldl);
          if (ldl !== undefined && ldl >= HEALTH_RANGES.ldl.min && ldl <= HEALTH_RANGES.ldl.max) {
            const hdl = safeParseFloat(pageData.hdl);
            const triglycerides = safeParseFloat(pageData.triglycerides);
            addEntryToDayLogs(existingLogs, bloodFatsDate, { 
              type: 'bloodFats', 
              value: ldl,
              value2: (hdl !== undefined && hdl >= HEALTH_RANGES.hdl.min && hdl <= HEALTH_RANGES.hdl.max) ? hdl : undefined,
              value3: (triglycerides !== undefined && triglycerides >= HEALTH_RANGES.triglycerides.min && triglycerides <= HEALTH_RANGES.triglycerides.max) ? triglycerides : undefined
            });
          }
        }
        break;
        
      case 3: // Blood glucose
        const bloodGlucoseDateRaw = pageData.date || today;
        const bloodGlucoseDate = bloodGlucoseDateRaw.includes('T') ? format(new Date(bloodGlucoseDateRaw), 'yyyy-MM-dd') : bloodGlucoseDateRaw;
        
        saveData({ 
          hba1c: pageData.hba1c,
          fastingGlucose: pageData.fastingGlucose,
          bloodGlucoseDate: bloodGlucoseDate,
        });
        
        if (pageData.hba1c || pageData.fastingGlucose) {
          const hba1c = safeParseFloat(pageData.hba1c);
          const fastingGlucose = safeParseFloat(pageData.fastingGlucose);
          
          const validHba1c = hba1c !== undefined && hba1c >= HEALTH_RANGES.hba1c.min && hba1c <= HEALTH_RANGES.hba1c.max;
          const validFasting = fastingGlucose !== undefined && fastingGlucose >= HEALTH_RANGES.fastingGlucose.min && fastingGlucose <= HEALTH_RANGES.fastingGlucose.max;
          
          if (validHba1c || validFasting) {
            addEntryToDayLogs(existingLogs, bloodGlucoseDate, { 
              type: 'bloodGlucose', 
              value: validHba1c ? hba1c : (validFasting ? fastingGlucose : 0),
              value2: validFasting ? fastingGlucose : undefined
            });
          }
        }
        break;
    }
    
    localStorage.setItem('dayLogs', JSON.stringify(existingLogs));

    if (currentPageIndex < TOTAL_STEPS - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      finishFlow();
    }
  };

  const addEntryToDayLogs = (logs: DayLog[], dateStr: string, entry: any) => {
    const existingLogIndex = logs.findIndex(log => log.date === dateStr);
    
    if (existingLogIndex >= 0) {
      logs[existingLogIndex].entries = logs[existingLogIndex].entries.filter(e => e.type !== entry.type);
      logs[existingLogIndex].entries.push(entry);
    } else {
      logs.push({ date: dateStr, entries: [entry] });
    }
  };

  const handleSkip = () => {
    if (currentPageIndex < TOTAL_STEPS - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      finishFlow();
    }
  };

  const handleBack = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const finishFlow = () => {
    const completedActivities = getStorageItem('completedActivities', completedActivitiesSchema) || [];
    const activities = Array.isArray(completedActivities) ? completedActivities : [];
    const existingActivity = activities.find(a => a.id === 'health-metrics');
    if (!existingActivity) {
      activities.push({
        id: 'health-metrics',
        title: 'Hälsomått',
        completedDate: new Date().toISOString(),
        type: 'health-metrics'
      });
      setStorageItem('completedActivities', activities, completedActivitiesSchema);
    }

    markCardCompleted('health-metrics');

    toast({
      title: "Startvärden sparade",
      description: "Dina mätningar har sparats. Ändra eller lägg till under 'Mina sidor'",
    });

    navigate('/app/today');
  };

  return (
    <div className={pageContainer}>
      <div className={headerContainer}>
        {currentPageIndex === 0 ? (
          <BackToTodayButton />
        ) : (
          <ButtonAbort className="absolute right-4 top-4" />
        )}
        <h1 className={sectionHeading}>{pageTitles[currentPageIndex]}</h1>
      </div>

      <main className={pagePadding}>
        {currentPageIndex === 0 && (
          <WeightHeightWizard
            onNext={handleNext}
            onSkip={handleSkip}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        )}
        {currentPageIndex === 1 && (
          <BloodPressure
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        )}
        {currentPageIndex === 2 && (
          <BloodFats
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        )}
        {currentPageIndex === 3 && (
          <BloodGlucose
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        )}
      </main>
    </div>
  );
}; 