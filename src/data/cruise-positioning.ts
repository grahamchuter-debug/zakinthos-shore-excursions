/**
 * Central cruise-positioning + Your Day Ashore experience categories.
 * Reusable World 2.0 pattern — destination copy lives here; component stays generic.
 */
export const cruisePositioning = {
  enabled: true,
  eyebrow: "Designed for Cruise Passengers",
  message: "Helping cruise passengers make every hour ashore count.",
  variantBMessage: "Everything here is built around your time in port.",
  activeVariant: "A" as "A" | "B",
  showDayAshoreSection: true,
} as const;

export function getCruiseTrustMessage(): string {
  if (cruisePositioning.activeVariant === "B") {
    return cruisePositioning.variantBMessage;
  }
  return cruisePositioning.message;
}

export interface DayAshoreItem {
  id: string;
  title: string;
  body: string;
  href?: string;
  icon: "clock" | "route" | "walk" | "sunrise" | "viewpoint" | "food" | "family" | "luxury";
}

export const dayAshoreIntro =
  "Where will your day in Zakynthos take you? Choose the experience that fits your hours ashore — then build everything around your ship’s schedule.";

export const dayAshoreItems: DayAshoreItem[] = [
  {
    id: "editors-choice",
    title: "Editor's Choice",
    body: "Panoramic Island Views by 4x4 — olive groves, villages and Ionian panoramas when you want the island beyond the harbour.",
    href: "/shore-excursions/panoramic-island-views-4x4",
    icon: "luxury",
  },
  {
    id: "walk-it-yourself",
    title: "Walk It Yourself",
    body: "A self-guided Zakynthos Town loop — Solomos Square, harbour promenade and café life at your own pace.",
    href: "/guides/explore-independently",
    icon: "walk",
  },
  {
    id: "blue-caves",
    title: "Blue Caves",
    body: "Luminous sea caves and dramatic limestone cliffs — best experienced on an organised coastal boat day.",
    href: "/guides/blue-caves-guide",
    icon: "sunrise",
  },
  {
    id: "wildlife",
    title: "Wildlife",
    body: "Caretta caretta loggerhead turtles — how to appreciate Zakynthos’s nesting shores with care and realism.",
    href: "/guides/loggerhead-turtle-guide",
    icon: "route",
  },
  {
    id: "photography",
    title: "Photography",
    body: "Turquoise water, cliff light, harbour frames and Navagio viewpoints when access and timing allow.",
    href: "/guides/best-viewpoints",
    icon: "viewpoint",
  },
  {
    id: "food",
    title: "Food",
    body: "Ionian cuisine, harbour cafés and olive-oil flavours — the everyday table of Zakynthos Town.",
    href: "/guides/food-guide",
    icon: "food",
  },
  {
    id: "families",
    title: "Families",
    body: "Town walks, gentle harbour time and carefully paced island days when travelling with children.",
    href: "/guides/explore-independently",
    icon: "family",
  },
];
