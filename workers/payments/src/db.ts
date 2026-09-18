import type { BookingRow, BookingStatus, PaymentsEnv } from "./types";

export async function insertBooking(
  env: PaymentsEnv,
  row: Omit<BookingRow, "email_confirmation_sent_at" | "email_supplier_sent_at"> & {
    email_confirmation_sent_at?: null;
    email_supplier_sent_at?: null;
  },
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO bookings (
      id, booking_reference, status, excursion_id, excursion_name, excursion_date,
      ship_id, ship_name, adults, children, total_guests, currency,
      amount_total_cents, unit_amount_cents, cancellation_protection,
      originating_site, originating_port, booking_session_id,
      customer_email, customer_name, customer_phone,
      stripe_checkout_session_id, stripe_payment_intent_id, idempotency_key,
      email_confirmation_sent_at, email_supplier_sent_at, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      NULL, NULL, ?, ?
    )`,
  )
    .bind(
      row.id,
      row.booking_reference,
      row.status,
      row.excursion_id,
      row.excursion_name,
      row.excursion_date,
      row.ship_id,
      row.ship_name,
      row.adults,
      row.children,
      row.total_guests,
      row.currency,
      row.amount_total_cents,
      row.unit_amount_cents,
      row.cancellation_protection,
      row.originating_site,
      row.originating_port,
      row.booking_session_id,
      row.customer_email,
      row.customer_name,
      row.customer_phone,
      row.stripe_checkout_session_id,
      row.stripe_payment_intent_id,
      row.idempotency_key,
      row.created_at,
      row.updated_at,
    )
    .run();
}

export async function getBookingByIdempotencyKey(
  env: PaymentsEnv,
  key: string,
): Promise<BookingRow | null> {
  return (
    (await env.DB.prepare(
      `SELECT * FROM bookings WHERE idempotency_key = ? LIMIT 1`,
    )
      .bind(key)
      .first<BookingRow>()) ?? null
  );
}

export async function getBookingByReference(
  env: PaymentsEnv,
  reference: string,
): Promise<BookingRow | null> {
  return (
    (await env.DB.prepare(
      `SELECT * FROM bookings WHERE booking_reference = ? LIMIT 1`,
    )
      .bind(reference)
      .first<BookingRow>()) ?? null
  );
}

export async function getBookingByCheckoutSessionId(
  env: PaymentsEnv,
  sessionId: string,
): Promise<BookingRow | null> {
  return (
    (await env.DB.prepare(
      `SELECT * FROM bookings WHERE stripe_checkout_session_id = ? LIMIT 1`,
    )
      .bind(sessionId)
      .first<BookingRow>()) ?? null
  );
}

export async function getBookingByPaymentIntentId(
  env: PaymentsEnv,
  paymentIntentId: string,
): Promise<BookingRow | null> {
  return (
    (await env.DB.prepare(
      `SELECT * FROM bookings WHERE stripe_payment_intent_id = ? LIMIT 1`,
    )
      .bind(paymentIntentId)
      .first<BookingRow>()) ?? null
  );
}

export async function updateBookingStripeIds(
  env: PaymentsEnv,
  bookingReference: string,
  sessionId: string,
  paymentIntentId: string | null,
): Promise<void> {
  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE bookings
     SET stripe_checkout_session_id = ?,
         stripe_payment_intent_id = COALESCE(?, stripe_payment_intent_id),
         updated_at = ?
     WHERE booking_reference = ?`,
  )
    .bind(sessionId, paymentIntentId, now, bookingReference)
    .run();
}

/**
 * After Stripe Checkout Session creation fails: free the idempotency slot and
 * mark the booking failed so a retry can insert a new awaiting_payment row.
 */
export async function markCheckoutCreateFailed(
  env: PaymentsEnv,
  bookingReference: string,
): Promise<void> {
  const now = new Date().toISOString();
  const abandonedKey = `abandoned:${crypto.randomUUID()}`;
  await env.DB.prepare(
    `UPDATE bookings
     SET status = 'payment_failed',
         idempotency_key = ?,
         updated_at = ?
     WHERE booking_reference = ?`,
  )
    .bind(abandonedKey, now, bookingReference)
    .run();
}

/**
 * Release an awaiting_payment row that never received a Stripe session id
 * (previous create failed before rotate, or crashed mid-flight).
 */
export async function abandonIncompleteCheckout(
  env: PaymentsEnv,
  bookingReference: string,
): Promise<void> {
  await markCheckoutCreateFailed(env, bookingReference);
}

export async function updateBookingStatus(
  env: PaymentsEnv,
  bookingReference: string,
  status: BookingStatus,
  extras?: {
    paymentIntentId?: string | null;
    customerPhone?: string | null;
    customerEmail?: string | null;
    customerName?: string | null;
  },
): Promise<void> {
  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE bookings
     SET status = ?,
         stripe_payment_intent_id = COALESCE(?, stripe_payment_intent_id),
         customer_phone = COALESCE(?, customer_phone),
         customer_email = COALESCE(?, customer_email),
         customer_name = COALESCE(?, customer_name),
         updated_at = ?
     WHERE booking_reference = ?`,
  )
    .bind(
      status,
      extras?.paymentIntentId ?? null,
      extras?.customerPhone ?? null,
      extras?.customerEmail ?? null,
      extras?.customerName ?? null,
      now,
      bookingReference,
    )
    .run();
}

export async function markBookingEmailColumnSent(
  env: PaymentsEnv,
  bookingReference: string,
  kind: "confirmation" | "supplier" | "internal",
): Promise<void> {
  const column =
    kind === "confirmation"
      ? "email_confirmation_sent_at"
      : kind === "supplier"
        ? "email_supplier_sent_at"
        : "email_internal_sent_at";
  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE bookings
     SET ${column} = COALESCE(${column}, ?), updated_at = ?
     WHERE booking_reference = ?`,
  )
    .bind(now, now, bookingReference)
    .run();
}

