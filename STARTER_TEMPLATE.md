# World 2.0 Starter Template

**Location:** `World-2.0/starter-template/`  
**Reference implementation:** `savona-shore-excursions` (config-driven)  
**Goal:** empty folder → production-ready Mediterranean destination in **under 2 hours**

---

## What a new destination must supply

| Input | Where |
|-------|--------|
| Destination name + strapline + **registered domain** | `src/config/destination.ts` (clone `--domain`) |
| Hero / excursion images | `public/images/` — see `docs/IMAGE_NAMING.md` |
| Tours + `whyWeChose` + `editorChoice` + `bookingStatus` + prices | `src/data/excursions.ts`, `bookable-products.ts`, Worker `catalogue.ts` |
| Homepage hero / decision cards / Honest Advice | `src/data/homepage.ts` (`featuredExperienceCards`, `chooseYourDay`, …) |
| Your Day Ashore categories | `src/data/cruise-positioning.ts` |
| Walk It Yourself (optional) | `experiences.ts` guide `explore-independently` + optional `independentWalk` — see `docs/WALK_IT_YOURSELF.md` |
| Internal completion tracker | `src/config/completion.ts` (not public) |
| Cruise schedules | `src/data/` / imported schedules |
| Local guides | `src/data/experiences.ts` + `highlights.ts` |
| Footer link copy | `src/config/footer.ts` |
| Contact email prefixes | generated from domain (`hello` / `bookings` / `privacy`) |

Everything else is inherited from this template.

---

## 1. Components moved (platform / reusable)

### Shell & branding
- `Header`, `Footer`, `DestinationLogo`, `Breadcrumbs`
- `PageHero`, `PhotoHeroBand`, `ComparisonHeroBand`
- `ResponsiveImage`, `PreloadImage`, `ImageCard`

### Editorial / trust
- `YourDayAshore`, `WhyWeChoseThisExcursion`
- `EditorsChoice`, `EditorsChoiceBadge` — configuration-driven via `editorChoice: true` on excursions
- `CruiseHeroTrust`, `CruisePassengerRatings`
- `HonestAdvice`, `FAQSection`, `EditorsCollection`, `WowCollectionFeature`, `EditorialPromise`
- `ChooseYourDay`, `SpiritOfPlace`, `SignatureExperienceFeature`, `DestinationQuickLinks`
- `IndependentWalkSections` — rich Walk It Yourself content nested in Independent Explorer guides
- `ExperienceCard`, `ExperienceCards` — decision-first editorial pathways (slate/coastal; not gold awards)
- `ExperienceSelector`, `VisitorTypeSelector`, `EditorialRecommendations`

### Planning frameworks
- `CruisePlanner` (was destination-named)
- `ScheduleTable`, `ShipScheduleHubView`
- Guide/article shells: `GuideArticle`, `HighlightArticle`, `ComparisonTable`, `PlanningLinks`
- **Walk It Yourself** — `/guides/explore-independently` with optional `independentWalk` (see `docs/WALK_IT_YOURSELF.md`)
- **Experience Cards** — homepage `ExperienceCards` + `ExperienceCard` (see `docs/EXPERIENCE_CARDS.md`)
- **Editorial Promise** — reusable trust statement (`EditorialPromise` + `editorialPromise`)

### Booking engine (full)
- `booking-engine/*` including steps, success client, tour context, trust, progress, resume
- App routes: `/book/[slug]`, `/book/[slug]/success`

### SEO / structured data
- `JsonLd` + `src/lib/schema.ts` + `src/lib/seo.ts`

### Legal pages (routes inherited)
- `/privacy`, `/terms`, `/cookie-policy`, `/booking-conditions`, `/cancellation-policy`, `/return-to-ship-guarantee`
- Content builders under `src/lib/legal/*` driven by `businessIdentity`

### Payments Worker + D1 + email
- `workers/payments` (Stripe Checkout, webhook, D1, Resend internal ops email)
- Migrations, catalogue, schedule helpers, CORS, booking refs via `BOOKING_REF_PREFIX`

---

## 2. Configuration created

| Config | Path | Purpose |
|--------|------|---------|
| **Destination** | `src/config/destination.ts` | Name, domain, currency, `contactMode` (central/local), contact addresses, SEO, nav, booking prefix, Worker/D1, legal |
| **Contact resolution** | `src/lib/contact.ts` | CENTRAL → `info@wowatour.com`; LOCAL → hello/bookings/privacy |
| **Footer** | `src/config/footer.ts` | Blurb + column links (destination content only) |
| **Site** | `src/lib/site.ts` | Derived from destination config |
| **Currency** | `src/lib/commerce/currency.ts` | Region defaults + `SITE_CURRENCY` from config (no FX) |
| **Business identity** | `src/lib/legal/business-identity.ts` | Derived emails / trading name |
| **Brand identity** | `src/data/destination-identity.ts` | Wordmark fields from config |
| **Worker vars** | `workers/payments/wrangler.toml` | Currency, prefix, origins, email From name |
| **Clone script** | `scripts/clone-destination.mjs` | Generates destination + wrangler + package name |

