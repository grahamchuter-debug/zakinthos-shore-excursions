/**
 * Manually retry failed/pending internal outbox emails against remote D1 + Resend.
 *
 * Usage (from workers/payments, with secrets in the environment or .dev.vars loaded):
 *   npm run email:retry-failed
 *
 * Requires: RESEND_API_KEY, EMAIL_FROM, EMAIL_FROM_NAME, INTERNAL_BOOKING_EMAIL
 * Uses: npx wrangler d1 execute villefranche-bookings --remote
 *
 * Does NOT expose a public HTTP endpoint.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadDevVars() {
  const file = path.join(root, ".dev.vars");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function d1Json(command) {
  const result = spawnSync(
    "npx",
    [
      "wrangler",
      "d1",
      "execute",
      "villefranche-bookings",
      "--remote",
      "--json",
      "--command",
      command,
    ],
    { cwd: root, encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "wrangler d1 failed");
  }
  const parsed = JSON.parse(result.stdout);
  // wrangler --json shape: [{ results: [...], success: true }, ...]
  const block = Array.isArray(parsed) ? parsed[0] : parsed;
  return block?.results ?? [];
}

function d1Run(command) {
  const result = spawnSync(
    "npx",
    [
      "wrangler",
      "d1",
      "execute",
      "villefranche-bookings",
      "--remote",
      "--command",
      command,
    ],
    { cwd: root, encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "wrangler d1 failed");
  }
}

function escapeSql(value) {
  return String(value).replace(/'/g, "''");
}

async function sendResend({ from, to, subject, text, html, apiKey }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text, html }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.message || body?.error?.message || `HTTP ${response.status}`);
  }
  return body.id;
}

loadDevVars();

const apiKey = process.env.RESEND_API_KEY?.trim();
const to = process.env.INTERNAL_BOOKING_EMAIL?.trim();
const fromAddress = process.env.EMAIL_FROM?.trim();
const fromName = (process.env.EMAIL_FROM_NAME || "Villefranche Shore Excursions").trim();

if (!apiKey || !to || !fromAddress) {
  console.error(
    "Missing RESEND_API_KEY, INTERNAL_BOOKING_EMAIL, or EMAIL_FROM (set in env or .dev.vars).",
  );
  process.exit(1);
}

const from = fromAddress.includes("<")
  ? fromAddress
  : `${fromName} <${fromAddress}>`;

const rows = d1Json(
  `SELECT id, booking_reference, status, attempts, last_error
   FROM email_outbox
   WHERE kind = 'internal' AND status IN ('pending', 'failed')
   ORDER BY created_at ASC
   LIMIT 20`,
);

if (!rows.length) {
  console.log("No pending/failed internal outbox rows.");
  process.exit(0);
}

console.log(`Retrying ${rows.length} internal outbox row(s)…`);

for (const row of rows) {
  const bookingRows = d1Json(
    `SELECT * FROM bookings WHERE booking_reference = '${escapeSql(row.booking_reference)}' LIMIT 1`,
  );
  const booking = bookingRows[0];
  if (!booking) {
    console.error(`Skip ${row.id}: booking not found`);
    continue;
  }

  const subject = `New paid Villefranche booking — ${booking.booking_reference} — ${booking.excursion_date}`;
  const banner =
    "ACTION REQUIRED: Review this booking and send the customer’s confirmation manually.";
  const text = [
    banner,
    "",
    `Booking reference: ${booking.booking_reference}`,
    `Payment status: ${booking.status}`,
    `Customer: ${booking.customer_name || "—"}`,
    `Email: ${booking.customer_email || "—"}`,
    `Phone: ${booking.customer_phone || "—"}`,
    `Excursion: ${booking.excursion_name}`,
    `Date: ${booking.excursion_date}`,
    `Ship: ${booking.ship_name}`,
    `Guests: ${booking.total_guests}`,
    `Total: ${(booking.amount_total_cents / 100).toFixed(2)} ${String(booking.currency).toUpperCase()}`,
  ].join("\n");

  const html = `<p><strong>${banner}</strong></p><pre>${text.replace(/</g, "&lt;")}</pre>`;

  const now = new Date().toISOString();
  d1Run(
    `UPDATE email_outbox
     SET status = 'processing', last_attempted_at = '${now}', updated_at = '${now}',
         attempts = attempts + 1, last_error = NULL
     WHERE id = '${escapeSql(row.id)}' AND status IN ('pending', 'failed')`,
  );

  try {
    const messageId = await sendResend({
      apiKey,
      from,
      to,
      subject,
      text,
      html,
    });
    d1Run(
      `UPDATE email_outbox
       SET status = 'sent', sent_at = '${now}', updated_at = '${now}',
           provider_message_id = '${escapeSql(messageId)}', last_error = NULL
       WHERE id = '${escapeSql(row.id)}'`,
    );
    d1Run(
      `UPDATE bookings
       SET email_internal_sent_at = COALESCE(email_internal_sent_at, '${now}'),
           updated_at = '${now}'
       WHERE booking_reference = '${escapeSql(row.booking_reference)}'`,
    );
    console.log(`Sent ${row.booking_reference} → provider ${messageId}`);
  } catch (err) {
    const msg = String(err).slice(0, 400).replace(/'/g, "''");
    d1Run(
      `UPDATE email_outbox
       SET status = 'failed', last_error = '${msg}', updated_at = '${now}'
       WHERE id = '${escapeSql(row.id)}'`,
    );
    console.error(`Failed ${row.booking_reference}:`, String(err).slice(0, 200));
  }
}
