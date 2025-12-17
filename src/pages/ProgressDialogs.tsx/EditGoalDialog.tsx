// components/dialogs/GoalEditDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GoalEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalEditType: 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose' | null;
  goalWeightInput: string;
  onGoalWeightInputChange: (value: string) => void;
  goalSystolicInput: string;
  onGoalSystolicInputChange: (value: string) => void;
  goalDiastolicInput: string;
  onGoalDiastolicInputChange: (value: string) => void;
  goalLDLInput: string;
  onGoalLDLInputChange: (value: string) => void;
  goalHDLInput: string;
  onGoalHDLInputChange: (value: string) => void;
  goalHbA1cInput: string;
  onGoalHbA1cInputChange: (value: string) => void;
  goalFastingGlucoseInput: string;
  onGoalFastingGlucoseInputChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function GoalEditDialog({
  open,
  onOpenChange,
  goalEditType,
  goalWeightInput,
  onGoalWeightInputChange,
  goalSystolicInput,
  onGoalSystolicInputChange,
  goalDiastolicInput,
  onGoalDiastolicInputChange,
  goalLDLInput,
  onGoalLDLInputChange,
  goalHDLInput,
  onGoalHDLInputChange,
  goalHbA1cInput,
  onGoalHbA1cInputChange,
  goalFastingGlucoseInput,
  onGoalFastingGlucoseInputChange,
  onSave,
  onCancel,
}: GoalEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {goalEditType === 'weight' && 'Ändra målvikt'}
            {goalEditType === 'bloodPressure' && 'Ändra målblodtryck'}
            {goalEditType === 'bloodFats' && 'Ändra kolesterolmål'}
            {goalEditType === 'bloodGlucose' && 'Ändra blodsockermål'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {goalEditType === 'weight' && (
            <div>
              <Label htmlFor="goal-weight-input" className="text-base mb-2 block">Målvikt (kg)</Label>
              <Input
                id="goal-weight-input"
                type="number"
                step="0.1"
                value={goalWeightInput}
                onChange={(e) => onGoalWeightInputChange(e.target.value)}
                placeholder="Ange målvikt i kg"
                className="w-full"
              />
            </div>
          )}
          {goalEditType === 'bloodPressure' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="goal-systolic-input" className="text-base mb-2 block">Systoliskt målvärde (övre)</Label>
                <Input
                  id="goal-systolic-input"
                  type="number"
                  value={goalSystolicInput}
                  onChange={(e) => onGoalSystolicInputChange(e.target.value)}
                  placeholder="T.ex. 120"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="goal-diastolic-input" className="text-base mb-2 block">Diastoliskt målvärde (nedre)</Label>
                <Input
                  id="goal-diastolic-input"
                  type="number"
                  value={goalDiastolicInput}
                  onChange={(e) => onGoalDiastolicInputChange(e.target.value)}
                  placeholder="T.ex. 80"
                  className="w-full"
                />
              </div>
            </div>
          )}
          {goalEditType === 'bloodFats' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="goal-ldl-input" className="text-base mb-2 block">LDL målvärde (mmol/L)</Label>
                <Input
                  id="goal-ldl-input"
                  type="number"
                  step="0.1"
                  value={goalLDLInput}
                  onChange={(e) => onGoalLDLInputChange(e.target.value)}
                  placeholder="T.ex. 2.5"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">Rekommenderat under 3.0 mmol/L</p>
              </div>
              <div>
                <Label htmlFor="goal-hdl-input" className="text-base mb-2 block">HDL målvärde (mmol/L) - Valfritt</Label>
                <Input
                  id="goal-hdl-input"
                  type="number"
                  step="0.1"
                  value={goalHDLInput}
                  onChange={(e) => onGoalHDLInputChange(e.target.value)}
                  placeholder="T.ex. 1.5"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">Rekommenderat över 1.0 mmol/L</p>
              </div>
            </div>
          )}
          {goalEditType === 'bloodGlucose' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="goal-hba1c-input" className="text-base mb-2 block">HbA1c målvärde (mmol/mol)</Label>
                <Input
                  id="goal-hba1c-input"
                  type="number"
                  step="1"
                  value={goalHbA1cInput}
                  onChange={(e) => onGoalHbA1cInputChange(e.target.value)}
                  placeholder="T.ex. 42"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">Rekommenderat under 52 mmol/mol</p>
              </div>
              <div>
                <Label htmlFor="goal-fasting-glucose-input" className="text-base mb-2 block">Fasteblodsocker målvärde (mmol/L) - Valfritt</Label>
                <Input
                  id="goal-fasting-glucose-input"
                  type="number"
                  step="0.1"
                  value={goalFastingGlucoseInput}
                  onChange={(e) => onGoalFastingGlucoseInputChange(e.target.value)}
                  placeholder="T.ex. 5.5"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">Rekommenderat under 6.0 mmol/L</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onCancel} className="text-base py-6">
            Avbryt
          </Button>
          <Button onClick={onSave} className="text-base py-6">
            Spara mål
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}