import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Weight, Activity, Droplet } from "lucide-react";
import { tips } from "@/data/tips";
import { Button } from "@/components/ui/button";
import { bodyText, tableHeaderSmall } from "@/lib/design-tokens";
import { getStorageItem } from "@/lib/storage";
import { healthPrioritiesSchema, type DayLog } from "@/lib/schemas";
import { healthGoalTips } from "@/data/health-goal-tips";
import { tipPageRoutes } from "@/lib/tip-routes";

interface WeeklyProgressTableProps {
  weekDates: Date[];
  dayLogs: DayLog[];
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  onTipToggle: (tipId: number, date: Date) => void;
  onOpenDialog: (date: Date, type: 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose') => void;
  isTipCompletedOnDate: (tipId: number, date: Date) => boolean;
  hasWeightOnDate: (date: Date) => boolean;
  hasBloodPressureOnDate: (date: Date) => boolean;
  hasBloodFatsOnDate: (date: Date) => boolean;
  hasBloodGlucoseOnDate: (date: Date) => boolean;
  isToday: (date: Date) => boolean;
  markedTipIds?: number[];
}

export const WeeklyProgressTable = ({
  weekDates,
  dayLogs,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek,
  onTipToggle,
  onOpenDialog,
  isTipCompletedOnDate,
  hasWeightOnDate,
  hasBloodPressureOnDate,
  hasBloodFatsOnDate,
  hasBloodGlucoseOnDate,
  isToday,
  markedTipIds = []
}: WeeklyProgressTableProps) => {
  const navigate = useNavigate();

  const getDayInitial = (date: Date) => {
    const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
    return days[date.getDay()];
  };

  const capitalizeMonth = (dateStr: string) => {
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  };

  // Load user's selected health goals
  const healthData = getStorageItem('healthPriorities', healthPrioritiesSchema);
  const selectedGoals = healthData?.priorities || [];
  
  // Helper function to check if a tip has relevant health goals
  const hasRelevantHealthGoals = (tipId: number) => {
    if (selectedGoals.length === 0) return false;
    return healthGoalTips.some(
      tip => tip.tipId === tipId && selectedGoals.includes(tip.goalId)
    );
  };
  
  // Sort tips: marked first, then unmarked with health goals, then unmarked without goals
  const marked = tips.filter(tip => markedTipIds.includes(tip.id));
  const unmarkedWithGoals = tips.filter(tip => !markedTipIds.includes(tip.id) && hasRelevantHealthGoals(tip.id));
  const unmarkedWithoutGoals = tips.filter(tip => !markedTipIds.includes(tip.id) && !hasRelevantHealthGoals(tip.id));
  
  const sortedTips = [...marked, ...unmarkedWithGoals, ...unmarkedWithoutGoals];

  return (
    <>
      <div className="flex items-center justify-center gap-1 mb-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousWeek}
          className="h-10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        {/* Center column: Date + "Gå till idag" stacked */}
        <div className="flex flex-col items-center px-2">
          <div className="text-lg font-semibold">
            {format(weekDates[0], 'd MMM', { locale: sv })} - {format(weekDates[6], 'd MMM', { locale: sv })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCurrentWeek}
            className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
          >
            Gå till idag
          </Button>
        </div>
        
        {/* Right arrow */}
        <Button
          variant="outline"
          size="sm"
          onClick={onNextWeek}
          className="h-10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Weekly Table */}
      <div className="bg-background border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="text-left py-1 px-1 font-semibold text-foreground w-[200px]"></th> 
                {weekDates.map((date, index) => {
                  const todayHighlight = isToday(date);
                  return (
                    <th 
                      key={index} 
                      className={`text-center py-2 px-0 font-semibold min-w-[40px] ${
                        todayHighlight ? 'bg-primary/20 border-l-2 border-r-2 border-primary' : 'text-foreground'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-0">
                        <span className={`${tableHeaderSmall} leading-tight ${todayHighlight ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                          {capitalizeMonth(format(date, 'MMM', { locale: sv }))}
                        </span>
                        <span className={`${tableHeaderSmall} font-bold leading-tight ${todayHighlight ? 'text-primary' : ''}`}>
                          {format(date, 'd')}
                        </span>
                        <span className={`${tableHeaderSmall} leading-tight ${todayHighlight ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                          {getDayInitial(date)}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sortedTips.map((tip) => {
                const tipColor = tip.color.includes('bg-[') 
                  ? tip.color.replace('bg-[', '').replace(']', '')
                  : '#A8CC7D';
                
                return (
                  <tr key={tip.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td 
                      className="py-1 px-1 cursor-pointer hover:underline"
                      onClick={() => {
                        const route = tipPageRoutes[tip.id];
                        if (route) navigate(route);
                      }}
                    >
                      <span className={bodyText}>{tip.title}</span>
                    </td>
                    {weekDates.map((date, dayIndex) => {
                      const todayHighlight = isToday(date);
                      return (
                        <td 
                          key={dayIndex} 
                          className={`text-center py-1 px-0 ${
                            todayHighlight ? 'bg-primary/10 border-l-2 border-r-2 border-primary' : ''
                          }`}
                        >
                          <div className="flex justify-center">
                            {/* Tip box color*/}
                            <div
                              onClick={() => onTipToggle(tip.id, date)}
                              className={`h-8 w-8 border border-gray-100 rounded-none transition-all duration-200 cursor-pointer ${
                                isTipCompletedOnDate(tip.id, date) ? '' : 'bg-white'
                              }`}
                              style={isTipCompletedOnDate(tip.id, date) ? {
                                backgroundColor: tipColor,
                                borderColor: tipColor
                              } : undefined}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              
             

              {/* Row for blood pressure */}
              <tr className="border-b bg-muted/20">
                <td className="py-1 px-1">
                  <span className={bodyText}>Blodtryck</span>
                </td>
                {weekDates.map((date, dayIndex) => {
                  const hasBP = hasBloodPressureOnDate(date);
                  const todayHighlight = isToday(date);
                  return (
                    <td 
                      key={dayIndex} 
                      className={`text-center py-1 px-0 ${
                        todayHighlight ? 'bg-primary/10 border-l-2 border-r-2 border-primary' : ''
                      }`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenDialog(date, 'bloodPressure')}
                        className="h-8 w-8 p-0 rounded-none"
                      >
                        {hasBP ? (
                            <Heart className="h-4 w-4 text-[hsla(332,52%,52%,1.00)] fill-[hsla(332,52%,52%,1.00)]" />
                        ) : null}
                      </Button>
                    </td>
                  );
                })}
              </tr>

               {/* Row for weight */}
              <tr className="border-b bg-muted/20">
                <td className="py-1 px-1">
                  <span className={bodyText}>Vikt</span>
                </td>
                {weekDates.map((date, dayIndex) => {
                  const hasWeight = hasWeightOnDate(date);
                  const todayHighlight = isToday(date);
                  return (
                    <td 
                      key={dayIndex} 
                      className={`text-center py-1 px-0 ${
                        todayHighlight ? 'bg-primary/10 border-l-2 border-r-2 border-primary' : ''
                      }`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenDialog(date, 'weight')}
                        className="h-8 w-8 p-0 rounded-none"
                      >
                        {hasWeight ? (
                          <Weight className="h-4 w-4 text-[hsla(204,37%,48%,1.00)] fill-[hsla(204,37%,48%,1.00)]" />
                        ) : null}
                      </Button>
                    </td>
                  );
                })}
              </tr>

              {/* Row for Kolesterol (blood fats) */}
              <tr className="border-b bg-muted/20">
                <td className="py-1 px-1">
                  <span className={bodyText}>Kolesterol</span>
                </td>
                {weekDates.map((date, dayIndex) => {
                  const hasBloodFats = hasBloodFatsOnDate(date);
                  const todayHighlight = isToday(date);
                  return (
                    <td 
                      key={dayIndex} 
                      className={`text-center py-1 px-0 ${
                        todayHighlight ? 'bg-primary/10 border-l-2 border-r-2 border-primary' : ''
                      }`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenDialog(date, 'bloodFats')}
                        className="h-8 w-8 p-0 rounded-none"
                      >
                        {hasBloodFats ? (
                          <Activity className="h-4 w-4 text-[hsla(280,60%,55%,1.00)] fill-[hsla(280,60%,55%,1.00)]" />
                        ) : null}
                      </Button>
                    </td>
                  );
                })}
              </tr>

              {/* Row for Blodsocker (blood glucose) */}
              <tr className="border-b bg-muted/20">
                <td className="py-1 px-1">
                  <span className={bodyText}>Blodsocker</span>
                </td>
                {weekDates.map((date, dayIndex) => {
                  const hasGlucose = hasBloodGlucoseOnDate(date);
                  const todayHighlight = isToday(date);
                  return (
                    <td 
                      key={dayIndex} 
                      className={`text-center py-1 px-0 ${
                        todayHighlight ? 'bg-primary/10 border-l-2 border-r-2 border-primary' : ''
                      }`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenDialog(date, 'bloodGlucose')}
                        className="h-8 w-8 p-0 rounded-none"
                      >
                        {hasGlucose ? (
                          <Droplet className="h-4 w-4 text-[hsla(195,75%,45%,1.00)] fill-[hsla(195,75%,45%,1.00)]" />
                        ) : null}
                      </Button>
                    </td>
                  );
                })}
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};