import type { ExperienceCard, FAQ, VisitorType } from "./types";

export const homepageTagline = "The Emerald Jewel of the Ionian.";

export const homepageSubheading =
  "Zakynthos offers three unforgettable cruise experiences: discover the dramatic coastline by boat, explore villages and natural scenery inland, or enjoy a relaxed day around Zakynthos Town and the waterfront. Neither path is “correct” — only the one that matches your hours ashore.";

export const homepageDestinationLine =
  "Navagio · Blue Caves · Caretta Caretta · Zakynthos Town · Olive Groves · Ionian Sea";

export const visitorTypes: VisitorType[] = [
  {
    id: "port-day",
    label: "I'm visiting Zakynthos for the day on a cruise",
    shortLabel: "Port day",
    description:
      "Match your hours ashore to a town walk, a coastal boat day, or our Editor’s Choice island 4x4 adventure.",
    href: "/shore-excursions",
    cta: "Plan my port day",
  },
  {
    id: "first-time",
    label: "It's my first time in the Ionian Islands",
    shortLabel: "First visit",
    description:
      "Compare independent Zakynthos Town, Blue Caves coastline and Editor’s Choice island highlights before you choose.",
    href: "/compare/first-time-zakynthos-day",
    cta: "See first-time picks",
  },
  {
    id: "independent",
    label: "I prefer to explore independently",
    shortLabel: "Independent",
    description:
      "Zakynthos Town is one of the Ionian’s easier ports to enjoy on foot — harbour, squares and cafés without a tour.",
    href: "/guides/explore-independently",
    cta: "Walk It Yourself",
  },
  {
    id: "planner",
    label: "I want help choosing my day",
    shortLabel: "Cruise planner",
    description:
      "Tell us your port times, interests, mobility and pace for a tailored Ionian plan from Zakynthos.",
    href: "/cruise-planner",
    cta: "Use the planner",
  },
];

