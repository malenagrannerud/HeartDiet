/**
 * @module AddMeasurementDialog
 *
 * @description
 * Dialog component for adding a new health measurement entry.
 * Renders dynamic input fields depending on the metric type:
 * - Weight: single value
 * - Blood pressure: systolic + diastolic
 * - Blood fats: LDL (required), HDL and triglycerides (optional)
 * - Blood glucose: HbA1c + fasting glucose (optional)
 */

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { MetricType } from "./metric-config";

interface AddMeasurementDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback to toggle dialog visibility */
  onOpenChange: (open: boolean) => void;
  /** Current metric type */
  metricType: MetricType;
  /**
   * Called with raw input strings when user saves.
   * @param date - ISO date string
   * @param value - Primary value (weight, systolic, LDL, HbA1c)
   * @param value2 - Secondary value (diastolic, HDL, fasting glucose)
   * @param value3 - Tertiary value (triglycerides)
   */
  onSave: (date: string, value: string, value2: string, value3: string) => void;
}

/**
 * Renders a dialog for creating a new measurement with date and metric-specific fields.
 *
 * @component
 * @param props - See {@link AddMeasurementDialogProps}
 */
export const AddMeasurementDialog: React.FC<AddMeasurementDialogProps> = ({
  open,
  onOpenChange,
  metricType,
  onSave,
}) => {
  const [dateInput, setDateInput] = useState("");
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");

  /** Reset inputs and default date to today when dialog opens */
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setDateInput(format(new Date(), "yyyy-MM-dd"));
      setValue("");
      setValue2("");
      setValue3("");
    }
    onOpenChange(isOpen);
  };

  /** Primary field label based on metric type */
  const getPrimaryLabel = (): string => {
    switch (metricType) {
      case "weight":
        return "Vikt (kg)";
      case "bloodPressure":
        return "Systoliskt (mmHg)";
      case "bloodFats":
        return "LDL (mmol/L)";
      case "bloodGlucose":
        return "HbA1c (mmol/mol)";
      default:
        return "Värde";
    }
  };

  /** Primary field placeholder */
  const getPrimaryPlaceholder = (): string => {
    switch (metricType) {
      case "weight":
        return "Ange vikt";
      case "bloodPressure":
        return "Ange systoliskt";
      case "bloodFats":
        return "Ange LDL";
      case "bloodGlucose":
        return "Ange HbA1c";
      default:
        return "Ange värde";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lägg till mätning</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Date picker */}
          <div>
            <Label>Datum</Label>
            <Input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
          </div>

          {/* Primary value - always shown */}
          <div>
            <Label>{getPrimaryLabel()}</Label>
            <Input
              type="number"
              step={metricType === "weight" || metricType === "bloodFats" ? "0.1" : "1"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={getPrimaryPlaceholder()}
            />
          </div>

          {/* Blood pressure: diastolic */}
          {metricType === "bloodPressure" && (
            <div>
              <Label>Diastoliskt (mmHg)</Label>
              <Input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="Ange diastoliskt"
              />
            </div>
          )}

          {/* Blood fats: HDL + triglycerides (optional) */}
          {metricType === "bloodFats" && (
            <>
              <div>
                <Label>HDL (mmol/L) - valfritt</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  placeholder="Ange HDL"
                />
              </div>
              <div>
                <Label>Triglycerider (mmol/L) - valfritt</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={value3}
                  onChange={(e) => setValue3(e.target.value)}
                  placeholder="Ange triglycerider"
                />
              </div>
            </>
          )}

          {/* Blood glucose: fasting glucose (optional) */}
          {metricType === "bloodGlucose" && (
            <div>
              <Label>Fasteglukos (mmol/L) - valfritt</Label>
              <Input
                type="number"
                step="0.1"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="Ange fasteglukos"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button onClick={() => onSave(dateInput, value, value2, value3)}>
            Spara
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
