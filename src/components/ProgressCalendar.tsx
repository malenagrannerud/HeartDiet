// src/components/ProgressCalendar.tsx
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { isSameDay } from "date-fns";
import { sv } from "date-fns/locale";

interface ProgressCalendarProps {
  date: Date;
  onDayClick: (date: Date | undefined) => void;
  achievementDays: Date[];
  weightDays: Date[];
  bloodPressureDays: Date[];
}

export const ProgressCalendar: React.FC<ProgressCalendarProps> = ({
  date,
  onDayClick,
  achievementDays,
  weightDays,
  bloodPressureDays
}) => {
  return (
    <div className="pt-6 pb-0 flex justify-center">
      <Calendar
        mode="single"
        selected={date}
        onSelect={onDayClick}
        locale={sv}
        className="rounded-md border-0 [&_.rdp-caption_label]:font-bold [&_.rdp-caption_label]:capitalize [&_.rdp-caption_label]:text-xl [&_.rdp-head_cell]:capitalize [&_.rdp-head_cell]:text-base mx-auto text-lg [&_button]:cursor-pointer [&_button]:min-h-[48px] [&_button]:min-w-[48px] [&_button]:text-lg"
        modifiers={{
          achievement: achievementDays,
          weight: weightDays,
          bloodPressure: bloodPressureDays
        }}
        modifiersClassNames={{
          achievement: "relative before:content-[''] before:absolute before:inset-[8px] before:bg-emerald-500 before:rounded-full before:-z-10 !text-blue-900 font-bold"
        }}
        modifiersStyles={{
          achievement: {
            backgroundColor: "transparent"
          }
        }}
        components={{
          DayContent: (props) => {
            const hasWeight = weightDays.some(d => isSameDay(d, props.date));
            const hasBP = bloodPressureDays.some(d => isSameDay(d, props.date));
            
            return (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute top-0.5 left-0.5 flex flex-col gap-0.5">
                  {hasBP && <span className="text-xs leading-none text-rose-600">♥</span>}
                  {hasWeight && <span className="text-xs leading-none text-blue-700">⚖</span>}
                </div>
                <span className="relative z-10">{props.date.getDate()}</span>
              </div>
            );
          }
        }}
      />
    </div>
  );
};