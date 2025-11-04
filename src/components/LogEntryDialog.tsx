// src/components/LogEntryDialog.tsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { tips } from '@/data/tips';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DayLog } from '@/types/progress';

interface LogEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  dayLogs: DayLog[];
  onUpdateDayLogs: (logs: DayLog[]) => void;
  onDeleteEntry: (entryIndex: number) => void;
  getExistingEntries: () => DayLog['entries'];
}

export const LogEntryDialog: React.FC<LogEntryDialogProps> = ({
  open,
  onOpenChange,
  selectedDate,
  dayLogs,
  onUpdateDayLogs,
  onDeleteEntry,
  getExistingEntries
}) => {
  const [entryType, setEntryType] = useState<'weight' | 'bloodPressure' | 'tip'>('tip');
  const [selectedTipId, setSelectedTipId] = useState<number>(1);
  const [gramsInput, setGramsInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [systolicInput, setSystolicInput] = useState("");
  const [diastolicInput, setDiastolicInput] = useState("");

  const handleSaveEntry = () => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    let existingLog = dayLogs.find(log => log.date === dateStr);
    
    if (!existingLog) {
      existingLog = { date: dateStr, entries: [] };
    }
    
    // Create new entry based on type
    let newEntry;
    if (entryType === 'tip') {
      const grams = parseInt(gramsInput) || 0;
      if (grams > 0) {
        newEntry = { type: 'tip' as const, value: grams, tipId: selectedTipId };
      }
    } else if (entryType === 'weight') {
      const kg = parseFloat(weightInput) || 0;
      if (kg > 0) {
        newEntry = { type: 'weight' as const, value: kg };
      }
    } else if (entryType === 'bloodPressure') {
      const systolic = parseInt(systolicInput) || 0;
      const diastolic = parseInt(diastolicInput) || 0;
      if (systolic > 0 && diastolic > 0) {
        newEntry = { type: 'bloodPressure' as const, value: systolic, value2: diastolic };
      }
    }
    
    if (newEntry) {
      const updatedEntries = [...existingLog.entries, newEntry];
      const updatedLogs = dayLogs.filter(log => log.date !== dateStr);
      updatedLogs.push({ date: dateStr, entries: updatedEntries });
      
      onUpdateDayLogs(updatedLogs);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Redigera {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: sv })}
          </DialogTitle>
          <DialogDescription>Lägg till eller ta bort inlägg för denna dag</DialogDescription>
        </DialogHeader>
        
        {/* Existing Entries */}
        {getExistingEntries().length > 0 && (
          <div className="space-y-2 pb-4 border-b">
            <Label className="text-base font-semibold">Dina inlägg</Label>
            {getExistingEntries().map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <div className="text-sm font-medium">
                  {entry.type === 'tip' && (
                    <span>
                      {tips.find(t => t.id === entry.tipId)?.title}: {entry.value}g
                    </span>
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
          <div>
            <Label className="text-lg mb-4 block font-semibold">Vad vill du logga?</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={entryType === 'tip' ? 'default' : 'outline'}
                onClick={() => setEntryType('tip')}
                className="w-full text-base py-6 min-h-[56px]"
              >
                Tips
              </Button>
              <Button
                variant={entryType === 'weight' ? 'default' : 'outline'}
                onClick={() => setEntryType('weight')}
                className="w-full text-base py-6 min-h-[56px]"
              >
                Vikt
              </Button>
              <Button
                variant={entryType === 'bloodPressure' ? 'default' : 'outline'}
                onClick={() => setEntryType('bloodPressure')}
                className="w-full text-base py-6 min-h-[56px]"
              >
                Blodtryck
              </Button>
            </div>
          </div>

          {entryType === 'tip' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="tip-select" className="text-base mb-2 block">
                  Välj tips-kategori
                </Label>
                <select
                  id="tip-select"
                  value={selectedTipId}
                  onChange={(e) => setSelectedTipId(parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  {tips.map(tip => (
                    <option key={tip.id} value={tip.id}>{tip.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="grams-input" className="text-base mb-2 block">
                  Hur många gram?
                </Label>
                <Input
                  id="grams-input"
                  type="number"
                  value={gramsInput}
                  onChange={(e) => setGramsInput(e.target.value)}
                  placeholder="Ange gram"
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Minst 500g för att markera dagen som klarad
                </p>
              </div>
            </div>
          )}

          {entryType === 'weight' && (
            <div>
              <Label htmlFor="weight-input" className="text-base mb-2 block">
                Vikt (kg)
              </Label>
              <Input
                id="weight-input"
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="Ange vikt i kg"
                className="w-full"
              />
            </div>
          )}

          {entryType === 'bloodPressure' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="systolic-input" className="text-base mb-2 block">
                  Systoliskt (övre värde)
                </Label>
                <Input
                  id="systolic-input"
                  type="number"
                  value={systolicInput}
                  onChange={(e) => setSystolicInput(e.target.value)}
                  placeholder="T.ex. 120"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="diastolic-input" className="text-base mb-2 block">
                  Diastoliskt (nedre värde)
                </Label>
                <Input
                  id="diastolic-input"
                  type="number"
                  value={diastolicInput}
                  onChange={(e) => setDiastolicInput(e.target.value)}
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
          <Button onClick={handleSaveEntry} className="text-base py-6 min-h-[56px]">
            Spara
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};