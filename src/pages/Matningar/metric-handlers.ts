/**
 * @module metric-handlers
 *
 * @description
 * Pure business-logic functions for health metric operations.
 * All functions are side-effect-free: they accept data in and return new data out.
 * Persistence (localStorage) is handled by the calling component.
 */

import type { MetricType } from "./metric-config";
import type { DayLog, DayLogEntry } from "@/lib/schemas";
import {
  validateWeight,
  validateSystolic,
  validateDiastolic,
  validateLDL,
  validateHbA1c,
  safeParseFloat,
  safeParseInt,
  type ValidationResult,
} from "@/lib/health-validators";
import { DEFAULT_GOALS } from "@/data/metrics-defaults";
import { getStorageItem } from "@/lib/storage";
import { healthMetricsSchema } from "@/lib/schemas";

// ──────────────────────────────────────────
// Validation
// ──────────────────────────────────────────

/**
 * Routes validation to the correct validator based on metric type.
 *
 * @param metricType - The metric being validated
 * @param value - Raw string input from user
 * @returns Validation result with parsed value or error
 */
export function validateMetricValue(metricType: MetricType, value: string): ValidationResult {
  switch (metricType) {
    case "weight":
      return validateWeight(value);
    case "bloodPressure":
      return validateSystolic(value);
    case "bloodFats":
      return validateLDL(value);
    case "bloodGlucose":
      return validateHbA1c(value);
    default:
      return { valid: true, value: parseFloat(value) };
  }
}

// ──────────────────────────────────────────
// Entry builders
// ──────────────────────────────────────────

/**
 * Constructs a new DayLogEntry from raw input values.
 *
 * @param metricType - Which metric is being recorded
 * @param values - Object containing the primary value and optional secondary/tertiary values
 * @returns A properly shaped DayLogEntry
 */
export function buildNewEntry(
  metricType: MetricType,
  values: { value: number; value2?: string; value3?: string }
): DayLogEntry {
  const entry: DayLogEntry = {
    type: metricType,
    value: values.value,
  };

  if (metricType === "bloodPressure" && values.value2) {
    entry.value2 = safeParseInt(values.value2);
  }
  if (metricType === "bloodFats") {
    if (values.value2) entry.value2 = safeParseFloat(values.value2);
    if (values.value3) entry.value3 = safeParseFloat(values.value3);
  }
  if (metricType === "bloodGlucose" && values.value2) {
    entry.value2 = safeParseFloat(values.value2);
  }

  return entry;
}

// ──────────────────────────────────────────
// Day-log mutations (immutable)
// ──────────────────────────────────────────

/**
 * Updates an existing entry's values for a given date and metric type.
 * Returns a new array; does not mutate the original.
 *
 * @param dayLogs - Current day logs
 * @param date - ISO date string of the entry to update
 * @param metricType - Which metric type to update
 * @param newValue - New primary value
 * @param newValue2 - Optional new secondary value (e.g. diastolic)
 * @returns Updated day logs array
 */
export function updateLogEntry(
  dayLogs: DayLog[],
  date: string,
  metricType: MetricType,
  newValue: number,
  newValue2?: number
): DayLog[] {
  return dayLogs.map((log) => {
    if (log.date !== date) return log;
    return {
      ...log,
      entries: log.entries.map((entry) => {
        if (entry.type !== metricType) return entry;
        return {
          ...entry,
          value: newValue,
          ...(metricType === "bloodPressure" && newValue2 !== undefined
            ? { value2: newValue2 }
            : {}),
        };
      }),
    };
  });
}

/**
 * Deletes all entries of a given metric type for a specific date.
 * Removes the entire day log if no entries remain.
 *
 * @param dayLogs - Current day logs
 * @param date - ISO date string
 * @param metricType - Which metric type to remove
 * @returns Updated day logs array
 */
export function deleteLogEntry(
  dayLogs: DayLog[],
  date: string,
  metricType: MetricType
): DayLog[] {
  return dayLogs
    .map((log) => {
      if (log.date !== date) return log;
      return { ...log, entries: log.entries.filter((e) => e.type !== metricType) };
    })
    .filter((log) => log.entries.length > 0);
}

