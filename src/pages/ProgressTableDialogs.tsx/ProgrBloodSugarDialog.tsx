// components/dialogs/BloodGlucoseDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BloodGlucoseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bloodGlucoseDateInput: string;
  onBloodGlucoseDateInputChange: (value: string) => void;
  hba1cInput: string;
  onHba1cInputChange: (value: string) => void;
  fastingGlucoseInput: string;
  onFastingGlucoseInputChange: (value: string) => void;
  existingBloodGlucoseEntry: { hba1c?: number; fastingGlucose?: number } | null;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function BloodGlucoseDialog({
  open,
  onOpenChange,
  bloodGlucoseDateInput,
  onBloodGlucoseDateInputChange,
  hba1cInput,
  onHba1cInputChange,
  fastingGlucoseInput,
  onFastingGlucoseInputChange,
  existingBloodGlucoseEntry,
  onSave,
  onDelete,
  onCancel,
}: BloodGlucoseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingBloodGlucoseEntry ? 'Ändra blodsockervärden' : 'Lägg till blodsockervärden'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="bloodglucose-date-input" className="text-base mb-2 block">Datum för mätning</Label>
            <Input
              id="bloodglucose-date-input"
              type="date"
              value={bloodGlucoseDateInput}
              onChange={(e) => onBloodGlucoseDateInputChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="hba1c-input" className="text-base mb-2 block">HbA1c (mmol/mol)</Label>
            <Input
              id="hba1c-input"
              type="number"
              step="1"
              value={hba1cInput}
              onChange={(e) => onHba1cInputChange(e.target.value)}
              placeholder="T.ex. 48"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">Målvärde är vanligtvis under 52 mmol/mol</p>
          </div>
          
          <div>
            <Label htmlFor="fasting-glucose-input" className="text-base mb-2 block">Fasteblodsocker (mmol/L)</Label>
            <Input
              id="fasting-glucose-input"
              type="number"
              step="0.1"
              value={fastingGlucoseInput}
              onChange={(e) => onFastingGlucoseInputChange(e.target.value)}
              placeholder="T.ex. 5.5"
              className="w-full"
            />
          </div>
        </div>
        
        <DialogFooter className="gap-3">
          {existingBloodGlucoseEntry && (
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