/**
 * Simulated date system for testing purposes
 * Allows simulating passage of time without waiting for actual days to pass
 */

const SIMULATED_DATE_KEY = 'simulatedDate';

/**
 * Get the current date (either simulated or real)
 */
export const getCurrentDate = (): Date => {
  const simulated = localStorage.getItem(SIMULATED_DATE_KEY);
  if (simulated) {
    return new Date(simulated);
  }
  return new Date();
};

/**
 * Advance the simulated date by one day
 */
export const advanceDay = (): void => {
  const current = getCurrentDate();
  current.setDate(current.getDate() + 1);
  localStorage.setItem(SIMULATED_DATE_KEY, current.toISOString());
};

/**
 * Reset to real current date
 */
export const resetToRealDate = (): void => {
  localStorage.removeItem(SIMULATED_DATE_KEY);
};

/**
 * Check if we're using simulated time
 */
export const isUsingSimulatedDate = (): boolean => {
  return localStorage.getItem(SIMULATED_DATE_KEY) !== null;
};
