/**
 * Progress detail page for viewing and managing health metrics
 * 
 * @module MatningarDetaljer
 * 
 * @description
 * DETAILED VIEW - Displays complete history for a single health metric.
 * Users can:
 * - View chart with all historical data points
 * - See current goal value and edit it
 * - Browse list of all logged values with dates
 * - Click any entry to edit or delete it
 * - Update goal values for each metric type
 * 
 * Accessed via URL parameter /progress/:type (weight, bloodPressure, bloodFats, bloodGlucose)
 * 
 * @requires react - useState, useEffect for state management
 * @requires react-router-dom - Navigation and URL parameters
 * @requires date-fns - Date formatting with Swedish locale
 * @requires lucide-react - Back arrow icon
 * @requires @/components/ui - UI components (Button, Input, Dialog, Label)
 * @requires @/hooks/use-toast - Toast notifications
 * @requires @/lib/tip-completion - Day logs data
 * @requires @/lib/storage - Local storage utilities
 * @requires @/lib/schemas - Type validation schemas
 * @requires @/lib/design-tokens - Design system classes
 * @requires @/pages/Matningar/MatningarPlotsMain - Chart component
 * @requires @/data/metrics-defaults - Default goal values
 * @requires @/lib/health-validators - Input validation functions
 */

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
import { healthMetricsSchema, type DayLog } from "@/lib/schemas";
import { pageTitle, pageContainer, headerContainer, pagePadding, bodyTextBald, cardTextSmall } from "@/lib/design-tokens";
import { ProgressChart } from "@/pages/Matningar/MatningarPlotsMain";
import { DEFAULT_GOALS } from "@/data/metrics-defaults";
import { safeParseFloat, safeParseInt, validateWeight, validateSystolic, validateDiastolic, validateLDL, validateHbA1c } from "@/lib/health-validators";

/**
 * Available metric types for tracking
 */
type MetricType = 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose';

/**
 * Configuration for each metric type
 * Defines display properties and goal mappings
 */
