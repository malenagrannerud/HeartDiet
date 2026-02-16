/**
 * @module metric-config
 *
 * @description
 * Shared type definitions and display configuration for health metric types.
 * Used by detail views, chart components, and handler functions.
 */

/** Available health metric types for tracking */
export type MetricType = 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose';

/**
 * Display configuration for a single metric type.
 * Defines how the metric appears in the UI and maps to storage keys.
 */
export interface MetricConfigItem {
  /** Display name including unit, e.g. "Vikt (kg)" */
  title: string;
  /** Measurement unit, e.g. "kg", "mmHg" */
  unit: string;
  /** Chart color in HSL format */
  color: string;
  /** localStorage key for the goal value */
  goalKey: string;
  /** Human-readable label for the goal input */
  goalLabel: string;
}

/**
 * Configuration record mapping each metric type to its display properties.
 * Single source of truth for metric titles, units, colors, and goal mappings.
 */
export const metricConfig: Record<MetricType, MetricConfigItem> = {
  weight: {
    title: "Vikt (kg)",
    unit: "kg",
    color: "hsla(204, 37%, 48%, 1.00)",
    goalKey: "goalWeight",
    goalLabel: "Målvikt (kg)",
  },
  bloodPressure: {
    title: "Blodtryck (mmHg)",
    unit: "mmHg",
    color: "hsla(332, 52%, 52%, 1.00)",
    goalKey: "goalSystolic",
    goalLabel: "Mål systoliskt",
  },
  bloodFats: {
    title: "LDL-Kolesterol (mmol/L)",
    unit: "mmol/L",
    color: "hsla(280, 65%, 60%, 1.00)",
    goalKey: "goalLDL",
    goalLabel: "Mål LDL",
  },
  bloodGlucose: {
    title: "P-Glukos (mmol/L)",
    unit: "mmol/mol",
    color: "hsla(160, 60%, 50%, 1.00)",
    goalKey: "goalHbA1c",
    goalLabel: "Mål HbA1c",
  },
};
