# Stripe Checkout setup (test mode) — Villefranche Shore Excursions

This site is a **static Next.js export**. Secret Stripe operations and webhooks run on a **Cloudflare Worker** with **D1**.

## Architecture

| Layer | Role |
|-------|------|
| Next static site | Booking journey → `POST` Worker → redirect to Stripe Checkout |
| Worker `workers/payments` | Create session, verify session, webhooks, D1 bookings |
| Stripe Checkout | Collect card (+ phone), 3DS, wallets where available |
| D1 | Bookings + processed event IDs + email outbox |

**Confirm bookings only via verified webhooks** — never because the customer hit the success URL. The success page calls `GET /api/checkout/session?session_id=` to verify payment server-side before showing confirmation.

**No capacity hold in v1** — opening Checkout does not reserve seats.

## Pricing (important)

**Approved retail: €149 per guest.**

Set the **same** value in both places:

| Variable | Where | Value |
|----------|--------|-------|
| `BOOKING_PRICE_PER_GUEST_EUR` | Worker plain var (`wrangler.toml` `[vars]` / dashboard Text) — not a secret | `149` |
| `NEXT_PUBLIC_BOOKING_PRICE_PER_GUEST_EUR` | Next `.env.local` (display only; baked at build) | `149` |

The Worker **always recalculates** amount as integer minor units: `149 × guests × 100` cents, and ignores any browser-supplied total (mismatches are logged).

Product **name** comes from the Worker excursion catalogue (`workers/payments/src/catalogue.ts`), not from the browser.

Until these are set, the payment CTA stays blocked with a customer-friendly message.

## Trusted validation (Worker)

| Input | Trust model |
|-------|-------------|
| `excursionId` | Must match server catalogue; official name derived server-side |
| `excursionName` | Ignored (display hint only) |
| `excursionDate` | Valid ISO date, not past (UTC today), within schedule window `2026-06-01`–`2028-11-30` |
| `shipId` / `shipName` | Listed ships validated against bundled `ships-by-date.json` (synced from `public/data` CSVs); name overwritten from schedule. Custom / `not-listed` ships require a client `shipName` hint |
| `successUrl` / `cancelUrl` | **Ignored.** Built from `SITE_BASE_URL` + catalogue paths only |
| `cancellationProtection` | **Ignored in v1** (not server-priced; always stored as `0`) |

### Redirect URLs

Worker builds:

- Success: `{SITE_BASE_URL}/book/small-group-monaco-monte-carlo-eze/success?session_id={CHECKOUT_SESSION_ID}`
- Cancel: `{SITE_BASE_URL}/book/small-group-monaco-monte-carlo-eze?checkout=cancelled`

Set `SITE_BASE_URL` to the public site origin (local: `http://localhost:3000`; production: `https://villefrancheshoreexcursions.com`). Falls back to `SITE_ORIGIN` if unset.

### Sync ship schedule into the Worker

After updating `public/data/*.csv`:

```bash
cd workers/payments
npm run sync:ships
```

### Cancellation protection (v1 decision)

**Disabled.** Browser flags are ignored; no add-on line item. Revisit only when a server-priced product exists and can be added as a separate Checkout `line_items` entry.

### Deferred before live launch

- Capacity / seat holds
- Automated customer confirmation / voucher email (v1: **manual**; internal Resend alert only — see `docs/ops-bookings.md`)
- Optional: tighter timezone-aware “today” (Worker currently uses UTC calendar date)
- Optional: reject custom ships on dates with no published calls (currently allowed when `shipId` is `not-listed`)

## Environment variables

### Next.js (`.env.local` — gitignored)

See root `.env.example`.

| Name | Required | Notes |
|------|----------|--------|
| `NEXT_PUBLIC_PAYMENTS_API_URL` | Yes for checkout | Worker origin, e.g. `http://127.0.0.1:8787` or production Worker URL |
| `NEXT_PUBLIC_BOOKING_PRICE_PER_GUEST_EUR` | Yes for checkout | Approved retail: `149` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No for hosted Checkout | `pk_test_…` for future client Stripe.js |