export async function markBookingInternalEmailSent(
  env: PaymentsEnv,
  bookingReference: string,
): Promise<void> {
  await markBookingEmailColumnSent(env, bookingReference, "internal");
}

/** Returns true if this event ID was newly recorded (should process). */
export async function claimEvent(
  env: PaymentsEnv,
  eventId: string,
  eventType: string,
  bookingReference: string | null,
): Promise<boolean> {
  const now = new Date().toISOString();
  try {
    await env.DB.prepare(
      `INSERT INTO processed_events (event_id, event_type, booking_reference, processed_at)
       VALUES (?, ?, ?, ?)`,
    )
      .bind(eventId, eventType, bookingReference, now)
      .run();
    return true;
  } catch {
    return false;
  }
}

/** Outbox kinds: v1 delivers only "internal". Others reserved for later automation. */
export type EmailOutboxKind = "confirmation" | "supplier" | "internal";
export type EmailOutboxStatus = "pending" | "processing" | "sent" | "failed";

export type EmailOutboxRow = {
  id: string;
  booking_reference: string;
  kind: EmailOutboxKind;
  status: EmailOutboxStatus;
  attempts: number;
  last_error: string | null;
  payload_json: string | null;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  last_attempted_at: string | null;
  provider_message_id: string | null;
};

/** Idempotent enqueue — unique (booking_reference, kind). Returns true if inserted. */
export async function enqueueEmailOutbox(
  env: PaymentsEnv,
  args: {
    bookingReference: string;
    kind: EmailOutboxKind;
    payload: Record<string, unknown>;
  },
): Promise<boolean> {
  const now = new Date().toISOString();
  try {
    await env.DB.prepare(
      `INSERT INTO email_outbox (
        id, booking_reference, kind, status, attempts, last_error, payload_json,
        created_at, updated_at, sent_at, last_attempted_at, provider_message_id
      ) VALUES (?, ?, ?, 'pending', 0, NULL, ?, ?, ?, NULL, NULL, NULL)`,
    )
      .bind(
        crypto.randomUUID(),
        args.bookingReference,
        args.kind,
        JSON.stringify(args.payload),
        now,
        now,
      )
      .run();
    return true;
  } catch {
    return false;
  }
}

/**
 * Claim a row for send: pending|failed → processing.
 * Returns false if another worker already claimed it or it is already sent.
 */
export async function claimEmailOutboxForSend(
  env: PaymentsEnv,
  outboxId: string,
): Promise<boolean> {
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    `UPDATE email_outbox
     SET status = 'processing',
         last_attempted_at = ?,
         updated_at = ?,
         attempts = attempts + 1,
         last_error = NULL
     WHERE id = ? AND status IN ('pending', 'failed')`,
  )
    .bind(now, now, outboxId)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

/** Retryable rows for one booking, or all bookings when bookingReference is null. */
export async function getRetryableEmailOutbox(
  env: PaymentsEnv,
  bookingReference: string | null,
): Promise<EmailOutboxRow[]> {
  if (bookingReference) {
    const result = await env.DB.prepare(
      `SELECT * FROM email_outbox
       WHERE booking_reference = ? AND status IN ('pending', 'failed')
       ORDER BY created_at ASC`,
    )
      .bind(bookingReference)
      .all<EmailOutboxRow>();
    return result.results ?? [];
  }
  const result = await env.DB.prepare(
    `SELECT * FROM email_outbox
     WHERE status IN ('pending', 'failed')
     ORDER BY created_at ASC
     LIMIT 50`,
  ).all<EmailOutboxRow>();
  return result.results ?? [];
}

/** @deprecated Use getRetryableEmailOutbox — kept for older tests. */
export async function getPendingEmailOutbox(
  env: PaymentsEnv,
  bookingReference: string,
): Promise<EmailOutboxRow[]> {
  const result = await env.DB.prepare(
    `SELECT * FROM email_outbox
     WHERE booking_reference = ? AND status = 'pending'
     ORDER BY created_at ASC`,
  )
    .bind(bookingReference)
    .all<EmailOutboxRow>();
  return result.results ?? [];
}

export async function markEmailOutboxSent(
  env: PaymentsEnv,
  outboxId: string,
  providerMessageId?: string | null,
): Promise<boolean> {
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    `UPDATE email_outbox
     SET status = 'sent',
         sent_at = ?,
         updated_at = ?,
         provider_message_id = COALESCE(?, provider_message_id),
         last_error = NULL
     WHERE id = ? AND status = 'processing'`,
  )
    .bind(now, now, providerMessageId ?? null, outboxId)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

export async function markEmailOutboxFailed(
  env: PaymentsEnv,
  outboxId: string,
  error: string,
): Promise<void> {
  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE email_outbox
     SET status = 'failed',
         last_error = ?,
         updated_at = ?,
         last_attempted_at = COALESCE(last_attempted_at, ?)
     WHERE id = ? AND status IN ('processing', 'pending')`,
  )
    .bind(error.slice(0, 500), now, now, outboxId)
    .run();
}
