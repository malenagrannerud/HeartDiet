/**
 * @module PlotsComponents.tsx
 * 
 * Reusable line chart component for visualizing health metrics data.
 * Supports both compact (preview) and detailed views with goal reference lines.
 * Displays all values per metric (e.g., systolic+diastolic for blood pressure).
 */

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip, CartesianGrid, Label } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { StatsBox } from "@/components/ProgressStatsBox";
import { MoreButton } from "@/components/MoreButton";
import { cardTextSmallBold } from "@/lib/design-tokens";
import { DEFAULT_GOALS } from "@/data/metrics-defaults";
import { type DayLog } from "@/lib/schemas";

/** Color palette per metric line */
const COLORS = {
  weight: { value: "hsla(204, 37%, 48%, 1.00)" },
  bloodPressure: {
    systolic: "hsla(332, 52%, 52%, 1.00)",
    diastolic: "hsla(332, 52%, 72%, 1.00)",
  },
  bloodFats: {
    ldl: "hsla(280, 65%, 60%, 1.00)",
    hdl: "hsla(280, 45%, 75%, 1.00)",
    triglycerides: "hsla(280, 30%, 50%, 1.00)",
  },
  bloodGlucose: {
    hba1c: "hsla(160, 60%, 50%, 1.00)",
    fastingGlucose: "hsla(160, 40%, 70%, 1.00)",
  },
} as const;

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

export const ProgressChart: React.FC<ProgressChartProps> = ({ 
  type, dayLogs, goalWeight, goalBloodPressure, goalBloodFats, goalBloodGlucose,
  onMoreClick, detailed = false
}) => {
  const isWeight = type === 'weight';
  const isBloodPressure = type === 'bloodPressure';
  const isBloodFats = type === 'bloodFats';
  const isBloodGlucose = type === 'bloodGlucose';

  // Swedish month abbreviations
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

  // Transform day logs into chart data with month-only labels
  const allChartData = dayLogs
    .flatMap(log => 
      log.entries
        .filter(e => e.type === type)
        .map(e => ({ 
          date: monthNames[new Date(log.date).getMonth()],
          value: e.value,
          value2: e.value2,
          value3: e.value3,
          fullDate: log.date,
        }))
    )
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  const chartData = detailed ? allChartData : allChartData.slice(-10);

  /** Chart config for ChartContainer */
  const getChartConfig = () => {
    if (isWeight) return { weight: { label: "Vikt", color: COLORS.weight.value } };
    if (isBloodPressure) return {
      systolic: { label: "Systoliskt", color: COLORS.bloodPressure.systolic },
      diastolic: { label: "Diastoliskt", color: COLORS.bloodPressure.diastolic },
    };
    if (isBloodFats) return {
      ldl: { label: "LDL", color: COLORS.bloodFats.ldl },
      hdl: { label: "HDL", color: COLORS.bloodFats.hdl },
      triglycerides: { label: "Triglycerider", color: COLORS.bloodFats.triglycerides },
    };
    return {
      hba1c: { label: "HbA1c", color: COLORS.bloodGlucose.hba1c },
      fastingGlucose: { label: "Fastande", color: COLORS.bloodGlucose.fastingGlucose },
    };
  };

  const getTitle = () => {
    if (isWeight) return "Vikt (kg)";
    if (isBloodPressure) return "Blodtryck (mmHg)";
    if (isBloodFats) return "Kolesterol (mmol/L)";
    return "Blodsocker (mmol/L)";
  };

  /** Get reference lines (goal values) */
  const getReferenceLines = () => {
    const lines: { value: number; label: string; color: string }[] = [];
    if (isWeight && goalWeight) {
      lines.push({ value: goalWeight, label: `Mål: ${goalWeight} kg`, color: COLORS.weight.value });
    }
    if (isBloodPressure) {
      const sys = goalBloodPressure?.systolic ?? DEFAULT_GOALS.bloodPressure.systolic;
      const dia = goalBloodPressure?.diastolic ?? DEFAULT_GOALS.bloodPressure.diastolic;
      lines.push({ value: sys, label: `Mål sys: ${sys}`, color: COLORS.bloodPressure.systolic });
      lines.push({ value: dia, label: `Mål dia: ${dia}`, color: COLORS.bloodPressure.diastolic });
    }
    if (isBloodFats) {
      const ldl = goalBloodFats?.ldl ?? DEFAULT_GOALS.bloodFats.ldl;
      lines.push({ value: ldl, label: `Mål LDL: ${ldl}`, color: COLORS.bloodFats.ldl });
    }
    if (isBloodGlucose) {
      const hba1c = goalBloodGlucose?.hba1c ?? DEFAULT_GOALS.bloodGlucose.hba1c;
      lines.push({ value: hba1c, label: `Mål HbA1c: ${hba1c}`, color: COLORS.bloodGlucose.hba1c });
    }
    return lines;
  };

  /** Get line definitions for each metric type */
  const getLines = () => {
    if (isWeight) return [
      { dataKey: "value", stroke: COLORS.weight.value, name: "Vikt" },
    ];
    if (isBloodPressure) return [
      { dataKey: "value", stroke: COLORS.bloodPressure.systolic, name: "Systoliskt" },
      { dataKey: "value2", stroke: COLORS.bloodPressure.diastolic, name: "Diastoliskt" },
    ];
    if (isBloodFats) return [
      { dataKey: "value", stroke: COLORS.bloodFats.ldl, name: "LDL" },
      { dataKey: "value2", stroke: COLORS.bloodFats.hdl, name: "HDL" },
      { dataKey: "value3", stroke: COLORS.bloodFats.triglycerides, name: "Triglycerider" },
    ];
    return [
      { dataKey: "value", stroke: COLORS.bloodGlucose.hba1c, name: "HbA1c" },
      { dataKey: "value2", stroke: COLORS.bloodGlucose.fastingGlucose, name: "Fastande" },
    ];
  };

  const chartConfig = getChartConfig();
  const title = getTitle();
  const referenceLines = getReferenceLines();
  const lines = getLines();

  const chartHeight = detailed ? "h-64" : "h-32";

  const renderChart = () => (
    <ChartContainer config={chartConfig} className={`${chartHeight} w-full`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 45, left: 10, bottom: 10 }}>
          <CartesianGrid
            stroke="hsl(var(--muted-foreground) / 0.15)"
            horizontal
            vertical
          />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            width={35}
          />

          {detailed && <Tooltip />}

          {referenceLines.map((ref, i) => (
            <ReferenceLine 
              key={i}
              y={ref.value} 
              stroke={ref.color}
              strokeWidth={1.5}
              label={detailed ? { 
                value: ref.label, 
                position: 'right', 
                fill: ref.color, 
                fontSize: 10 
              } : undefined}
            />
          ))}

          {lines.map(line => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: line.stroke, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
              name={line.name}
              connectNulls
            >
              <Label value={line.name} position="insideEnd" fill={line.stroke} fontSize={11} fontWeight={600} />
            </Line>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );

  // Detailed view
  if (detailed) {
    return (
      <div className="bg-card rounded-lg p-4 border">
        {renderChart()}
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-2 px-2">
          {lines.map(line => (
            <div key={line.dataKey} className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ backgroundColor: line.stroke }} />
              <span className="text-xs text-muted-foreground">{line.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Compact view
  return (
    <StatsBox>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className={cardTextSmallBold}>{title}</div>
          {onMoreClick && <MoreButton label="Detaljer" onClick={onMoreClick} />}
        </div>
        {renderChart()}
      </div>
    </StatsBox>
  );
};
