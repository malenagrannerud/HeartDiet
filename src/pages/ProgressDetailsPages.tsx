import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getDayLogs } from "@/lib/tip-completion";
import { getStorageItem } from "@/lib/storage";
import { healthMetricsSchema } from "@/lib/schemas";
import { pageTitle, pageContainer, headerContainer, pagePadding, bodyTextBald, cardTextSmall } from "@/lib/design-tokens";
import { ProgressChart } from "@/pages/ProgressChart";
import { DEFAULT_GOALS } from "@/lib/metrics-defaults";
type MetricType = 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose';

interface DayLog {
  date: string;
  entries: {
    type: MetricType | 'tip';
    value: number;
    value2?: number;
    value3?: number;
    tipId?: number;
  }[];
}

const metricConfig: Record<MetricType, {
  title: string;
  unit: string;
  color: string;
  goalKey: string;
  goalLabel: string;
}> = {
  weight: {
    title: "Vikt (kg)",
    unit: "kg",
    color: "hsla(204, 37%, 48%, 1.00)",
    goalKey: "goalWeight",
    goalLabel: "Målvikt (kg)"
  },
  bloodPressure: {
    title: "Blodtryck (mmHg)",
    unit: "mmHg",
    color: "hsla(332, 52%, 52%, 1.00)",
    goalKey: "goalSystolic",
    goalLabel: "Mål systoliskt"
  },
  bloodFats: {
    title: "LDL-Kolesterol (mmol/L)",
    unit: "mmol/L",
    color: "hsla(280, 65%, 60%, 1.00)",
    goalKey: "goalLDL",
    goalLabel: "Mål LDL"
  },
  bloodGlucose: {
    title: "P-Glukos (mmol/L)",
    unit: "mmol/mol",
    color: "hsla(160, 60%, 50%, 1.00)",
    goalKey: "goalHbA1c",
    goalLabel: "Mål HbA1c"
  }
};

