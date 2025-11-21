import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth } from "date-fns";
import { sv } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { tips } from "@/data/tips";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { pageTitle, pageSubtitle, pageContainer, pagePadding } from "@/lib/design-tokens";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getDayLogs } from "@/lib/tip-completion";
import { Checkbox } from "@/components/ui/checkbox";

interface DayLog {
  date: string;
  entries: {
    type: 'weight' | 'bloodPressure' | 'tip';
    value: number;
    value2?: number;
    tipId?: number;
  }[];
}

const Progress = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [entryType, setEntryType] = useState<'weight' | 'bloodPressure'>('weight');
  const [weightInput, setWeightInput] = useState("");
  const [systolicInput, setSystolicInput] = useState("");
  const [diastolicInput, setDiastolicInput] = useState("");
  const [saveAlertOpen, setSaveAlertOpen] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<{
    type: 'weight' | 'bloodPressure';
    weight?: string;
    systolic?: string;
    diastolic?: string;
  } | null>(null);

  // Load day logs from localStorage
  useEffect(() => {
    const logs = getDayLogs();
    setDayLogs(logs);
  }, []);

  // Generate week dates (Monday to Sunday)
  const weekDates = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeekStart, i)
  );

  const goToPreviousWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const isTipCompletedOnDate = (tipId: number, date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    return log?.entries.some(entry => entry.type === 'tip' && entry.tipId === tipId) || false;
  };

  const handleTipToggle = (tipId: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingLogIndex = dayLogs.findIndex(log => log.date === dateStr);
    let updatedLogs = [...dayLogs];

    if (existingLogIndex >= 0) {
      const existingLog = updatedLogs[existingLogIndex];
      const tipEntryIndex = existingLog.entries.findIndex(
        entry => entry.type === 'tip' && entry.tipId === tipId
      );

      if (tipEntryIndex >= 0) {
        // Remove tip
        existingLog.entries.splice(tipEntryIndex, 1);
        if (existingLog.entries.length === 0) {
          updatedLogs.splice(existingLogIndex, 1);
        }
        toast({
          title: "Tips avmarkerat",
          description: `${tips.find(t => t.id === tipId)?.title} har avmarkerats`,
        });
      } else {
        // Add tip
        existingLog.entries.push({ type: 'tip', value: 1, tipId });
        toast({
          title: "Tips markerat som gjort!",
          description: `${tips.find(t => t.id === tipId)?.title} har markerats`,
        });
      }
    } else {
      // Create new log with tip
      updatedLogs.push({
        date: dateStr,
        entries: [{ type: 'tip', value: 1, tipId }]
      });
      toast({
        title: "Tips markerat som gjort!",
        description: `${tips.find(t => t.id === tipId)?.title} har markerats`,
      });
    }

    setDayLogs(updatedLogs);
    localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
  };

  const openAddDataDialog = (date: Date) => {
    setSelectedDate(date);
    setEntryType('weight');
    setWeightInput("");
    setSystolicInput("");
    setDiastolicInput("");
    setDialogOpen(true);
  };

  const handleSaveEntry = () => {
    if (!selectedDate) return;

    if (entryType === 'weight') {
      const kg = parseFloat(weightInput) || 0;
      if (kg <= 0) return;
      setPendingEntry({ type: 'weight', weight: weightInput });
    } else if (entryType === 'bloodPressure') {
      const systolic = parseInt(systolicInput) || 0;
      const diastolic = parseInt(diastolicInput) || 0;
      if (systolic <= 0 || diastolic <= 0) return;
      setPendingEntry({ type: 'bloodPressure', systolic: systolicInput, diastolic: diastolicInput });
    }
    
    setSaveAlertOpen(true);
  };

  const confirmSaveEntry = () => {
    if (!selectedDate || !pendingEntry) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingLog = dayLogs.find(log => log.date === dateStr);
    const newEntries = existingLog ? [...existingLog.entries] : [];

    if (pendingEntry.type === 'weight' && pendingEntry.weight) {
      const kg = parseFloat(pendingEntry.weight);
      newEntries.push({ type: 'weight', value: kg });
    } else if (pendingEntry.type === 'bloodPressure' && pendingEntry.systolic && pendingEntry.diastolic) {
      const systolic = parseInt(pendingEntry.systolic);
      const diastolic = parseInt(pendingEntry.diastolic);
      newEntries.push({ 
        type: 'bloodPressure', 
        value: systolic, 
        value2: diastolic 
      });
    }
    
    const updatedLogs = dayLogs.filter(log => log.date !== dateStr);
    updatedLogs.push({ date: dateStr, entries: newEntries });
    setDayLogs(updatedLogs);
    localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
    
    toast({
      title: "Data sparad",
      description: `${pendingEntry.type === 'weight' ? 'Vikt' : 'Blodtryck'} har sparats för ${format(selectedDate, 'd MMMM', { locale: sv })}`,
    });
    
    setDialogOpen(false);
    setSaveAlertOpen(false);
    setPendingEntry(null);
  };

  const getDaysWithGoalThisMonth = () => {
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    return dayLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= monthStart && logDate <= monthEnd && 
             log.entries.some(entry => entry.type === 'tip');
    }).length;
  };

  const getCurrentStreak = () => {
    const daysWithTips = dayLogs
      .filter(log => log.entries.some(entry => entry.type === 'tip'))
      .map(log => new Date(log.date));
    
    if (daysWithTips.length === 0) return 0;
    
    const sortedDays = daysWithTips.sort((a, b) => b.getTime() - a.getTime());
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDays.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const hasDay = sortedDays.some(day => {
        const d = new Date(day);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === checkDate.getTime();
      });
      if (hasDay) streak++;
      else break;
    }
    return streak;
  };

  const getDayInitial = (date: Date) => {
    const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
    return days[date.getDay()];
  };

  const hasWeightOrBPOnDate = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    return log?.entries.some(entry => entry.type === 'weight' || entry.type === 'bloodPressure') || false;
  };

  const daysThisMonth = getDaysWithGoalThisMonth();
  const currentStreak = getCurrentStreak();

  return (
    <div className={`${pageContainer} ${pagePadding} space-y-6`}>
      <header className="flex items-start justify-between">
        <div>
          <h1 className={pageTitle}>Veckoöversikt</h1>
          <p className={pageSubtitle}>Följ dina framsteg och logga data</p>
        </div>
      </header>

      {/* Week Navigation */}
      <div className="flex items-center justify-between py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousWeek}
          className="h-10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="text-center">
          <div className="text-lg font-semibold">
            {format(weekDates[0], 'd MMM', { locale: sv })} - {format(weekDates[6], 'd MMM', { locale: sv })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToCurrentWeek}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Gå till idag
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNextWeek}
          className="h-10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Weekly Table */}
      <div className="bg-background rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-4 px-4 font-semibold text-foreground w-[200px]">Tips</th>
                {weekDates.map((date, index) => (
                  <th key={index} className="text-center py-4 px-2 font-semibold text-foreground min-w-[60px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs">{getDayInitial(date)}</span>
                      <span className="text-sm">{format(date, 'd/M')}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tips.map((tip) => (
                <tr key={tip.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ 
                          backgroundColor: tip.color.includes('bg-[') 
                            ? tip.color.replace('bg-[', '').replace(']', '')
                            : undefined 
                        }}
                      />
                      <span className="text-sm font-medium">{tip.title}</span>
                    </div>
                  </td>
                  {weekDates.map((date, dayIndex) => (
                    <td key={dayIndex} className="text-center py-4 px-2">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={isTipCompletedOnDate(tip.id, date)}
                          onCheckedChange={() => handleTipToggle(tip.id, date)}
                          className="h-7 w-7 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-all duration-200"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Row for adding weight/BP data */}
              <tr className="border-b bg-muted/20">
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-muted-foreground">Vikt & Blodtryck</span>
                </td>
                {weekDates.map((date, dayIndex) => (
                  <td key={dayIndex} className="text-center py-4 px-2">
                    <Button
                      variant={hasWeightOrBPOnDate(date) ? "default" : "outline"}
                      size="sm"
                      onClick={() => openAddDataDialog(date)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg bg-background">
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-base font-bold text-foreground">Klarade dagar</div>
              <div className="text-sm text-muted-foreground font-normal">Antal dagar du följt dina Tips</div>
            </div>
            <div className="flex items-center justify-end">
              <div className="w-16 h-16 rounded-lg bg-emerald-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-900">{daysThisMonth}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-background">
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-base font-bold text-foreground">Klarade dagar i rad</div>
              <div className="text-sm text-muted-foreground font-normal">Antal dagar i rad du följt dina Tips</div>
            </div>
            <div className="flex items-center justify-end">
              <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-900">{currentStreak}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for adding weight/blood pressure */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Lägg till data för {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: sv })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-base mb-4 block font-semibold">Välj typ</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={entryType === 'weight' ? 'default' : 'outline'}
                  onClick={() => setEntryType('weight')}
                  className="w-full text-base py-6"
                >
                  Vikt
                </Button>
                <Button
                  variant={entryType === 'bloodPressure' ? 'default' : 'outline'}
                  onClick={() => setEntryType('bloodPressure')}
                  className="w-full text-base py-6"
                >
                  Blodtryck
                </Button>
              </div>
            </div>

            {entryType === 'weight' && (
              <div>
                <Label htmlFor="weight-input" className="text-base mb-2 block">Vikt (kg)</Label>
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
                  <Label htmlFor="systolic-input" className="text-base mb-2 block">Systoliskt (övre värde)</Label>
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
                  <Label htmlFor="diastolic-input" className="text-base mb-2 block">Diastoliskt (nedre värde)</Label>
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
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="text-base py-6">
              Avbryt
            </Button>
            <Button onClick={handleSaveEntry} className="text-base py-6">
              Spara
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Confirmation Alert */}
      <AlertDialog open={saveAlertOpen} onOpenChange={setSaveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Granska innan du sparar</AlertDialogTitle>
            <AlertDialogDescription>
              Kontrollera att uppgifterna stämmer:
            </AlertDialogDescription>
          </AlertDialogHeader>
          {pendingEntry && selectedDate && (
            <div className="my-4 space-y-3 rounded-lg bg-muted/50 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Datum:</span>
                <span className="text-sm font-medium">{format(selectedDate, 'd MMMM yyyy', { locale: sv })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Typ:</span>
                <span className="text-sm font-medium">
                  {pendingEntry.type === 'weight' ? 'Vikt' : 'Blodtryck'}
                </span>
              </div>
              {pendingEntry.type === 'weight' && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Värde:</span>
                  <span className="text-sm font-medium">{pendingEntry.weight} kg</span>
                </div>
              )}
              {pendingEntry.type === 'bloodPressure' && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Värde:</span>
                  <span className="text-sm font-medium">{pendingEntry.systolic}/{pendingEntry.diastolic} mmHg</span>
                </div>
              )}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingEntry(null)}>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveEntry}>
              Spara
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Progress;