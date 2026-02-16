/**
 * @module MatningarDetaljer
 *
 * @description
 * Detailed view for a single health metric. Orchestrates sub-components:
 * - Chart with all historical data points
 * - Goal display and editing
 * - History list with click-to-edit
 * - Dialogs for editing, deleting, and adding entries
 *
 * Accessed via URL parameter /progress/:type (weight, bloodPressure, bloodFats, bloodGlucose)
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getDayLogs } from "@/lib/tip-completion";
import { type DayLog } from "@/lib/schemas";
import { pageTitle, pageContainer, headerContainer, pagePadding, bodyTextBald, cardTextSmall } from "@/lib/design-tokens";
import { ProgressChart } from "@/pages/Matningar/PlotsComponents";
import { safeParseInt } from "@/lib/health-validators";
import { validateDiastolic } from "@/lib/health-validators";

import { type MetricType, metricConfig } from "./metric-config";
import {
  validateMetricValue,
  buildNewEntry,
  updateLogEntry,
  deleteLogEntry,
  upsertLogEntry,
  loadGoalValues,
  saveGoalValues,
  getGoalLabel,
} from "./metric-handlers";
import { EditEntryDialog, type SelectedEntry } from "./EditEntryDialog";
import { GoalDialog } from "./GoalDialog";
import { AddMeasurementDialog } from "./AddMeasurementDialog";

/**
 * Progress detail page — thin orchestrator that wires handlers to UI.
 *
 * @component
 * @returns Detailed metric view with edit/delete/add functionality
 */
