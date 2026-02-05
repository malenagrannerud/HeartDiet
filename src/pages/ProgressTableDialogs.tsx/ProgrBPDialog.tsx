// components/dialogs/BloodPressureDialog.tsx
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BloodPressureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  systolicInput: string;
  onSystolicInputChange: (value: string) => void;
  diastolicInput: string;
  onDiastolicInputChange: (value: string) => void;
  existingBPEntry: { systolic: number; diastolic: number } | null;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function BloodPressureDialog({
  open,
  onOpenChange,
  selectedDate,
  systolicInput,
  onSystolicInputChange,
  diastolicInput,
  onDiastolicInputChange,
  existingBPEntry,
  onSave,
  onDelete,
  onCancel,
}: BloodPressureDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingBPEntry ? 'Ändra blodtryck' : 'Lägg till blodtryck'} för {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: sv })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {existingBPEntry && (
            <div className="p-3 bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Nuvarande värde:</p>
              <p className="text-lg font-semibold">{existingBPEntry.systolic}/{existingBPEntry.diastolic} mmHg</p>
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="systolic-input" className="text-base mb-2 block">Systoliskt (övre värde)</Label>
              <Input
                id="systolic-input"
                type="number"
                value={systolicInput}
                onChange={(e) => onSystolicInputChange(e.target.value)}
                placeholder="T.ex. 120"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="diastolic-input" className="text-base mb-2 block">Diastoliskt (nedre värde)</Label>
              <Input
                id="diastolic-input"
                type="number"
                value={diastolicInput}
                onChange={(e) => onDiastolicInputChange(e.target.value)}
                placeholder="T.ex. 80"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          {existingBPEntry && (
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