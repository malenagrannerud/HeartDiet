# Add New Measurement Button to Detail Views

## Overview

Add a "Lagg till matning" (Add measurement) button to each metric detail page so users can add new entries directly from the detailed view, not just edit existing ones.

## What Will Change

Currently, the detail pages at `/app/progress/:type` only let users edit or delete existing entries. After this change, each detail page will have an **"Add measurement" button** that opens a dialog with a date picker and the appropriate input fields for that metric type.

## Implementation

### Single file change: `src/pages/Matningar/MatningarDetaljer.tsx`

1. **Add new state variables:**
  - `addDialogOpen` - controls the add dialog visibility
  - `addDateInput` - date input for the new entry (defaults to today)
  - `addValue` / `addValue2` / `addValue3` - input values depending on metric type
  - &nbsp;
2. **Add new dialog** for creating entries with:
  - Date picker (type="date") - defaults to today's date
  - For **weight**: single weight input (kg)
  - For **bloodPressure**: systolic + diastolic inputs
  - For **bloodFats**: LDL input (required), HDL and triglycerides inputs (optional)
  - For **bloodGlucose**: HbA1c and fasting glucose inputs
3. **Add `handleSaveNew` function** that:
  - Validates input using existing validators (`validateWeight`, `validateSystolic`, etc.)
  - Creates a new entry in `dayLogs` for the selected date
  - If a log for that date already exists, appends the entry (or replaces if same type exists)
  - Saves to localStorage and updates state
  - Shows toast confirmation

## Technical Details

### New state (lines ~111-116 area)

```typescript
const [addDialogOpen, setAddDialogOpen] = useState(false);
const [addDateInput, setAddDateInput] = useState("");
const [addValue, setAddValue] = useState("");
const [addValue2, setAddValue2] = useState("");
const [addValue3, setAddValue3] = useState("");
```

### Add button placement (in the "Loggade varden" header, line ~354)

```tsx
<div className="p-4 border-b flex justify-between items-center">
  <div className={bodyTextBald}>Loggade varden</div>
  <Button variant="outline" size="sm" onClick={openAddDialog}>
    <Plus className="mr-1 h-4 w-4" /> Lagg till
  </Button>
</div>
```

### New handler: `openAddDialog`

- Sets `addDateInput` to today in `yyyy-MM-dd` format
- Clears all value inputs
- Opens the dialog

### New handler: `handleSaveNew`

- Validates based on metric type
- Finds or creates a dayLog for the selected date
- Adds the entry (removes existing same-type entry for that date to avoid duplicates)
- Persists to localStorage
- Refreshes state and closes dialog

### Add Dialog - adapts fields per metric type

- **weight**: 1 input field (value)
- **bloodPressure**: 2 input fields (systolic/diastolic)
- **bloodFats**: 3 input fields (LDL required, HDL optional, triglycerides optional)
- **bloodGlucose**: 2 input fields (HbA1c, fasting glucose)

### Blood fats storage detail

Blood fats uses `value` for LDL, `value2` for HDL, `value3` for triglycerides - matching the existing `dayLogEntrySchema` which supports `value`, `value2`, and `value3`.

## Files Changed


| File                                        | Change                                                           |
| ------------------------------------------- | ---------------------------------------------------------------- |
| `src/pages/Matningar/MatningarDetaljer.tsx` | Add state, button, dialog, and save handler for new measurements |


No other files need changes - the existing schema and validators already support all needed metric types.