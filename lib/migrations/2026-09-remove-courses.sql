-- Migration: hub-only site (courses and academy retired).
-- Safe to run on an existing database — nothing is dropped.

-- 1. New tables for the tour booking and newsletter forms.
CREATE TABLE IF NOT EXISTS tour_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name      VARCHAR(255) NOT NULL,
  email          VARCHAR(255) NOT NULL,
  phone          VARCHAR(50),
  team_size      VARCHAR(20),
  interest       VARCHAR(100) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(60) NOT NULL,
  message        TEXT,
  status         VARCHAR(20) NOT NULL DEFAULT 'new'
                 CHECK (status IN ('new', 'confirmed', 'completed', 'cancelled')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tour_requests_date ON tour_requests (preferred_date, status);
CREATE INDEX IF NOT EXISTS idx_tour_requests_created ON tour_requests (created_at DESC);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(255) NOT NULL UNIQUE,
  source     VARCHAR(40) NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tour_requests          ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tour_requests_select_policy ON tour_requests;
CREATE POLICY tour_requests_select_policy ON tour_requests
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS newsletter_select_policy ON newsletter_subscribers;
CREATE POLICY newsletter_select_policy ON newsletter_subscribers
  FOR SELECT TO authenticated USING (true);

-- 2. The waitlist no longer needs anon INSERT — the API route uses the
--    service-role key. Remove the permissive policy if it is still there.
DROP POLICY IF EXISTS waitlist_insert_policy ON waitlist;
DROP POLICY IF EXISTS "Enable insert for everyone" ON waitlist;

-- 3. course_applications is now unused by the site.
--    It still holds real applications and payment references, so this
--    migration deliberately leaves it in place. Export it first, then run
--    the line below by hand once you are certain you no longer need it:
--
-- DROP TABLE course_applications;
