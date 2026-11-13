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

-- ---------------------------------------------------------------------------
-- workspace_bookings — desks and offices bought online from the home page
-- One row per seat. Rows from one checkout share booking_code and
-- payment_reference. A private office is stored as one row per desk.
-- ---------------------------------------------------------------------------
-- btree_gist lets the exclusion constraint below compare seat_id with "=".
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS workspace_bookings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code      VARCHAR(20) NOT NULL,
  seat_id           VARCHAR(50) NOT NULL,
  zone_id           VARCHAR(50) NOT NULL,
  plan              VARCHAR(10) NOT NULL CHECK (plan IN ('day', 'week', 'month')),
  quantity          INTEGER NOT NULL CHECK (quantity > 0),
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  full_name         VARCHAR(255) NOT NULL,
  email             VARCHAR(255) NOT NULL,
  phone             VARCHAR(50) NOT NULL,
  amount_paid       DECIMAL(10, 2) NOT NULL,  -- this seat's share, naira
  booking_total     DECIMAL(10, 2) NOT NULL,  -- the whole checkout, naira
  payment_reference VARCHAR(100) NOT NULL,
  -- 'unverified' means it was saved without checking Paystack (no secret key set)
  payment_status    VARCHAR(20) NOT NULL DEFAULT 'success'
                    CHECK (payment_status IN ('success', 'unverified', 'refunded', 'cancelled')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date >= start_date),
  UNIQUE (payment_reference, seat_id),
  -- The database itself refuses to double-book a seat, even under a race.
  CONSTRAINT workspace_bookings_no_overlap
    EXCLUDE USING gist (seat_id WITH =, daterange(start_date, end_date, '[]') WITH &&)
);

-- The front desk reads this as "who is in today".
CREATE INDEX IF NOT EXISTS idx_workspace_bookings_dates ON workspace_bookings (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_workspace_bookings_code  ON workspace_bookings (booking_code);

ALTER TABLE workspace_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS workspace_bookings_select_policy ON workspace_bookings;
CREATE POLICY workspace_bookings_select_policy ON workspace_bookings
  FOR SELECT TO authenticated USING (true);
