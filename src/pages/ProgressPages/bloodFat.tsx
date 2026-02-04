// pages/ProgressPages/bloodFat.tsx
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

interface BloodFatsChartData {
  date: string;
  ldl: number;
  hdl?: number;
  triglycerides?: number;
}

// ============================================================================
// FULL DETAILED CHART PAGE
// ============================================================================

const BloodFatChart = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<BloodFatsChartData[]>([]);
  const [goalLDL, setGoalLDL] = useState<number | undefined>();

  useEffect(() => {
    // Load health data
    const logs = getDayLogs();
    
    // Filter and format blood fats data
    const fatsData: BloodFatsChartData[] = logs
      .map(log => {
        const bloodFatsEntry = log.entries.find(e => e.type === 'bloodFats');
        if (!bloodFatsEntry) return null;
        
        return {
          date: log.date,
          ldl: bloodFatsEntry.value,
          hdl: bloodFatsEntry.value2,
          triglycerides: bloodFatsEntry.value3
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as BloodFatsChartData[];
    
    setChartData(fatsData);

    // Load goal
    const metrics = getStorageItem('healthMetrics', healthMetricsSchema);
    if (metrics) {
      const goal = safeParseFloat(metrics.goalLDL);
      if (goal !== undefined) setGoalLDL(goal);
    }
  }, []);

  // Simple chart rendering function
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Inga kolesterolvärden sparade ännu</p>
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
    const allValues = chartData.flatMap(d => [
      d.ldl, 
      d.hdl || 0, 
      d.triglycerides || 0,
      goalLDL || 0
    ]).filter(v => v > 0);
    
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
        {/* Goal line */}
        {goalLDL && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-green-500"
            style={{ top: `${valueToY(goalLDL)}px` }}
          >
            <div className="absolute -top-6 left-2 text-xs text-green-600">
              Mål: {goalLDL} mmol/L
            </div>
          </div>
        )}

        {/* Grid lines */}
        <div className="absolute inset-0 border border-gray-200 rounded-lg" />
        
        {/* LDL Line */}
        <svg className="absolute inset-0 w-full h-full">
          <polyline
            fill="none"
            stroke="#3b82f6" // Blue for LDL
            strokeWidth="2"
            points={chartData
              .map((d, i) => `${dateToX(i)},${valueToY(d.ldl)}`)
              .join(' ')}
          />
          
          {/* HDL Line (if exists) */}
          {chartData.some(d => d.hdl) && (
            <polyline
              fill="none"
              stroke="#10b981" // Green for HDL
              strokeWidth="2"
              strokeDasharray="5,5"
              points={chartData
                .map((d, i) => d.hdl ? `${dateToX(i)},${valueToY(d.hdl)}` : null)
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {/* Data points */}
          {chartData.map((data, index) => (
            <g key={data.date}>
              <circle
                cx={dateToX(index)}
                cy={valueToY(data.ldl)}
                r="4"
                fill="#3b82f6"
                className="cursor-pointer hover:r-6 transition-all"
              />
              {data.hdl && (
                <circle
                  cx={dateToX(index)}
                  cy={valueToY(data.hdl)}
                  r="4"
                  fill="#10b981"
                  className="cursor-pointer hover:r-6 transition-all"
                />
              )}
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
  const ldlChange = chartData.length > 1 
    ? ((latestData?.ldl || 0) - (chartData[0]?.ldl || 0)).toFixed(1)
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
          <h1 className={pageTitle}>Kolesterolvärden</h1>
        </div>
      </header>

      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          
          {/* Statistics Card */}
          {latestData && (
            <Card className="mb-6 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Senaste LDL</p>
                  <p className="text-2xl font-bold">{latestData.ldl.toFixed(1)} mmol/L</p>
                  {ldlChange && (
                    <p className={`text-sm ${parseFloat(ldlChange) < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(ldlChange) < 0 ? '▼' : '▲'} {Math.abs(parseFloat(ldlChange))} mmol/L
                    </p>
                  )}
                </div>
                {latestData.hdl && (
                  <div>
                    <p className="text-sm text-gray-500">Senaste HDL</p>
                    <p className="text-2xl font-bold">{latestData.hdl.toFixed(1)} mmol/L</p>
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
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">LDL-kolesterol</span>
                </div>
                {chartData.some(d => d.hdl) && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">HDL-kolesterol</span>
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
                      <th className="text-left py-2">LDL</th>
                      <th className="text-left py-2">HDL</th>
                      <th className="text-left py-2">Triglycerider</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.slice().reverse().map((data) => (
                      <tr key={data.date} className="border-b last:border-0">
                        <td className="py-2">{new Date(data.date).toLocaleDateString('sv-SE')}</td>
                        <td className="py-2">{data.ldl.toFixed(1)} mmol/L</td>
                        <td className="py-2">{data.hdl ? `${data.hdl.toFixed(1)} mmol/L` : '-'}</td>
                        <td className="py-2">{data.triglycerides ? `${data.triglycerides.toFixed(1)} mmol/L` : '-'}</td>
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

interface BloodFatsMiniChartProps {
  dayLogs: DayLog[];
  goalLDL?: number;
  onMoreClick?: () => void;
}

export const BloodFatsMiniChart: React.FC<BloodFatsMiniChartProps> = ({
  dayLogs,
  goalLDL,
  onMoreClick
}) => {
  const [chartData, setChartData] = useState<{date: string; ldl: number; hdl?: number}[]>([]);

  useEffect(() => {
    const fatsData = dayLogs
      .map(log => {
        const bloodFatsEntry = log.entries.find(e => e.type === 'bloodFats');
        if (!bloodFatsEntry) return null;
        
        return {
          date: log.date,
          ldl: bloodFatsEntry.value,
          hdl: bloodFatsEntry.value2
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setChartData(fatsData);
  }, [dayLogs]);

  // Simple mini bar chart
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
    const values = recentData.map(d => d.ldl);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    return (
      <div className="h-20">
        <div className="flex items-end h-14 space-x-1">
          {recentData.map((data, i) => {
            const heightPercent = ((data.ldl - minValue) / range) * 70 + 30;
            return (
              <div 
                key={i}
                className="flex-1 flex flex-col items-center"
              >
                <div 
                  className="w-3 bg-blue-500 rounded-t"
                  style={{ height: `${heightPercent}%` }}
                  title={`LDL: ${data.ldl.toFixed(1)}`}
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
          <h3 className="font-semibold text-gray-800">Kolesterol</h3>
          <p className="text-sm text-gray-500">
            {latestData ? 'Senaste LDL' : 'Inga värden'}
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
            {latestData ? latestData.ldl.toFixed(1) : '–'}
          </span>
          <span className="text-sm text-gray-500">mmol/L</span>
        </div>
      </div>

      <div className="mt-3">
        {renderMiniChart()}
      </div>

      {goalLDL && latestData && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Mål:</span>
            <span className={`font-medium ${
              latestData.ldl > goalLDL ? 'text-red-600' : 'text-green-600'
            }`}>
              {goalLDL} mmol/L
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

// Export both
export default BloodFatChart;