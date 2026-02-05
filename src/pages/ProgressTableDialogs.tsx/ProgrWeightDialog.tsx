// components/dialogs/WeightDialog.tsx
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WeightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  weightInput: string;
  onWeightInputChange: (value: string) => void;
  existingWeightEntry: number | null;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function WeightDialog({
  open,
  onOpenChange,
  selectedDate,
  weightInput,
  onWeightInputChange,
  existingWeightEntry,
  onSave,
  onDelete,
  onCancel,
}: WeightDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingWeightEntry ? 'Ändra vikt' : 'Lägg till vikt'} för {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: sv })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {existingWeightEntry && (
            <div className="p-3 bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Nuvarande värde:</p>
              <p className="text-lg font-semibold">{existingWeightEntry} kg</p>
            </div>
          )}
          
          <div>
            <Label htmlFor="weight-input" className="text-base mb-2 block">Vikt (kg)</Label>
            <Input
              id="weight-input"
              type="number"
              step="0.1"
              value={weightInput}
              onChange={(e) => onWeightInputChange(e.target.value)}
              placeholder="Ange vikt i kg"
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter className="gap-3">
          {existingWeightEntry && (
            <Button 
              variant="destructive" 
              onClick={onDelete} 
              className="text-base py-6"
            >
              Radera
            </Button>
          )}
          <Button variant="outline" onClick={onCancel} className="text-base py-6">
            Avbryt
          </Button>
          <Button onClick={onSave} className="text-base py-6">
            Spara
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}