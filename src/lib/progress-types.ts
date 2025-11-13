/**
 * Type definitions specifically for Progress tracking feature
 * Contains interfaces for day logs, entries, and progress-related data structures
 */

export interface ProgressEntry {
  type: 'weight' | 'bloodPressure' | 'tip';
  value: number;
  value2?: number;
  tipId?: number;
}

export interface ProgressDayLog {
  date: string;
  entries: ProgressEntry[];
}

export interface ProgressState {
  date: Date;
  achievementDays: Date[];
  weightDays: Date[];
  bloodPressureDays: Date[];
  dayLogs: ProgressDayLog[];
  selectedDate: Date | null;
  dialogOpen: boolean;
  entryType: 'weight' | 'bloodPressure' | 'tip';
  selectedTipIds: number[];
  weightInput: string;
  systolicInput: string;
  diastolicInput: string;
  highestStreak: number;
}

export interface ProgressStats {
  daysThisMonth: number;
  currentStreak: number;
  highestStreak: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  value2?: number;
  fullDate: string;
}

export interface ProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  entryType: 'weight' | 'bloodPressure' | 'tip';
  onEntryTypeChange: (type: 'weight' | 'bloodPressure' | 'tip') => void;
  selectedTipIds: number[];
  onSelectedTipIdsChange: (ids: number[]) => void;
  weightInput: string;
  onWeightInputChange: (value: string) => void;
  systolicInput: string;
  onSystolicInputChange: (value: string) => void;
  diastolicInput: string;
  onDiastolicInputChange: (value: string) => void;
  dayLogs: ProgressDayLog[];
  onSaveEntry: () => void;
  onDeleteEntry: (entryIndex: number) => void;
}