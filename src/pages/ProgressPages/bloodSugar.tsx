// pages/ProgressPages/bloodSugar.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { getDayLogs } from "@/lib/tip-completion";
import { getStorageItem } from "@/lib/storage";
import { healthMetricsSchema, type DayLog } from "@/lib/schemas";
import { safeParseFloat } from "@/lib/health-validators";
import { pageTitle, pageContainer, pagePadding, standardSpacing } from "@/lib/design-tokens";

interface BloodGlucoseChartData {
  date: string;
  hba1c?: number;
  fastingGlucose?: number;
}

// ============================================================================
// FULL DETAILED BLOOD GLUCOSE CHART PAGE
// ============================================================================

const BloodSugarChart = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<BloodGlucoseChartData[]>([]);
  const [goalHbA1c, setGoalHbA1c] = useState<number | undefined>();
  const [goalFastingGlucose, setGoalFastingGlucose] = useState<number | undefined>();

  useEffect(() => {
    // Load health data
    const logs = getDayLogs();
    
    // Filter and format blood glucose data
    const glucoseData: BloodGlucoseChartData[] = logs
      .map(log => {
        const glucoseEntry = log.entries.find(e => e.type === 'bloodGlucose');
        if (!glucoseEntry) return null;
        
        return {
          date: log.date,
          hba1c: glucoseEntry.value,
          fastingGlucose: glucoseEntry.value2
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as BloodGlucoseChartData[];
    
    setChartData(glucoseData);

    // Load goals
    const metrics = getStorageItem('healthMetrics', healthMetricsSchema);
    if (metrics) {
      const goalHb = safeParseFloat(metrics.goalHbA1c);
      const goalFG = safeParseFloat(metrics.goalFastingGlucose);
      if (goalHb !== undefined) setGoalHbA1c(goalHb);
      if (goalFG !== undefined) setGoalFastingGlucose(goalFG);
    }
  }, []);

  // Simple chart rendering function
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Inga blodsockervärden sparade ännu</p>
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

    // Filter data with values
    const hba1cData = chartData.filter(d => d.hba1c);
    const fastingData = chartData.filter(d => d.fastingGlucose);
    
    // Calculate min/max for scaling
    const allValues = [
      ...hba1cData.map(d => d.hba1c!),
      ...fastingData.map(d => d.fastingGlucose!),
      goalHbA1c || 0,
      goalFastingGlucose || 0
    ].filter(v => v > 0);
    
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
    const dateToX = (index: number, totalPoints: number) => {
      const availableWidth = `calc(${chartWidth} - ${padding * 2}px)`;
      return `calc(${padding}px + (${availableWidth} * ${index / (totalPoints - 1)}))`;
    };

    return (
      <div className="relative" style={{ height: `${chartHeight}px`, width: chartWidth }}>
        {/* Goal lines */}
        {goalHbA1c && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-purple-500"
            style={{ top: `${valueToY(goalHbA1c)}px` }}
          >
            <div className="absolute -top-6 left-2 text-xs text-purple-600">
              HbA1c mål: {goalHbA1c} mmol/mol
            </div>
          </div>
        )}
        
        {goalFastingGlucose && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-orange-500"
            style={{ top: `${valueToY(goalFastingGlucose)}px` }}
          >
            <div className="absolute -top-6 right-2 text-xs text-orange-600">
              Faste mål: {goalFastingGlucose} mmol/L
            </div>
          </div>
        )}

        {/* Grid lines */}
        <div className="absolute inset-0 border border-gray-200 rounded-lg" />
        
        {/* HbA1c Line */}
        <svg className="absolute inset-0 w-full h-full">
          {hba1cData.length > 0 && (
            <polyline
              fill="none"
              stroke="#8b5cf6" // Purple for HbA1c
              strokeWidth="2"
              points={hba1cData
                .map((d, i) => `${dateToX(i, hba1cData.length)},${valueToY(d.hba1c!)}`)
                .join(' ')}
            />
          )}
          
          {/* Fasting Glucose Line */}
          {fastingData.length > 0 && (
            <polyline
              fill="none"
              stroke="#f97316" // Orange for fasting glucose
              strokeWidth="2"
              strokeDasharray="5,5"
              points={fastingData
                .map((d, i) => `${dateToX(i, fastingData.length)},${valueToY(d.fastingGlucose!)}`)
                .join(' ')}
            />
          )}

          {/* Data points */}
          {hba1cData.map((data, index) => (
            <circle
              key={`hba1c-${data.date}`}
              cx={dateToX(index, hba1cData.length)}
              cy={valueToY(data.hba1c!)}
              r="4"
              fill="#8b5cf6"
              className="cursor-pointer hover:r-6 transition-all"
            />
          ))}
          
          {fastingData.map((data, index) => (
            <circle
              key={`fasting-${data.date}`}
              cx={dateToX(index, fastingData.length)}
              cy={valueToY(data.fastingGlucose!)}
              r="4"
              fill="#f97316"
              className="cursor-pointer hover:r-6 transition-all"
            />
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
          <span>{maxValue.toFixed(1)}</span>
          <span>{((maxValue + minValue) / 2).toFixed(1)}</span>
          <span>{minValue.toFixed(1)}</span>
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
          <h1 className={pageTitle}>Blodsocker</h1>
        </div>
      </header>

      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          
          {/* Statistics Card */}
          {latestData && (
            <Card className="mb-6 p-4">
              <div className="grid grid-cols-2 gap-4">
                {latestData.hba1c && (
                  <div>
                    <p className="text-sm text-gray-500">Senaste HbA1c</p>
                    <p className="text-2xl font-bold text-purple-600">{latestData.hba1c.toFixed(1)} mmol/mol</p>
                    {goalHbA1c && (
                      <p className="text-sm text-gray-500">
                        Mål: {goalHbA1c} mmol/mol
                      </p>
                    )}
                  </div>
                )}
                {latestData.fastingGlucose && (
                  <div>
                    <p className="text-sm text-gray-500">Senaste faste</p>
                    <p className="text-2xl font-bold text-orange-600">{latestData.fastingGlucose.toFixed(1)} mmol/L</p>
                    {goalFastingGlucose && (
                      <p className="text-sm text-gray-500">
                        Mål: {goalFastingGlucose} mmol/L
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Chart */}
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="font-medium">Utveckling över tid</h3>
              <div className="flex items-center gap-4 mt-2">
                {chartData.some(d => d.hba1c) && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm">HbA1c (mmol/mol)</span>
                  </div>
                )}
                {chartData.some(d => d.fastingGlucose) && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm">Fasteblodsocker (mmol/L)</span>
                  </div>
                )}
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
                      <th className="text-left py-2">HbA1c</th>
                      <th className="text-left py-2">Fasteblodsocker</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.slice().reverse().map((data) => (
                      <tr key={data.date} className="border-b last:border-0">
                        <td className="py-2">{new Date(data.date).toLocaleDateString('sv-SE')}</td>
                        <td className="py-2 text-purple-600">
                          {data.hba1c ? `${data.hba1c.toFixed(1)} mmol/mol` : '-'}
                        </td>
                        <td className="py-2 text-orange-600">
                          {data.fastingGlucose ? `${data.fastingGlucose.toFixed(1)} mmol/L` : '-'}
                        </td>
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

interface BloodSugarMiniChartProps {
  dayLogs: DayLog[];
  goalHbA1c?: number;
  goalFastingGlucose?: number;
  onMoreClick?: () => void;
}

export const BloodSugarMiniChart: React.FC<BloodSugarMiniChartProps> = ({
  dayLogs,
  goalHbA1c,
  goalFastingGlucose,
  onMoreClick
}) => {
  const [chartData, setChartData] = useState<{date: string; hba1c?: number; fastingGlucose?: number}[]>([]);

  useEffect(() => {
    const glucoseData = dayLogs
      .map(log => {
        const glucoseEntry = log.entries.find(e => e.type === 'bloodGlucose');
        if (!glucoseEntry) return null;
        
        return {
          date: log.date,
          hba1c: glucoseEntry.value,
          fastingGlucose: glucoseEntry.value2
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setChartData(glucoseData);
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

    // Get last 5-7 values with HbA1c data
    const recentHbA1cData = chartData.filter(d => d.hba1c).slice(-7);
    const recentFastingData = chartData.filter(d => d.fastingGlucose).slice(-7);
    
    if (recentHbA1cData.length === 0 && recentFastingData.length === 0) {
      return <div className="h-20 flex items-center justify-center text-gray-500 text-sm">Inga värden</div>;
    }

    // Calculate min/max for scaling
    const allValues = [
      ...recentHbA1cData.map(d => d.hba1c!),
      ...recentFastingData.map(d => d.fastingGlucose!),
      goalHbA1c || 0,
      goalFastingGlucose || 0
    ].filter(v => v > 0);
    
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const range = maxValue - minValue || 1;

    return (
      <div className="h-20">
        <div className="flex items-end h-14 space-x-1">
          {recentHbA1cData.map((data, i) => {
            const heightPercent = ((data.hba1c! - minValue) / range) * 70 + 30;
            return (
              <div 
                key={`hba1c-${i}`}
                className="flex-1 flex flex-col items-center"
              >
                <div 
                  className="w-2 bg-purple-500 rounded-t"
                  style={{ height: `${heightPercent}%` }}
                  title={`HbA1c: ${data.hba1c!.toFixed(1)}`}
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
          <h3 className="font-semibold text-gray-800">Blodsocker</h3>
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
            {latestData?.hba1c 
              ? `${latestData.hba1c.toFixed(1)} mmol/mol`
              : latestData?.fastingGlucose
              ? `${latestData.fastingGlucose.toFixed(1)} mmol/L`
              : '–'
            }
          </span>
        </div>
      </div>

      <div className="mt-3">
        {renderMiniChart()}
      </div>

      {(goalHbA1c || goalFastingGlucose) && latestData && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Mål:</span>
            <span className={`font-medium ${
              ((latestData.hba1c && latestData.hba1c > (goalHbA1c || 0)) ||
               (latestData.fastingGlucose && latestData.fastingGlucose > (goalFastingGlucose || 0))) 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {goalHbA1c ? `${goalHbA1c} mmol/mol` : `${goalFastingGlucose} mmol/L`}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

// Export both
export default BloodSugarChart;