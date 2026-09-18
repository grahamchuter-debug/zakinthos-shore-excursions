# Zakynthos Shore Excursions — remaining destination work

Config generated for `zakinthos` with domain `zakinthosshoreexcursions.com` and `contactMode: "central"` (info@wowatour.com).

Complete these before production (also track in `src/config/completion.ts`):

- [ ] Hero + excursion images in `public/images/` (see IMAGE_NAMING.md)
- [ ] Tours in `src/data/excursions.ts` + `bookable-products.ts` + Worker `catalogue.ts`
- [ ] Set `bookingStatus` per product (`comingSoon` | `enquiryOnly` | `live` | …)
- [ ] Cruise schedules in `src/data/` / imported schedules
- [ ] Local guides in `src/data/experiences.ts` + `highlights.ts`
- [ ] Footer links in `src/config/footer.ts`
- [ ] Home + port-guide editorial copy (`src/data/homepage.ts`)
- [ ] `wrangler d1 create zakinthos-bookings` → set database_id
- [ ] Stripe + Resend secrets
- [ ] Confirm DNS for zakinthosshoreexcursions.com
- [ ] Deploy site Worker: `npm run deploy` (Workers Static Assets — ADR-0001; do **not** use Pages)
- [ ] Attach apex Custom Domain only; www → apex via Redirect Rules
- [ ] Configure hello@ / bookings@ / privacy@ forwarding, then set `contactMode: "local"`
- [ ] Add site to World-2.0 `sites.json`
- [ ] Run `npm run qa:full` (includes Domain Audit)
