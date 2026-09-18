# Destination-only surface

When cloning from this template, **only** these need destination content:

1. `src/config/destination.ts` — name, strapline, domain, currency, `contactMode` (default `central`), local emails (for later), booking prefix
2. `src/config/footer.ts` — blurb + link columns
3. `src/data/excursions.ts` — tours + `whyWeChose`
4. `src/data/bookable-products.ts` — bookable catalogue
5. `workers/payments/src/catalogue.ts` — chargeable products (must match)
6. Cruise schedule data under `src/data/` / imported schedules
7. `src/data/guides.ts` (+ comparisons as needed)
8. `src/lib/images.ts` + `public/images/**` — hero and tour photography
9. Light home/port copy in `src/data/homepage.ts` / port-guide data

Do not fork the booking engine, Worker schema, legal routes, or chrome components.
