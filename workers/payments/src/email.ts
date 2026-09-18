/**
 * Transactional email via Resend HTTP API (no SDK — Workers-friendly).
 *
 * v1: only internal paid-booking alerts.
 * Customer confirmation / supplier kinds are reserved for a later back-office project.
 */

import {
  claimEmailOutboxForSend,
  enqueueEmailOutbox,
  getBookingByReference,
  getRetryableEmailOutbox,
  markBookingInternalEmailSent,
  markEmailOutboxFailed,
  markEmailOutboxSent,
  type EmailOutboxKind,
  type EmailOutboxRow,
} from "./db";
import { getShipCallTimes } from "./schedule";
import type { BookingRow, PaymentsEnv } from "./types";

export const INTERNAL_OUTBOX_KIND: EmailOutboxKind = "internal";

export const MANUAL_CUSTOMER_CONFIRMATION_BANNER =
  "ACTION REQUIRED: Review this booking and send the customer’s confirmation manually.";

export type ProviderSendResult =
  | { accepted: true; messageId: string }
  | { accepted: false; error: string };

/** Build Resend "from" header from separate name + address env vars. */
export function formatEmailFrom(env: PaymentsEnv): string {
  const address = (env.EMAIL_FROM ?? "").trim();
  if (!address) {
    throw new Error("EMAIL_FROM is required (verified sender address)");
  }
  const name = (env.EMAIL_FROM_NAME ?? "Savona Shore Excursions").trim();
  if (address.includes("<")) return address;
  return `${name} <${address}>`;
}

export function getInternalBookingEmail(env: PaymentsEnv): string {
  const to = (env.INTERNAL_BOOKING_EMAIL ?? "").trim();
  if (!to) {
    throw new Error("INTERNAL_BOOKING_EMAIL is required");
  }
  return to;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMoney(cents: number, currency: string): string {
  const major = (cents / 100).toFixed(2);
  return `${currency.toUpperCase()} ${major}`;
}

export type InternalEmailContent = {
  subject: string;
  text: string;
  html: string;
};

export function buildInternalBookingEmail(
  booking: BookingRow,
  times: { arrival: string | null; departure: string | null },
): InternalEmailContent {
  const ref = booking.booking_reference;
  const date = booking.excursion_date;
  const subject = `New paid Savona booking — ${ref} — ${date}`;
  const adminUrl = `https://savonashoreexcursions.com/admin/booking/${encodeURIComponent(ref)}`;

  const customerEmail = booking.customer_email?.trim() || "—";
  const mailto =
    customerEmail !== "—"
      ? `<a href="mailto:${escapeHtml(customerEmail)}">${escapeHtml(customerEmail)}</a>`
      : "—";

  const rows: Array<[string, string]> = [
    ["Payment status", booking.status],
    ["Stripe Checkout Session", booking.stripe_checkout_session_id ?? "—"],
    ["Stripe PaymentIntent", booking.stripe_payment_intent_id ?? "—"],
    ["Customer name", booking.customer_name ?? "—"],
    ["Customer email", customerEmail],
    ["Customer phone", booking.customer_phone ?? "—"],
    ["Excursion", booking.excursion_name],
    ["Excursion date", date],
    ["Cruise ship", booking.ship_name],
    ["Ship arrival", times.arrival ?? "—"],
    ["Ship departure", times.departure ?? "—"],
    ["Guests", String(booking.total_guests)],
    ["Adults", String(booking.adults)],
    ["Children", String(booking.children)],
    ["Total paid", formatMoney(booking.amount_total_cents, booking.currency)],
    ["Currency", booking.currency.toUpperCase()],
    ["Booking created (UTC)", booking.created_at],
    ["Customer notes", "— (not collected in v1)"],
    ["Originating website", booking.originating_site],
    ["Port", booking.originating_port ?? "—"],
  ];

  const textLines = [
    "Booking Reference",
    ref,
    "",
    `Open Booking: ${adminUrl}`,
    "",
    MANUAL_CUSTOMER_CONFIRMATION_BANNER,
    "",
    "Customer confirmation / voucher must be sent manually for this soft launch.",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
  ];

  const htmlRows = rows
    .map(([k, v]) => {
      const display =
        k === "Customer email" && customerEmail !== "—"
          ? mailto
          : escapeHtml(v);
      return `<tr><th align="left" style="padding:4px 12px 4px 0;vertical-align:top;">${escapeHtml(k)}</th><td style="padding:4px 0;">${display}</td></tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;line-height:1.45;color:#111;">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#555;">Booking Reference</p>
  <p style="margin:0 0 16px;font-size:28px;font-weight:700;letter-spacing:0.02em;">${escapeHtml(ref)}</p>
  <p style="margin:0 0 8px;">
    <a href="${escapeHtml(adminUrl)}"
       style="display:inline-block;padding:12px 20px;background:#0b5fff;color:#ffffff;text-decoration:none;font-weight:600;border-radius:6px;">
      Open Booking
    </a>
  </p>
  <p style="margin:0 0 20px;font-size:12px;color:#666;word-break:break-all;">
    ${escapeHtml(adminUrl)}
  </p>
  <p style="padding:12px 14px;background:#fff3cd;border:1px solid #ffc107;font-weight:700;">
    ${escapeHtml(MANUAL_CUSTOMER_CONFIRMATION_BANNER)}
  </p>
  <p>Customer confirmation / voucher must be sent <strong>manually</strong> for this soft launch. No automated customer email was sent.</p>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${htmlRows}</table>
</body></html>`;

  return { subject, text: textLines.join("\n"), html };
}

/**
 * Send via Resend REST API. Does not log recipient PII or API keys.
 */
export async function sendViaResend(
  env: PaymentsEnv,
  args: {
    to: string;
    subject: string;
    text: string;
    html: string;
  },
): Promise<ProviderSendResult> {
  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { accepted: false, error: "RESEND_API_KEY is not configured" };
  }

  let from: string;
  try {
    from = formatEmailFrom(env);
  } catch (err) {
    return { accepted: false, error: String(err) };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [args.to],
      subject: args.subject,
      text: args.text,
      html: args.html,
    }),
  });

  const body = (await response.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
    name?: string;
    error?: { message?: string };
  };

  if (!response.ok) {
    const msg =
      body.error?.message ||
      body.message ||
      body.name ||
      `Resend HTTP ${response.status}`;
    console.error(
      JSON.stringify({
        email_provider_error: true,
        status: response.status,
        // Avoid logging full provider payloads (may include addresses).
      }),
    );
    return { accepted: false, error: String(msg).slice(0, 400) };
  }

  if (!body.id) {
    return { accepted: false, error: "Resend accepted but returned no message id" };
  }

  return { accepted: true, messageId: body.id };
}

