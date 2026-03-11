/**
 * 
 * @module LoggCalender
 * 
 * @description
 * Displays a weekly calendar view showing tip completion status.
 * Users can:
 * - View which tips are completed on which days (colored squares)
 * - Toggle tip completion by clicking squares
 * - Navigate between weeks (previous/next)
 * - Jump back to current week
 * - Click tip titles to navigate to detailed tip pages
 * 
 * Tips are sorted by priority:
 * 1. Marked/bookmarked tips appear first
 * 2. Tips with health goals appear next
 * 3. Remaining tips appear last
 * 
 * Today's date is highlighted with a colored background.
 * 
 * @requires date-fns - Date formatting with Swedish locale
 * @requires react-router-dom - Navigation to tip pages
 * @requires lucide-react - Chevron icons for week navigation
 * @requires @/data/tips - Tip data
 * @requires @/components/ui/button - Button component
 * @requires @/lib/design-tokens - Design system classes
 * @requires @/lib/schemas - Type validation schemas
 * @requires @/data/health-goal-tips - Health goal to tip mappings
 * @requires @/lib/tip-routes - Route mappings for tip pages
 */

import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight} from "lucide-react";
import { tips } from "@/data/tips";
import { Button } from "@/components/ui/button";
import { bodyText, tableHeaderSmall } from "@/lib/design-tokens";
import { healthGoalTips } from "@/data/health-goal-tips";
import { tipPageRoutes } from "@/lib/tip-routes";
import { hiddenTipIds } from "@/data/hidden-tips";

/**
 * Props for the LoggCalender component
 * 
 * @interface LoggCalenderProps
 * @property {Date[]} weekDates - Array of 7 dates representing the current week
 * @property {Function} onPreviousWeek - Callback when clicking left arrow to go to previous week
 * @property {Function} onNextWeek - Callback when clicking right arrow to go to next week
 * @property {Function} onCurrentWeek - Callback when clicking "Gå till idag" to return to current week
 * @property {Function} onTipToggle - Callback when clicking a tip square to toggle completion status
 * @property {Function} isTipCompletedOnDate - Function that returns true if a tip is completed on a specific date
 * @property {Function} isToday - Function that returns true if a date is today
 * @property {number[]} [markedTipIds] - Array of tip IDs that are marked/bookmarked by the user
 */
interface LoggCalenderProps {
  weekDates: Date[];
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  onTipToggle: (tipId: number, date: Date) => void;
  isTipCompletedOnDate: (tipId: number, date: Date) => boolean;
  isToday: (date: Date) => boolean;
  markedTipIds?: number[];
}

/**
 * Calendar view component for tracking daily tip completion
 * 
 * @component
 * @param {LoggCalenderProps} props - Component props
 * @returns {JSX.Element} Weekly calendar with tip completion squares
 * 
 * @example
 * <LoggCalender
 *   weekDates={currentWeekDates}
 *   onPreviousWeek={handlePreviousWeek}
 *   onNextWeek={handleNextWeek}
 *   onCurrentWeek={handleCurrentWeek}
 *   onTipToggle={handleTipToggle}
 *   isTipCompletedOnDate={checkTipCompletion}
 *   isToday={checkIfToday}
 *   markedTipIds={bookmarkedTips}
 * />
 */
export const LoggCalender = ({
  weekDates,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek,
  onTipToggle,
  isTipCompletedOnDate,
  isToday,
  markedTipIds = []
}: LoggCalenderProps) => {
  const navigate = useNavigate();

  /**
   * Gets Swedish day abbreviation for a given date
   * 
   * @param {Date} date - Date to get day for
   * @returns {string} Day abbreviation (Sön, Mån, Tis, etc.)
   */
  const getDayInitial = (date: Date) => {
    const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
    return days[date.getDay()];
  };

  /**
   * Capitalizes the first letter of a month name
   * 
   * @param {string} dateStr - Month string from date-fns
   * @returns {string} Month with first letter capitalized
   */
  const capitalizeMonth = (dateStr: string) => {
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  };

  /**
   * Sort tips by priority order:
   * 1. Marked/bookmarked tips (user's favorites)
   * 2. Unmarked tips that have associated health goals
   * 3. Unmarked tips without health goals
   */
  const marked = tips.filter(tip => markedTipIds.includes(tip.id));
  const unmarked = tips.filter(tip => !markedTipIds.includes(tip.id));
  const withHealthGoals = unmarked.filter(tip => healthGoalTips[tip.id]);
  const withoutHealthGoals = unmarked.filter(tip => !healthGoalTips[tip.id]);
  const sortedTips = [...marked, ...withHealthGoals, ...withoutHealthGoals];

  return (
    <>
      {/* Week navigation controls */}
      <div className="flex items-center justify-center gap-1 mb-1">
        {/* Previous week button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousWeek}
          className="h-10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        {/* Center column: Date range + "Go to today" button */}
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
        
        {/* Next week button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onNextWeek}
          className="h-10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Weekly calendar table */}
      <div className="bg-background border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/20">
                {/* Empty header cell for tip names column */}
                <th className="text-left py-1 px-1 font-semibold text-foreground w-[200px]"></th> 
                
                {/* Date headers for each day of the week */}
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
                        {/* Month abbreviation */}
                        <span className={`${tableHeaderSmall} leading-tight ${todayHighlight ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                          {capitalizeMonth(format(date, 'MMM', { locale: sv }))}
                        </span>
                        {/* Day of month */}
                        <span className={`${tableHeaderSmall} font-bold leading-tight ${todayHighlight ? 'text-primary' : ''}`}>
                          {format(date, 'd')}
                        </span>
                        {/* Day of week abbreviation */}
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
              {/* Tip rows */}
              {sortedTips.map((tip) => {
                // Extract color from tip data (handles both hex and Tailwind formats)
                const tipColor = tip.color.includes('bg-[') 
                  ? tip.color.replace('bg-[', '').replace(']', '')
                  : '#A8CC7D';
                
                return (
                  <tr key={tip.id} className="border-b hover:bg-muted/30 transition-colors">
                    {/* Tip name cell - clickable to navigate to tip page */}
                    <td 
                      className="py-1 px-1 cursor-pointer hover:underline"
                      onClick={() => {
                        const route = tipPageRoutes[tip.id];
                        if (route) navigate(route);
                      }}
                    >
                      <span className={bodyText}>{tip.title}</span>
                    </td>
                    
                    {/* Completion squares for each day */}
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
                            {/* Tip square - click to toggle completion */}
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
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};