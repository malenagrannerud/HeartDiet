/**
 * ==========================================
 * HEALTH METRICS VALIDATION UTILITIES
 * ==========================================
 * 
 * Centralized validation for numeric health data to prevent:
 * - NaN values from invalid inputs
 * - Out-of-range values that could corrupt data
 * - Extremely large numbers that break UI display
 * 
 * All validators return { valid: boolean, value?: number, error?: string }
 */

import { z } from 'zod';

// ==========================================
// VALIDATION RESULT TYPE
// ==========================================
export interface ValidationResult {
  valid: boolean;
  value?: number;
  error?: string;
}

// ==========================================
// HEALTH METRIC RANGES (medically reasonable)
// ==========================================
export const HEALTH_RANGES = {
  weight: { min: 20, max: 300, decimals: 1 },      // kg
  height: { min: 50, max: 250, decimals: 0 },      // cm
  systolic: { min: 50, max: 250, decimals: 0 },    // mmHg
  diastolic: { min: 30, max: 150, decimals: 0 },   // mmHg
  ldl: { min: 0.5, max: 15, decimals: 1 },         // mmol/L
  hdl: { min: 0.3, max: 5, decimals: 1 },          // mmol/L
  triglycerides: { min: 0.2, max: 20, decimals: 1 }, // mmol/L
  hba1c: { min: 20, max: 150, decimals: 0 },       // mmol/mol
  fastingGlucose: { min: 2, max: 30, decimals: 1 }, // mmol/L
} as const;

// ==========================================
// ZOD SCHEMAS FOR NUMERIC VALIDATION
// ==========================================
export const weightSchema = z.number()
  .min(HEALTH_RANGES.weight.min, `Vikt måste vara minst ${HEALTH_RANGES.weight.min} kg`)
  .max(HEALTH_RANGES.weight.max, `Vikt kan inte överstiga ${HEALTH_RANGES.weight.max} kg`);

export const heightSchema = z.number()
  .min(HEALTH_RANGES.height.min, `Längd måste vara minst ${HEALTH_RANGES.height.min} cm`)
  .max(HEALTH_RANGES.height.max, `Längd kan inte överstiga ${HEALTH_RANGES.height.max} cm`);

export const systolicSchema = z.number()
  .int('Systoliskt tryck måste vara ett heltal')
  .min(HEALTH_RANGES.systolic.min, `Systoliskt tryck måste vara minst ${HEALTH_RANGES.systolic.min} mmHg`)
  .max(HEALTH_RANGES.systolic.max, `Systoliskt tryck kan inte överstiga ${HEALTH_RANGES.systolic.max} mmHg`);

export const diastolicSchema = z.number()
  .int('Diastoliskt tryck måste vara ett heltal')
  .min(HEALTH_RANGES.diastolic.min, `Diastoliskt tryck måste vara minst ${HEALTH_RANGES.diastolic.min} mmHg`)
  .max(HEALTH_RANGES.diastolic.max, `Diastoliskt tryck kan inte överstiga ${HEALTH_RANGES.diastolic.max} mmHg`);

export const ldlSchema = z.number()
  .min(HEALTH_RANGES.ldl.min, `LDL måste vara minst ${HEALTH_RANGES.ldl.min} mmol/L`)
  .max(HEALTH_RANGES.ldl.max, `LDL kan inte överstiga ${HEALTH_RANGES.ldl.max} mmol/L`);

export const hdlSchema = z.number()
  .min(HEALTH_RANGES.hdl.min, `HDL måste vara minst ${HEALTH_RANGES.hdl.min} mmol/L`)
  .max(HEALTH_RANGES.hdl.max, `HDL kan inte överstiga ${HEALTH_RANGES.hdl.max} mmol/L`);

export const triglyceridesSchema = z.number()
  .min(HEALTH_RANGES.triglycerides.min, `Triglycerider måste vara minst ${HEALTH_RANGES.triglycerides.min} mmol/L`)
  .max(HEALTH_RANGES.triglycerides.max, `Triglycerider kan inte överstiga ${HEALTH_RANGES.triglycerides.max} mmol/L`);