export interface HomeSection {
  slug: string;
  number: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export const coreSections: HomeSection[] = [
  {
    slug: "excursions",
    number: "01",
    title: "Shore excursions",
    description:
      "Carefully selected experiences across island panoramas, coastal wonders and harbour life — designed around cruise timing.",
    href: "/shore-excursions",
    cta: "Browse excursions",
  },
  {
    slug: "guides",
    number: "02",
    title: "Port & island guides",
    description:
      "Honest advice on walking from the cruise port, Navagio restrictions, Blue Caves, loggerhead turtles and when an organised tour genuinely helps.",
    href: "/guides",
    cta: "Read the guides",
  },
  {
    slug: "schedules",
    number: "03",
    title: "Cruise ship schedule",
    description:
      "Ship call data for Zakynthos will appear here once confirmed schedules are available for publication.",
    href: "/ship-schedules",
    cta: "View schedules",
  },
];

export const spiritOfPlace = {
  title: "Turquoise Ionian light — cliffs, coves, turtles and olive-green hills.",
  body: [
    "Zakynthos opens onto the Ionian Sea like a jewel set in turquoise. Limestone cliffs fall into luminous water; olive groves climb inland ridges; and on the west coast the world-famous Navagio cove holds its shipwreck story beneath pale cliffs — a scene best admired from approved viewpoints or from the water, with beach access subject to current safety restrictions. Nearby, the Blue Caves glow with refracted light, while loggerhead turtles (Caretta caretta) still nest on protected southern shores.",
    "This is Greece at its most coastal and cinematic — adventurous enough for a boat day among arches and cliffs, relaxed enough for harbour cafés in Zakynthos Town, luxurious in its sense of place rather than in showiness. We write like a premium travel magazine for cruise passengers — fewer recommendations, clearer trade-offs, and always a plan that protects your return to the ship.",
  ],
};

export const honestAdvicePoints = [
  {
    title: "The coastline rewards an organised boat day",
    body: "If your priority is Zakynthos’s famous coastline — Blue Caves, dramatic cliffs and Navagio viewpoints — a guided excursion or organised boat trip usually offers the best overall experience.",
  },
  {
    title: "The town rewards a relaxed walk",
    body: "If you prefer an easy day, Zakynthos Town is pleasant to explore independently — Solomos Square, harbour views, cafés and local shops within a sensible return buffer.",
  },
  {
    title: "Navagio Beach access is restricted",
    body: "Access onto Navagio (Shipwreck) Beach itself is subject to current safety restrictions. Expect to admire the famous cove from approved viewpoints or from the water rather than walking onto the beach unless local authorities reopen access. Do not plan a day around a guaranteed beach landing.",
  },
];

export function getHomepageFaqs(): FAQ[] {
  return [
    {
      question: "Can I explore Zakynthos without an excursion?",
      answer:
        "Yes. Zakynthos Town is pleasant to explore independently and offers an enjoyable day of walking, cafés, harbour views and local shops. Many cruise passengers stroll from the port toward Solomos Square and the promenade and return with a sensible buffer. Organised excursions become especially useful when you want the Blue Caves, Navagio viewpoints from the water, or the island’s scenic interior beyond comfortable walking distance.",
    },
    {
      question: "How far is the centre from the cruise port?",
      answer:
        "Zakynthos Town’s harbour approaches and civic centre are typically a realistic stroll from many cruise berths or tender landings for most guests — often around 10–25 minutes depending on assignment, pace and route. Exact timing varies; follow port signage and allow extra time if mobility is limited.",
    },
    {
      question: "Should I book a tour?",
      answer:
        "Book a tour when discovering the dramatic coastline by boat or the island’s interior villages is your priority — or when you want cruise-aware timing for a full scenic day. Skip a tour when you prefer flexible wandering, harbour cafés and self-paced photography in Zakynthos Town.",
    },
    {
      question: "Can I walk onto Navagio Beach on a cruise day?",
      answer:
        "Do not assume so. Access to Navagio Beach itself has been subject to safety restrictions. Most cruise visitors should plan to admire the cove from approved viewpoints or from the water on an organised boat trip, not to land and walk on the sand, unless authorities have clearly reopened access for your sailing dates.",
    },
    {
      question: "What is your Editor's Choice excursion?",
      answer:
        "Panoramic Island Views of Zakynthos by 4x4 — the strongest overall organised cruise experience currently in our Shore Excursions Group catalogue, delivering olive-grove villages, panoramic Ionian views, tastings and a traditional lunch when you want the island beyond the harbour.",
    },
  ];
}

/** Primary decision grid — Experience Cards (not awards). */
export const featuredExperienceCards: ExperienceCard[] = [
  {
    slug: "editors-choice-island",
    type: "guided",
    title: "Island Highlights",
    eyebrow: "Editor's Choice",
    description:
      "Premium 4x4 day through olive groves and mountain villages — our strongest organised island experience when schedule allows.",
    href: "/shore-excursions/panoramic-island-views-4x4",
    cta: "View Editor's Choice",
    imageKey: "island-4x4",
  },
  {
    slug: "coastal-wonders",
    type: "nature",
    title: "Blue Caves & Dramatic Cliffs",
    eyebrow: "Coastal Wonders",
    description:
      "Luminous sea caves, limestone arches and turquoise Ionian water — the classic coastal day when coastline is your priority.",
    href: "/guides/blue-caves-guide",
    cta: "Explore the Blue Caves",
    imageKey: "blue-caves",
  },
  {
    slug: "wildlife-turtles",
    type: "nature",
    title: "Caretta Caretta Turtles",
    eyebrow: "Wildlife",
    description:
      "Zakynthos is one of the Mediterranean’s important loggerhead nesting islands — appreciate wildlife with care and realistic expectations.",
    href: "/guides/loggerhead-turtle-guide",
    cta: "Read the turtle guide",
    imageKey: "turtles",
  },
  {
    slug: "explore-independently",
    type: "walk-it-yourself",
    title: "Zakynthos Town",
    eyebrow: "Walk It Yourself",
    description:
      "A free self-guided route from the cruise port through Solomos Square, harbour promenade, cafés and shopping streets.",
    href: "/guides/explore-independently",
    cta: "Open the walking guide",
    imageKey: "walking",
    duration: "2–4 hours",
    distance: "Approximately 3–5 km",
    difficulty: "Easy",
    idealFor: "Independent cruise passengers",
  },
  {
    slug: "food-local-life",
    type: "food-wine",
    title: "Ionian cuisine, cafés and harbour life",
    eyebrow: "Food & Local Life",
    description:
      "Olive oil, seafood and waterfront cafés — the everyday flavours of Zakynthos Town beside the Ionian.",
    href: "/guides/food-guide",
    cta: "Explore food & harbour life",
    imageKey: "food",
  },
];

export const experienceCards: ExperienceCard[] = [
  ...featuredExperienceCards,
  {
    slug: "navagio",
    type: "nature",
    title: "Navagio Viewpoints",
    description:
      "The world-famous shipwreck cove — how to see it honestly from viewpoints or the water, without promising beach landings.",
    href: "/guides/navagio-guide",
    cta: "Read the Navagio guide",
    imageKey: "navagio",
  },
  {
    slug: "photography",
    type: "photography",
    title: "Photography",
    description:
      "Turquoise water, cliff light, harbour frames and olive-grove ridges when timing and access allow.",
    href: "/guides/best-viewpoints",
    cta: "Find viewpoints",
    imageKey: "photography",
  },
  {
    slug: "families",
    type: "families",
    title: "Families",
    description:
      "Manageable town walks, harbour time and carefully paced island days with children.",
    href: "/guides/explore-independently",
    cta: "Family-friendly days",
    imageKey: "family",
  },
  {
    slug: "private",
    type: "private",
    title: "Private Experiences",
    description:
      "Ask about private pacing for island circuits when your party wants a tailored Zakynthos day.",
    href: "/enquire",
    cta: "Enquire about private days",
    imageKey: "private",
  },
];

/** Homepage hero — destination copy (components stay generic). */
export const homepageHero = {
  eyebrow: "Zakynthos Shore Excursions",
  headline: homepageTagline,
  subheading: homepageSubheading,
  destinationLine: homepageDestinationLine,
  primaryCta: { href: "/shore-excursions", label: "Explore Shore Excursions" },
  secondaryCta: { href: "/guides/explore-independently", label: "Walk It Yourself" },
} as const;

export interface ChooseYourDayCard {
  slug: string;
  emoji: string;
  title: string;
  tagline: string;
  highlights: readonly string[];
  cta: string;
  href: string;
  imageKey: string;
  wide?: boolean;
}

export const chooseYourDay = {
  eyebrow: "Choose Your Day",
  title: "How would you like to experience Zakynthos?",
  subtitle:
    "Three excellent cruise experiences — explore Zakynthos Town independently, discover the Blue Caves coastline, or take our Editor’s Choice island adventure.",
  cards: [
    {
      slug: "explore-zakynthos-town",
      emoji: "🚶",
      title: "Explore Zakynthos Town",
      tagline:
        "Walk Solomos Square, the harbour promenade and café streets at your own pace — often the finest relaxed day ashore from this port.",
      highlights: [
        "Walkable harbour and civic centre from many berths",
        "Solomos Square and St Mark’s Square",
        "Harbour promenade and waterfront cafés",
        "Shopping streets and local atmosphere",
        "Honest return-to-ship buffers",
      ],
      cta: "Open Walk It Yourself",
      href: "/guides/explore-independently",
      imageKey: "walking",
      wide: true,
    },
    {
      slug: "discover-blue-caves",
      emoji: "🚤",
      title: "Discover the Blue Caves",
      tagline:
        "Leave the harbour for luminous sea caves, dramatic cliffs and turquoise Ionian water on a classic coastal day.",
      highlights: [
        "Blue Caves arches and refracted light",
        "Dramatic west-coast limestone cliffs",
        "Often combined with Navagio viewpoints from the water",
        "Best when coastline is the priority",
        "Clear trade-off versus a town walk or inland 4x4 day",
      ],
      cta: "Read the Blue Caves guide",
      href: "/guides/blue-caves-guide",
      imageKey: "blue-caves",
      wide: true,
    },
    {
      slug: "editors-choice-adventure",
      emoji: "⭐",
      title: "Editor's Choice Adventure",
      tagline:
        "Panoramic Island Views by 4x4 — our strongest overall organised cruise experience when you want Zakynthos beyond the harbour.",
      highlights: [
        "Premium Land Rover small-group format",
        "Olive groves, villages and panoramic ridges",
        "Olive oil and wine tasting",
        "Traditional Greek lunch included as stated",
        "Never required if the town walk or a boat day is enough",
      ],
      cta: "View Editor's Choice",
      href: "/shore-excursions/panoramic-island-views-4x4",
      imageKey: "island-4x4",
      wide: false,
    },
  ] as const satisfies readonly ChooseYourDayCard[],
};

export const honestAdviceContent = {
  eyebrow: "Honest advice",
  title: "Do You Need a Shore Excursion in Zakynthos?",
  subtitle:
    "Zakynthos offers three unforgettable cruise experiences. If your priority is the famous coastline, a guided excursion or organised boat trip usually offers the best overall experience. If you prefer a relaxed day, Zakynthos Town is pleasant to explore independently with cafés, harbour views and local shops. If you want olive-grove villages and panoramic interior scenery, our Editor’s Choice 4x4 day is the strongest organised option currently in catalogue. Choose what genuinely suits your interests. We never push excursions unnecessarily.",
  independent: {
    title: "You can explore Zakynthos Town independently — and many passengers should",
    body: "Zakynthos Town is pleasant to explore independently and offers an enjoyable day of walking, cafés, harbour views and local shops:",
    items: [
      "Solomos Square and the civic heart of town",
      "Harbour promenade and waterfront cafés",
      "St Mark’s Square and nearby streets",
      "Shopping lanes before a composed return to the ship",
    ],
    note: "Set a 60–90 minute return buffer and confirm your all-aboard time. The ship will not wait.",
  },
  organised: {
    title: "When a guided day is the better choice",
    body: "If your priority is discovering Zakynthos beyond a harbour stroll, organised excursions provide access that independent wandering cannot match in a single port call:",
    items: [
      {
        label: "Island Highlights by 4x4",
        detail:
          "Olive groves, villages and Ionian panoramas — our Editor’s Choice when the scenic interior is the priority",
      },
      {
        label: "Blue Caves & coastal cliffs",
        detail:
          "Luminous sea caves and dramatic limestone — best on an organised boat day when coastline comes first",
      },
      {
        label: "Navagio viewpoints",
        detail:
          "The famous shipwreck cove from approved viewpoints or the water — do not assume beach landings are permitted",
      },
      {
        label: "Wildlife context",
        detail:
          "Caretta caretta nesting shores — appreciate ethically, with realistic expectations for a cruise call",
      },
    ],
  },
  links: [
    { href: "/compare/tour-or-independent", label: "Tour or independent?" },
    { href: "/guides/explore-independently", label: "Walk It Yourself" },
    { href: "/guides/navagio-guide", label: "Navagio Guide" },
  ],
} as const;

export const featuredSectionCopy = {
  eyebrow: "When you're ready",
  title: "Featured shore excursions",
  subtitle:
    "Curated Zakynthos experiences planned around your cruise day. Live booking opens once EUR selling prices and fulfilment routes are verified.",
} as const;
