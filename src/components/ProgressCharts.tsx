import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { ProgressDayLog, ChartDataPoint } from "@/lib/progress-types";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface ProgressChartsProps {
  dayLogs: ProgressDayLog[];
}

/**
 * Component displaying progress charts for weight and blood pressure
 * Shows historical data in bar chart format for the last 10 entries
 */
export const ProgressCharts: React.FC<ProgressChartsProps> = ({ dayLogs }) => {
  // Process weight data for chart display
  const weightData: ChartDataPoint[] = dayLogs
    .flatMap(log => 
      log.entries
        .filter(e => e.type === 'weight')
        .map(e => ({ 
          date: format(new Date(log.date), 'd MMM', { locale: sv }),
          value: e.value,
          fullDate: log.date
        }))
    )
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
    .slice(-10); // Show last 10 entries

  // Process blood pressure data for chart display
  const bloodPressureData: ChartDataPoint[] = dayLogs
    .flatMap(log => 
      log.entries
        .filter(e => e.type === 'bloodPressure')
        .map(e => ({ 
          date: format(new Date(log.date), 'd MMM', { locale: sv }),
          value: e.value,
          value2: e.value2,
          fullDate: log.date
        }))
    )
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
    .slice(-10); // Show last 10 entries

  return (
    <div className="grid grid-cols-2 gap-0 pt-0">
      {/* Weight Chart */}
      <div className="py-6 pr-6 pl-0 border-r border-t">
        <div className="flex flex-col h-full">
          <div className="flex-1 mb-4">
            <div className="text-base font-bold text-foreground">Vikt</div>
            <div className="text-sm text-muted-foreground font-normal">Loggade vikter (kg)</div>
          </div>
          <ChartContainer config={{ weight: { label: "Vikt", color: "hsl(217, 91%, 60%)" } }} className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weightData} margin={{ top: 20, bottom: 20 }}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis hide />
                <Bar 
                  dataKey="value" 
                  fill="hsl(217, 91%, 60%)" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={20}
                >
                  <LabelList 
                    dataKey="value" 
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

      {/* Blood Pressure Chart */}
      <div className="py-6 pr-0 pl-6 border-t">
        <div className="flex flex-col h-full">
          <div className="flex-1 mb-4">
            <div className="text-base font-bold text-foreground">Blodtryck</div>
            <div className="text-sm text-muted-foreground font-normal">Loggade blodtryck (mmHg)</div>
          </div>
          <ChartContainer config={{ systolic: { label: "Systoliskt", color: "hsl(350, 89%, 60%)" } }} className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bloodPressureData} margin={{ top: 20, bottom: 20 }}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis hide />
                <Bar 
                  dataKey="value" 
                  fill="hsl(350, 89%, 60%)" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={20}
                >
                  <LabelList 
                    dataKey="value" 
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
  );
};