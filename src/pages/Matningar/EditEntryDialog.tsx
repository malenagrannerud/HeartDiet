/**
 * @module EditEntryDialog
 *
 * @description
 * Dialog component for editing or deleting an existing health measurement entry.
 * Manages its own local input state and delegates persistence to parent callbacks.
 */

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { MetricType, MetricConfigItem } from "./metric-config";

/** Shape of the entry being edited */
export interface SelectedEntry {
  date: string;
  value: number;
  value2?: number;
}

interface EditEntryDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback to toggle dialog visibility */
  onOpenChange: (open: boolean) => void;
  /** Current metric type being viewed */
  metricType: MetricType;
  /** Display config for the metric */
  config: MetricConfigItem;
  /** The entry being edited, or null if none selected */
  selectedEntry: SelectedEntry | null;
  /** Called when user saves edits; receives raw string inputs */
  onSave: (value: string, value2: string) => void;
  /** Called when user deletes the entry */
  onDelete: () => void;
}

/**
 * Renders a dialog for modifying or removing a single logged measurement.
 *
 * @component
 * @param props - See {@link EditEntryDialogProps}
 */
export const EditEntryDialog: React.FC<EditEntryDialogProps> = ({
  open,
  onOpenChange,
  metricType,
  config,
  selectedEntry,
  onSave,
  onDelete,
}) => {
  const [editValue, setEditValue] = useState("");
  const [editValue2, setEditValue2] = useState("");

  /** Sync local state when a new entry is selected */
  useEffect(() => {
    if (selectedEntry) {
      setEditValue(selectedEntry.value.toString());
      setEditValue2(selectedEntry.value2?.toString() || "");
    }
  }, [selectedEntry]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Ändra värde för{" "}
            {selectedEntry &&
              format(new Date(selectedEntry.date), "d MMMM yyyy", { locale: sv })}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>
              {metricType === "bloodPressure" ? "Systoliskt" : config.title}
            </Label>
            <Input
              type="number"
              step={
                metricType === "weight" || metricType === "bloodFats"
                  ? "0.1"
                  : "1"
              }
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          </div>
          {metricType === "bloodPressure" && (
            <div>
              <Label>Diastoliskt</Label>
              <Input
                type="number"
                value={editValue2}
                onChange={(e) => setEditValue2(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="destructive" onClick={onDelete}>
            Radera
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button onClick={() => onSave(editValue, editValue2)}>Spara</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
