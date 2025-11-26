import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Heart, Weight } from "lucide-react";
import { tips } from "@/data/tips";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { standardSpacing, bodyText, bodyTextBald, tableHeaderSmall } from "@/lib/design-tokens";

interface DayLog {
  date: string;
  entries: {
    type: 'weight' | 'bloodPressure' | 'tip';
    value: number;
    value2?: number;
    tipId?: number;
  }[];
}

interface WeeklyProgressTableProps {
  weekDates: Date[];
  dayLogs: DayLog[];
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  onTipToggle: (tipId: number, date: Date) => void;
  onOpenDialog: (date: Date, type: 'weight' | 'bloodPressure') => void;
  isTipCompletedOnDate: (tipId: number, date: Date) => boolean;
  hasWeightOnDate: (date: Date) => boolean;
  hasBloodPressureOnDate: (date: Date) => boolean;
  isToday: (date: Date) => boolean;
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
  isToday
}: WeeklyProgressTableProps) => {
  const getDayInitial = (date: Date) => {
    const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
    return days[date.getDay()];
  };

  const capitalizeMonth = (dateStr: string) => {
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  };

  return (
    <>
      {/* Week Navigation */}
      <div className="flex flex-col gap-2"> 
        {/* Top row: arrows and date */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousWeek}
            className="h-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <div className="text-lg font-semibold">
              {format(weekDates[0], 'd MMM', { locale: sv })} - {format(weekDates[6], 'd MMM', { locale: sv })}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onNextWeek}
            className="h-10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* "Gå till idag" button centered below */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCurrentWeek}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Gå till idag
          </Button>
        </div>
      </div>

      {/* Weekly Table */}
      <div className={standardSpacing.sectionContent}>
        <div className="bg-background border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
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
                {tips.map((tip) => {
                  const tipColor = tip.color.includes('bg-[') 
                    ? tip.color.replace('bg-[', '').replace(']', '')
                    : '#A8CC7D';
                  
                  return (
                    <tr key={tip.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-1 px-1">
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
                              <Checkbox
                                checked={isTipCompletedOnDate(tip.id, date)}
                                onCheckedChange={() => onTipToggle(tip.id, date)}
                                className="h-7 w-7 rounded-none transition-all duration-200"
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
                            <Weight className="h-4 w-4 text-black fill-black" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    );
                  })}
                </tr>

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
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
