-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Run this AFTER running 001_initial_schema.sql

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- HEALTH PRIORITIES
CREATE POLICY "Users can view own health priorities" ON public.health_priorities FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health priorities" ON public.health_priorities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health priorities" ON public.health_priorities FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own health priorities" ON public.health_priorities FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- USER MEDICATIONS
CREATE POLICY "Users can view own medications" ON public.user_medications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medications" ON public.user_medications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own medications" ON public.user_medications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- HEALTH METRICS
CREATE POLICY "Users can view own health metrics" ON public.health_metrics FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health metrics" ON public.health_metrics FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health metrics" ON public.health_metrics FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own health metrics" ON public.health_metrics FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- HEALTH GOALS
CREATE POLICY "Users can view own health goals" ON public.health_goals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health goals" ON public.health_goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health goals" ON public.health_goals FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own health goals" ON public.health_goals FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- DAILY LOGS
CREATE POLICY "Users can view own daily logs" ON public.daily_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily logs" ON public.daily_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily logs" ON public.daily_logs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own daily logs" ON public.daily_logs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- MARKED TIPS
CREATE POLICY "Users can view own marked tips" ON public.marked_tips FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own marked tips" ON public.marked_tips FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own marked tips" ON public.marked_tips FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- COMPLETED ACTIVITIES
CREATE POLICY "Users can view own completed activities" ON public.completed_activities FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completed activities" ON public.completed_activities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own completed activities" ON public.completed_activities FOR DELETE TO authenticated USING (auth.uid() = user_id);
