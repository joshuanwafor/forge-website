-- Supabase Database Schema for Forge Website
-- Run these SQL commands in your Supabase SQL Editor

-- Table: waitlist
-- Stores waitlist signups
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  interest VARCHAR(100) NOT NULL,
  referral VARCHAR(100),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Index for created_at to sort by date
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist(created_at DESC);

-- Table: course_applications
-- Stores course application submissions with payment info
CREATE TABLE IF NOT EXISTS course_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  course_of_interest VARCHAR(100) NOT NULL,
  why_interested TEXT NOT NULL,
  availability VARCHAR(100) NOT NULL,
  payment_reference VARCHAR(255) NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'success',
  amount_paid DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email
CREATE INDEX IF NOT EXISTS idx_applications_email ON course_applications(email);

-- Index for created_at
CREATE INDEX IF NOT EXISTS idx_applications_created ON course_applications(created_at DESC);

-- Index for course_of_interest (to filter by course)
CREATE INDEX IF NOT EXISTS idx_applications_course ON course_applications(course_of_interest);

-- Index for payment_reference (for lookup and verification)
CREATE INDEX IF NOT EXISTS idx_applications_payment ON course_applications(payment_reference);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for everyone" ON waitlist;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON waitlist;
DROP POLICY IF EXISTS "Enable insert for everyone" ON course_applications;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON course_applications;

-- RLS Policies for waitlist (allow insert from anyone, read only for authenticated users)
CREATE POLICY "waitlist_insert_policy" ON waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "waitlist_select_policy" ON waitlist
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for course_applications (allow insert from anyone, read only for authenticated users)
CREATE POLICY "applications_insert_policy" ON course_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "applications_select_policy" ON course_applications
  FOR SELECT USING (auth.role() = 'authenticated');

-- Optional: Create a view for analytics (requires authentication)
CREATE OR REPLACE VIEW waitlist_stats AS
SELECT 
  interest,
  COUNT(*) as count,
  DATE_TRUNC('day', created_at) as signup_date
FROM waitlist
GROUP BY interest, DATE_TRUNC('day', created_at)
ORDER BY signup_date DESC;

CREATE OR REPLACE VIEW application_stats AS
SELECT 
  course_of_interest,
  COUNT(*) as count,
  DATE_TRUNC('day', created_at) as application_date
FROM course_applications
GROUP BY course_of_interest, DATE_TRUNC('day', created_at)
ORDER BY application_date DESC;