const ProgressDetail = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: MetricType }>();
  const { toast } = useToast();
  
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [goalValue, setGoalValue] = useState<number | undefined>();
  const [goalValue2, setGoalValue2] = useState<number | undefined>();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<{ date: string; value: number; value2?: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editValue2, setEditValue2] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [goalInput2, setGoalInput2] = useState("");

  const metricType = type as MetricType;
  const config = metricConfig[metricType];

  useEffect(() => {
    const logs = getDayLogs();
    setDayLogs(logs);

    const metrics = getStorageItem('healthMetrics', healthMetricsSchema);
    
    if (metricType === 'weight') {
      if (metrics?.goalWeight) {
        setGoalValue(parseFloat(metrics.goalWeight));
      }
    } else if (metricType === 'bloodPressure') {
      setGoalValue(metrics?.goalSystolic ? parseInt(metrics.goalSystolic) : DEFAULT_GOALS.bloodPressure.systolic);
      setGoalValue2(metrics?.goalDiastolic ? parseInt(metrics.goalDiastolic) : DEFAULT_GOALS.bloodPressure.diastolic);
    } else if (metricType === 'bloodFats') {
      setGoalValue(metrics?.goalLDL ? parseFloat(metrics.goalLDL) : DEFAULT_GOALS.bloodFats.ldl);
    } else if (metricType === 'bloodGlucose') {
      setGoalValue(metrics?.goalHbA1c ? parseFloat(metrics.goalHbA1c) : DEFAULT_GOALS.bloodGlucose.hba1c);
    }
  }, [metricType]);

  const chartData = dayLogs
    .flatMap(log => 
      log.entries
        .filter(e => e.type === metricType)
        .map(e => ({ 
          date: format(new Date(log.date), 'd MMM', { locale: sv }),
          value: e.value,
          value2: e.value2,
          fullDate: log.date
        }))
    )
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  const formatter = (value: number) => {
    if (metricType === 'weight') return `${value} kg`;
    return `${value}`;
  };

  const getGoalLabel = () => {
    if (!goalValue) return '';
    if (metricType === 'weight') return `Mål: ${goalValue} kg`;
    if (metricType === 'bloodPressure' && goalValue2) return `Mål: ${goalValue}/${goalValue2}`;
    if (metricType === 'bloodFats') return `Mål LDL: ${goalValue}`;
    if (metricType === 'bloodGlucose') return `Mål HbA1c: ${goalValue}`;
    return '';
  };

  const openEditDialog = (entry: { date: string; value: number; value2?: number }) => {
    setSelectedEntry(entry);
    setEditValue(entry.value.toString());
    setEditValue2(entry.value2?.toString() || "");
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedEntry) return;
    const newValue = parseFloat(editValue);
    if (isNaN(newValue) || newValue <= 0) {
      toast({ title: "Ogiltigt värde", variant: "destructive" });
      return;
    }

    const updatedLogs = dayLogs.map(log => {
      if (log.date === selectedEntry.date) {
        return {
          ...log,
          entries: log.entries.map(entry => {
            if (entry.type === metricType) {
              return {
                ...entry,
                value: newValue,
                value2: metricType === 'bloodPressure' ? parseInt(editValue2) : entry.value2
              };
            }
            return entry;
          })
        };
      }
      return log;
    });

    setDayLogs(updatedLogs);
    localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
    setEditDialogOpen(false);
    toast({ title: "Värde uppdaterat" });
  };

  const handleDeleteEntry = () => {
    if (!selectedEntry) return;
    
    const updatedLogs = dayLogs.map(log => {
      if (log.date === selectedEntry.date) {
        return {
          ...log,
          entries: log.entries.filter(entry => entry.type !== metricType)
        };
      }
      return log;
    }).filter(log => log.entries.length > 0);

    setDayLogs(updatedLogs);
    localStorage.setItem('dayLogs', JSON.stringify(updatedLogs));
    setEditDialogOpen(false);
    toast({ title: "Värde raderat" });
  };

  const openGoalDialog = () => {
    setGoalInput(goalValue?.toString() || "");
    setGoalInput2(goalValue2?.toString() || "");
    setGoalDialogOpen(true);
  };

  const handleSaveGoal = () => {
    const metrics = getStorageItem('healthMetrics', healthMetricsSchema) || {};
    
    if (metricType === 'weight') {
      metrics.goalWeight = goalInput || undefined;
      setGoalValue(goalInput ? parseFloat(goalInput) : undefined);
    } else if (metricType === 'bloodPressure') {
      metrics.goalSystolic = goalInput || undefined;
      metrics.goalDiastolic = goalInput2 || undefined;
      setGoalValue(goalInput ? parseInt(goalInput) : undefined);
      setGoalValue2(goalInput2 ? parseInt(goalInput2) : undefined);
    } else if (metricType === 'bloodFats') {
      metrics.goalLDL = goalInput || undefined;
      setGoalValue(goalInput ? parseFloat(goalInput) : undefined);
    } else if (metricType === 'bloodGlucose') {
      metrics.goalHbA1c = goalInput || undefined;
      setGoalValue(goalInput ? parseFloat(goalInput) : undefined);
    }

    localStorage.setItem('healthMetrics', JSON.stringify(metrics));
    setGoalDialogOpen(false);
    toast({ title: "Mål uppdaterat" });
  };

  if (!config) {
    return <div>Okänd typ</div>;
  }

  return (
    <div className={pageContainer}>
      <div className={`${headerContainer} ${pagePadding}`}>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/app/progress')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tillbaka
        </Button>
        <h1 className={pageTitle}>{config.title}</h1>
      </div>

      {/* Main content with consistent spacing */}
      <div className={`${pagePadding} flex flex-col gap-4`}>
        {/* Chart */}
        {chartData.length > 0 && (
          <ProgressChart
            type={metricType}
            dayLogs={dayLogs}
            goalWeight={metricType === 'weight' ? goalValue : undefined}
            goalBloodPressure={metricType === 'bloodPressure' && goalValue && goalValue2 
              ? { systolic: goalValue, diastolic: goalValue2 } : undefined}
            goalBloodFats={metricType === 'bloodFats' && goalValue 
              ? { ldl: goalValue } : undefined}
            goalBloodGlucose={metricType === 'bloodGlucose' && goalValue 
              ? { hba1c: goalValue } : undefined}
            detailed={true}
          />
        )}

        {/* Goal section */}
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex justify-between items-center">
            <div>
              <div className={bodyTextBald}>Målvärde</div>
              <div className={cardTextSmall}>
                {goalValue ? getGoalLabel() : "Inget mål satt"}
              </div>
            </div>
            <Button variant="outline" onClick={openGoalDialog}>
              {goalValue ? "Ändra mål" : "Sätt mål"}
            </Button>
          </div>
        </div>

        {/* Values list */}
        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b">
            <div className={bodyTextBald}>Loggade värden</div>
          </div>
          {chartData.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Inga värden loggade än
            </div>
          ) : (
            <div className="divide-y">
              {[...chartData].reverse().map((entry, idx) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center p-4 hover:bg-muted/30 cursor-pointer"
                  onClick={() => openEditDialog({ date: entry.fullDate, value: entry.value, value2: entry.value2 })}
                >
                  <span className="text-sm font-medium">
                    {format(new Date(entry.fullDate), 'd MMMM yyyy', { locale: sv })}
                  </span>
                  <span className="text-sm font-semibold">
                    {metricType === 'bloodPressure' && entry.value2 
                      ? `${entry.value}/${entry.value2} ${config.unit}`
                      : `${entry.value} ${config.unit}`
                    }
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Ändra värde för {selectedEntry && format(new Date(selectedEntry.date), 'd MMMM yyyy', { locale: sv })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{metricType === 'bloodPressure' ? 'Systoliskt' : config.title}</Label>
              <Input
                type="number"
                step={metricType === 'weight' || metricType === 'bloodFats' ? "0.1" : "1"}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </div>
            {metricType === 'bloodPressure' && (
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
            <Button variant="destructive" onClick={handleDeleteEntry}>Radera</Button>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Avbryt</Button>
            <Button onClick={handleSaveEdit}>Spara</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goal Dialog */}
      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ändra målvärde</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{metricType === 'bloodPressure' ? 'Mål systoliskt' : config.goalLabel}</Label>
              <Input
                type="number"
                step={metricType === 'weight' || metricType === 'bloodFats' || metricType === 'bloodGlucose' ? "0.1" : "1"}
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder={`Ange ${config.goalLabel.toLowerCase()}`}
              />
            </div>
            {metricType === 'bloodPressure' && (
              <div>
                <Label>Mål diastoliskt</Label>
                <Input
                  type="number"
                  value={goalInput2}
                  onChange={(e) => setGoalInput2(e.target.value)}
                  placeholder="Ange mål diastoliskt"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGoalDialogOpen(false)}>Avbryt</Button>
            <Button onClick={handleSaveGoal}>Spara</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
    </div>
  );
};

export default ProgressDetail;
