/**
 * @module MainOnboardMatningar
 * @description Simple 5-step onboarding: Name → Age → Height → Weight → Goal Weight
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { ButtonAbort } from "@/components/ButtonAbort";
import { ButtonBackForward } from "@/components/ButtonBackForward";
import { ProgressIndicator } from "./ProgressIndicator";
import { CheckBoxSkipNow } from "@/components/CheckBoxSkipNow";
import { useToast } from "@/hooks/use-toast";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { completedActivitiesSchema, healthMetricsSchema } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion";
import { sectionHeading, headerContainer, pageContainer, pagePadding, standardCard, standardSpacing } from "@/lib/design-tokens";
import { getCurrentDate } from "@/lib/simulated-date";
import { format } from "date-fns";
import { safeParseFloat, HEALTH_RANGES } from "@/lib/health-validators";

const TOTAL_STEPS = 5;

/** Step configuration for the 5-page flow */
const STEPS = [
  { key: 'name', title: 'Namn', question: 'Vad heter du?', type: 'text', placeholder: 'Ditt namn' },
  { key: 'age', title: 'Ålder', question: 'Hur gammal är du?', type: 'number', placeholder: '45', unit: 'år' },
  { key: 'height', title: 'Längd', question: 'Vad är din längd?', type: 'number', placeholder: '175', unit: 'cm' },
  { key: 'weight', title: 'Vikt', question: 'Vad är din nuvarande vikt?', type: 'number', placeholder: '85', unit: 'kg' },
  { key: 'goalWeight', title: 'Målvikt', question: 'Vad är din målvikt?', type: 'number', placeholder: '75', unit: 'kg' },
] as const;

const HealthMetricsFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isSkipped, setIsSkipped] = useState(false);

  // Load existing data on mount
  useEffect(() => {
    const existing = getStorageItem('healthMetrics', healthMetricsSchema);
    if (existing) {
      const loaded: Record<string, string> = {};
      if (existing.height) loaded.height = existing.height;
      if (existing.weight) loaded.weight = existing.weight;
      if (existing.goalWeight) loaded.goalWeight = existing.goalWeight;
      // name and age stored separately
      const name = localStorage.getItem('userName');
      const age = localStorage.getItem('userAge');
      if (name) loaded.name = name;
      if (age) loaded.age = age;
      setValues(loaded);
    }
  }, []);

  const step = STEPS[currentPageIndex];
  const currentValue = values[step.key] || '';
  const isValid = currentValue !== '' || isSkipped;
  const isLastStep = currentPageIndex === TOTAL_STEPS - 1;

  const handleValueChange = (val: string) => {
    setValues(prev => ({ ...prev, [step.key]: val }));
    if (isSkipped) setIsSkipped(false);
  };

  const handleContinue = () => {
    if (!currentValue && isSkipped) {
      // Skip - move forward without saving this field
    }

    if (isLastStep) {
      finishFlow();
    } else {
      setCurrentPageIndex(prev => prev + 1);
      setIsSkipped(false);
    }
  };

  const handleBack = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      setIsSkipped(false);
    }
  };

  /** Save all collected data and complete the flow */
  const finishFlow = () => {
    const today = format(getCurrentDate(), 'yyyy-MM-dd');

    // Save name and age to localStorage directly
    if (values.name) localStorage.setItem('userName', values.name);
    if (values.age) localStorage.setItem('userAge', values.age);

    // Save health metrics (height, weight, goalWeight)
    const metricsUpdate: Record<string, string> = { lastUpdated: new Date().toISOString() };
    if (values.height) metricsUpdate.height = values.height;
    if (values.weight) metricsUpdate.weight = values.weight;
    if (values.goalWeight) metricsUpdate.goalWeight = values.goalWeight;

    const existing = getStorageItem('healthMetrics', healthMetricsSchema) || {};
    const merged = { ...existing, ...metricsUpdate };
    setStorageItem('healthMetrics', merged, healthMetricsSchema);

    // Add weight to day logs if provided
    if (values.weight) {
      const weight = safeParseFloat(values.weight);
      if (weight !== undefined && weight >= HEALTH_RANGES.weight.min && weight <= HEALTH_RANGES.weight.max) {
        const existingLogs = JSON.parse(localStorage.getItem('dayLogs') || '[]');
        const logIndex = existingLogs.findIndex((log: any) => log.date === today);
        const entry = { type: 'weight', value: weight, timestamp: new Date().toISOString() };
        if (logIndex >= 0) {
          existingLogs[logIndex].entries = existingLogs[logIndex].entries.filter((e: any) => e.type !== 'weight');
          existingLogs[logIndex].entries.push(entry);
        } else {
          existingLogs.push({ date: today, entries: [entry] });
        }
        localStorage.setItem('dayLogs', JSON.stringify(existingLogs));
      }
    }

    // Mark as completed
    const completedActivities = getStorageItem('completedActivities', completedActivitiesSchema) || [];
    const activities = Array.isArray(completedActivities) ? completedActivities : [];
    if (!activities.find(a => a.id === 'health-metrics')) {
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
      title: "Uppgifter sparade",
      description: "Dina uppgifter har sparats.",
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
        <h1 className={sectionHeading}>{step.title}</h1>
      </div>

      <main className={pagePadding}>
        <div className={pageContainer}>
          <div className="mb-30">
            <ProgressIndicator currentStep={currentPageIndex + 1} totalSteps={TOTAL_STEPS} />
          </div>

          <section className={standardSpacing.sectionContent}>
            <Card className={standardCard}>
              <div className="p-10 space-y-10">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {step.question}
                    {'unit' in step && ` (${step.unit})`}
                  </h1>
                  <Input
                    type={step.type}
                    value={currentValue}
                    onChange={(e) => handleValueChange(e.target.value)}
                    placeholder={step.placeholder}
                    autoFocus
                    step={step.type === 'number' ? '0.1' : undefined}
                  />
                </div>

                <CheckBoxSkipNow
                  isSkipped={isSkipped}
                  setIsSkipped={setIsSkipped}
                />
              </div>
            </Card>
          </section>

          {/* Navigation buttons */}
          <section className="fixed bottom-24 left-0 right-0 px-4 z-10">
            {currentPageIndex === 0 ? (
              <div className="max-w-md mx-auto">
                <Button
                  onClick={handleContinue}
                  disabled={!isValid}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  Nästa
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <ButtonBackForward
                  onBack={handleBack}
                  onForward={handleContinue}
                  forwardDisabled={!isValid}
                  forwardLabel={isLastStep ? 'Spara' : undefined}
                />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default HealthMetricsFlow;