---

## 3. Estimated reduction in development time

| Workstream (pre-template) | Typical | With starter | Savings |
|---------------------------|---------|--------------|---------|
| Scaffold Next + design system + nav/footer | 6–10 h | 0 h (inherited) | ~8 h |
| Legal pages + identity wiring | 3–4 h | 15 min (emails/domain) | ~3.5 h |
| Booking engine + success UX | 12–20 h | 0 h | ~16 h |
| Payments Worker + D1 + email | 8–12 h | 30–45 min (D1 id + secrets) | ~10 h |
| Your Day Ashore / Why We Chose / trust / FAQ shells | 4–6 h | 30–60 min (copy) | ~4 h |
| Cruise planner + schedule + port guide frameworks | 6–10 h | 1–1.5 h (data only) | ~7 h |
| SEO / JSON-LD / image components | 3–5 h | 20 min | ~4 h |
| **Total engineering** | **~42–67 h** | **~3–4 h content + ops** | **~90%+** |

**Target for next Mediterranean port:** **≤ 2 hours** of focused work once images and tour list are ready:

1. Clone + config (10 min)  
2. Tours + catalogue prices (40–50 min)  
3. Schedules + 4–6 guides (40–50 min)  
4. Heroes + smoke QA + D1 create (20–30 min)

Editorial depth beyond “production-ready” (unique long-form, photography licensing) can continue after launch.

---

## 4. Recommended clone procedure

See **[CLONE.md](./CLONE.md)** for the step-by-step runbook.

Quick path:

```bash
cd "World-2.0"
node scripts/clone-destination.mjs \
  --slug livorno \
  --name "Livorno" \
  --strapline "Gateway to Tuscany" \
  --prefix LV \
  --country Italy \
  --domain livornoshoreexcursions.com \
  --out ../../livorno-shore-excursions

cd ../../livorno-shore-excursions
npm install
# Fill destination/CLONE_CHECKLIST.md + src/config/completion.ts
npm run dev
npm run qa:full
```

Register the site in `sites.json` when live.

---

## 5. Domain handling

- **Single source of truth:** `destinationConfig.domain` / `.url`
- Derived via `SITE` in `src/lib/site.ts` for canonicals, sitemap, OG, robots, JSON-LD
- Clone with `--domain registered-hostname.com` (no protocol). Default convention: `{slug}shoreexcursions.com`
- Non-conventional domains print a warning but are stored exactly as supplied
- **Domain Audit** (`scripts/lib/check-domain.js`) fails the World 2.0 audit on host mismatches

## 6. Booking status

```ts
bookingStatus?: "comingSoon" | "enquiryOnly" | "live" | "soldOut" | "seasonal"
```

| Status | UI behaviour |
|--------|----------------|
| `live` | Book Now (requires `bookingPath` + catalogue price) |
| `enquiryOnly` | Primary enquire CTA |
| `comingSoon` | Enquire / coming soon — **no public price** |
| `soldOut` | Waitlist / enquire |
| `seasonal` | Enquire about dates |

Legacy `bookable?: boolean` maps to `live` / `enquiryOnly`. Helpers live in `src/lib/booking-status.ts`.

Empty catalogues are supported: booking routes emit an `unavailable` static param and a safe placeholder tour view.

## 7. Destination completion (internal)

`src/config/completion.ts` tracks Pending / In Progress / Complete for editorial, images, products, pricing, schedules, booking, Stripe, Worker, D1, Search Console, analytics, production images, deployment. **Never render this on public pages.**

## 8. Image naming

See **[docs/IMAGE_NAMING.md](./docs/IMAGE_NAMING.md)**. Prefer `hero.jpg`, `coastal.jpg`, `nature.jpg`, `food-and-wine.jpg`, plus destination subjects (`klis-fortress.jpg`). Do not inherit `ligurian-coast.jpg` / `camogli.jpg`-style placeholders.

## 9. QA process

```bash
npm run build
npm run check-links
npm run seo-qa
npm run qa:world2 -- --build   # Domain Audit + SEO + scaffold + editorial
# or
npm run qa:full
```

## 10. Platform version

World 2.0 Standard **v1.2** — see `World-2.0/CHANGELOG.md`.
