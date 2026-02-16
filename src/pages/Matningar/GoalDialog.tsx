/**
 * @module GoalDialog
 *
 * @description
 * Dialog component for viewing and updating health metric goal/target values.
 * Manages its own local input state and calls parent callback on save.
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { MetricType, MetricConfigItem } from "./metric-config";

interface GoalDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback to toggle dialog visibility */
  onOpenChange: (open: boolean) => void;
  /** Current metric type */
  metricType: MetricType;
  /** Display config for the metric */
  config: MetricConfigItem;
  /** Current primary goal value */
  currentGoal?: number;
  /** Current secondary goal value (e.g. diastolic for blood pressure) */
  currentGoal2?: number;
  /** Called with raw input strings when user saves */
  onSave: (goalInput: string, goalInput2: string) => void;
}

/**
 * Renders a dialog for setting or updating metric target values.
 *
 * @component
 * @param props - See {@link GoalDialogProps}
 */
export const GoalDialog: React.FC<GoalDialogProps> = ({
  open,
  onOpenChange,
  metricType,
  config,
  currentGoal,
  currentGoal2,
  onSave,
}) => {
  const [goalInput, setGoalInput] = useState("");
  const [goalInput2, setGoalInput2] = useState("");

  /** Pre-fill inputs when dialog opens with current values */
  useEffect(() => {
    if (open) {
      setGoalInput(currentGoal?.toString() || "");
      setGoalInput2(currentGoal2?.toString() || "");
    }
  }, [open, currentGoal, currentGoal2]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ändra målvärde</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>
              {metricType === "bloodPressure"
                ? "Mål systoliskt"
                : config.goalLabel}
            </Label>
            <Input
              type="number"
              step={
                metricType === "weight" ||
                metricType === "bloodFats" ||
                metricType === "bloodGlucose"
                  ? "0.1"
                  : "1"
              }
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder={`Ange ${config.goalLabel.toLowerCase()}`}
            />
          </div>
          {metricType === "bloodPressure" && (
            <div>
              <Label>Mål diastoliskt</Label>
              <Input
                type="number"
                value={goalInput2}
                onChange={(e) => setGoalInput2(e.target.value)}
                placeholder="Ange mål diastoliskt"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button onClick={() => onSave(goalInput, goalInput2)}>Spara</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
