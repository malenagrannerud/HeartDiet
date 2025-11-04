// src/components/ProgressStats.tsx
import React from 'react';

interface ProgressStatsProps {
  daysThisMonth: number;
  currentStreak: number;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({
  daysThisMonth,
  currentStreak
}) => {
  return (
    <div className="grid grid-cols-2 gap-0 -mt-8 pt-0">
      <div className="py-6 pr-6 pl-0 border-r border-t">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="text-base font-bold text-foreground">
              Klarade dagar
            </div>
            <div className="text-sm text-muted-foreground font-normal">
              Antal dagar du följt dina Tips
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="w-16 h-16 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-900">{daysThisMonth}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 pr-0 pl-6 border-t">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="text-base font-bold text-foreground">
              Klarade dagar i rad
            </div>
            <div className="text-sm text-muted-foreground font-normal">
              Antal dagar i rad du följt dina Tips
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-900">{currentStreak}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};