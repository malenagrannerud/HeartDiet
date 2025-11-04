import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfMonth, endOfMonth, isSameDay, addDays, isWithinInterval } from "date-fns";
import { sv } from "date-fns/locale";
import { Trophy, Flame, Weight, Activity, Trash2, Settings } from "lucide-react";
import { tips } from "@/data/tips";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { pageTitle, pageSubtitle, sectionHeading, iconButton, pageContainer, pagePadding } from "@/lib/design-tokens";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface DayLog {
  date: string;
  entries: {
  type: 'weight' | 'bloodPressure' | 'tip';
  value: number; // grams for tips, kg for weight, systolic for blood pressure
  value2?: number; // diastolic for blood pressure
  tipId?: number; // which tip category
}[];
}

// DUPLICATE TIPS ARRAY REMOVED - Now importing from @/data/tips

const Progress = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [achievementDays, setAchievementDays] = useState<Date[]>([]);
  const [weightDays, setWeightDays] = useState<Date[]>([]);
  const [bloodPressureDays, setBloodPressureDays] = useState<Date[]>([]);
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [entryType, setEntryType] = useState<'weight' | 'bloodPressure' | 'tip'>('tip');
  const [selectedTipId, setSelectedTipId] = useState<number>(1);
  const [gramsInput, setGramsInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [systolicInput, setSystolicInput] = useState("");
  const [diastolicInput, setDiastolicInput] = useState("");
  
  // Load day logs and marked tips from localStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem('dayLogs');
    let logs: DayLog[] = [];
    
    if (savedLogs) {
      const parsed = JSON.parse(savedLogs);
      // Migrate old data format to new format
      const migratedLogs = parsed.map((log: any) => {
        if (log.entries) {
          return log; // Already in new format
        } else if (log.fruitGrams !== undefined) {
          // Old format - migrate to new
          return {
            date: log.date,
            entries: [{ type: 'tip' as const, value: log.fruitGrams, tipId: 1 }]
          };
        }
        return log;
      });
      logs = migratedLogs;
    } else {
      // Demo data for demonstration
      const demoLogs = [
        { 
          date: '2025-10-10', 
          entries: [
            { type: 'weight' as const, value: 75 },
            { type: 'bloodPressure' as const, value: 120, value2: 80 }
          ] 
        },
        { 
          date: '2025-10-15', 
          entries: [
            { type: 'weight' as const, value: 74.5 }
          ] 
        },
        { 
          date: '2025-10-22', 
          entries: [
            { type: 'bloodPressure' as const, value: 118, value2: 78 }
          ] 
        }
      ];
      logs = demoLogs;
    }

    // Load health metrics from HealthMetrics page
    const savedHealthMetrics = localStorage.getItem('healthMetrics');
    if (savedHealthMetrics) {
      const metrics = JSON.parse(savedHealthMetrics);
      const metricsDate = format(new Date(metrics.date), 'yyyy-MM-dd');
      
      // Check if this date already has entries
      const existingLog = logs.find(log => log.date === metricsDate);
      
      if (existingLog) {
        // Add weight if not already present
        const hasWeight = existingLog.entries.some(e => e.type === 'weight');
        if (!hasWeight && metrics.weight) {
          existingLog.entries.push({ 
            type: 'weight' as const, 
            value: parseFloat(metrics.weight) 
          });
        }
        
        // Add blood pressure if not already present
        const hasBP = existingLog.entries.some(e => e.type === 'bloodPressure');
        if (!hasBP && metrics.systolic && metrics.diastolic) {
          existingLog.entries.push({ 
            type: 'bloodPressure' as const, 
            value: parseInt(metrics.systolic), 
            value2: parseInt(metrics.diastolic) 
          });
        }
      } else {
        // Create new log entry with the metrics
        const newEntries: DayLog['entries'] = [];
        
        if (metrics.weight) {
          newEntries.push({ 
            type: 'weight' as const, 
            value: parseFloat(metrics.weight) 
          });
        }
        
        if (metrics.systolic && metrics.diastolic) {
          newEntries.push({ 
            type: 'bloodPressure' as const, 
            value: parseInt(metrics.systolic), 
            value2: parseInt(metrics.diastolic) 
          });
        }
        
        if (newEntries.length > 0) {
          logs.push({ date: metricsDate, entries: newEntries });
        }
      }
      
      // Save the updated logs back to localStorage
      localStorage.setItem('dayLogs', JSON.stringify(logs));
    }
    
    setDayLogs(logs);
  }, []);

  // Update achievement days based on day logs (500g+ threshold for tips)
  useEffect(() => {
    const achievedDays = dayLogs
      .filter(log => {
        // A day is achieved if any tip entry has 500g or more
        return log.entries && log.entries.some(entry => 
          entry.type === 'tip' && entry.value >= 500
        );
      })
      .map(log => new Date(log.date));
    setAchievementDays(achievedDays);

    // Track weight days
    const weightLogDays = dayLogs
      .filter(log => log.entries && log.entries.some(entry => entry.type === 'weight'))
      .map(log => new Date(log.date));
    setWeightDays(weightLogDays);

    // Track blood pressure days
    const bpLogDays = dayLogs
      .filter(log => log.entries && log.entries.some(entry => entry.type === 'bloodPressure'))
      .map(log => new Date(log.date));
    setBloodPressureDays(bpLogDays);
  }, [dayLogs]);

  // Calculate days in current month with 10+ points
  const getDaysWithGoalThisMonth = () => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    return achievementDays.filter(day => {
      const dayDate = new Date(day);
      return dayDate >= monthStart && dayDate <= monthEnd;
    }).length;
  };

  // Calculate current streak
  const getCurrentStreak = () => {
    if (achievementDays.length === 0) return 0;
    
    const sortedDays = [...achievementDays].sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
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
      
      if (hasDay) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const daysThisMonth = getDaysWithGoalThisMonth();
  const currentStreak = getCurrentStreak();

  const handleDayClick = (clickedDate: Date | undefined) => {
    if (!clickedDate) return;
    
    // Don't allow entries for future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clicked = new Date(clickedDate);
    clicked.setHours(0, 0, 0, 0);
    
    // Allow today and past dates only
    if (clicked.getTime() > today.getTime()) return;
    
    setSelectedDate(clickedDate);
    
    // Reset inputs
    setEntryType('tip');
    setSelectedTipId(1);
    setGramsInput("");
    setWeightInput("");
    setSystolicInput("");
    setDiastolicInput("");
    
    setDialogOpen(true);
  };

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
      
      setDayLogs(updatedLogs);
      localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
    }
    
    setDialogOpen(false);
  };

  const handleDeleteEntry = (entryIndex: number) => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingLog = dayLogs.find(log => log.date === dateStr);
    
    if (existingLog) {
      const updatedEntries = existingLog.entries.filter((_, index) => index !== entryIndex);
      const updatedLogs = dayLogs.filter(log => log.date !== dateStr);
      
      if (updatedEntries.length > 0) {
        updatedLogs.push({ date: dateStr, entries: updatedEntries });
      }
      
      setDayLogs(updatedLogs);
      localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
    }
  };

  const getExistingEntries = () => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    return log?.entries || [];
  };

  return (
    /* STANDARDIZATION: space-y-6 for consistent page section spacing */
    <div className={`${pageContainer} ${pagePadding} space-y-6`}>
      <header className="flex items-start justify-between">
        <div>
          <h1 className={pageTitle}>Mina sidor</h1>
          <p className={pageSubtitle}>Följ dina framsteg & redigera loggar</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/app/settings')} className={iconButton} aria-label="Inställningar">
          <Settings size={28} className="text-foreground" />
        </Button>
      </header>

      <div className="pt-6 pb-0 flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDayClick}
          locale={sv}
          className="rounded-md border-0 [&_.rdp-caption_label]:font-bold [&_.rdp-caption_label]:capitalize [&_.rdp-caption_label]:text-xl [&_.rdp-head_cell]:capitalize [&_.rdp-head_cell]:text-base mx-auto text-lg [&_button]:cursor-pointer [&_button]:min-h-[48px] [&_button]:min-w-[48px] [&_button]:text-lg"
          modifiers={{
            achievement: achievementDays,
            weight: weightDays,
            bloodPressure: bloodPressureDays
          }}
          modifiersClassNames={{
            achievement: "relative before:content-[''] before:absolute before:inset-[8px] before:bg-emerald-500 before:rounded-full before:-z-10 !text-blue-900 font-bold"
          }}
          modifiersStyles={{
            achievement: {
              backgroundColor: "transparent"
            }
          }}
          components={{
            DayContent: (props) => {
              const hasWeight = weightDays.some(d => isSameDay(d, props.date));
              const hasBP = bloodPressureDays.some(d => isSameDay(d, props.date));
              
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Data icons */}
                  <div className="absolute top-0.5 left-0.5 flex flex-col gap-0.5">
                    {hasBP && <span className="text-xs leading-none text-rose-600">♥</span>}
                    {hasWeight && <span className="text-xs leading-none text-blue-700">⚖</span>}
                  </div>
                  
                  {/* Date number */}
                  <span className="relative z-10">{props.date.getDate()}</span>
                </div>
              );
            }
          }}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                    onClick={() => handleDeleteEntry(index)}
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
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="text-base py-6 min-h-[56px]">
              Avbryt
            </Button>
            <Button onClick={handleSaveEntry} className="text-base py-6 min-h-[56px]">
              Spara
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-2 gap-0 -mt-8 pt-0">
        <div className="py-6 pr-6 pl-0 border-r border-t">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="text-base font-bold text-foreground">
                Klarade dagar
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                Antal dagar du följt dina Tips
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="w-16 h-16 rounded-lg bg-emerald-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-900">{daysThisMonth}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 pr-0 pl-6 border-t">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="text-base font-bold text-foreground">
                Klarade dagar i rad
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                Antal dagar i rad du följt dina Tips
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-900">{currentStreak}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weight and Blood Pressure Charts */}
      <div className="grid grid-cols-2 gap-0 pt-0">
        <div className="py-6 pr-6 pl-0 border-r border-t">
          <div className="flex flex-col h-full">
            <div className="flex-1 mb-4">
              <div className="text-base font-bold text-foreground">
                Vikt
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                Loggade vikter (kg)
              </div>
            </div>
            <ChartContainer 
              config={{ 
                weight: { 
                  label: "Vikt", 
                  color: "hsl(217, 91%, 60%)" 
                } 
              }} 
              className="h-48 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={dayLogs
                    .flatMap(log => 
                      log.entries
                        .filter(e => e.type === 'weight')
                        .map(e => ({ 
                          date: format(new Date(log.date), 'd MMM', { locale: sv }),
                          weight: e.value,
                          fullDate: log.date
                        }))
                    )
                    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
                    .slice(-10)} 
                  margin={{ top: 20, bottom: 20 }}
                >
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis hide />
                  <Bar 
                    dataKey="weight" 
                    fill="hsl(217, 91%, 60%)" 
                    radius={[8, 8, 0, 0]}
                    maxBarSize={20}
                  >
                    <LabelList 
                      dataKey="weight" 
                      position="top" 
                      style={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                      formatter={(value: number) => `${value} kg`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div className="py-6 pr-0 pl-6 border-t">
          <div className="flex flex-col h-full">
            <div className="flex-1 mb-4">
              <div className="text-base font-bold text-foreground">
                Blodtryck
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                Loggade blodtryck (mmHg)
              </div>
            </div>
            <ChartContainer 
              config={{ 
                systolic: { 
                  label: "Systoliskt", 
                  color: "hsl(350, 89%, 60%)" 
                } 
              }} 
              className="h-48 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={dayLogs
                    .flatMap(log => 
                      log.entries
                        .filter(e => e.type === 'bloodPressure')
                        .map(e => ({ 
                          date: format(new Date(log.date), 'd MMM', { locale: sv }),
                          systolic: e.value,
                          diastolic: e.value2,
                          fullDate: log.date
                        }))
                    )
                    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
                    .slice(-10)} 
                  margin={{ top: 20, bottom: 20 }}
                >
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis hide />
                  <Bar 
                    dataKey="systolic" 
                    fill="hsl(350, 89%, 60%)" 
                    radius={[8, 8, 0, 0]}
                    maxBarSize={20}
                  >
                    <LabelList 
                      dataKey="systolic" 
                      position="top" 
                      style={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                      formatter={(value: number) => `${value}`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;