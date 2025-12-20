/**
 * ==========================================
 * ZOD VALIDATION SCHEMAS
 * ==========================================
 * 
 * Centralized schemas for localStorage data validation
 */

import { z } from 'zod';

export const markedTipSchema = z.object({     // Marked tips schema
  id: z.number(),
  markedDate: z.string(),
  color: z.string(),
});
export const markedTipsSchema = z.array(markedTipSchema);

export const healthPrioritiesSchema = z.object({   // Health priorities schema
  priorities: z.array(z.string()),
  medications: z.array(z.string()),
});



export const completedActivitySchema = z.object({ // Completed activity schema
  id: z.string(),
  title: z.string(),
  completedDate: z.string(),  // Fixed: was completedAt
  type: z.string(),
});

export const completedActivitiesSchema = z.array(completedActivitySchema);

// Day log entry schema
export const dayLogEntrySchema = z.object({
  type: z.enum(['weight', 'bloodPressure', 'bloodFats', 'bloodGlucose', 'tip']),
  value: z.number(),
  value2: z.number().optional(),
  value3: z.number().optional(),
  tipId: z.number().optional(),
});

export const dayLogSchema = z.object({
  date: z.string(),
  entries: z.array(dayLogEntrySchema),
});

export const dayLogsSchema = z.array(dayLogSchema);

export const onboardingCompletedSchema = z.boolean(); // Onboarding completion schema
export type MarkedTip = z.infer<typeof markedTipSchema>;
export type HealthPriorities = z.infer<typeof healthPrioritiesSchema>;
export type HealthMetrics = z.infer<typeof healthMetricsSchema>;
export type CompletedActivity = z.infer<typeof completedActivitySchema>;
export type DayLogEntry = z.infer<typeof dayLogEntrySchema>;
export type DayLog = z.infer<typeof dayLogSchema>;

// Card completion schema
export const cardCompletionSchema = z.object({
  cardId: z.enum(['tutorial', 'health-goals', 'medications', 'health-metrics']),
  completedDate: z.string(), // ISO date string
});
export const cardCompletionsSchema = z.array(cardCompletionSchema);
export type CardCompletion = z.infer<typeof cardCompletionSchema>;
export type CardId = CardCompletion['cardId'];





// Selected medication schema
export const selectedMedicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  addedDate: z.string(), // ISO date string
});
export const selectedMedicationsSchema = z.array(selectedMedicationSchema);
export type SelectedMedication = z.infer<typeof selectedMedicationSchema>;







// Blood fats/lipids schema
export const bloodFatsSchema = z.object({
  knowsLDL: z.enum(['detailed', 'just-high', 'unknown']),
  ldl: z.string().optional(),
  hdl: z.string().optional(),
  triglycerides: z.string().optional(),
  date: z.string().optional(),
});

// Blood glucose schema  
export const bloodGlucoseSchema = z.object({
  hba1c: z.string().optional(),
  fastingGlucose: z.string().optional(),
  date: z.string().optional(),
});


export const healthMetricsSchema = z.object({ 
  // Basic measurements
  weight: z.string().optional(),
  goalWeight: z.string().optional(),
  height: z.string().optional(),

  // Blood pressure
  systolic: z.string().optional(),
  diastolic: z.string().optional(),
  goalSystolic: z.string().optional(),
  goalDiastolic: z.string().optional(),
  
  // Blood fats fields (from bloodFatsSchema)
  knowsLDL: z.enum(['detailed', 'just-high', 'unknown']).optional(),
  ldl: z.string().optional(),
  hdl: z.string().optional(),
  triglycerides: z.string().optional(),
  goalLDL: z.string().optional(),
  goalHDL: z.string().optional(),
  
  // Blood glucose fields (from bloodGlucoseSchema)
  hba1c: z.string().optional(),
  fastingGlucose: z.string().optional(),
  goalHbA1c: z.string().optional(),
  goalFastingGlucose: z.string().optional(),
  
  // Measurement dates
  bloodPressureDate: z.string().optional(),
  bloodFatsDate: z.string().optional(),
  bloodGlucoseDate: z.string().optional(),
  
  // Other fields
  skipBloodPressure: z.boolean().optional(),
  date: z.string().optional(),
  lastUpdated: z.string().optional(),
});

export type BloodFats = z.infer<typeof bloodFatsSchema>;
export type BloodGlucose = z.infer<typeof bloodGlucoseSchema>;