### Cloudflare Worker (`.dev.vars` locally; secrets in dashboard)

Copy `workers/payments/.dev.vars.example` → `workers/payments/.dev.vars`.

| Name | Required | Notes |
|------|----------|--------|
| `STRIPE_SECRET_KEY` | Yes | `sk_test_…` only until launch checklist passes |
| `STRIPE_WEBHOOK_SECRET` | Yes | `whsec_…` from Stripe CLI or Dashboard endpoint |
| `BOOKING_PRICE_PER_GUEST_EUR` | Yes | `149` as a **plain** Worker var (not a secret); same as Next public price |
| `SITE_BASE_URL` | Yes for checkout | Trusted site origin for success/cancel redirects |
| `SITE_ORIGIN` | Recommended | CORS + fallback if `SITE_BASE_URL` unset |
| `CORS_ALLOWED_ORIGINS` | Optional | Extra origins (localhost already allowed) |
| `CHECKOUT_CURRENCY` | Optional | Default `eur` |
| `ORIGINATING_SITE` / `ORIGINATING_PORT` | Optional | Metadata defaults |

**Never** put `sk_` / `whsec_` in Next public env, client bundles, or git.

### Where to add keys (do not paste secrets into chat)

1. **Local Next**: project root `.env.local`
2. **Local Worker**: `workers/payments/.dev.vars`
3. **Cloudflare**: Worker → Settings → Variables and Secrets (`wrangler secret put STRIPE_SECRET_KEY`, etc.)
4. **Stripe Dashboard**: Developers → API keys (test), Webhooks → signing secret

## Local run

### 1. Create D1 database (once)

```bash
cd workers/payments
npx wrangler d1 create villefranche-bookings
```

Paste the returned `database_id` into `workers/payments/wrangler.toml`.

### 2. Apply migrations

```bash
cd workers/payments
npm run db:migrate:local
# later, after deploy:
# npm run db:migrate:remote
```

Migrations: `0001_init` (bookings + processed_events), `0002_email_outbox` (retry-safe email queue).

### 3. Start Worker

```bash
cd workers/payments
# ensure .dev.vars is filled with sk_test + whsec + price + SITE_BASE_URL
npm run dev
```

Default: `http://127.0.0.1:8787`

### 4. Forward webhooks (Stripe CLI)

```bash
stripe listen --forward-to http://127.0.0.1:8787/api/stripe/webhook
```

Copy the CLI `whsec_…` into `.dev.vars` as `STRIPE_WEBHOOK_SECRET`.

### 5. Start Next

```bash
# root .env.local:
# NEXT_PUBLIC_PAYMENTS_API_URL=http://127.0.0.1:8787
# NEXT_PUBLIC_BOOKING_PRICE_PER_GUEST_EUR=149
npm run dev
```

Open `/book/small-group-monaco-monte-carlo-eze`, complete the journey, pay with test card `4242 4242 4242 4242`.

### Deploy Worker

```bash
cd workers/payments
npm run db:migrate:remote
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
# BOOKING_PRICE_PER_GUEST_EUR and SITE_BASE_URL are plain [vars] in wrangler.toml (not secrets)
npm run deploy
```

Point Stripe Dashboard webhook to `https://<worker>/api/stripe/webhook` and subscribe to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `payment_intent.payment_failed`
- `charge.refunded`
- `refund.updated`

