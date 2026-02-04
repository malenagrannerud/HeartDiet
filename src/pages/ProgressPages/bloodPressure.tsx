// pages/ProgressPages/bloodPressure.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { getDayLogs } from "@/lib/tip-completion";
import { getStorageItem } from "@/lib/storage";
import { healthMetricsSchema, type DayLog } from "@/lib/schemas";
import { safeParseInt } from "@/lib/health-validators";
import { pageTitle, pageContainer, pagePadding, standardSpacing } from "@/lib/design-tokens";

interface BloodPressureChartData {
  date: string;
  systolic: number;
  diastolic: number;
}

// ============================================================================
// FULL DETAILED BLOOD PRESSURE CHART PAGE
// ============================================================================

const BloodPressureChart = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<BloodPressureChartData[]>([]);
  const [goalSystolic, setGoalSystolic] = useState<number | undefined>();
  const [goalDiastolic, setGoalDiastolic] = useState<number | undefined>();

  useEffect(() => {
    // Load health data
    const logs = getDayLogs();
    
    // Filter and format blood pressure data
    const bpData: BloodPressureChartData[] = logs
      .map(log => {
        const bpEntry = log.entries.find(e => e.type === 'bloodPressure');
        if (!bpEntry || !bpEntry.value2) return null;
        
        return {
          date: log.date,
          systolic: bpEntry.value,
          diastolic: bpEntry.value2
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as BloodPressureChartData[];
    
    setChartData(bpData);

    // Load goals
    const metricsData = getStorageItem('healthMetrics');
    if (metricsData) {
      const parsed = healthMetricsSchema.safeParse(metricsData);
      if (parsed.success) {
        const metrics = parsed.data;
        const goalSys = safeParseInt(metrics.goalSystolic);
        const goalDia = safeParseInt(metrics.goalDiastolic);
        if (goalSys !== undefined) setGoalSystolic(goalSys);
        if (goalDia !== undefined) setGoalDiastolic(goalDia);
      }
    }
  }, []);

  // Simple chart rendering function
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Inga blodtrycksvärden sparade ännu</p>
          <Button 
            onClick={() => navigate('/app/progress')}
            variant="outline"
            className="mt-4"
          >
            Lägg till värden
          </Button>
        </div>
      );
    }

    // Calculate min/max for scaling
    const systolicValues = chartData.map(d => d.systolic);
    const diastolicValues = chartData.map(d => d.diastolic);
    const allValues = [...systolicValues, ...diastolicValues, goalSystolic || 0, goalDiastolic || 0];
    
    const maxValue = Math.max(...allValues) * 1.1; // Add 10% padding
    const minValue = Math.max(0, Math.min(...allValues) * 0.9);

    // Chart dimensions
    const chartHeight = 200;
    const chartWidth = "100%";
    const padding = 40;

    // Helper to convert value to Y coordinate
    const valueToY = (value: number) => {
      const range = maxValue - minValue;
      if (range === 0) return chartHeight - padding;
      return ((maxValue - value) / range) * (chartHeight - padding * 2) + padding;
    };

    // Helper to convert date to X coordinate
    const dateToX = (index: number) => {
      const totalPoints = chartData.length;
      const availableWidth = `calc(${chartWidth} - ${padding * 2}px)`;
      return `calc(${padding}px + (${availableWidth} * ${index / (totalPoints - 1)}))`;
    };

    return (
      <div className="relative" style={{ height: `${chartHeight}px`, width: chartWidth }}>
        {/* Goal lines */}
        {goalSystolic && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-green-500"
            style={{ top: `${valueToY(goalSystolic)}px` }}
          >
            <div className="absolute -top-6 left-2 text-xs text-green-600">
              Systoliskt mål: {goalSystolic} mmHg
            </div>
          </div>
        )}
        
        {goalDiastolic && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-blue-500"
            style={{ top: `${valueToY(goalDiastolic)}px` }}
          >
            <div className="absolute -top-6 right-2 text-xs text-blue-600">
              Diastoliskt mål: {goalDiastolic} mmHg
            </div>
          </div>
        )}

        {/* Grid lines */}
        <div className="absolute inset-0 border border-gray-200 rounded-lg" />
        
        {/* Systolic Line */}
        <svg className="absolute inset-0 w-full h-full">
          <polyline
            fill="none"
            stroke="#ef4444" // Red for systolic
            strokeWidth="2"
            points={chartData
              .map((d, i) => `${dateToX(i)},${valueToY(d.systolic)}`)
              .join(' ')}
          />
          
          {/* Diastolic Line */}
          <polyline
            fill="none"
            stroke="#3b82f6" // Blue for diastolic
            strokeWidth="2"
            strokeDasharray="5,5"
            points={chartData
              .map((d, i) => `${dateToX(i)},${valueToY(d.diastolic)}`)
              .join(' ')}
          />

          {/* Data points */}
          {chartData.map((data, index) => (
            <g key={data.date}>
              <circle
                cx={dateToX(index)}
                cy={valueToY(data.systolic)}
                r="4"
                fill="#ef4444"
                className="cursor-pointer hover:r-6 transition-all"
              />
              <circle
                cx={dateToX(index)}
                cy={valueToY(data.diastolic)}
                r="4"
                fill="#3b82f6"
                className="cursor-pointer hover:r-6 transition-all"
              />
            </g>
          ))}
        </svg>

        {/* X-axis labels (dates) */}
        <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-500">
          {chartData.length > 0 && (
            <>
              <span>{formatDate(chartData[0].date)}</span>
              {chartData.length > 1 && (
                <span>{formatDate(chartData[chartData.length - 1].date)}</span>
              )}
            </>
          )}
        </div>

        {/* Y-axis labels */}
        <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue.toFixed(0)}</span>
          <span>{((maxValue + minValue) / 2).toFixed(0)}</span>
          <span>{minValue.toFixed(0)}</span>
        </div>
      </div>
    );
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Calculate statistics
  const latestData = chartData[chartData.length - 1];

  return (
    <div className={pageContainer}>
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/app/progress')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className={pageTitle}>Blodtryck</h1>
        </div>
      </header>

      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          
          {/* Statistics Card */}
          {latestData && (
            <Card className="mb-6 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Senaste systoliskt</p>
                  <p className="text-2xl font-bold text-red-600">{latestData.systolic.toFixed(0)} mmHg</p>
                  {goalSystolic && (
                    <p className="text-sm text-gray-500">
                      Mål: {goalSystolic} mmHg
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Senaste diastoliskt</p>
                  <p className="text-2xl font-bold text-blue-600">{latestData.diastolic.toFixed(0)} mmHg</p>
                  {goalDiastolic && (
                    <p className="text-sm text-gray-500">
                      Mål: {goalDiastolic} mmHg
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-lg font-semibold text-center">
                  {latestData.systolic}/{latestData.diastolic} mmHg
                </p>
              </div>
            </Card>
          )}

          {/* Chart */}
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="font-medium">Utveckling över tid</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Systoliskt (övre)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Diastoliskt (nedre)</span>
                </div>
              </div>
            </div>
            
            {renderChart()}
          </Card>

          {/* Data Table */}
          {chartData.length > 0 && (
            <Card className="mt-6 p-4">
              <h3 className="font-medium mb-3">Historik</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Datum</th>
                      <th className="text-left py-2">Systoliskt</th>
                      <th className="text-left py-2">Diastoliskt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.slice().reverse().map((data) => (
                      <tr key={data.date} className="border-b last:border-0">
                        <td className="py-2">{new Date(data.date).toLocaleDateString('sv-SE')}</td>
                        <td className="py-2 text-red-600">{data.systolic.toFixed(0)} mmHg</td>
                        <td className="py-2 text-blue-600">{data.diastolic.toFixed(0)} mmHg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

// ============================================================================
// SIMPLIFIED MINI CHART FOR PROGRESS PAGE (Export this!)
// ============================================================================

interface BloodPressureMiniChartProps {
  dayLogs: DayLog[];
  goalSystolic?: number;
  goalDiastolic?: number;
  onMoreClick?: () => void;
}

export const BloodPressureMiniChart: React.FC<BloodPressureMiniChartProps> = ({
  dayLogs,
  goalSystolic,
  goalDiastolic,
  onMoreClick
}) => {
  const [chartData, setChartData] = useState<{date: string; systolic: number; diastolic: number}[]>([]);

  useEffect(() => {
    const bpData = dayLogs
      .map(log => {
        const bpEntry = log.entries.find(e => e.type === 'bloodPressure');
        if (!bpEntry || !bpEntry.value2) return null;
        
        return {
          date: log.date,
          systolic: bpEntry.value,
          diastolic: bpEntry.value2
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setChartData(bpData);
  }, [dayLogs]);

  // Simple mini chart
  const renderMiniChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="h-20 flex items-center justify-center text-gray-500 text-sm">
          Inga värden
        </div>
      );
    }

    // Get last 5-7 values
    const recentData = chartData.slice(-7);
    const systolicValues = recentData.map(d => d.systolic);
    const diastolicValues = recentData.map(d => d.diastolic);
    const maxValue = Math.max(...systolicValues, ...diastolicValues);
    const minValue = Math.min(...systolicValues, ...diastolicValues);
    const range = maxValue - minValue || 1;

    return (
      <div className="h-20">
        <div className="flex items-end h-14 space-x-1">
          {recentData.map((data, i) => {
            const systolicHeight = ((data.systolic - minValue) / range) * 70 + 30;
            const diastolicHeight = ((data.diastolic - minValue) / range) * 70 + 30;
            
            return (
              <div 
                key={i}
                className="flex-1 flex flex-col items-center"
              >
                {/* Systolic (top/red) */}
                <div 
                  className="w-2 bg-red-500 rounded-t"
                  style={{ height: `${systolicHeight}%` }}
                  title={`Syst: ${data.systolic}`}
                />
                {/* Diastolic (bottom/blue) */}
                <div 
                  className="w-2 bg-blue-500 rounded-t mt-1"
                  style={{ height: `${diastolicHeight}%` }}
                  title={`Diast: ${data.diastolic}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const latestData = chartData[chartData.length - 1];

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">Blodtryck</h3>
          <p className="text-sm text-gray-500">
            {latestData ? 'Senaste värde' : 'Inga värden'}
          </p>
        </div>
        
        {onMoreClick && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMoreClick}
            className="text-blue-600 hover:text-blue-800"
          >
            Detaljer
          </Button>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {latestData ? `${latestData.systolic}/${latestData.diastolic}` : '–'}
          </span>
          <span className="text-sm text-gray-500">mmHg</span>
        </div>
      </div>

      <div className="mt-3">
        {renderMiniChart()}
      </div>

      {(goalSystolic || goalDiastolic) && latestData && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Mål:</span>
            <span className={`font-medium ${
              (latestData.systolic > (goalSystolic || 0) || 
               latestData.diastolic > (goalDiastolic || 0)) 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {goalSystolic}/{goalDiastolic} mmHg
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

// Export both
export default BloodPressureChart;