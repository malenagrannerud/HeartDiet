/**
 * ==========================================
 * SUPABASE DATABASE TYPES
 * ==========================================
 * 
 * TypeScript types for Supabase database schema
 * These provide end-to-end type safety
 * 
 * REGENERATION: To update after schema changes, run:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      health_priorities: {
        Row: {
          id: string
          user_id: string
          priorities: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          priorities?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          priorities?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_medications: {
        Row: {
          id: string
          user_id: string
          medication_id: string
          medication_name: string
          added_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          medication_id: string
          medication_name: string
          added_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          medication_id?: string
          medication_name?: string
          added_date?: string
          created_at?: string
        }
        Relationships: []
      }
      health_metrics: {
        Row: {
          id: string
          user_id: string
          height: number | null
          weight: number | null
          systolic: number | null
          diastolic: number | null
          bp_date: string | null
          ldl: number | null
          hdl: number | null
          triglycerides: number | null
          knows_ldl: 'detailed' | 'just-high' | 'unknown' | null
          blood_fats_date: string | null
          hba1c: number | null
          fasting_glucose: number | null
          blood_glucose_date: string | null
          measurement_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          height?: number | null
          weight?: number | null
          systolic?: number | null
          diastolic?: number | null
          bp_date?: string | null
          ldl?: number | null
          hdl?: number | null
          triglycerides?: number | null
          knows_ldl?: 'detailed' | 'just-high' | 'unknown' | null
          blood_fats_date?: string | null
          hba1c?: number | null
          fasting_glucose?: number | null
          blood_glucose_date?: string | null
          measurement_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          height?: number | null
          weight?: number | null
          systolic?: number | null
          diastolic?: number | null
          bp_date?: string | null
          ldl?: number | null
          hdl?: number | null
          triglycerides?: number | null
          knows_ldl?: 'detailed' | 'just-high' | 'unknown' | null
          blood_fats_date?: string | null
          hba1c?: number | null
          fasting_glucose?: number | null
          blood_glucose_date?: string | null
          measurement_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      health_goals: {
        Row: {
          id: string
          user_id: string
          goal_weight: number | null
          goal_systolic: number | null
          goal_diastolic: number | null
          goal_ldl: number | null
          goal_hdl: number | null
          goal_hba1c: number | null
          goal_fasting_glucose: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_weight?: number | null
          goal_systolic?: number | null
          goal_diastolic?: number | null
          goal_ldl?: number | null
          goal_hdl?: number | null
          goal_hba1c?: number | null
          goal_fasting_glucose?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_weight?: number | null
          goal_systolic?: number | null
          goal_diastolic?: number | null
          goal_ldl?: number | null
          goal_hdl?: number | null
          goal_hba1c?: number | null
          goal_fasting_glucose?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_logs: {
        Row: {
          id: string
          user_id: string
          log_date: string
          entries: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          log_date: string
          entries?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          log_date?: string
          entries?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      marked_tips: {
        Row: {
          id: string
          user_id: string
          tip_id: number
          color: string
          marked_date: string
        }
        Insert: {
          id?: string
          user_id: string
          tip_id: number
          color: string
          marked_date?: string
        }
        Update: {
          id?: string
          user_id?: string
          tip_id?: number
          color?: string
          marked_date?: string
        }
        Relationships: []
      }
      completed_activities: {
        Row: {
          id: string
          user_id: string
          activity_id: string
          activity_title: string
          activity_type: string
          completed_date: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_id: string
          activity_title: string
          activity_type: string
          completed_date?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_id?: string
          activity_title?: string
          activity_type?: string
          completed_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
