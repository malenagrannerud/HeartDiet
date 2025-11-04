export interface DayLogEntry {
  type: 'weight' | 'bloodPressure' | 'tip';
  value: number;
  value2?: number;
  tipId?: number;
}

export interface DayLog {
  date: string;
  entries: DayLogEntry[];
}