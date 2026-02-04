// pages/ProgressPages/weight.tsx
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

interface WeightChartData {
  date: string;
  weight: number;
}

// ============================================================================
// FULL DETAILED WEIGHT CHART PAGE
// ============================================================================

const WeightChart = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<WeightChartData[]>([]);
  const [goalWeight, setGoalWeight] = useState<number | undefined>();

  useEffect(() => {
    // Load health data
    const logs = getDayLogs();
    
    // Filter and format weight data
    const weightData: WeightChartData[] = logs
      .map(log => {
        const weightEntry = log.entries.find(e => e.type === 'weight');
        if (!weightEntry) return null;
        
        return {
          date: log.date,
          weight: weightEntry.value
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as WeightChartData[];
    
    setChartData(weightData);

    // Load goal
    const metrics = getStorageItem('healthMetrics', healthMetricsSchema);
    if (metrics?.goalWeight) {
      setGoalWeight(safeParseFloat(metrics.goalWeight));
    }
  }, []);

  // Simple chart rendering function
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Inga viktvärden sparade ännu</p>
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
    const allValues = chartData.map(d => d.weight);
    const maxValue = Math.max(...allValues, goalWeight || 0) * 1.05; // Add 5% padding
    const minValue = Math.max(0, Math.min(...allValues, goalWeight || Infinity) * 0.95);

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
        {/* Goal line */}
        {goalWeight && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-green-500"
            style={{ top: `${valueToY(goalWeight)}px` }}
          >
            <div className="absolute -top-6 left-2 text-xs text-green-600">
              Målvikt: {goalWeight} kg
            </div>
          </div>
        )}

        {/* Grid lines */}
        <div className="absolute inset-0 border border-gray-200 rounded-lg" />
        
        {/* Weight Line */}
        <svg className="absolute inset-0 w-full h-full">
          <polyline
            fill="none"
            stroke="#6366f1" // Indigo for weight
            strokeWidth="2"
            points={chartData
              .map((d, i) => `${dateToX(i)},${valueToY(d.weight)}`)
              .join(' ')}
          />

          {/* Data points */}
          {chartData.map((data, index) => (
            <circle
              key={data.date}
              cx={dateToX(index)}
              cy={valueToY(data.weight)}
              r="4"
              fill="#6366f1"
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
          <span>{maxValue.toFixed(0)} kg</span>
          <span>{((maxValue + minValue) / 2).toFixed(0)} kg</span>
          <span>{minValue.toFixed(0)} kg</span>
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
  const firstData = chartData[0];
  const weightChange = chartData.length > 1 && latestData && firstData 
    ? (latestData.weight - firstData.weight).toFixed(1)
    : null;

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
          <h1 className={pageTitle}>Viktutveckling</h1>
        </div>
      </header>

      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          
          {/* Statistics Card */}
          {latestData && (
            <Card className="mb-6 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Senaste vikt</p>
                  <p className="text-2xl font-bold text-indigo-600">{latestData.weight.toFixed(1)} kg</p>
                </div>
                {weightChange && (
                  <div>
                    <p className="text-sm text-gray-500">Förändring</p>
                    <p className={`text-2xl font-bold ${parseFloat(weightChange) < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(weightChange) < 0 ? '▼' : '▲'} {Math.abs(parseFloat(weightChange))} kg
                    </p>
                    <p className="text-sm text-gray-500">
                      Sedan start
                    </p>
                  </div>
                )}
              </div>
              {goalWeight && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Målvikt:</span>
                    <span className="font-semibold">{goalWeight} kg</span>
                  </div>
                  {latestData && (
                    <div className="mt-2 flex justify-between">
                      <span className="text-gray-600">Återstår:</span>
                      <span className={`font-semibold ${
                        Math.abs(latestData.weight - goalWeight) < 0.5 
                          ? 'text-green-600' 
                          : latestData.weight > goalWeight 
                            ? 'text-red-600' 
                            : 'text-blue-600'
                      }`}>
                        {Math.abs(latestData.weight - goalWeight).toFixed(1)} kg
                      </span>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* Chart */}
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="font-medium">Utveckling över tid</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-sm">Vikt (kg)</span>
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
                      <th className="text-left py-2">Vikt</th>
                      <th className="text-left py-2">Förändring</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.slice().reverse().map((data, index, array) => {
                      const prevWeight = index < array.length - 1 ? array[index + 1].weight : null;
                      const change = prevWeight ? (data.weight - prevWeight).toFixed(1) : null;
                      
                      return (
                        <tr key={data.date} className="border-b last:border-0">
                          <td className="py-2">{new Date(data.date).toLocaleDateString('sv-SE')}</td>
                          <td className="py-2 text-indigo-600">{data.weight.toFixed(1)} kg</td>
                          <td className="py-2">
                            {change && (
                              <span className={`${parseFloat(change) < 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {parseFloat(change) < 0 ? '▼' : '▲'} {Math.abs(parseFloat(change))} kg
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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

interface WeightMiniChartProps {
  dayLogs: DayLog[];
  goalWeight?: number;
  onMoreClick?: () => void;
}

export const WeightMiniChart: React.FC<WeightMiniChartProps> = ({
  dayLogs,
  goalWeight,
  onMoreClick
}) => {
  const [chartData, setChartData] = useState<{date: string; weight: number}[]>([]);

  useEffect(() => {
    const weightData = dayLogs
      .map(log => {
        const weightEntry = log.entries.find(e => e.type === 'weight');
        if (!weightEntry) return null;
        
        return {
          date: log.date,
          weight: weightEntry.value
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setChartData(weightData);
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
    const values = recentData.map(d => d.weight);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    return (
      <div className="h-20">
        <div className="flex items-end h-14 space-x-1">
          {recentData.map((data, i) => {
            const heightPercent = ((data.weight - minValue) / range) * 70 + 30;
            return (
              <div 
                key={i}
                className="flex-1 flex flex-col items-center"
              >
                <div 
                  className="w-3 bg-indigo-500 rounded-t"
                  style={{ height: `${heightPercent}%` }}
                  title={`Vikt: ${data.weight.toFixed(1)} kg`}
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
          <h3 className="font-semibold text-gray-800">Vikt</h3>
          <p className="text-sm text-gray-500">
            {latestData ? 'Senaste vikt' : 'Inga värden'}
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
            {latestData ? latestData.weight.toFixed(1) : '–'}
          </span>
          <span className="text-sm text-gray-500">kg</span>
        </div>
      </div>

      <div className="mt-3">
        {renderMiniChart()}
      </div>

      {goalWeight && latestData && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Mål:</span>
            <span className={`font-medium ${
              latestData.weight > goalWeight ? 'text-red-600' : 'text-green-600'
            }`}>
              {goalWeight} kg
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

// Export both
export default WeightChart;