export const hba1cSchema = z.number()
  .int('HbA1c måste vara ett heltal')
  .min(HEALTH_RANGES.hba1c.min, `HbA1c måste vara minst ${HEALTH_RANGES.hba1c.min} mmol/mol`)
  .max(HEALTH_RANGES.hba1c.max, `HbA1c kan inte överstiga ${HEALTH_RANGES.hba1c.max} mmol/mol`);

export const fastingGlucoseSchema = z.number()
  .min(HEALTH_RANGES.fastingGlucose.min, `Fasteblodsocker måste vara minst ${HEALTH_RANGES.fastingGlucose.min} mmol/L`)
  .max(HEALTH_RANGES.fastingGlucose.max, `Fasteblodsocker kan inte överstiga ${HEALTH_RANGES.fastingGlucose.max} mmol/L`);

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

/**
 * Safely parse and validate a numeric string input
 * Returns validation result with parsed value or error message
 */
export function validateNumericInput(
  input: string,
  schema: z.ZodNumber,
  isInteger = false
): ValidationResult {
  // Trim and check for empty
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, error: 'Värdet får inte vara tomt' };
  }

  // Parse the number
  const parsed = isInteger ? parseInt(trimmed, 10) : parseFloat(trimmed);

  // Check for NaN
  if (isNaN(parsed)) {
    return { valid: false, error: 'Ogiltigt nummer' };
  }

  // Validate with Zod schema
  const result = schema.safeParse(parsed);
  if (!result.success) {
    return { valid: false, error: result.error.errors[0]?.message || 'Ogiltigt värde' };
  }

  return { valid: true, value: result.data };
}

/**
 * Validate weight input
 */
export function validateWeight(input: string): ValidationResult {
  return validateNumericInput(input, weightSchema, false);
}

/**
 * Validate height input
 */
export function validateHeight(input: string): ValidationResult {
  return validateNumericInput(input, heightSchema, true);
}

/**
 * Validate systolic blood pressure
 */
export function validateSystolic(input: string): ValidationResult {
  return validateNumericInput(input, systolicSchema, true);
}

/**
 * Validate diastolic blood pressure
 */
export function validateDiastolic(input: string): ValidationResult {
  return validateNumericInput(input, diastolicSchema, true);
}

/**
 * Validate LDL cholesterol
 */
export function validateLDL(input: string): ValidationResult {
  return validateNumericInput(input, ldlSchema, false);
}

/**
 * Validate HDL cholesterol
 */
export function validateHDL(input: string): ValidationResult {
  return validateNumericInput(input, hdlSchema, false);
}

/**
 * Validate triglycerides
 */
export function validateTriglycerides(input: string): ValidationResult {
  return validateNumericInput(input, triglyceridesSchema, false);
}

/**
 * Validate HbA1c
 */
export function validateHbA1c(input: string): ValidationResult {
  return validateNumericInput(input, hba1cSchema, true);
}

/**
 * Validate fasting glucose
 */
export function validateFastingGlucose(input: string): ValidationResult {
  return validateNumericInput(input, fastingGlucoseSchema, false);
}

// ==========================================
// SAFE PARSE HELPERS (for existing data)
// ==========================================

/**
 * Safely parse a stored string value, returning undefined if invalid
 * Used when loading data from storage where validation should be lenient
 */
export function safeParseFloat(input: string | undefined, fallback?: number): number | undefined {
  if (!input?.trim()) return fallback;
  const parsed = parseFloat(input);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Safely parse an integer string, returning undefined if invalid
 */
export function safeParseInt(input: string | undefined, fallback?: number): number | undefined {
  if (!input?.trim()) return fallback;
  const parsed = parseInt(input, 10);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Validate and parse with range check, returning undefined for invalid values
 */
export function safeParseWithRange(
  input: string | undefined,
  min: number,
  max: number,
  isInteger = false
): number | undefined {
  if (!input?.trim()) return undefined;
  const parsed = isInteger ? parseInt(input, 10) : parseFloat(input);
  if (isNaN(parsed) || parsed < min || parsed > max) {
    return undefined;
  }
  return parsed;
}
