import type { Comparison } from "./types";

export const comparisons: Comparison[] = [
  {
    slug: "tour-or-independent",
    title: "Tour or Independent?",
    seoTitle: "Zakynthos Tour or Independent? Honest Cruise Advice",
    metaDescription:
      "Should you book a Zakynthos shore excursion or explore the town independently? Honest comparison for cruise passengers — town, Blue Caves and island interior.",
    kind: "versus",
    optionA: "Independent",
    optionB: "Guided tour",
    summary:
      "Zakynthos Town is one of the Ionian’s easier cruise ports to enjoy on foot. Independence wins for flexible harbour, Solomos Square and café days; a guided tour wins for Blue Caves boat circuits, Navagio viewpoints from the water and especially the Editor’s Choice island 4x4 day within limited hours.",
    verdict:
      "Choose independence when Zakynthos Town itself is your priority and you enjoy self-paced walking. Choose a tour when you want coastal caves, shipwreck viewpoints from the water or olive-grove panoramas with cruise-aware return.",
    overview: [
      "Many guests walk from passenger access into the harbour promenade and Solomos Square without an organised excursion.",
      "Guided coastal boat days add Blue Caves and cliff drama while still protecting ship timing.",
      "Island interior 4x4 circuits need organised transport and a fuller usable window ashore.",
    ],
    comparisonTable: [
      { category: "Best for", optionA: "Flexible harbour & cafés", optionB: "Blue Caves, Navagio views or island 4x4" },
      { category: "Cost", optionA: "Lower", optionB: "Higher" },
      { category: "Walking", optionA: "Self-paced town & promenade", optionB: "Guided pace on boat decks or village stops" },
      { category: "Return timing", optionA: "Your responsibility", optionB: "Cruise-aware operator planning" },
      { category: "Beyond the town", optionA: "Harder without transport", optionB: "Practical with organised routing" },
    ],
    faqs: [
      {
        question: "Can I explore Zakynthos without an excursion?",
        answer:
          "Yes. Independent town days along the harbour are common and often excellent — Solomos Square, cafés and a relaxed Ionian atmosphere.",
      },
      {
        question: "When is a tour clearly better?",
        answer:
          "When you want Blue Caves, Navagio viewpoints from the water, island interior villages or simply prefer guided logistics within a single cruise call.",
      },
    ],
    relatedSlugs: ["first-time-zakynthos-day", "best-shore-excursions", "boat-or-zakynthos-town"],
    imageKey: "compare",
  },
  {
    slug: "best-shore-excursions",
    title: "Best Shore Excursions",
    seoTitle: "Best Zakynthos Shore Excursions for Cruise Passengers",
    metaDescription:
      "Best Zakynthos shore excursions compared: Editor's Choice island 4x4, Blue Caves coastline, Navagio viewpoints and independent town walking.",
    kind: "guide",
    summary:
      "Start with Panoramic Island Views by 4x4 for first-timers who want olive-grove villages and panoramic Ionian scenery when hours allow. Choose a coastal boat day when Blue Caves and Navagio viewpoints are the priority, and keep independence as a genuine alternative.",
    verdict:
      "Editor’s Choice remains the clearest organised catalogue first-time pick when your call supports a full island day. Match everything else to hours ashore and appetite for boat time versus harbour flexibility.",
    overview: [
      "Town experiences stay closer to the ship and protect timing.",
      "Coastal boat days and inland 4x4 circuits need honest clock management.",
    ],
    guideItems: [
      {
        name: "Panoramic Island Views of Zakynthos by 4x4",
        slug: "panoramic-island-views-4x4",
        href: "/shore-excursions/panoramic-island-views-4x4",
        reason: "Best organised introduction to the island interior — villages, olive groves and cruise-aware return.",
        topExcursion: "Panoramic Island Views of Zakynthos by 4x4",
        returnConfidence: "High with full-day window",
        walkingDifficulty: "Easy",
      },
      {
        name: "Walk It Yourself — Zakynthos Town",
        slug: "explore-independently",
        href: "/guides/explore-independently",
        reason: "Harbour promenade, Solomos Square and cafés without booking anything.",
        topExcursion: "Self-guided Zakynthos Town walk",
        returnConfidence: "Very high with a disciplined buffer",
        walkingDifficulty: "Easy",
      },
      {
        name: "Blue Caves coastal day",
        slug: "blue-caves-guide",
        href: "/guides/blue-caves-guide",
        reason: "Luminous sea caves and dramatic cliffs when coastline is the priority.",
        topExcursion: "Organised Blue Caves boat day",
        returnConfidence: "High on a solid call",
        walkingDifficulty: "Easy boat pacing",
      },
      {
        name: "Navagio viewpoints",
        slug: "navagio-guide",
        href: "/guides/navagio-guide",
        reason: "Famous shipwreck cove from viewpoints or the water — without assuming beach landings.",
        topExcursion: "Coastal boat / viewpoint day",
        returnConfidence: "High when organised",
        walkingDifficulty: "Easy to moderate",
      },
    ],
    faqs: [
      {
        question: "What is Editor's Choice?",
        answer:
          "Panoramic Island Views of Zakynthos by 4x4 — selected for cruise visitors who want the island’s scenic interior with ship-aware timing.",
      },
      {
        question: "What if I do not want a long island day?",
        answer:
          "Choose Walk It Yourself on the Zakynthos Town harbour, or a coastal boat day if Blue Caves are the priority. Those are excellent days, not consolation prizes.",
      },
    ],
    relatedSlugs: ["first-time-zakynthos-day", "tour-or-independent", "boat-or-island-4x4"],
    imageKey: "historic",
  },
  {
    slug: "first-time-zakynthos-day",
    title: "Best First-Time Zakynthos Day",
    seoTitle: "Best First-Time Zakynthos Cruise Day — Honest Picks",
    metaDescription:
      "Best first-time Zakynthos cruise day: Walk It Yourself, Blue Caves coastline, or Editor’s Choice island 4x4 — with honest timing advice.",
    kind: "guide",
    optionA: "Walk It Yourself",
    optionB: "Editor's Choice 4x4",
    summary:
      "Most first-timers should start by deciding whether coastline, town or island interior is the priority. Choose Walk It Yourself for harbour cafés; Blue Caves for coastal drama; Editor’s Choice 4x4 when olive-grove panoramas are the goal and hours allow.",
    verdict:
      "Default to Walk It Yourself plus harbour time on shorter calls. Upgrade to a coastal boat day or Editor’s Choice 4x4 when scenery beyond town clearly matters more than café lingering.",
    overview: [
      "Zakynthos rewards a clear primary story over a rushed checklist.",
      "Do not assume Navagio Beach landings are permitted.",
      "Protect a 60–90 minute return buffer whatever you choose.",
    ],
    guideItems: [
      {
        name: "Walk It Yourself",
        slug: "explore-independently",
        href: "/guides/explore-independently",
        reason: "Best default for a relaxed first harbour day.",
        topExcursion: "Self-guided Zakynthos Town walk",
        returnConfidence: "Very high",
        walkingDifficulty: "Easy",
      },
      {
        name: "Editor's Choice Island 4x4",
        slug: "panoramic-island-views-4x4",
        href: "/shore-excursions/panoramic-island-views-4x4",
        reason: "Strongest organised catalogue day for island interior character.",
        topExcursion: "Panoramic Island Views of Zakynthos by 4x4",
        returnConfidence: "High with full-day window",
        walkingDifficulty: "Easy",
      },
      {
        name: "Blue Caves Guide",
        slug: "blue-caves-guide",
        href: "/guides/blue-caves-guide",
        reason: "Best first coastal story when turquoise caves are the priority.",
        topExcursion: "Organised Blue Caves boat day",
        returnConfidence: "High",
        walkingDifficulty: "Easy boat pacing",
      },
      {
        name: "One Day in Zakynthos",
        slug: "one-day-in-zakynthos",
        href: "/guides/one-day-in-zakynthos",
        reason: "Planning framework for choosing among the three archetypes.",
        topExcursion: "Planning guide",
        returnConfidence: "N/A",
        walkingDifficulty: "N/A",
      },
    ],
    faqs: [
      {
        question: "What should first-timers do?",
        answer:
          "If you want relaxed Ionian harbour life, walk Zakynthos Town. If you want famous coastline, plan a Blue Caves / Navagio viewpoints boat day. If you want olive-grove panoramas, choose Editor’s Choice 4x4 when hours allow.",
      },
    ],
    relatedSlugs: ["tour-or-independent", "best-shore-excursions", "one-day-in-zakynthos"],
    imageKey: "walking",
  },
  {
    slug: "boat-or-island-4x4",
    title: "Boat Day or Island 4x4?",
    seoTitle: "Zakynthos Blue Caves Boat Day or Island 4x4?",
    metaDescription:
      "Blue Caves boat day or Editor's Choice island 4x4 on a Zakynthos cruise call? Honest comparison of coastline versus olive-grove panoramas.",
    kind: "versus",
    optionA: "Coastal boat day",
    optionB: "Island 4x4",
    summary:
      "A coastal boat day delivers Blue Caves light and Navagio viewpoints from the water. The Editor’s Choice 4x4 delivers olive groves, villages and inland Ionian panoramas. Both are excellent — they are different islands.",
    verdict:
      "Choose the boat when coastline is your non-negotiable. Choose the 4x4 when you want the Emerald Jewel’s interior character and a traditional lunch circuit.",
    overview: [
      "Boat days are weather-dependent and queue-sensitive at embarkation.",
      "4x4 days trade sea caves for mountain tracks and village tastings.",
      "Neither replaces a relaxed Zakynthos Town walk if that is what you actually want.",
    ],
    comparisonTable: [
      { category: "Best for", optionA: "Blue Caves & cliff drama", optionB: "Villages & olive-grove panoramas" },
      { category: "Signature sights", optionA: "Sea caves / Navagio from water", optionB: "Interior ridges & tastings" },
      { category: "Format", optionA: "Boat", optionB: "Premium Land Rover" },
      { category: "Weather risk", optionA: "Higher (sea state)", optionB: "Lower inland, still variable" },
      { category: "Editor's Choice?", optionA: "Thematic coastal match", optionB: "Current catalogue Editor's Choice" },
    ],
    faqs: [
      {
        question: "Which is Editor's Choice?",
        answer:
          "Panoramic Island Views by 4x4 is Editor’s Choice in the current Shore Excursions Group catalogue. A coastal boat day can still be the better personal choice when coastline is your priority.",
      },
      {
        question: "Can I do both?",
        answer:
          "Rarely deeply on a standard call. Prioritise one primary story and protect your return buffer.",
      },
    ],
    relatedSlugs: ["boat-or-zakynthos-town", "best-shore-excursions", "first-time-zakynthos-day"],
    imageKey: "blue-caves",
  },
  {
    slug: "boat-or-zakynthos-town",
    title: "Boat Day or Zakynthos Town?",
    seoTitle: "Zakynthos Boat Day or Town Walk?",
    metaDescription:
      "Organised Blue Caves boat day or independent Zakynthos Town walk? Honest cruise comparison for harbour cafés versus coastal drama.",
    kind: "versus",
    optionA: "Zakynthos Town",
    optionB: "Coastal boat day",
    summary:
      "Zakynthos Town offers Solomos Square, harbour cafés and a free self-guided day. A coastal boat day offers Blue Caves and dramatic cliffs — usually the better match when famous coastline is the priority.",
    verdict:
      "Choose the town when you want a relaxed, flexible Ionian harbour day. Choose the boat when turquoise caves and cliff drama are why you came.",
    overview: [
      "Independence is excellent in Zakynthos Town for many cruise calls.",
      "Coastal drama cannot be invented on foot from Solomos Square.",
      "Navagio Beach landings should not be assumed on either plan.",
    ],
    comparisonTable: [
      { category: "Best for", optionA: "Cafés & harbour atmosphere", optionB: "Blue Caves & cliff scenery" },
      { category: "Cost", optionA: "Lower", optionB: "Higher" },
      { category: "Effort", optionA: "Easy town walking", optionB: "Boat pacing + embarkation" },
      { category: "Return timing", optionA: "Your buffer", optionB: "Cruise-aware operator planning" },
      { category: "Flexibility", optionA: "High", optionB: "Lower once embarked" },
    ],
    faqs: [
      {
        question: "Do I need a boat trip?",
        answer:
          "Only if coastline is your priority. Many passengers have an excellent day without leaving Zakynthos Town.",
      },
      {
        question: "What about Navagio Beach?",
        answer:
          "Plan for viewpoints or water perspectives. Do not promise yourself a beach landing unless authorities have reopened access for your dates.",
      },
    ],
    relatedSlugs: ["tour-or-independent", "boat-or-island-4x4", "first-time-zakynthos-day"],
    imageKey: "blue-caves",
  },
  {
    slug: "private-tour-vs-small-group",
    title: "Private Tour vs Small Group",
    seoTitle: "Private vs Small-Group Zakynthos Shore Excursions",
    metaDescription:
      "Private or small-group shore excursion in Zakynthos? Compare pacing, cost and cruise-day fit for island and coastal plans.",
    kind: "versus",
    optionA: "Small group",
    optionB: "Private",
    summary:
      "Small-group days such as the Editor’s Choice 4x4 balance cost and companionship. Private days add pacing control for families, celebrations or guests who want a tailored coastal or inland circuit.",
    verdict:
      "Choose small group when the published itinerary already matches your interests. Choose private when timing, mobility or party preferences need a bespoke day.",
    overview: [
      "Editor’s Choice currently publishes as a small-group Land Rover format.",
      "Private enquiries remain useful when your party wants different pacing.",
      "Independence remains free and excellent for Zakynthos Town itself.",
    ],
    comparisonTable: [
      { category: "Best for", optionA: "Shared scenic days", optionB: "Tailored pacing" },
      { category: "Cost per guest", optionA: "Usually lower", optionB: "Usually higher" },
      { category: "Flexibility", optionA: "Fixed circuit", optionB: "High" },
      { category: "Social", optionA: "Meet other travellers", optionB: "Your party only" },
      { category: "Booking", optionA: "Catalogue product", optionB: "Often enquiry-led" },
    ],
    faqs: [
      {
        question: "Is Editor's Choice private?",
        answer:
          "The current Editor’s Choice is a small-group 4x4 day. Ask about private alternatives if your party needs dedicated pacing.",
      },
    ],
    relatedSlugs: ["best-shore-excursions", "tour-or-independent"],
    imageKey: "private",
  },
  {
    slug: "one-day-in-zakynthos",
    title: "One Day in Zakynthos",
    seoTitle: "One Day in Zakynthos — Tour Comparison for Cruise Visitors",
    metaDescription:
      "Compare ways to spend one cruise day in Zakynthos — town walk, Blue Caves boat day and Editor's Choice island 4x4 with honest timing advice.",
    kind: "guide",
    summary:
      "One day ashore works best with a single primary story: Walk It Yourself in town, a coastal boat circuit, or Editor’s Choice inland panoramas.",
    verdict:
      "Pick one archetype and protect your buffer. Depth beats a exhausted checklist on Zakynthos.",
    overview: [
      "Town days maximise café flexibility.",
      "Boat days maximise coastal drama.",
      "4x4 days maximise interior character.",
    ],
    guideItems: [
      {
        name: "Walk It Yourself",
        slug: "explore-independently",
        href: "/guides/explore-independently",
        reason: "Best relaxed harbour day.",
        topExcursion: "Self-guided Zakynthos Town walk",
        returnConfidence: "Very high",
        walkingDifficulty: "Easy",
      },
      {
        name: "One Day planning guide",
        slug: "one-day-in-zakynthos",
        href: "/guides/one-day-in-zakynthos",
        reason: "Editorial framework for choosing among the three stories.",
        topExcursion: "Planning guide",
        returnConfidence: "N/A",
        walkingDifficulty: "N/A",
      },
      {
        name: "Food Guide",
        slug: "food-guide",
        href: "/guides/food-guide",
        reason: "Ionian cuisine and harbour cafés to anchor a town day.",
        topExcursion: "Food guide",
        returnConfidence: "N/A",
        walkingDifficulty: "Easy",
      },
      {
        name: "Editor's Choice 4x4",
        slug: "panoramic-island-views-4x4",
        href: "/shore-excursions/panoramic-island-views-4x4",
        reason: "Best organised full-day interior circuit.",
        topExcursion: "Panoramic Island Views of Zakynthos by 4x4",
        returnConfidence: "High with full-day window",
        walkingDifficulty: "Easy",
      },
    ],
    faqs: [
      {
        question: "Where should I start?",
        answer:
          "Read One Day in Zakynthos and Walk It Yourself, then decide whether coastline or interior is worth leaving the harbour.",
      },
    ],
    relatedSlugs: ["first-time-zakynthos-day", "tour-or-independent", "best-shore-excursions"],
    imageKey: "walking",
  },
];

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export function getComparisonDisplayTitle(c: Comparison): string {
  if (c.kind === "versus" && c.optionA && c.optionB) {
    return `${c.optionA} or ${c.optionB}?`;
  }
  return c.title;
}

export function getAllComparisonSlugs(): string[] {
  return comparisons.map((c) => c.slug);
}
