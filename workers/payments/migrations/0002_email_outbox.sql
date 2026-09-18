-- Email outbox: enqueue on webhook; mark sent only after provider acceptance.
-- Unique (booking_reference, kind) prevents duplicate sends across webhook retries.

CREATE TABLE IF NOT EXISTS email_outbox (
  id TEXT PRIMARY KEY,
  booking_reference TEXT NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  payload_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sent_at TEXT,
  UNIQUE (booking_reference, kind)
);

CREATE INDEX IF NOT EXISTS idx_email_outbox_status ON email_outbox(status);
CREATE INDEX IF NOT EXISTS idx_email_outbox_booking ON email_outbox(booking_reference);
