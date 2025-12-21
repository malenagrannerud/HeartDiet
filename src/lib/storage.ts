/**
 * ==========================================
 * SAFE LOCALSTORAGE WRAPPER
 * ==========================================
 * 
 * Provides safe access to localStorage with error handling
 * and optional Zod validation.
 */

import { z } from 'zod';

/**
 * Safely get an item from localStorage
 * Returns null if item doesn't exist or parsing fails
 * When using with a Zod schema, returns the properly typed output
 */
export function getStorageItem<T>(key: string, schema?: z.ZodType<T>): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    
    const parsed = JSON.parse(item);
    
    if (schema) {
      const result = schema.safeParse(parsed);
      if (!result.success) {
        console.error(`Validation failed for ${key}:`, result.error);
        return null;
      }
      // Cast to T to ensure proper type inference
      return result.data as T;
    }
    
    return parsed as T;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * Safely set an item in localStorage
 * Returns true if successful, false otherwise
 */
export function setStorageItem<T>(key: string, value: T, schema?: z.ZodType<T>): boolean {
  try {
    if (schema) {
      const result = schema.safeParse(value);
      if (!result.success) {
        console.error(`Validation failed for ${key}:`, result.error);
        return false;
      }
    }
    
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 * Returns true if successful, false otherwise
 */
export function removeStorageItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Safely clear all items from localStorage
 * Returns true if successful, false otherwise
 */
export function clearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}