/**
 * Inserts or replaces an entry for a specific date.
 * If a log for the date exists, replaces the entry of the same type.
 * Otherwise creates a new day log.
 *
 * @param dayLogs - Current day logs
 * @param date - ISO date string
 * @param entry - The new entry to insert
 * @returns Updated day logs array
 */
export function upsertLogEntry(
  dayLogs: DayLog[],
  date: string,
  entry: DayLogEntry
): DayLog[] {
  const updated = [...dayLogs];
  const idx = updated.findIndex((log) => log.date === date);

  if (idx >= 0) {
    updated[idx] = {
      ...updated[idx],
      entries: [
        ...updated[idx].entries.filter((e) => e.type !== entry.type),
        entry,
      ],
    };
  } else {
    updated.push({ date, entries: [entry] });
  }

  return updated;
}

// ──────────────────────────────────────────
// Goal helpers
// ──────────────────────────────────────────

/**
 * Loads goal values from stored health metrics for a given metric type.
 *
 * @param metricType - Which metric's goals to load
 * @returns Object with goalValue and optional goalValue2
 */
export function loadGoalValues(metricType: MetricType): {
  goalValue?: number;
  goalValue2?: number;
} {
  const metrics = getStorageItem("healthMetrics", healthMetricsSchema);

  switch (metricType) {
    case "weight":
      return { goalValue: safeParseFloat(metrics?.goalWeight) };
    case "bloodPressure":
      return {
        goalValue: safeParseInt(metrics?.goalSystolic) ?? DEFAULT_GOALS.bloodPressure.systolic,
        goalValue2: safeParseInt(metrics?.goalDiastolic) ?? DEFAULT_GOALS.bloodPressure.diastolic,
      };
    case "bloodFats":
      return { goalValue: safeParseFloat(metrics?.goalLDL) ?? DEFAULT_GOALS.bloodFats.ldl };
    case "bloodGlucose":
      return { goalValue: safeParseFloat(metrics?.goalHbA1c) ?? DEFAULT_GOALS.bloodGlucose.hba1c };
    default:
      return {};
  }
}

/**
 * Saves goal values into the health metrics object and persists to localStorage.
 *
 * @param metricType - Which metric's goals to save
 * @param goalInput - Primary goal value string
 * @param goalInput2 - Optional secondary goal value string (e.g. diastolic)
 * @returns Parsed goal values for state updates
 */
export function saveGoalValues(
  metricType: MetricType,
  goalInput: string,
  goalInput2?: string
): { goalValue?: number; goalValue2?: number } {
  const metrics = getStorageItem("healthMetrics", healthMetricsSchema) || {};

  switch (metricType) {
    case "weight":
      metrics.goalWeight = goalInput || undefined;
      break;
    case "bloodPressure":
      metrics.goalSystolic = goalInput || undefined;
      metrics.goalDiastolic = goalInput2 || undefined;
      break;
    case "bloodFats":
      metrics.goalLDL = goalInput || undefined;
      break;
    case "bloodGlucose":
      metrics.goalHbA1c = goalInput || undefined;
      break;
  }

  localStorage.setItem("healthMetrics", JSON.stringify(metrics));

  return {
    goalValue: metricType === "bloodPressure" ? safeParseInt(goalInput) : safeParseFloat(goalInput),
    goalValue2: metricType === "bloodPressure" ? safeParseInt(goalInput2) : undefined,
  };
}

/**
 * Formats a human-readable goal label string.
 *
 * @param metricType - The metric type
 * @param goalValue - Primary goal value
 * @param goalValue2 - Optional secondary goal value
 * @returns Formatted string like "Mål: 80 kg" or "Mål: 130/80"
 */
export function getGoalLabel(
  metricType: MetricType,
  goalValue?: number,
  goalValue2?: number
): string {
  if (!goalValue) return "";
  switch (metricType) {
    case "weight":
      return `Mål: ${goalValue} kg`;
    case "bloodPressure":
      return goalValue2 ? `Mål: ${goalValue}/${goalValue2}` : "";
    case "bloodFats":
      return `Mål LDL: ${goalValue}`;
    case "bloodGlucose":
      return `Mål HbA1c: ${goalValue}`;
    default:
      return "";
  }
}
