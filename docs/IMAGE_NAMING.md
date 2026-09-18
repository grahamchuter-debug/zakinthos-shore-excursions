# World 2.0 image naming convention

Destination imagery should use **neutral, destination-agnostic role names** for shared slots, plus **subject names** for place-specific assets.

## Required shared bases

Place JPEG sources in `public/images/`:

| File | Role |
|------|------|
| `hero.jpg` | Homepage / primary hero |
| `og-default.jpg` | Default Open Graph image |
| `cruise-port.jpg` | Port / terminal context |
| `historic.jpg` | Historic centre / landmark default |
| `walking.jpg` | Walking / old-town routes |
| `food-and-wine.jpg` | Culinary experiences |
| `coastal.jpg` | Coastal / scenic default |
| `nature.jpg` | Nature / parks / waterfalls |
| `compare.jpg` | Comparison / planning cards |
| `private.jpg` | Private / premium experiences |

Wire these through `src/lib/images.ts` (`siteImages` + `subjectImages`).

## Destination subject files (examples)

Use kebab-case place or experience names — never inherit another destination’s filenames:

```
diocletians-palace.jpg
klis-fortress.jpg
trogir.jpg
krka-waterfalls.jpg
split-old-town.jpg
```

Map excursion slugs → subject keys in `getExcursionImage`.

## Do not use

- Inherited Riviera placeholders: `ligurian-coast.jpg`, `camogli.jpg`, `santa-margherita.jpg`
- Another destination’s city names
- Obviously AI-generated or geographically inaccurate stock

## Optimisation

`scripts/optimize-images.mjs` reads `USED_BASES`. Add new subject bases there before `npm run build`.

Temporary stand-ins for local development must be listed in `public/images/sources.json`.
