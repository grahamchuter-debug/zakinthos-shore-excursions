-- Extend email_outbox for Resend delivery, processing state, and retries.
-- Kind "internal" = ops paid-booking alert (v1). confirmation/supplier reserved for later.

ALTER TABLE email_outbox ADD COLUMN last_attempted_at TEXT;
ALTER TABLE email_outbox ADD COLUMN provider_message_id TEXT;

-- Bookings: track when internal ops email was accepted by the provider.
ALTER TABLE bookings ADD COLUMN email_internal_sent_at TEXT;
