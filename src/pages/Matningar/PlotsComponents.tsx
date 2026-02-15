/**
 * 
 * @module PlotsComponents.tsx
 * 
 * @description
 * Reusable chart component for visualizing health metrics data.
 * Supports both compact (preview) and detailed views with goal reference lines.
 * Used on dashboard and detailed progress pages.
 * 
 * Features:
 * - Bar chart with historical data points
 * - Goal reference line with formatted label
 * - Value labels on bars (detailed view only)
 * - Metric-specific colors and formatting
 * - "More" button for navigation to detailed view
 * - Automatic data sorting by date
 * - Limits to last 10 entries in compact view
 * 
 * Metric types supported:
 * - weight (kg) - teal color, no default goal
 * - bloodPressure (mmHg) - pink/red color, shows systolic values
 * - bloodFats (mmol/L) - purple color, shows LDL values
 * - bloodGlucose (mmol/L) - green color, shows HbA1c values
 * 
 * @requires date-fns - Date formatting with Swedish locale
 * @requires recharts - Chart components (BarChart, Bar, XAxis, YAxis, ReferenceLine, LabelList)
 * @requires @/components/ui/chart - Chart container wrapper
 * @requires @/components/ProgressStatsBox - Stats box container for compact view
 * @requires @/components/MoreButton - Navigation button to detailed view
 * @requires @/lib/design-tokens - Design system classes
 * @requires @/data/metrics-defaults - Default goal values
 */

import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { StatsBox } from "@/components/ProgressStatsBox";
import { MoreButton } from "@/components/MoreButton";
import { cardTextSmallBold } from "@/lib/design-tokens";
import { DEFAULT_GOALS } from "@/data/metrics-defaults";
import { type DayLog } from "@/lib/schemas";

/**
 * Props for the ProgressChart component
 * 
 * @interface ProgressChartProps
 * @property {('weight'|'bloodPressure'|'bloodFats'|'bloodGlucose')} type - Type of metric to display
 * @property {DayLog[]} dayLogs - Array of daily logs containing entries
 * @property {number} [goalWeight] - Target weight in kg (no default)
 * @property {Object} [goalBloodPressure] - Target blood pressure values
 * @property {number} goalBloodPressure.systolic - Target systolic pressure
 * @property {number} goalBloodPressure.diastolic - Target diastolic pressure
 * @property {Object} [goalBloodFats] - Target blood fat values
 * @property {number} [goalBloodFats.ldl] - Target LDL cholesterol
 * @property {number} [goalBloodFats.hdl] - Target HDL cholesterol
 * @property {Object} [goalBloodGlucose] - Target blood glucose values
 * @property {number} [goalBloodGlucose.hba1c] - Target HbA1c
 * @property {number} [goalBloodGlucose.fastingGlucose] - Target fasting glucose
 * @property {Function} [onMoreClick] - Callback when "More" button is clicked
 * @property {boolean} [detailed=false] - If true, shows detailed view with value labels and more data
 */
interface ProgressChartProps {
  type: 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose';
  dayLogs: DayLog[];
  goalWeight?: number;
  goalBloodPressure?: { systolic: number; diastolic: number };
  goalBloodFats?: { ldl?: number; hdl?: number };
  goalBloodGlucose?: { hba1c?: number; fastingGlucose?: number };
  onMoreClick?: () => void;
  detailed?: boolean;
}

/**
 * Progress chart component
 * 
 * @component
 * @param {ProgressChartProps} props - Component props
 * @returns {JSX.Element} Chart with metric data and goal reference line
 * 
 * @example
 * // Compact view for dashboard
 * <ProgressChart
 *   type="weight"
 *   dayLogs={dayLogs}
 *   goalWeight={80}
 *   onMoreClick={() => navigate('/progress/weight')}
 * />
 * 
 * @example
 * // Detailed view for progress page
 * <ProgressChart
 *   type="bloodPressure"
 *   dayLogs={dayLogs}
 *   goalBloodPressure={{ systolic: 120, diastolic: 80 }}
 *   detailed={true}
 * />
 */