/**
 * After D1 booking is confirmed: enqueue internal outbox row only (idempotent).
 * Does not call Resend — caller should schedule deliverInternalOutbox via waitUntil.
 */
export async function enqueueInternalBookingNotification(
  env: PaymentsEnv,
  booking: BookingRow,
): Promise<boolean> {
  const times = getShipCallTimes(
    booking.excursion_date,
    booking.ship_id,
    booking.ship_name,
  );
  const content = buildInternalBookingEmail(booking, times);

  return enqueueEmailOutbox(env, {
    bookingReference: booking.booking_reference,
    kind: INTERNAL_OUTBOX_KIND,
    payload: {
      to: getInternalBookingEmail(env),
      subject: content.subject,
      // Snapshot for retries if booking row changes later
      booking_reference: booking.booking_reference,
    },
  });
}

async function deliverOneInternalRow(
  env: PaymentsEnv,
  row: EmailOutboxRow,
): Promise<void> {
  if (row.kind !== INTERNAL_OUTBOX_KIND) {
    // v1 must never auto-send customer/supplier kinds.
    console.error(
      JSON.stringify({
        email_skipped_non_internal: true,
        kind: row.kind,
        outboxId: row.id,
      }),
    );
    await markEmailOutboxFailed(
      env,
      row.id,
      "v1 only delivers internal notifications",
    );
    return;
  }

  const claimed = await claimEmailOutboxForSend(env, row.id);
  if (!claimed) return;

  const booking = await getBookingByReference(env, row.booking_reference);
  if (!booking) {
    await markEmailOutboxFailed(env, row.id, "booking_not_found");
    return;
  }

  let to: string;
  try {
    to = getInternalBookingEmail(env);
  } catch (err) {
    await markEmailOutboxFailed(env, row.id, String(err));
    return;
  }

  const times = getShipCallTimes(
    booking.excursion_date,
    booking.ship_id,
    booking.ship_name,
  );
  const content = buildInternalBookingEmail(booking, times);

  try {
    const result = await sendViaResend(env, {
      to,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });

    if (!result.accepted) {
      await markEmailOutboxFailed(env, row.id, result.error);
      return;
    }

    const marked = await markEmailOutboxSent(env, row.id, result.messageId);
    if (marked) {
      await markBookingInternalEmailSent(env, booking.booking_reference);
      console.log(
        JSON.stringify({
          email_internal_sent: true,
          bookingReference: booking.booking_reference,
          // message id is an opaque provider token — safe enough for ops logs
          providerMessageId: result.messageId,
        }),
      );
    }
  } catch (err) {
    console.error(
      JSON.stringify({
        email_outbox_delivery_failed: true,
        outboxId: row.id,
        error: String(err).slice(0, 200),
      }),
    );
    await markEmailOutboxFailed(env, row.id, String(err));
  }
}

/** Deliver pending/failed internal rows for one booking (safe for waitUntil). */
export async function deliverInternalOutboxForBooking(
  env: PaymentsEnv,
  bookingReference: string,
): Promise<void> {
  const rows = await getRetryableEmailOutbox(env, bookingReference);
  for (const row of rows) {
    if (row.kind !== INTERNAL_OUTBOX_KIND) continue;
    await deliverOneInternalRow(env, row);
  }
}

/** Deliver all retryable internal rows (used by local retry script / future cron). */
export async function deliverAllRetryableInternalOutbox(
  env: PaymentsEnv,
): Promise<{ attempted: number }> {
  const rows = await getRetryableEmailOutbox(env, null);
  let attempted = 0;
  for (const row of rows) {
    if (row.kind !== INTERNAL_OUTBOX_KIND) continue;
    attempted += 1;
    await deliverOneInternalRow(env, row);
  }
  return { attempted };
}
