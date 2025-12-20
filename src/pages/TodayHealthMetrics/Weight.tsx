/**
 * CurrentMeasurements Component
 * 
 * First step in health metrics flow - collects height, weight, and goal weight.
 * 
 * DATA FLOW:
 * - Loads: Latest measurements from dayLogs + goals from healthMetrics via health-data helpers
 * - Saves: Passed to parent (index.tsx) which saves to dayLogs and healthMetrics
 */

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { standardCard, standardSpacing } from "@/lib/design-tokens";
import { CheckBoxSkipNow } from "@/components/CheckBoxSkipNow";
import { getLatestMeasurement, getHealthGoals, getLatestHeight } from "@/lib/health-data";

interface CurrentMeasurementsProps {
  onNext: (data: { height: string; weight: string; goalWeight: string }) => void;
  onSkip: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CurrentMeasurements = ({ onNext, onSkip, currentStep, totalSteps }: CurrentMeasurementsProps) => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    const savedHeight = getLatestHeight();
    if (savedHeight) setHeight(savedHeight);

    // Load latest weight from dayLogs (time-series)
    const latestWeight = getLatestMeasurement('weight');
    if (latestWeight) setWeight(latestWeight.value.toString());

    // Load goal weight from healthMetrics
    const goals = getHealthGoals();
    if (goals.goalWeight) setGoalWeight(goals.goalWeight.toString());
  }, []);

  const handleContinue = () => {
    if (height && weight) {
      onNext({ height, weight, goalWeight });
    } else if (isSkipped) {
      onSkip();
    }
  };

  const isValid = (height !== "" && weight !== "") || isSkipped;

  return (
    <div className={standardSpacing.pageContent}>
      <div className="mb-6">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <section className={standardSpacing.sectionContent}>
        <div className={standardSpacing.cardList}>
          <Card className={standardCard}>
            <div className="space-y-10">
              
              <div className="space-y-2">
                <Label htmlFor="height">Längd (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value);
                    // If user starts typing after skipping, un-mark as skipped
                    if (isSkipped) setIsSkipped(false);
                  }}
                  placeholder="Ex: 175"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Vikt (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    // If user starts typing after skipping, un-mark as skipped
                    if (isSkipped) setIsSkipped(false);
                  }}
                  placeholder="Ex: 95,5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalWeight">Målvikt (kg)</Label>
                <Input
                  id="goalWeight"
                  type="number"
                  step="0.1"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  placeholder="Ex: 80"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                
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
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            onClick={handleContinue}
            disabled={!isValid}
            className="flex-1 h-10 text-base"
            size="lg"
          >
            Nästa
            <ArrowRight className="mr-2 h-5 w-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};