export const ProgressChart: React.FC<ProgressChartProps> = ({ 
  type, 
  dayLogs, 
  goalWeight, 
  goalBloodPressure, 
  goalBloodFats,
  goalBloodGlucose,
  onMoreClick,
  detailed = false
}) => {
  // Metric type flags
  const isWeight = type === 'weight';
  const isBloodPressure = type === 'bloodPressure';
  const isBloodFats = type === 'bloodFats';
  const isBloodGlucose = type === 'bloodGlucose';
  
  /**
   * Transform day logs into chart data format
   * Filters entries by type, extracts values, and formats dates
   * Sorts chronologically by full date
   */
  const allChartData = dayLogs
    .flatMap(log => 
      log.entries
        .filter(e => e.type === type)
        .map(e => ({ 
          date: format(new Date(log.date), 'd MMM', { locale: sv }),
          value: e.value,
          value2: e.value2,
          value3: e.value3,
          fullDate: log.date
        }))
    )
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  
  // Limit to last 10 entries for compact view
  const chartData = detailed ? allChartData : allChartData.slice(-10);

  /**
   * Get chart configuration for ChartContainer
   * Returns metric-specific label and color
   * 
   * @returns {Object} Chart config object
   */
  const getChartConfig = () => {
    if (isWeight) return { weight: { label: "Vikt", color: "hsla(204, 37%, 48%, 1.00)" } };
    if (isBloodPressure) return { systolic: { label: "Systoliskt", color: "hsla(332, 52%, 52%, 1.00)" } };
    if (isBloodFats) return { ldl: { label: "LDL", color: "hsla(280, 65%, 60%, 1.00)" } };
    return { glucose: { label: "Blodsocker", color: "hsla(160, 60%, 50%, 1.00)" } };
  };

  /**
   * Get bar color based on metric type
   * 
   * @returns {string} HSL color string
   */
  const getBarColor = () => {
    if (isWeight) return "hsla(204, 37%, 48%, 1.00)";
    if (isBloodPressure) return "hsla(332, 52%, 52%, 1.00)";
    if (isBloodFats) return "hsla(280, 65%, 60%, 1.00)";
    return "hsla(160, 60%, 50%, 1.00)";
  };

  /**
   * Get chart title with unit
   * 
   * @returns {string} Formatted title
   */
  const getTitle = () => {
    if (isWeight) return "Vikt (kg)";
    if (isBloodPressure) return "Blodtryck (mmHg)";
    if (isBloodFats) return "Kolesterol (mmol/L)";
    return "Blodsocker (mmol/L)";
  };

  /**
   * Get value formatter for labels
   * 
   * @returns {Function} Formatting function
   */
  const getFormatter = () => {
    if (isWeight) return (value: number) => `${value} kg`;
    if (isBloodPressure) return (value: number) => `${value}`;
    if (isBloodFats) return (value: number) => `${value}`;
    return (value: number) => `${value}`;
  };

  const chartConfig = getChartConfig();
  const barColor = getBarColor();
  const dataKey = "value";
  const title = getTitle();
  const formatter = getFormatter();

  /**
   * Get goal value for reference line
   * Uses provided goal or default (except weight which has no default)
   * 
   * @returns {number|null} Goal value or null if none
   */
  const getGoalValue = () => {
    if (isWeight) return goalWeight || null;
    if (isBloodPressure) return goalBloodPressure?.systolic ?? DEFAULT_GOALS.bloodPressure.systolic;
    if (isBloodFats) return goalBloodFats?.ldl ?? DEFAULT_GOALS.bloodFats.ldl;
    if (isBloodGlucose) return goalBloodGlucose?.hba1c ?? DEFAULT_GOALS.bloodGlucose.hba1c;
    return null;
  };

  /**
   * Get formatted goal label for reference line
   * 
   * @returns {string} Formatted goal string
   */
  const getGoalLabel = () => {
    if (isWeight && goalWeight) return `Mål: ${goalWeight} kg`;
    if (isBloodPressure) {
      const sys = goalBloodPressure?.systolic ?? DEFAULT_GOALS.bloodPressure.systolic;
      const dia = goalBloodPressure?.diastolic ?? DEFAULT_GOALS.bloodPressure.diastolic;
      return `Mål: ${sys}/${dia}`;
    }
    if (isBloodFats) {
      const ldl = goalBloodFats?.ldl ?? DEFAULT_GOALS.bloodFats.ldl;
      return `Mål LDL: ${ldl}`;
    }
    if (isBloodGlucose) {
      const hba1c = goalBloodGlucose?.hba1c ?? DEFAULT_GOALS.bloodGlucose.hba1c;
      return `Mål HbA1c: ${hba1c}`;
    }
    return '';
  };

  const metricGoalValue = getGoalValue();
  const metricGoalLabel = getGoalLabel();

  // Detailed view with value labels and full data
  if (detailed) {
    return (
      <div className="bg-card rounded-lg p-4 border">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
              {/* X-axis with formatted dates */}
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              {/* Y-axis hidden for cleaner look */}
              <YAxis hide />
              
              {/* Goal reference line */}
              {metricGoalValue && (
                <ReferenceLine 
                  y={metricGoalValue} 
                  stroke="hsl(var(--primary))" 
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  label={{ 
                    value: metricGoalLabel, 
                    position: 'right', 
                    fill: 'hsl(var(--primary))', 
                    fontSize: 10 
                  }}
                />
              )}
              
              {/* Data bars with value labels */}
              <Bar dataKey={dataKey} fill={barColor} radius={[5, 5, 0, 0]} barSize={20}>
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  style={{ fontSize: 10, fill: 'hsl(var(--foreground))' }} 
                  formatter={formatter} 
                  offset={10} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    );
  }

  // Compact view for dashboard (no value labels, fewer data points)
  return (
    <StatsBox>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <div className={cardTextSmallBold}>{title}</div>
          </div>
          {/* More button for navigation to detailed view */}
          {onMoreClick && (
            <MoreButton label="Detaljer" onClick={onMoreClick} />
          )}
        </div>
        
        <ChartContainer config={chartConfig} className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              {/* Axes hidden for compact view */}
              <XAxis dataKey="date" hide />
              <YAxis hide />
              
              {/* Goal reference line */}
              {metricGoalValue && (
                <ReferenceLine 
                  y={metricGoalValue} 
                  stroke="hsl(var(--primary))" 
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  label={{ 
                    value: metricGoalLabel, 
                    position: 'right', 
                    fill: 'hsl(var(--primary))', 
                    fontSize: 10 
                  }}
                />
              )}
              
              {/* Simple bars without labels */}
              <Bar 
                dataKey={dataKey} 
                fill={barColor} 
                radius={[10, 10, 10, 10]}
                barSize={10}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </StatsBox>
  );
};