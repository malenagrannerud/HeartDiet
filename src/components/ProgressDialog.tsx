import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { tips } from "@/data/tips";
import { ProgressDayLog } from "@/lib/progress-types";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface ProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  entryType: 'weight' | 'bloodPressure' | 'tip';
  onEntryTypeChange: (type: 'weight' | 'bloodPressure' | 'tip') => void;
  selectedTipIds: number[];
  onSelectedTipIdsChange: (ids: number[]) => void;
  weightInput: string;
  onWeightInputChange: (value: string) => void;
  systolicInput: string;
  onSystolicInputChange: (value: string) => void;
  diastolicInput: string;
  onDiastolicInputChange: (value: string) => void;
  dayLogs: ProgressDayLog[];
  onSaveEntry: () => void;
  onDeleteEntry: (entryIndex: number) => void;
}

/**
 * Dialog component for adding/editing progress entries
 * Allows users to log tips followed, weight measurements, and blood pressure readings
 */
export const ProgressDialog: React.FC<ProgressDialogProps> = ({
  open,
  onOpenChange,
  selectedDate,
  entryType,
  onEntryTypeChange,
  selectedTipIds,
  onSelectedTipIdsChange,
  weightInput,
  onWeightInputChange,
  systolicInput,
  onSystolicInputChange,
  diastolicInput,
  onDiastolicInputChange,
  dayLogs,
  onSaveEntry,
  onDeleteEntry
}) => {
  /**
   * Retrieves existing entries for the selected date
   * @returns Array of entries for the selected date
   */
  const getExistingEntries = () => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    return log?.entries || [];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Redigera {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: sv })}
          </DialogTitle>
        </DialogHeader>
        
        {/* Display existing entries with delete option */}
        {getExistingEntries().length > 0 && (
          <div className="space-y-2 pb-4 border-b">
            <Label className="text-base font-semibold">Dina inlägg</Label>
            {getExistingEntries().map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <div className="text-sm font-medium">
                  {entry.type === 'tip' && (
                    <span>{tips.find(t => t.id === entry.tipId)?.title}: {entry.value}g</span>
                  )}
                  {entry.type === 'weight' && <span>Vikt: {entry.value} kg</span>}
                  {entry.type === 'bloodPressure' && (
                    <span>Blodtryck: {entry.value}/{entry.value2} mmHg</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteEntry(index)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10"
                >
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4 py-4">
          {/* Entry type selection */}
          <div>
            <Label className="text-lg mb-4 block font-semibold">Logga</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={entryType === 'tip' ? 'default' : 'outline'}
                onClick={() => onEntryTypeChange('tip')}
                className="w-full text-base py-6 min-h-[56px]"
              >
                Tips
              </Button>
              <Button
                variant={entryType === 'weight' ? 'default' : 'outline'}
                onClick={() => onEntryTypeChange('weight')}
                className="w-full text-base py-6 min-h-[56px]"
              >
                Vikt
              </Button>
              <Button
                variant={entryType === 'bloodPressure' ? 'default' : 'outline'}
                onClick={() => onEntryTypeChange('bloodPressure')}
                className="w-full text-base py-6 min-h-[56px]"
              >
                Blodtryck
              </Button>
            </div>
          </div>

          {/* Tip selection interface */}
          {entryType === 'tip' && (
            <div className="space-y-4">
              <div>
                <Label className="text-base mb-3 block font-semibold">Vilka tips följde du idag?</Label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {tips.map((tip) => (
                    <div 
                      key={tip.id} 
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{ 
                        backgroundColor: tip.color || '#f3f4f6',
                        borderColor: tip.color ? `${tip.color}80` : '#e5e7eb'
                      }}
                    >
                      <Label htmlFor={`tip-${tip.id}`} className="flex-1 cursor-pointer text-sm font-medium">
                        {tip.title}
                      </Label>
                      <input
                        id={`tip-${tip.id}`}
                        type="checkbox"
                        checked={selectedTipIds.includes(tip.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onSelectedTipIdsChange([...selectedTipIds, tip.id]);
                          } else {
                            onSelectedTipIdsChange(selectedTipIds.filter(id => id !== tip.id));
                          }
                        }}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Weight input interface */}
          {entryType === 'weight' && (
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
          )}

          {/* Blood pressure input interface */}
          {entryType === 'bloodPressure' && (
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
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-base py-6 min-h-[56px]">
            Avbryt
          </Button>
          <Button onClick={onSaveEntry} className="text-base py-6 min-h-[56px]">
            Spara
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};