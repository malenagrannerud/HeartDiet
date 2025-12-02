/**
 * ==========================================
 * SUPABASE CLIENT CONFIGURATION
 * ==========================================
 * 
 * Singleton Supabase client with automatic session management
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a .env.local file in project root with:
 *    VITE_SUPABASE_URL=your_supabase_project_url
 *    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
 * 
 * 2. Get these values from Supabase Dashboard:
 *    - Go to Project Settings > API
 *    - Copy "Project URL" and "anon/public" key
 * 
 * 3. NEVER commit .env.local to git (it's in .gitignore)
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if variables exist and are not placeholder values
const isPlaceholder = (value: string | undefined) => 
  !value || 
  value.includes('your-project-id') || 
  value.includes('your-actual-anon-key');

if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
  throw new Error(
    '⚠️ Supabase Configuration Required\n\n' +
    'You need to connect your Supabase project:\n\n' +
    '1. Go to https://supabase.com/dashboard\n' +
    '2. Create a new project (or select existing)\n' +
    '3. Go to Project Settings > API\n' +
    '4. Copy your Project URL and anon/public key\n' +
    '5. Update .env.local with real values:\n' +
    '   VITE_SUPABASE_URL=<your-project-url>\n' +
    '   VITE_SUPABASE_ANON_KEY=<your-anon-key>'
  );
}

/**
 * Supabase client with optimal configuration for React apps
 * - Automatic session persistence via localStorage
 * - Automatic token refresh
 * - Type-safe database operations
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

/**
 * Helper to check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

/**
 * Helper to get current user
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Export types for use throughout the app
 */
export type { Database };
