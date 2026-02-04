// src/components/ProgressChartSimple.tsx
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { type DayLog } from "@/lib/schemas";

interface ProgressChartProps {
  type: 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose';
  dayLogs: DayLog[];
  goalWeight?: number;
  goalBloodPressure?: { systolic: number; diastolic: number };
  goalBloodFats?: { ldl?: number; hdl?: number };
  goalBloodGlucose?: { hba1c?: number; fastingGlucose?: number };
  onMoreClick: () => void;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  type,
  dayLogs,
  goalWeight,
  goalBloodPressure,
  goalBloodFats,
  goalBloodGlucose,
  onMoreClick,
}) => {
  const navigate = useNavigate();

  // Filter and get the latest value
  const getLatestValue = () => {
    const relevantLogs = dayLogs
      .flatMap(log => 
        log.entries
          .filter(e => e.type === type)
          .map(e => ({
            date: new Date(log.date),
            value: e.value,
            value2: e.value2,
            value3: e.value3
          }))
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Newest first

    return relevantLogs[0] || null;
  };

  const getGoalValue = () => {
    if (type === 'weight') return goalWeight;
    if (type === 'bloodPressure') return goalBloodPressure?.systolic;
    if (type === 'bloodFats') return goalBloodFats?.ldl;
    if (type === 'bloodGlucose') return goalBloodGlucose?.hba1c;
    return undefined;
  };

  const getTrend = (current: number, goal?: number) => {
    if (!goal) return 'neutral';
    const difference = current - goal;
    
    // Lower is better for most metrics except HDL
    if (type === 'bloodFats') {
      // For LDL, lower is better
      return difference > 0 ? 'bad' : difference < -0.5 ? 'good' : 'neutral';
    }
    
    return difference > 0 ? 'bad' : difference < 0 ? 'good' : 'neutral';
  };

  const getTitle = () => {
    switch (type) {
      case 'weight': return 'Vikt';
      case 'bloodPressure': return 'Blodtryck';
      case 'bloodFats': return 'Kolesterol';
      case 'bloodGlucose': return 'Blodsocker';
      default: return '';
    }
  };

  const getUnit = () => {
    switch (type) {
      case 'weight': return 'kg';
      case 'bloodPressure': return 'mmHg';
      case 'bloodFats': return 'mmol/L';
      case 'bloodGlucose': return 'mmol/L';
      default: return '';
    }
  };

  const getDisplayValue = (data: any) => {
    if (!data) return 'Inga data';
    
    switch (type) {
      case 'weight': return `${data.value.toFixed(1)} ${getUnit()}`;
      case 'bloodPressure': 
        return data.value2 
          ? `${data.value.toFixed(0)}/${data.value2.toFixed(0)} ${getUnit()}`
          : `${data.value.toFixed(0)} ${getUnit()}`;
      case 'bloodFats':
        if (data.value2) {
          return `LDL: ${data.value.toFixed(1)} | HDL: ${data.value2.toFixed(1)} ${getUnit()}`;
        }
        return `${data.value.toFixed(1)} ${getUnit()}`;
      case 'bloodGlucose':
        return data.value2 
          ? `HbA1c: ${data.value.toFixed(1)} | Faste: ${data.value2.toFixed(1)} ${getUnit()}`
          : `${data.value.toFixed(1)} ${getUnit()}`;
      default: return '';
    }
  };

  const getLastUpdated = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Idag';
    if (diffDays === 1) return 'Igår';
    if (diffDays < 7) return `${diffDays} dagar sedan`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} veckor sedan`;
    return format(date, 'd MMM', { locale: sv });
  };

  const latestData = getLatestValue();
  const goalValue = getGoalValue();
  const trend = latestData && goalValue ? getTrend(latestData.value, goalValue) : 'neutral';

  const TrendIcon = () => {
    switch (trend) {
      case 'good': return <TrendingDown className="h-4 w-4 text-green-600" />;
      case 'bad': return <TrendingUp className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (trend) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'bad': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = () => {
    if (!latestData || !goalValue) return 'Inget mål satt';
    
    const difference = latestData.value - goalValue;
    const absDiff = Math.abs(difference).toFixed(1);
    
    if (type === 'weight') {
      if (difference > 0) return `${absDiff} kg över mål`;
      if (difference < 0) return `${absDiff} kg under mål`;
      return 'På målet';
    }
    
    if (type === 'bloodFats' || type === 'bloodGlucose') {
      if (difference > 0) return `${absDiff} över mål`;
      if (difference < 0) return `${absDiff} under mål`;
      return 'På målet';
    }
    
    return difference > 0 ? 'Över mål' : 'Under mål';
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800">{getTitle()}</h3>
            <p className="text-sm text-gray-500">
              {latestData 
                ? `Senast: ${getLastUpdated(latestData.date)}`
                : 'Inga värden sparade'
              }
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMoreClick}
            className="text-blue-600 hover:text-blue-800"
          >
            Detaljer
          </Button>
        </div>

        {/* Main Value */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {latestData 
              ? (type === 'bloodPressure' && latestData.value2 
                  ? `${latestData.value.toFixed(0)}/${latestData.value2.toFixed(0)}`
                  : latestData.value.toFixed(type === 'weight' ? 1 : 1))
              : '–'
            }
          </span>
          <span className="text-sm text-gray-500">{getUnit()}</span>
          
          {latestData && goalValue && (
            <div className="ml-auto flex items-center gap-1">
              <TrendIcon />
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
          )}
        </div>

        {/* Secondary Info */}
        {latestData && (
          <div className="text-sm text-gray-600">
            {getDisplayValue(latestData)}
          </div>
        )}

        {/* Goal Display */}
        {goalValue !== undefined && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Målvärde:</span>
              <span className="font-medium">
                {goalValue.toFixed(type === 'weight' ? 1 : 1)} {getUnit()}
              </span>
            </div>
          </div>
        )}

        {/* Call to Action when no data */}
        {!latestData && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  Lägg till ditt första värde
                </p>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => navigate('/app/dagbok')}
                  className="p-0 h-auto text-blue-600"
                >
                  Gå till Dagbok →
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};