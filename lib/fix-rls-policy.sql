-- Quick Fix for RLS Policy Error
-- Run this in Supabase SQL Editor to fix the insert permissions

-- Fix waitlist table policies
DROP POLICY IF EXISTS "Enable insert for everyone" ON waitlist;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON waitlist;

CREATE POLICY "waitlist_insert_policy" ON waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "waitlist_select_policy" ON waitlist
  FOR SELECT USING (auth.role() = 'authenticated');

-- Fix course_applications table policies  
DROP POLICY IF EXISTS "Enable insert for everyone" ON course_applications;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON course_applications;

CREATE POLICY "applications_insert_policy" ON course_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "applications_select_policy" ON course_applications
  FOR SELECT USING (auth.role() = 'authenticated');

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN ('waitlist', 'course_applications');