const metricConfig: Record<MetricType, {
  title: string;        // Display name with unit
  unit: string;         // Measurement unit
  color: string;        // Chart color in HSL
  goalKey: string;      // Storage key for goal
  goalLabel: string;    // Display label for goal input
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

/**
 * Progress detail page component - DETAILED VIEW
 * 
 * @component
 * @returns {JSX.Element} Detailed metric view with edit/delete functionality
 */
const ProgressDetail = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: MetricType }>();
  const { toast } = useToast();
  
  // State
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

  /**
   * Load day logs and goal values on mount or metric change
   */
  useEffect(() => {
    const logs = getDayLogs();
    setDayLogs(logs);

    const metrics = getStorageItem('healthMetrics', healthMetricsSchema);
    
    if (metricType === 'weight') {
      const goal = safeParseFloat(metrics?.goalWeight);
      if (goal !== undefined) setGoalValue(goal);
    } else if (metricType === 'bloodPressure') {
      setGoalValue(safeParseInt(metrics?.goalSystolic) ?? DEFAULT_GOALS.bloodPressure.systolic);
      setGoalValue2(safeParseInt(metrics?.goalDiastolic) ?? DEFAULT_GOALS.bloodPressure.diastolic);
    } else if (metricType === 'bloodFats') {
      setGoalValue(safeParseFloat(metrics?.goalLDL) ?? DEFAULT_GOALS.bloodFats.ldl);
    } else if (metricType === 'bloodGlucose') {
      setGoalValue(safeParseFloat(metrics?.goalHbA1c) ?? DEFAULT_GOALS.bloodGlucose.hba1c);
    }
  }, [metricType]);

  /**
   * Prepare chart data from day logs
   * Formats dates and sorts chronologically
   */
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

  /**
   * Generate goal display label
   * @returns {string} Formatted goal string
   */
  const getGoalLabel = () => {
    if (!goalValue) return '';
    if (metricType === 'weight') return `Mål: ${goalValue} kg`;
    if (metricType === 'bloodPressure' && goalValue2) return `Mål: ${goalValue}/${goalValue2}`;
    if (metricType === 'bloodFats') return `Mål LDL: ${goalValue}`;
    if (metricType === 'bloodGlucose') return `Mål HbA1c: ${goalValue}`;
    return '';
  };

  /**
   * Opens edit dialog for a specific entry
   * @param {Object} entry - The entry to edit
   */
  const openEditDialog = (entry: { date: string; value: number; value2?: number }) => {
    setSelectedEntry(entry);
    setEditValue(entry.value.toString());
    setEditValue2(entry.value2?.toString() || "");
    setEditDialogOpen(true);
  };

  /**
   * Saves edited entry after validation
   * Updates localStorage and state
   */
  const handleSaveEdit = () => {
    if (!selectedEntry) return;
    
    // Validate based on metric type
    let validation;
    if (metricType === 'weight') {
      validation = validateWeight(editValue);
    } else if (metricType === 'bloodPressure') {
      validation = validateSystolic(editValue);
    } else if (metricType === 'bloodFats') {
      validation = validateLDL(editValue);
    } else if (metricType === 'bloodGlucose') {
      validation = validateHbA1c(editValue);
    } else {
      validation = { valid: true, value: parseFloat(editValue) };
    }
    
    if (!validation.valid || validation.value === undefined) {
      toast({ title: "Ogiltigt värde", description: validation.error, variant: "destructive" });
      return;
    }

    const newValue = validation.value;

    const updatedLogs = dayLogs.map(log => {
      if (log.date === selectedEntry.date) {
        return {
          ...log,
          entries: log.entries.map(entry => {
            if (entry.type === metricType) {
              return {
                ...entry,
                value: newValue,
                value2: metricType === 'bloodPressure' ? (safeParseInt(editValue2) ?? entry.value2) : entry.value2
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

  /**
   * Deletes the selected entry
   * Removes from logs and updates storage
   */
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

  /**
   * Opens goal dialog with current values
   */
  const openGoalDialog = () => {
    setGoalInput(goalValue?.toString() || "");
    setGoalInput2(goalValue2?.toString() || "");
    setGoalDialogOpen(true);
  };

  /**
   * Saves new goal values
   * Updates health metrics in storage
   */
  const handleSaveGoal = () => {
    const metrics = getStorageItem('healthMetrics', healthMetricsSchema) || {};
    
    if (metricType === 'weight') {
      metrics.goalWeight = goalInput || undefined;
      const parsed = safeParseFloat(goalInput);
      setGoalValue(parsed);
    } else if (metricType === 'bloodPressure') {
      metrics.goalSystolic = goalInput || undefined;
      metrics.goalDiastolic = goalInput2 || undefined;
      setGoalValue(safeParseInt(goalInput));
      setGoalValue2(safeParseInt(goalInput2));
    } else if (metricType === 'bloodFats') {
      metrics.goalLDL = goalInput || undefined;
      setGoalValue(safeParseFloat(goalInput));
    } else if (metricType === 'bloodGlucose') {
      metrics.goalHbA1c = goalInput || undefined;
      setGoalValue(safeParseFloat(goalInput));
    }

    localStorage.setItem('healthMetrics', JSON.stringify(metrics));
    setGoalDialogOpen(false);
    toast({ title: "Mål uppdaterat" });
  };

  // Handle invalid metric type
  if (!config) {
    return <div>Okänd typ</div>;
  }

  return (
    <div className={pageContainer}>
      {/* Header with back button */}
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

      {/* Main content */}
      <div className={`${pagePadding} flex flex-col gap-4`}>
        {/* Chart section - detailed view with all historical data */}
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

        {/* Goal section - manage target values */}
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

        {/* History list - click any entry to edit/delete */}
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

      {/* EDIT DIALOG - for modifying or deleting existing entries */}
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

      {/* GOAL DIALOG - for updating target values */}
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