-- Bookings + Stripe event idempotency for shore-excursion Checkout.
-- Confirm bookings only after verified webhooks (not on success URL alone).

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  booking_reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  excursion_id TEXT NOT NULL,
  excursion_name TEXT NOT NULL,
  excursion_date TEXT NOT NULL,
  ship_id TEXT,
  ship_name TEXT NOT NULL,
  adults INTEGER NOT NULL DEFAULT 0,
  children INTEGER NOT NULL DEFAULT 0,
  total_guests INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  amount_total_cents INTEGER NOT NULL,
  unit_amount_cents INTEGER NOT NULL,
  cancellation_protection INTEGER NOT NULL DEFAULT 0,
  originating_site TEXT NOT NULL,
  originating_port TEXT,
  booking_session_id TEXT,
  customer_email TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  idempotency_key TEXT NOT NULL UNIQUE,
  email_confirmation_sent_at TEXT,
  email_supplier_sent_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_session ON bookings(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent ON bookings(stripe_payment_intent_id);

CREATE TABLE IF NOT EXISTS processed_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  booking_reference TEXT,
  processed_at TEXT NOT NULL
);
