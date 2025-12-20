/**
 * Default goal values for health metrics
 * These are used when no user-specific goal has been set
 */

export const DEFAULT_GOALS = {
  bloodPressure: {
    systolic: 140,
    diastolic: 90,
  },
  bloodGlucose: {
    hba1c: 48, // mmol/mol (equivalent to ~6.5%)
    fastingGlucose: 6.0, // mmol/L (upper target range 4.0-6.0)
  },
  bloodFats: {
    ldl: 1.4, // mmol/L
    hdl: 1.0, // mmol/L (minimum target)
    triglycerides: 2.0, // mmol/L
  },
  // Weight has no default - must be set by user during onboarding
} as const;
