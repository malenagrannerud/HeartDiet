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





export const healthMetricsSchema = z.object({ // Health metrics schema
  weight: z.string(),
  goalWeight: z.string().optional(),
  height: z.string(),

  
  systolic: z.string(),
  diastolic: z.string(),
  goalSystolic: z.string().optional(),
  goalDiastolic: z.string().optional(),
  goalLDL: z.string().optional(),
  goalHDL: z.string().optional(),
  goalHbA1c: z.string().optional(),
  goalFastingGlucose: z.string().optional(),
  skipBloodPressure: z.boolean(),
  date: z.string(),
});

// Extended health metrics schema
export const extendedHealthMetricsSchema = z.object({
 
  height: z.string().optional(),
  weight: z.string().optional(),
  goalWeight: z.string().optional(),
  
  // Blood pressure (conditional)
  bloodPressure: z.object({
    systolic: z.string(),
    diastolic: z.string(),
    date: z.string(),
  }).optional(),
  
  // Blood fats (conditional)
  bloodFats: bloodFatsSchema.optional(),
  
  // Blood glucose (conditional)
  bloodGlucose: bloodGlucoseSchema.optional(),
  
  lastUpdated: z.string().optional(),
});

export type BloodFats = z.infer<typeof bloodFatsSchema>;
export type BloodGlucose = z.infer<typeof bloodGlucoseSchema>;
export type ExtendedHealthMetrics = z.infer<typeof extendedHealthMetricsSchema>;