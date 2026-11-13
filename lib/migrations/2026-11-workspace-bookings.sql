-- Migration: online desk booking.
-- Safe to run on an existing database — it only adds a table.

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
