

# Refactor `src/pages/Matningar/` - Split into Smaller Modules with JSDoc

## Overview

The main file `MatningarDetaljer.tsx` is 628 lines long and contains configuration data, business logic, and three dialog components all in one file. This refactor splits it into focused, single-responsibility modules while adding JSDoc to all files. No functionality changes.

## New File Structure

```text
src/pages/Matningar/
  MatningarMain.tsx          -- (exists, add JSDoc cleanup only)
  MatningarHalsomal.tsx      -- (exists, already has JSDoc, no changes)
  MatningarDetaljer.tsx      -- (slimmed down, orchestrates sub-components)
  PlotsComponents.tsx        -- (exists, already has JSDoc, no changes)
  MEDAS.tsx                  -- (exists, empty, no changes)
  metric-config.ts           -- NEW: MetricType type + metricConfig constant
  EditEntryDialog.tsx        -- NEW: Edit/delete dialog component
  GoalDialog.tsx             -- NEW: Goal editing dialog component
  AddMeasurementDialog.tsx   -- NEW: Add new measurement dialog component
  metric-handlers.ts         -- NEW: Pure logic functions (validate, save, delete)
```

## What Gets Extracted

### 1. `metric-config.ts` (new)
- `MetricType` type definition
- `metricConfig` record (titles, units, colors, goal keys)
- Reusable across both `MatningarDetaljer` and potentially `PlotsComponents`

### 2. `metric-handlers.ts` (new)
Pure functions extracted from the component, each with JSDoc:
- `validateMetricValue(metricType, value)` - routes to correct validator
- `buildNewEntry(metricType, values)` - constructs a `DayLogEntry`
- `updateLogEntry(dayLogs, date, metricType, newValue, newValue2)` - immutable update
- `deleteLogEntry(dayLogs, date, metricType)` - immutable delete
- `upsertLogEntry(dayLogs, date, entry)` - add or replace entry for a date
- `loadGoalValues(metricType, metrics)` - reads goal values from stored metrics
- `saveGoalValues(metricType, metrics, values)` - writes goal values to metrics object
- `getGoalLabel(metricType, goalValue, goalValue2)` - formats goal display string

### 3. `EditEntryDialog.tsx` (new)
Dialog component for editing/deleting an existing measurement entry.
- Props: `open`, `onOpenChange`, `metricType`, `config`, `selectedEntry`, `onSave`, `onDelete`
- Manages its own local input state (`editValue`, `editValue2`)
- Calls parent callbacks for save/delete

### 4. `GoalDialog.tsx` (new)
Dialog component for editing goal/target values.
- Props: `open`, `onOpenChange`, `metricType`, `config`, `currentGoal`, `currentGoal2`, `onSave`
- Manages its own local input state

### 5. `AddMeasurementDialog.tsx` (new)
Dialog component for adding a new measurement.
- Props: `open`, `onOpenChange`, `metricType`, `onSave`
- Manages date, value1/2/3 state internally
- Renders conditional fields per metric type (weight: 1 field, BP: 2, fats: 3, glucose: 2)

### 6. `MatningarDetaljer.tsx` (simplified)
Becomes a thin orchestration component (~150 lines):
- Imports config from `metric-config.ts`
- Imports handlers from `metric-handlers.ts`
- Imports three dialog components
- Manages `dayLogs`, `goalValue`, `goalValue2`, and dialog open states
- Renders header, chart, goal section, history list, and the three dialogs

## Files NOT Changed
- `MatningarMain.tsx` - already clean, only minor JSDoc touch-up
- `MatningarHalsomal.tsx` - already well-documented
- `PlotsComponents.tsx` - already well-documented
- `MainApp.tsx` - import stays the same (default export unchanged)

## Technical Details

### metric-config.ts
```typescript
/** Available health metric types */
export type MetricType = 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose';

/** Display configuration for each metric type */
export interface MetricConfigItem {
  title: string;
  unit: string;
  color: string;
  goalKey: string;
  goalLabel: string;
}

export const metricConfig: Record<MetricType, MetricConfigItem> = { ... };
```

### metric-handlers.ts
All functions are pure (no side effects), making them easy to test:
```typescript
/**
 * Validates a metric value using the appropriate validator
 * @param metricType - The type of metric being validated
 * @param value - Raw string input from user
 * @returns Validation result with parsed value or error message
 */
export const validateMetricValue = (metricType: MetricType, value: string) => { ... };
```

### Dialog components
Each dialog is self-contained with local state, receiving callbacks for persistence:
```typescript
interface EditEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricType: MetricType;
  config: MetricConfigItem;
  selectedEntry: { date: string; value: number; value2?: number } | null;
  onSave: (value: string, value2: string) => void;
  onDelete: () => void;
}
```

### Import changes in MatningarDetaljer.tsx
```typescript
import { MetricType, metricConfig } from "./metric-config";
import { validateMetricValue, buildNewEntry, ... } from "./metric-handlers";
import { EditEntryDialog } from "./EditEntryDialog";
import { GoalDialog } from "./GoalDialog";
import { AddMeasurementDialog } from "./AddMeasurementDialog";
```

## Files Changed Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/Matningar/metric-config.ts` | Create | Shared types and config constants |
| `src/pages/Matningar/metric-handlers.ts` | Create | Pure business logic functions |
| `src/pages/Matningar/EditEntryDialog.tsx` | Create | Edit/delete measurement dialog |
| `src/pages/Matningar/GoalDialog.tsx` | Create | Goal editing dialog |
| `src/pages/Matningar/AddMeasurementDialog.tsx` | Create | Add measurement dialog |
| `src/pages/Matningar/MatningarDetaljer.tsx` | Rewrite | Slim orchestrator using new modules |
| `src/pages/Matningar/MatningarMain.tsx` | Minor edit | Import `MetricType` from shared config |

