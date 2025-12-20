import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { StatsBox } from "@/components/ProgressStatsBox";
import { MoreButton } from "@/components/MoreButton";
import { cardTextSmallBold } from "@/lib/design-tokens";
import { DEFAULT_GOALS } from "@/lib/metrics-defaults";
interface DayLog {
  date: string;
  entries: {
    type: 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose' | 'tip';
    value: number;
    value2?: number;
    value3?: number;
    tipId?: number;
  }[];
}

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
  type, 
  dayLogs, 
  goalWeight, 
  goalBloodPressure, 
  goalBloodFats,
  goalBloodGlucose,
  onMoreClick,
  detailed = false
}) => {
  const isWeight = type === 'weight';
  const isBloodPressure = type === 'bloodPressure';
  const isBloodFats = type === 'bloodFats';
  const isBloodGlucose = type === 'bloodGlucose';
  
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
  
  const chartData = detailed ? allChartData : allChartData.slice(-10);

  const getChartConfig = () => {
    if (isWeight) return { weight: { label: "Vikt", color: "hsla(204, 37%, 48%, 1.00)" } };
    if (isBloodPressure) return { systolic: { label: "Systoliskt", color: "hsla(332, 52%, 52%, 1.00)" } };
    if (isBloodFats) return { ldl: { label: "LDL", color: "hsla(280, 65%, 60%, 1.00)" } };
    return { glucose: { label: "Blodsocker", color: "hsla(160, 60%, 50%, 1.00)" } };
  };

  const getBarColor = () => {
    if (isWeight) return "hsla(204, 37%, 48%, 1.00)";
    if (isBloodPressure) return "hsla(332, 52%, 52%, 1.00)";
    if (isBloodFats) return "hsla(280, 65%, 60%, 1.00)";
    return "hsla(160, 60%, 50%, 1.00)";
  };

  const getTitle = () => {
    if (isWeight) return "Vikt (kg)";
    if (isBloodPressure) return "Blodtryck (mmHg)";
    if (isBloodFats) return "Kolesterol (mmol/L)";
    return "Blodsocker (mmol/L)";
  };

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

  // Get goal value: use provided value or default (except weight which has no default)
  const getGoalValue = () => {
    if (isWeight) return goalWeight || null; // No default for weight
    if (isBloodPressure) return goalBloodPressure?.systolic ?? DEFAULT_GOALS.bloodPressure.systolic;
    if (isBloodFats) return goalBloodFats?.ldl ?? DEFAULT_GOALS.bloodFats.ldl;
    if (isBloodGlucose) return goalBloodGlucose?.hba1c ?? DEFAULT_GOALS.bloodGlucose.hba1c;
    return null;
  };

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

  // Detailed view (for ProgressDetail page)
  if (detailed) {
    return (
      <div className="bg-card rounded-lg p-4 border">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis hide />
              {metricGoalValue && (
                <ReferenceLine 
                  y={metricGoalValue} 
                  stroke="hsl(var(--primary))" 
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  label={{ value: metricGoalLabel, position: 'right', fill: 'hsl(var(--primary))', fontSize: 10 }}
                />
              )}
              <Bar dataKey={dataKey} fill={barColor} radius={[5, 5, 0, 0]} barSize={20}>
                <LabelList dataKey="value" position="top" style={{ fontSize: 10, fill: 'hsl(var(--foreground))' }} formatter={formatter} offset={10} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    );
  }

  // Simplified view (for Progress page StatsBox)
  return (
    <StatsBox>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <div className={cardTextSmallBold}>{title}</div>
          </div>
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
              <XAxis dataKey="date" hide />
              <YAxis hide />
              {metricGoalValue && (
                <ReferenceLine 
                  y={metricGoalValue} 
                  stroke="hsl(var(--primary))" 
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  label={{ value: metricGoalLabel, position: 'right', fill: 'hsl(var(--primary))', fontSize: 10 }}
                />
              )}
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
