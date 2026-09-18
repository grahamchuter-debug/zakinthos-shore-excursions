# Clone a new World 2.0 destination (≤ 2 hours)

Reference template: `World-2.0/starter-template/`.

## Minute 0–10 — Scaffold

```bash
cd "/path/to/World-2.0"
node scripts/clone-destination.mjs \
  --slug <slug> \
  --name "<Name>" \
  --strapline "<Strapline>" \
  --prefix <XX> \
  --country "<Country>" \
  --domain <registered-hostname.com> \
  --out ../<slug>-shore-excursions

cd ../<slug>-shore-excursions
npm install
cp .env.example .env.local
```

### Domain (required for singular / non-convention hosts)

Prefer an explicit `--domain` matching the **registered** production hostname (no protocol, no `www`):

```bash
--domain splitshoreexcursion.com
```

If omitted, the generator defaults to `{slug}shoreexcursions.com` (hyphens stripped).  
If the supplied domain differs from that convention, the script prints a warning and still uses your value as the **single source of truth**.

Confirm `src/config/destination.ts` (`domain`, `url`, currency, emails, booking prefix, `contactMode`).

## Minute 10–60 — Tours & booking catalogue

1. Replace sample excursions in `src/data/excursions.ts`.
2. Set `bookingStatus` per product: `comingSoon` | `enquiryOnly` | `live` | `soldOut` | `seasonal`.
   - Only `live` + `bookingPath` enables online Stripe checkout.
   - Legacy `bookable: boolean` still works (`true`→`live`, `false`→`enquiryOnly`).
3. Mirror live products in `bookable-products.ts` + Worker `catalogue.ts` (face currency, **no FX**).
4. Images → `public/images/` using [docs/IMAGE_NAMING.md](./docs/IMAGE_NAMING.md); wire `src/lib/images.ts`.

## Minute 60–100 — Schedules, guides, home copy

1. Cruise schedules (never publish fictitious calls).
2. Guides in `experiences.ts` + `highlights.ts`.
3. Homepage copy in `src/data/homepage.ts` (`homepageHero`, `chooseYourDay`, `honestAdviceContent`, FAQs).
4. Your Day Ashore categories in `cruise-positioning.ts`.
5. Walk It Yourself — enrich `experiences.ts` slug `explore-independently` with optional `independentWalk` only when independence is honestly best; see `docs/WALK_IT_YOURSELF.md`.
6. Update `src/config/completion.ts` as work progresses (internal only).

## Minute 100–120 — Ops smoke test

```bash
npm run build && npm run check-links
npm run qa:world2 -- --build   # includes Domain Audit
```

Production prep:

```bash
cd workers/payments
npx wrangler d1 create <slug>-bookings
# paste database_id into wrangler.toml
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put RESEND_API_KEY
npx wrangler deploy
```

Then **Cloudflare Workers Static Assets** (`npm run deploy` / `wrangler deploy`), DNS Custom Domain
(apex only), www→apex Redirect Rules, Search Console, World-2.0 `sites.json`.

Do **not** create a Cloudflare Pages project for new destinations (ADR-0001).

## Do not rebuild

Navigation/footer chrome · legal routes · booking engine UI · Worker/D1/email · currency helpers · JSON-LD helpers

## Destination-only files

- `src/config/destination.ts`, `completion.ts`, `footer.ts`
- `src/data/excursions.ts`, `bookable-products.ts`, `homepage.ts`, guides, comparisons, planner, schedules
- `src/lib/images.ts` + `public/images/**`
- `workers/payments/src/catalogue.ts` + `wrangler.toml`

## Contact modes

Clones default to `contactMode: "central"` (`info@wowatour.com` only).  
After forwarding works, switch to `local`.