Rebuild/redeploy the static site with production `NEXT_PUBLIC_PAYMENTS_API_URL` and matching price env.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/checkout/session` | Validate booking against catalogue/schedule, price server-side, create Checkout Session, store `awaiting_payment` |
| `GET` | `/api/checkout/session?session_id=` | Success-page verification (`paid` vs `bookingFinalised`) |
| `POST` | `/api/stripe/webhook` | Signature-verified fulfillment + email outbox enqueue |
| `GET` | `/health` | Liveness |

Checkout Session uses `mode: payment`, EUR `price_data`, `phone_number_collection.enabled`, metadata + `client_reference_id`, and Stripe idempotency keys.

### Stripe create failure recovery

If D1 inserts `awaiting_payment` but Stripe Checkout Session creation fails, the Worker marks the row `payment_failed` and **rotates** `idempotency_key` so a retry is not blocked. Covered by `npm test` in `workers/payments`.

## Success page wording

| Condition | UI |
|-----------|-----|
| Stripe `payment_status=paid` but D1 not yet `paid`/`confirmed` | **Payment received — finalising your booking** |
| D1 `bookingFinalised` (`paid` or `confirmed`) | Full confirmation (“Booking confirmed…”) |

## Email (outbox)

Webhooks **enqueue** an **internal** ops alert (`kind = internal`) after the booking is `confirmed`, then deliver via Resend in `ctx.waitUntil` so Stripe is not blocked.

- Customer confirmation / supplier automation: **not sent in v1** (manual customer email).
- `sent_at` / `provider_message_id` only after Resend accepts the message.
- Unique `(booking_reference, kind)` prevents duplicate internal emails on webhook retries.
- Ops runbook + D1 queries + `npm run email:retry-failed`: **`docs/ops-bookings.md`**.

## Analytics stubs

`src/lib/payments/analytics.ts` emits no-ops for:

`booking_started`, `date_selected`, `ship_selected`, `guest_count_selected`, `checkout_started`, `checkout_cancelled`, `payment_succeeded`, `payment_failed`, `booking_confirmed`.

## Test checklist (before live keys)

- [ ] 1. Successful card payment (`4242…`)
- [ ] 2. American Express test payment
- [ ] 3. Apple Pay / Google Pay where testable
- [ ] 4. 3D Secure authentication
- [ ] 5. Declined card
- [ ] 6. Insufficient funds
- [ ] 7. Incorrect CVC
- [ ] 8. Customer cancels Checkout → returns to payment step with selections
- [ ] 9. Refresh / revisit success page (still shows confirmation when paid + webhook processed)
- [ ] 10. Double-click pay button (single session / idempotency)
- [ ] 11. Duplicate webhook delivery (no duplicate emails / status thrash)
- [ ] 12. Delayed webhook delivery (success page shows “finalising” until D1 confirms)
- [ ] 13. Invalid webhook signature rejected
- [ ] 14. Browser total manipulation ignored (server amount charged)
- [ ] 15. Date / ship / guests changed before payment (new amount)
- [ ] 16. Full refund → booking `refunded`
- [ ] 17. Partial refund → `partially_refunded` (if supported)
- [ ] 18. Confirmation email stub fired only once (outbox unique)
- [ ] 19. Supplier notification stub fired only once
- [ ] 20. Mobile: iPhone Safari + Android Chrome
- [ ] 21. Stripe create failure then retry succeeds (idempotency freed)
- [ ] 22. Client-supplied success/cancel URLs ignored (SITE_BASE_URL wins)

## Live launch checklist

- [ ] All test items passed in **test mode**
- [ ] Approved retail EUR price set identically on Worker + Next build
- [ ] `SITE_BASE_URL` points at production site origin (https)
- [ ] Ship catalogue synced (`npm run sync:ships`) after latest schedule CSVs
- [ ] Switch Cloudflare secrets to `sk_live_…` and live `whsec_…`
- [ ] Stripe Dashboard webhook endpoint points at production Worker (live mode)
- [ ] Rebuild static site with production `NEXT_PUBLIC_*` values
- [ ] Confirm CORS allows production origin only (plus temporary staging if needed)
- [ ] Restricted API key considered for production permissions
- [ ] Real email provider wired for **internal** ops alerts (`RESEND_API_KEY`); customer vouchers remain manual until back-office project
- [ ] Monitor first live payments + webhook delivery in Stripe Workbench
- [ ] Document rollback: revert Worker deploy + keep accepting enquiries if needed

## Modular reuse

`src/lib/payments/*` and `workers/payments` are structured for other shore-excursion sites: swap catalogue entries, schedule sync, `ORIGINATING_SITE` / port, and price env — keep the same Checkout + webhook contract.
