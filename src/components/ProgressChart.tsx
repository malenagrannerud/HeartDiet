import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { StatsBox } from "@/components/StatsBox";
import { bodyTextBald, cardTextSmall } from "@/lib/design-tokens";

interface DayLog {
  date: string;
  entries: {
    type: 'weight' | 'bloodPressure' | 'tip';
    value: number;
    value2?: number;
    tipId?: number;
  }[];
}

interface ProgressChartProps {
  type: 'weight' | 'bloodPressure';
  dayLogs: DayLog[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ type, dayLogs }) => {
  const isWeight = type === 'weight';
  
  const chartData = dayLogs
    .flatMap(log => 
      log.entries
        .filter(e => e.type === type)
        .map(e => ({ 
          date: format(new Date(log.date), 'd MMM', { locale: sv }),
          value: e.value,
          value2: e.value2,
          fullDate: log.date
        }))
    )
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
    .slice(-10);

  const chartConfig = isWeight
    ? { weight: { label: "Vikt", color: "hsla(204, 37%, 48%, 1.00)" } }
    : { systolic: { label: "Systoliskt", color: "hsla(332, 52%, 52%, 1.00)" } };

  const barColor = isWeight ? "hsla(204, 37%, 48%, 1.00)" : "hsla(332, 52%, 52%, 1.00)";
  const dataKey = isWeight ? "value" : "value";
  const title = isWeight ? "Vikt" : "Blodtryck";
  const subtitle = isWeight ? "Loggade vikter (kg)" : "Loggade blodtryck (mmHg)";
  const formatter = isWeight 
    ? (value: number) => `${value} kg`
    : (value: number) => `${value}`;

  return (
    <StatsBox>
    <div className="flex flex-col gap-4">
      <div>
        <div className={bodyTextBald}>{title}</div>
        <div className={cardTextSmall}>{subtitle}</div>
      </div>
      <ChartContainer config={chartConfig} className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={[...chartData].sort((a, b) => {
              // Safe date comparison
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
    </div>
  </StatsBox>
    
  );
};