const ProgressDetail = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: MetricType }>();
  const { toast } = useToast();

  const metricType = type as MetricType;
  const config = metricConfig[metricType];

  // ── State ────────────────────────────────
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [goalValue, setGoalValue] = useState<number | undefined>();
  const [goalValue2, setGoalValue2] = useState<number | undefined>();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<SelectedEntry | null>(null);

  /** Load day logs and goal values on mount or metric change */
  useEffect(() => {
    setDayLogs(getDayLogs());
    const goals = loadGoalValues(metricType);
    setGoalValue(goals.goalValue);
    setGoalValue2(goals.goalValue2);
  }, [metricType]);

  // ── Derived data ─────────────────────────
  /** Chart data: formatted dates sorted chronologically */
  const chartData = dayLogs
    .flatMap((log) =>
      log.entries
        .filter((e) => e.type === metricType)
        .map((e) => ({
          date: format(new Date(log.date), "d MMM", { locale: sv }),
          value: e.value,
          value2: e.value2,
          fullDate: log.date,
        }))
    )
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  // ── Helpers to persist logs ──────────────
  /** Writes updated logs to state and localStorage */
  const persistLogs = (logs: DayLog[]) => {
    setDayLogs(logs);
    localStorage.setItem("dayLogs", JSON.stringify(logs));
  };

  // ── Dialog callbacks ─────────────────────

  /** Opens edit dialog for a specific entry */
  const openEditDialog = (entry: SelectedEntry) => {
    setSelectedEntry(entry);
    setEditDialogOpen(true);
  };

  /** Saves edited entry after validation */
  const handleSaveEdit = (editValue: string, editValue2: string) => {
    if (!selectedEntry) return;

    const validation = validateMetricValue(metricType, editValue);
    if (!validation.valid || validation.value === undefined) {
      toast({ title: "Ogiltigt värde", description: validation.error, variant: "destructive" });
      return;
    }

    const newValue2 =
      metricType === "bloodPressure" ? safeParseInt(editValue2) : undefined;

    persistLogs(updateLogEntry(dayLogs, selectedEntry.date, metricType, validation.value, newValue2));
    setEditDialogOpen(false);
    toast({ title: "Värde uppdaterat" });
  };

  /** Deletes the currently selected entry */
  const handleDeleteEntry = () => {
    if (!selectedEntry) return;
    persistLogs(deleteLogEntry(dayLogs, selectedEntry.date, metricType));
    setEditDialogOpen(false);
    toast({ title: "Värde raderat" });
  };

  /** Saves updated goal values */
  const handleSaveGoal = (goalInput: string, goalInput2: string) => {
    const result = saveGoalValues(metricType, goalInput, goalInput2);
    setGoalValue(result.goalValue);
    setGoalValue2(result.goalValue2);
    setGoalDialogOpen(false);
    toast({ title: "Mål uppdaterat" });
  };

  /** Saves a new measurement entry after validation */
  const handleSaveNew = (date: string, addValue: string, addValue2: string, addValue3: string) => {
    const validation = validateMetricValue(metricType, addValue);
    if (!validation.valid || validation.value === undefined) {
      toast({ title: "Ogiltigt värde", description: validation.error, variant: "destructive" });
      return;
    }

    // Validate diastolic for blood pressure
    if (metricType === "bloodPressure") {
      const diaValidation = validateDiastolic(addValue2);
      if (!diaValidation.valid) {
        toast({ title: "Ogiltigt diastoliskt värde", description: diaValidation.error, variant: "destructive" });
        return;
      }
    }

    if (!date) {
      toast({ title: "Välj ett datum", variant: "destructive" });
      return;
    }

    const entry = buildNewEntry(metricType, { value: validation.value, value2: addValue2, value3: addValue3 });
    persistLogs(upsertLogEntry(dayLogs, date, entry));
    setAddDialogOpen(false);
    toast({ title: "Mätning tillagd" });
  };

  // ── Guard ────────────────────────────────
  if (!config) return <div>Okänd typ</div>;

  // ── Render ───────────────────────────────
  return (
    <div className={pageContainer}>
      {/* Header with back button */}
      <div className={`${headerContainer} ${pagePadding}`}>
        <Button variant="ghost" onClick={() => navigate("/app/progress")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tillbaka
        </Button>
        <h1 className={pageTitle}>{config.title}</h1>
      </div>

      {/* Main content */}
      <div className={`${pagePadding} flex flex-col gap-4`}>
        {/* Chart */}
        {chartData.length > 0 && (
          <ProgressChart
            type={metricType}
            dayLogs={dayLogs}
            goalWeight={metricType === "weight" ? goalValue : undefined}
            goalBloodPressure={
              metricType === "bloodPressure" && goalValue && goalValue2
                ? { systolic: goalValue, diastolic: goalValue2 }
                : undefined
            }
            goalBloodFats={
              metricType === "bloodFats" && goalValue ? { ldl: goalValue } : undefined
            }
            goalBloodGlucose={
              metricType === "bloodGlucose" && goalValue ? { hba1c: goalValue } : undefined
            }
            detailed={true}
          />
        )}

        {/* Goal section */}
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex justify-between items-center">
            <div>
              <div className={bodyTextBald}>Målvärde</div>
              <div className={cardTextSmall}>
                {goalValue ? getGoalLabel(metricType, goalValue, goalValue2) : "Inget mål satt"}
              </div>
            </div>
            <Button variant="outline" onClick={() => setGoalDialogOpen(true)}>
              {goalValue ? "Ändra mål" : "Sätt mål"}
            </Button>
          </div>
        </div>

        {/* History list */}
        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b flex justify-between items-center">
            <div className={bodyTextBald}>Loggade värden</div>
            <Button variant="outline" size="sm" onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-1 h-4 w-4" /> Lägg till
            </Button>
          </div>
          {chartData.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">Inga värden loggade än</div>
          ) : (
            <div className="divide-y">
              {[...chartData].reverse().map((entry, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-4 hover:bg-muted/30 cursor-pointer"
                  onClick={() => openEditDialog({ date: entry.fullDate, value: entry.value, value2: entry.value2 })}
                >
                  <span className="text-sm font-medium">
                    {format(new Date(entry.fullDate), "d MMMM yyyy", { locale: sv })}
                  </span>
                  <span className="text-sm font-semibold">
                    {metricType === "bloodPressure" && entry.value2
                      ? `${entry.value}/${entry.value2} ${config.unit}`
                      : `${entry.value} ${config.unit}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <EditEntryDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        metricType={metricType}
        config={config}
        selectedEntry={selectedEntry}
        onSave={handleSaveEdit}
        onDelete={handleDeleteEntry}
      />

      <GoalDialog
        open={goalDialogOpen}
        onOpenChange={setGoalDialogOpen}
        metricType={metricType}
        config={config}
        currentGoal={goalValue}
        currentGoal2={goalValue2}
        onSave={handleSaveGoal}
      />

      <AddMeasurementDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        metricType={metricType}
        onSave={handleSaveNew}
      />
    </div>
  );
};

export default ProgressDetail;
