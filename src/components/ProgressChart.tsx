import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList, ReferenceLine } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { StatsBox } from "@/components/StatsBox";
import { MoreButton } from "@/components/MoreButton";
import { bodyTextBald, cardTextSmall } from "@/lib/design-tokens";

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
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ 
  type, 
  dayLogs, 
  goalWeight, 
  goalBloodPressure, 
  goalBloodFats,
  goalBloodGlucose,
  onMoreClick
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
  
  const chartData = allChartData.slice(-10);

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
    if (isWeight) return "Vikt";
    if (isBloodPressure) return "Blodtryck";
    if (isBloodFats) return "Kolesterol (LDL)";
    return "Blodsocker";
  };

  const getSubtitle = () => {
    if (isWeight) return "Loggade vikter (kg)";
    if (isBloodPressure) return "Loggade blodtryck (mmHg)";
    if (isBloodFats) return "Loggat LDL-kolesterol (mmol/L)";
    return "Loggat blodsocker (mmol/mol eller mmol/L)";
  };

  const getFormatter = () => {
    if (isWeight) return (value: number) => `${value} kg`;
    if (isBloodPressure) return (value: number) => `${value}`;
    if (isBloodFats) return (value: number) => `${value}`;
    return (value: number) => `${value}`;
  };

  const chartConfig = getChartConfig();
  const barColor = getBarColor();
  const dataKey = "value"; // All chart types use 'value' as primary data key
  const title = getTitle();
  const subtitle = getSubtitle();
  const formatter = getFormatter();

  const getGoalValue = () => {
    if (isWeight && goalWeight) return goalWeight;
    if (isBloodPressure && goalBloodPressure) return goalBloodPressure.systolic;
    if (isBloodFats && goalBloodFats?.ldl) return goalBloodFats.ldl;
    if (isBloodGlucose && goalBloodGlucose?.hba1c) return goalBloodGlucose.hba1c;
    return null;
  };

  const getGoalLabel = () => {
    if (isWeight && goalWeight) return `Mål: ${goalWeight} kg`;
    if (isBloodPressure && goalBloodPressure) return `Mål: ${goalBloodPressure.systolic}/${goalBloodPressure.diastolic}`;
    if (isBloodFats && goalBloodFats?.ldl) return `Mål LDL: ${goalBloodFats.ldl}`;
    if (isBloodGlucose && goalBloodGlucose?.hba1c) return `Mål HbA1c: ${goalBloodGlucose.hba1c}`;
    return '';
  };

  const goalValue = getGoalValue();
  const goalLabel = getGoalLabel();

  return (
    <StatsBox>
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <div className={bodyTextBald}>{title}</div>
          <div className={cardTextSmall}>{subtitle}</div>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={[...chartData].sort((a, b) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return dateA - dateB;
            })}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              interval={0}
            />
            <YAxis hide />
            {goalValue && (
              <ReferenceLine 
                y={goalValue} 
                stroke="hsl(var(--primary))" 
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{ value: goalLabel, position: 'right', fill: 'hsl(var(--primary))', fontSize: 10 }}
              />
            )}
            <Bar 
              dataKey={dataKey} 
              fill={barColor} 
              radius={[5, 5, 0, 0]}
              barSize={20}
            >
              <LabelList 
                dataKey={dataKey} 
                position="top" 
                style={{ fontSize: 10, fill: 'hsl(var(--foreground))' }}
                formatter={formatter}
                offset={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      {onMoreClick && (
        <div className="flex justify-end">
          <MoreButton label="Detaljer" onClick={onMoreClick} />
        </div>
      )}
    </div>
  </StatsBox>
    
  );
};
