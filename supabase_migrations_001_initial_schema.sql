-- ==========================================
-- SWEDISH HEALTH TRACKING APP - DATABASE SCHEMA
-- ==========================================
-- This migration creates all tables for user health data tracking
-- Run this in Supabase SQL Editor

-- ==========================================
-- 1. USER PROFILES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);

-- ==========================================
-- 2. HEALTH PRIORITIES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.health_priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  priorities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.health_priorities ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS health_priorities_user_id_idx ON public.health_priorities(user_id);

-- ==========================================
-- 3. MEDICATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  medication_id TEXT NOT NULL,
  medication_name TEXT NOT NULL,
  added_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_medications ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS user_medications_user_id_idx ON public.user_medications(user_id);

-- ==========================================
-- 4. HEALTH METRICS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  height NUMERIC(5,2),
  weight NUMERIC(5,2),
  systolic INTEGER,
  diastolic INTEGER,
  bp_date DATE,
  ldl NUMERIC(5,2),
  hdl NUMERIC(5,2),
  triglycerides NUMERIC(5,2),
  knows_ldl TEXT CHECK (knows_ldl IN ('detailed', 'just-high', 'unknown')),
  blood_fats_date DATE,
  hba1c NUMERIC(4,2),
  fasting_glucose NUMERIC(5,2),
  blood_glucose_date DATE,
  measurement_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS health_metrics_user_id_idx ON public.health_metrics(user_id);

-- ==========================================
-- 5. HEALTH GOALS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.health_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  goal_weight NUMERIC(5,2),
  goal_systolic INTEGER,
  goal_diastolic INTEGER,
  goal_ldl NUMERIC(5,2),
  goal_hdl NUMERIC(5,2),
  goal_hba1c NUMERIC(4,2),
  goal_fasting_glucose NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.health_goals ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS health_goals_user_id_idx ON public.health_goals(user_id);

-- ==========================================
-- 6. DAILY LOGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  entries JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS daily_logs_user_id_idx ON public.daily_logs(user_id);

-- ==========================================
-- 7. MARKED TIPS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.marked_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tip_id INTEGER NOT NULL,
  color TEXT NOT NULL,
  marked_date TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tip_id)
);

ALTER TABLE public.marked_tips ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS marked_tips_user_id_idx ON public.marked_tips(user_id);

-- ==========================================
-- 8. COMPLETED ACTIVITIES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.completed_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  activity_id TEXT NOT NULL,
  activity_title TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  completed_date TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, activity_id)
);

ALTER TABLE public.completed_activities ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS completed_activities_user_id_idx ON public.completed_activities(user_id);

-- ==========================================
-- 9. AUTO-CREATE PROFILE TRIGGER
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 10. AUTO-UPDATE TIMESTAMPS
-- ==========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_priorities_updated_at BEFORE UPDATE ON public.health_priorities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_metrics_updated_at BEFORE UPDATE ON public.health_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_goals_updated_at BEFORE UPDATE ON public.health_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_daily_logs_updated_at BEFORE UPDATE ON public.daily_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
