import type { EditorialCategory } from "./types";
import { SIGNATURE_EXPERIENCE_PATH } from "./signature-experience";
import { EXPLORE_INDEPENDENTLY_PATH } from "./explore-independently";

/**
 * Shared Editorial Promise — destination may override copy in this module.
 * Tone: editorial trust, never a sales pitch. Editor's Choice badge stays separate.
 */
export const editorialPromise = {
  eyebrow: "Our editorial promise",
  title: "We'll always recommend the experience we'd choose ourselves",
  lead: "We'll always recommend the experience we'd choose ourselves.",
  points: [
    "Sometimes that's one of our carefully selected Editor's Choice excursions.",
    "Sometimes it's a free self-guided experience.",
  ],
  closing: "Our goal is to help you enjoy the best possible day ashore.",
} as const;

export interface EditorialCategoryDef {
  id: EditorialCategory;
  label: string;
  shortLabel: string;
  description: string;
}

export const EDITORIAL_CATEGORIES: EditorialCategoryDef[] = [
  {
    id: "editors-choice",
    label: "Editor's Choice",
    shortLabel: "Editor's Choice",
    description:
      "Our strongest overall choice for a well-timed Zakynthos cruise day — Panoramic Island Views by 4x4 when hours allow.",
  },
  {
    id: "best-historic",
    label: "Best Historic Experience",
    shortLabel: "Historic",
    description: "Solomos Square, St Mark’s Square and the civic heart of Zakynthos Town.",
  },
  {
    id: "best-independent",
    label: "Best Independent Experience",
    shortLabel: "Walk It Yourself",
    description:
      "A realistic self-guided Zakynthos Town harbour day within easy reach of the ship — when independence is genuinely best.",
  },
  {
    id: "best-coastal",
    label: "Best Coastal Experience",
    shortLabel: "Coastal",
    description: "Blue Caves, dramatic cliffs and Navagio viewpoints when coastline is the priority.",
  },
  {
    id: "best-view",
    label: "Best Views",
    shortLabel: "Views",
    description: "Turquoise Ionian light, harbour frames and west-coast cliff panoramas.",
  },
  {
    id: "best-got",
    label: "Signature Experience",
    shortLabel: "Signature",
    description: "Our future Zakynthos small-group flagship, currently in preparation.",
  },
  {
    id: "best-families",
    label: "Best for Families",
    shortLabel: "Families",
    description: "Harbour walks and manageable town circuits with sensible pacing.",
  },
  {
    id: "best-photography",
    label: "Best Photography",
    shortLabel: "Photography",
    description: "Blue Caves light, Navagio viewpoints and olive-grove ridges.",
  },
  {
    id: "best-food",
    label: "Best Food & Wine",
    shortLabel: "Food & Wine",
    description: "Ionian cuisine, harbour cafés and olive-oil flavours in Zakynthos Town.",
  },
  {
    id: "best-luxury",
    label: "Best Private Tour",
    shortLabel: "Private",
    description: "Dedicated transport and flexible pacing for your own party.",
  },
  {
    id: "hidden-gem",
    label: "Hidden Gem",
    shortLabel: "Hidden Gem",
    description: "Quiet olive-grove villages and inland lanes beyond the postcard coves.",
  },
  {
    id: "best-value",
    label: "Best Value",
    shortLabel: "Best Value",
    description: "A rewarding port day without unnecessary transfers or expense.",
  },
  {
    id: "best-short-port",
    label: "Best Short Port Call",
    shortLabel: "Short Port",
    description: "Zakynthos Town harbour and squares when usable hours cannot support boat or 4x4 days.",
  },
];

export interface EditorsCollectionItem {
  id: string;
  emoji: string;
  label: string;
  description: string;
  href: string;
  cta: string;
  signature?: boolean;
  comingSoon?: boolean;
}

export const editorsCollectionItems: EditorsCollectionItem[] = [
  {
    id: "editors-choice",
    emoji: "⭐",
    label: "Editor's Choice",
    description:
      "Panoramic Island Views by 4x4 — the strongest island-interior day from Zakynthos when your call can support the journey.",
    href: "/shore-excursions/panoramic-island-views-4x4",
    cta: "View our top pick",
  },
  {
    id: "independent",
    emoji: "🚶",
    label: "Walk It Yourself",
    description:
      "Zakynthos Town on foot — Solomos Square, harbour promenade, cafés and shopping streets with a generous ship buffer.",
    href: EXPLORE_INDEPENDENTLY_PATH,
    cta: "Open the walking guide",
  },
  {
    id: "coastal",
    emoji: "🚤",
    label: "Best Coastal Day",
    description:
      "Blue Caves and dramatic cliffs — luminous sea caves when coastline is your priority.",
    href: "/guides/blue-caves-guide",
    cta: "Explore the Blue Caves",
  },
  {
    id: "navagio",
    emoji: "📸",
    label: "Best Navagio View",
    description:
      "Honest guidance on seeing Shipwreck Beach from viewpoints or the water — without promising beach landings.",
    href: "/guides/navagio-guide",
    cta: "Read the Navagio guide",
  },
  {
    id: "wildlife",
    emoji: "🐢",
    label: "Best Wildlife",
    description:
      "Caretta caretta loggerhead turtles — how to appreciate Zakynthos’s nesting shores with care.",
    href: "/guides/loggerhead-turtle-guide",
    cta: "Read the turtle guide",
  },
  {
    id: "food-wine",
    emoji: "🍽️",
    label: "Best Food & Harbour Life",
    description:
      "Ionian cuisine and waterfront cafés — start with our Food Guide before you sit down.",
    href: "/guides/food-guide",
    cta: "Taste Zakynthos",
  },
  {
    id: "photography",
    emoji: "📸",
    label: "Best Photography",
    description:
      "Turquoise Ionian light, cliff frames and harbour compositions around Zakynthos.",
    href: "/guides/best-viewpoints",
    cta: "Find the views",
  },
  {
    id: "families",
    emoji: "👨‍👩‍👧",
    label: "Best for Families",
    description:
      "Harbour walks keep distances manageable and leave room for ice cream on the promenade.",
    href: "/guides/explore-independently",
    cta: "See the walking guide",
  },
  {
    id: "signature-experience",
    emoji: "✨",
    label: "Signature Experience",
    description:
      "A future maximum-eight-guest Zakynthos day, currently in preparation and not bookable.",
    href: SIGNATURE_EXPERIENCE_PATH,
    cta: "Preview the concept",
    signature: true,
    comingSoon: true,
  },
];

export function getEditorialLabel(id: EditorialCategory): string {
  return EDITORIAL_CATEGORIES.find((category) => category.id === id)?.label ?? id;
}
