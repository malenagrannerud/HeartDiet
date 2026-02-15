
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BloodFatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bloodFatsDateInput: string;
  onBloodFatsDateInputChange: (value: string) => void;
  ldlInput: string;
  onLdlInputChange: (value: string) => void;
  hdlInput: string;
  onHdlInputChange: (value: string) => void;
  triglyceridesInput: string;
  onTriglyceridesInputChange: (value: string) => void;
  existingBloodFatsEntry: { ldl: number; hdl?: number; triglycerides?: number } | null;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function BloodFatsDialog({
  open,
  onOpenChange,
  bloodFatsDateInput,
  onBloodFatsDateInputChange,
  ldlInput,
  onLdlInputChange,
  hdlInput,
  onHdlInputChange,
  triglyceridesInput,
  onTriglyceridesInputChange,
  existingBloodFatsEntry,
  onSave,
  onDelete,
  onCancel,
}: BloodFatsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingBloodFatsEntry ? 'Ändra kolesterolvärden' : 'Lägg till kolesterolvärden'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="bloodfats-date-input" className="text-base mb-2 block">Datum för mätning</Label>
            <Input
              id="bloodfats-date-input"
              type="date"
              value={bloodFatsDateInput}
              onChange={(e) => onBloodFatsDateInputChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="ldl-input" className="text-base mb-2 block">LDL-kolesterol (mmol/L) *</Label>
            <Input
              id="ldl-input"
              type="number"
              step="0.1"
              value={ldlInput}
              onChange={(e) => onLdlInputChange(e.target.value)}
              placeholder="T.ex. 3.5"
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="hdl-input" className="text-base mb-2 block">HDL-kolesterol (mmol/L)</Label>
            <Input
              id="hdl-input"
              type="number"
              step="0.1"
              value={hdlInput}
              onChange={(e) => onHdlInputChange(e.target.value)}
              placeholder="T.ex. 1.3"
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="triglycerides-input" className="text-base mb-2 block">Triglycerider (mmol/L)</Label>
            <Input
              id="triglycerides-input"
              type="number"
              step="0.1"
              value={triglyceridesInput}
              onChange={(e) => onTriglyceridesInputChange(e.target.value)}
              placeholder="T.ex. 1.7"
              className="w-full"
            />
          </div>
        </div>
        
        <DialogFooter className="gap-3">
          {existingBloodFatsEntry && (
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