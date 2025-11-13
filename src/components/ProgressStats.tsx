interface StatsCardProps {
  title: string;
  subtitle: string;
  value: number;
  bgColor: string;
}

/**
 * Individual statistic card displaying progress metrics
 * Shows title, description, and value with colored background
 */
const StatsCard: React.FC<StatsCardProps> = ({ title, subtitle, value, bgColor }) => (
  <div className="flex flex-col h-full">
    <div className="flex-1">
      <div className="text-base font-bold text-foreground">{title}</div>
      <div className="text-sm text-muted-foreground font-normal">{subtitle}</div>
    </div>
    <div className="flex items-center justify-end">
      <div className={`w-16 h-16 rounded-lg ${bgColor} flex items-center justify-center`}>
        <span className="text-3xl font-bold text-blue-900">{value}</span>
      </div>
    </div>
  </div>
);

interface ProgressStatsProps {
  daysThisMonth: number;
  currentStreak: number;
}

/**
 * Component displaying progress statistics in a two-column grid
 * Shows completed days this month and current streak
 */
export const ProgressStats: React.FC<ProgressStatsProps> = ({ daysThisMonth, currentStreak }) => (
  <div className="grid grid-cols-2 gap-0 -mt-8 pt-0">
    <div className="py-6 pr-6 pl-0 border-r border-t">
      <StatsCard
        title="Klarade dagar"
        subtitle="Antal dagar du följt dina Tips"
        value={daysThisMonth}
        bgColor="bg-emerald-500"
      />
    </div>

    <div className="py-6 pr-0 pl-6 border-t">
      <StatsCard
        title="Klarade dagar i rad"
        subtitle="Antal dagar i rad du följt dina Tips"
        value={currentStreak}
        bgColor="bg-blue-100"
      />
    </div>
  </div>
);