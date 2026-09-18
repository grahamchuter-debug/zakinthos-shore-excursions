export interface SiteImage {
  src: string;
  alt: string;
  base: string;
}

const B = "/images";

function img(base: string, alt: string): SiteImage {
  return { base, src: `${B}/${base}.jpg`, alt };
}

export const siteImages = {
  hero: img(
    "hero",
    "Turquoise Ionian coastline and cliffs of Zakynthos — the Emerald Jewel of the Ionian",
  ),
  ogDefault: img(
    "og-default",
    "Zakynthos shore excursions — Navagio, Blue Caves and Ionian island days",
  ),
  logo: {
    base: "logo-mark",
    src: `${B}/logo-mark.svg`,
    alt: "Zakynthos Shore Excursions",
  },
  port: img("cruise-port", "Zakynthos cruise port near the harbour town"),
} as const;

export const subjectImages: Record<string, SiteImage> = {
  historic: img("historic", "Historic streets and civic character in Zakynthos Town"),
  coast: img("coast", "Coastal scenery on the Ionian Sea near Zakynthos"),
  coastal: img("coastal", "Coastal light along the Zakynthos shoreline"),
  walking: img("walking", "Walking Zakynthos Town from the cruise port"),
  food: img("food", "Ionian cuisine and harbour dining in Zakynthos"),
  "food-and-wine": img("food-and-wine", "Olive oil, wine and Greek dining culture in Zakynthos"),
  private: img("private", "Private shore excursion day from Zakynthos"),
  photography: img("photography", "Photography viewpoints across Zakynthos"),
  wine: img("wine", "Wine tasting and island cellar culture"),
  compare: img("compare", "Comparing Zakynthos shore excursion options"),
  port: img("cruise-port", "Zakynthos cruise port terminal"),
  nature: img("nature", "Natural scenery and olive landscapes of Zakynthos"),
  family: img("family", "Family-friendly day ashore in Zakynthos"),
  highlights: img("hero", "Zakynthos coastal and island highlights"),
  city: img("zakynthos-town", "Zakynthos Town harbour and civic centre"),
  "hero-home": img("hero-home", "Emerald Jewel of the Ionian — Zakynthos coastline"),
  navagio: img("navagio", "Navagio Shipwreck Beach cove from an approved viewpoint"),
  shipwreck: img("shipwreck", "Famous shipwreck cove of Navagio on Zakynthos"),
  "blue-caves": img("blue-caves", "Blue Caves arches and turquoise Ionian water"),
  turtles: img("turtles", "Caretta caretta loggerhead turtle context on Zakynthos"),
  "zakynthos-town": img("zakynthos-town", "Zakynthos Town harbour promenade"),
  harbour: img("harbour", "Zakynthos harbour cafés and waterfront life"),
  "island-4x4": img("island-4x4", "Panoramic island 4x4 adventure on Zakynthos"),
  "olive-groves": img("olive-groves", "Olive groves and inland scenery of Zakynthos"),
  ionian: img("ionian", "Turquoise Ionian Sea off Zakynthos"),
  "ionian-cuisine": img("ionian-cuisine", "Ionian cuisine and olive-oil flavours"),
  cliffs: img("cliffs", "Dramatic limestone cliffs of Zakynthos"),
  promenade: img("promenade", "Harbour promenade stroll in Zakynthos Town"),
  solomos: img("solomos", "Solomos Square in Zakynthos Town"),
  viewpoints: img("viewpoints", "Best viewpoints around Zakynthos"),
  waterfront: img("waterfront", "Zakynthos harbour and waterfront cafés"),
};

function pick(key: string): SiteImage {
  return subjectImages[key] ?? siteImages.ogDefault;
}

const excursionImageKeys: Record<string, string> = {
  "panoramic-island-views-4x4": "island-4x4",
};

export function getExcursionImage(slug: string): SiteImage {
  return pick(excursionImageKeys[slug] ?? "highlights");
}

export const excursionsHubImage = pick("ionian");

const highlightImageKeys: Record<string, string> = {
  "zakynthos-town": "zakynthos-town",
  "solomos-square": "solomos",
  navagio: "navagio",
  "blue-caves": "blue-caves",
  turtles: "turtles",
  "olive-groves": "olive-groves",
  harbour: "harbour",
  ionian: "ionian",
  "ionian-sea": "ionian",
};

const comparisonImageKeys: Record<string, string> = {
  "tour-or-independent": "compare",
  "best-shore-excursions": "highlights",
  "first-time-zakynthos-day": "walking",
  "boat-or-island-4x4": "blue-caves",
  "boat-or-zakynthos-town": "blue-caves",
  "private-tour-vs-small-group": "private",
  "one-day-in-zakynthos": "walking",
};

export function getComparisonImage(slug: string): SiteImage {
  return pick(comparisonImageKeys[slug] ?? "compare");
}

export function getHighlightImage(slug: string): SiteImage {
  return pick(highlightImageKeys[slug] ?? "highlights");
}

export function getExperienceImage(slug: string): SiteImage {
  return pick(slug);
}

export const guidesHubImage = pick("highlights");

const guideImageKeys: Record<string, string> = {
  historic: "historic",
  walking: "walking",
  compare: "compare",
  port: "port",
  "cruise-port": "port",
  food: "food",
  "food-and-wine": "food-and-wine",
  private: "private",
  coast: "coast",
  coastal: "coastal",
  nature: "nature",
  photography: "photography",
  navagio: "navagio",
  shipwreck: "shipwreck",
  "blue-caves": "blue-caves",
  turtles: "turtles",
  "zakynthos-town": "zakynthos-town",
  harbour: "harbour",
  "island-4x4": "island-4x4",
  "olive-groves": "olive-groves",
  ionian: "ionian",
  cliffs: "cliffs",
  promenade: "promenade",
  solomos: "solomos",
  viewpoints: "viewpoints",
  waterfront: "waterfront",
  wine: "wine",
};

export function getGuideImage(imageKey: string): SiteImage {
  return pick(guideImageKeys[imageKey] ?? imageKey);
}

export function getHotelImage(_slug?: string): SiteImage {
  return pick("city");
}

export function getTransferImage(_slug?: string): SiteImage {
  return pick("private");
}
