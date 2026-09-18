# Ops: paid bookings & internal email (v1 soft launch)

Stripe stays in **test mode** until you explicitly cut over. Customer confirmation emails are **manual**. The Worker only auto-sends an **internal** alert to `INTERNAL_BOOKING_EMAIL`.

## Environment

| Name | Type | Example |
|------|------|---------|
| `RESEND_API_KEY` | Secret | `re_…` |
| `INTERNAL_BOOKING_EMAIL` | Var | `info@wowatour.com` |
| `EMAIL_FROM` | Var | `bookings@notifications.wowatour.com` |
| `EMAIL_FROM_NAME` | Var | `Villefranche Shore Excursions` |

Domain `notifications.wowatour.com` must be **verified in Resend** before production sends.

```bash
cd workers/payments
npx wrangler secret put RESEND_API_KEY   # paste key — never commit
# Plain vars are in wrangler.toml; redeploy after edits:
npm run deploy   # only when approved
```

Apply migration:

```bash
npm run db:migrate:remote
```

## After a paid booking

1. Stripe webhook verifies payment → D1 status `confirmed`
2. Outbox row `kind='internal'` enqueued (idempotent)
3. Resend send runs in `ctx.waitUntil` (Stripe does not wait on Resend)
4. Ops receives email with **ACTION REQUIRED: … send the customer’s confirmation manually**

## D1 queries (remote)

Pending / failed internal emails:

```bash
npx wrangler d1 execute villefranche-bookings --remote --command \
  "SELECT id, booking_reference, status, attempts, last_error, last_attempted_at, sent_at
   FROM email_outbox
   WHERE kind = 'internal' AND status IN ('pending', 'failed', 'processing')
   ORDER BY created_at DESC
   LIMIT 50;"
```

Confirmed bookings missing a sent internal notification:

```bash
npx wrangler d1 execute villefranche-bookings --remote --command \
  "SELECT b.booking_reference, b.status, b.created_at, b.email_internal_sent_at, o.status AS outbox_status
   FROM bookings b
   LEFT JOIN email_outbox o
     ON o.booking_reference = b.booking_reference AND o.kind = 'internal'
   WHERE b.status IN ('confirmed', 'paid')
     AND (o.id IS NULL OR o.status != 'sent' OR b.email_internal_sent_at IS NULL)
   ORDER BY b.created_at DESC
   LIMIT 50;"
```

Lookup one booking:

```bash
npx wrangler d1 execute villefranche-bookings --remote --command \
  "SELECT booking_reference, status, customer_name, customer_email, customer_phone,
          excursion_date, ship_name, total_guests, amount_total_cents, currency,
          stripe_checkout_session_id, email_internal_sent_at
   FROM bookings
   WHERE booking_reference = 'VF-XXXXXX';"
```

## Manual retry (no public HTTP endpoint)

With `RESEND_API_KEY` / from / recipient available in `.dev.vars` or the shell:

```bash
cd workers/payments
npm run email:retry-failed
```

This re-sends up to 20 `pending`/`failed` **internal** rows via Resend and updates D1.

## Customer wording

Confirmation page: *“Booking confirmed. We are preparing your meeting details and will email your confirmation shortly.”*  
No claim that an automated email was already sent.
