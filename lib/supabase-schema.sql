-- Supabase schema for the Forge website.
-- Run in the Supabase SQL editor on a fresh project.
--
-- Every write goes through the service-role key in an API route, so RLS is
-- enabled and no anon policies are granted. The service role bypasses RLS.

-- ---------------------------------------------------------------------------
-- waitlist — people who want a desk when one frees up
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS waitlist (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name  VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  phone      VARCHAR(50),
  interest   VARCHAR(100) NOT NULL,
  referral   VARCHAR(100),
  message    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist (created_at DESC);

-- ---------------------------------------------------------------------------
-- tour_requests — visit bookings from /tour
-- ---------------------------------------------------------------------------
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

-- The front desk reads this as "upcoming tours still to confirm".
CREATE INDEX IF NOT EXISTS idx_tour_requests_date ON tour_requests (preferred_date, status);
CREATE INDEX IF NOT EXISTS idx_tour_requests_created ON tour_requests (created_at DESC);

-- ---------------------------------------------------------------------------
-- newsletter_subscribers — blog / footer sign-ups
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(255) NOT NULL UNIQUE,
  source     VARCHAR(40) NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
ALTER TABLE waitlist               ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_requests          ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Reads are for signed-in staff only. Inserts happen server-side with the
-- service-role key, which is not subject to these policies.
DROP POLICY IF EXISTS waitlist_select_policy ON waitlist;
CREATE POLICY waitlist_select_policy ON waitlist
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS tour_requests_select_policy ON tour_requests;
CREATE POLICY tour_requests_select_policy ON tour_requests
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS newsletter_select_policy ON newsletter_subscribers;
CREATE POLICY newsletter_select_policy ON newsletter_subscribers
  FOR SELECT TO authenticated USING (true);
