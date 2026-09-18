# Walk It Yourself (Independent Explorer)

World 2.0 evolves the existing **Independent Explorer / Explore Independently** guide into a defining editorial experience.

## Philosophy

> We'll always recommend the experience we'd choose ourselves.  
> Sometimes that's one of our carefully selected Editor's Choice excursions.  
> Sometimes it's a free self-guided experience.  
> Our goal is to help you enjoy the best possible day ashore.

This is not a competing badge. **Editor's Choice** (`editorChoice` + `EditorsChoiceBadge`) stays exactly as it is.

## Naming

| Layer | Value |
|-------|--------|
| Customer-facing | **Walk It Yourself** |
| Guide slug / URL | `/guides/explore-independently` |
| Day Ashore / Choose Your Day | Link to that guide with Walk It Yourself labels |

Do **not** create a parallel `/walk-it-yourself` route.

## How to enable for a destination

1. Add or enrich the guide in `src/data/experiences.ts` with `slug: "explore-independently"`.
2. Set `title: "Walk It Yourself"` (customer-facing).
3. Add optional `independentWalk: { … }` for the rich route layout (stops, don’t miss, cafés, tips, back-to-ship, soft Editor’s Choice link).
4. Point Your Day Ashore / Choose Your Day / Experience Cards / Honest Advice at `/guides/explore-independently`.
5. Omit Walk It Yourself cards and Day Ashore items when independence is **not** the honest advice for that port.

## Files

| Layer | Path |
|-------|------|
| Path constants | `src/data/explore-independently.ts` |
| Guide content | `src/data/experiences.ts` → `independentWalk` |
| Types | `src/data/types.ts` → `IndependentWalkContent` |
| Guide shell | `src/components/GuideArticle.tsx` |
| Walk sections | `src/components/IndependentWalkSections.tsx` |
| Editorial Promise | `src/components/EditorialPromise.tsx` + `editorialPromise` in `editorial.ts` |
| Navigation | Your Day Ashore, Choose Your Day, Experience Cards (existing) |

## Clone checklist

1. Only publish rich `independentWalk` when the historic centre is close, safe, and rewarding on foot.  
2. Point `exploreFurther` at a real Editor's Choice excursion.  
3. Keep Editor's Choice badge usage unchanged on products.  
4. Surface Walk It Yourself through existing homepage navigation — do not invent a second subsystem.

## Flagship

**Tallinn** — full Old Town `independentWalk` on `/guides/explore-independently`.
