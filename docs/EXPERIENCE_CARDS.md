# Experience Cards

World 2.0 decision-first pathways: **how would you like to experience this destination?**

## Philosophy

Experience Cards introduce ways of spending the day ashore — Walk It Yourself, History, Nature, Food & Wine, Photography, Families, Luxury, Independent Explorer, Private Experiences, and future kinds.

They are editorial navigation, not awards.

**Editor's Choice is not an Experience Card.**  
Keep using `EditorsChoiceBadge` / `EditorsChoice` + `editorChoice: true` for the highest paid recommendation. Do not apply gold/cream award styling to Experience Cards.

## Components

| Layer | Path |
|-------|------|
| Card | `src/components/ExperienceCard.tsx` |
| Section | `src/components/ExperienceCards.tsx` |
| Broader grid | `src/components/ExperienceSelector.tsx` (uses ExperienceCard) |
| Types | `ExperienceCard` / `ExperienceCardType` in `src/data/types.ts` |
| Data | `featuredExperienceCards` + `experienceCards` in `src/data/homepage.ts` |
| Styles | `.experience-card*` in `src/app/globals.css` (slate / stone / coastal) |

## Walk It Yourself card

When `type: "walk-it-yourself"` or `independent-explorer` (or slug `explore-independently`), the card uses the calm walk variant and can show:

- Eyebrow: `Free self-guided route`
- Duration / distance / difficulty / ideal for

The full Walk It Yourself experience lives on `/guides/explore-independently` via `GuidePage.independentWalk` (see `docs/WALK_IT_YOURSELF.md`). Include the card in homepage data when independence is recommended; omit it when it is not.

## Adding a new kind

1. Extend `ExperienceCardType` if needed.
2. Add an entry to `featuredExperienceCards` and/or `experienceCards`.
3. Prefer coastal/slate meta chips — never gold award chrome.
