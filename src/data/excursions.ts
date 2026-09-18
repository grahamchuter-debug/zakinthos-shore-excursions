import type { ExcursionPage } from "./types";

const PORT_LOGISTICS =
  "Cruise ships calling at Zakynthos (Zante) typically berth or tender near Zakynthos Town, with passenger access oriented toward the harbour and civic centre. Solomos Square, the harbour promenade, cafés and much of the walkable town sit within a realistic stroll for many guests — exact times depend on berth or tender assignment, pace and crowds. The island’s dramatic west coast — Navagio viewpoints, Blue Caves and limestone cliffs — requires organised boat trips or guided transport; the interior olive-grove villages reward a scenic 4x4 day. Confirm your ship’s all-aboard time — not merely the published departure — and aim to be back at the terminal 60–90 minutes early. Longer island circuits need the larger end of that buffer.";

const SEG_SUPPLIER = {
  kind: "shore-excursions-group" as const,
  name: "Shore Excursions Group",
  notes:
    "Partner network — confirm availability for your sailing. Catalogue imported from shoreexcursionsgroup.com/port/zakinthos-shore-excursions.",
};

const RETURN_GUARANTEE =
  "Return to ship guarantee: itineraries are planned around your Zakynthos cruise call so you are back at the terminal with time before all-aboard. If an operational delay on our side causes you to miss the ship, we work with the local provider under the published return-to-ship assurance for that booking.";

export const excursions: ExcursionPage[] = [
  {
    slug: "panoramic-island-views-4x4",
    title: "Panoramic Island Views of Zakynthos by 4x4",
    seoTitle: "Zakynthos 4x4 Island Tour | Editor's Choice Shore Excursion",
    metaDescription:
      "Editor's Choice small-group 4x4 shore excursion on Zakynthos — mountain villages, olive groves, panoramic Ionian views, tastings and cruise-aware return.",
    category: "Editor's Choice",
    tagline:
      "The Emerald Jewel inland — premium Land Rovers, olive-grove villages and sweeping Ionian panoramas when you want the island beyond the harbour.",
    duration: "Approximately 7 hours",
    pace: "Relaxed",
    bestFor:
      "Cruise visitors who want Zakynthos’s interior character — villages, olive trees, viewpoints and a traditional lunch — without relying only on the town waterfront",
    overview:
      "Zakynthos is famous for turquoise coves, yet much of its soul lives inland: olive groves, quiet villages and ridge-line views over the Ionian. This small-group Editor’s Choice day travels in premium seven-seater Land Rovers with multilingual guides, tasting local olive oil and wine, pausing for photographs, and closing with a traditional Greek lunch before a cruise-aware return.",
    body: [
      "We chose this excursion because it is the strongest overall organised cruise experience currently available in the Shore Excursions Group Zakynthos catalogue — a coherent Best of / Island Highlights day that independent planning rarely matches within a single port call.",
      "It particularly suits first-time visitors who want more than a harbour stroll, and who prefer scenic mountain tracks and village atmosphere over a purely coastal boat circuit.",
      "Guests whose priority is Navagio viewpoints or the Blue Caves from the water may be happier on an organised boat day — and those who simply want cafés and the promenade can Walk It Yourself in Zakynthos Town. Both are genuinely excellent choices.",
      "Expect off-road stretches, light walking at village and monastery stops, tasting time, and a full-day format that needs a solid usable window ashore. Exact sequencing flexes with weather, group pace and ship timing.",
    ],
    highlights: [
      "Premium seven-seater Land Rover small-group format",
      "Off-road scenic routes toward Koiliomenos and Loucha",
      "Ancient olive tree at Exo Chora with olive oil and wine tasting",
      "Anafonitria and the Church of Agios Georgios Krimnon",
      "Monastery of Panagia Spiliotissa with guided context",
      "Traditional Greek lunch included as stated on your voucher",
      "Return planned around all-aboard",
    ],
    itinerary: [
      {
        title: "Meet at the Zakynthos cruise pier",
        detail:
          "Join your small group near the passenger area and confirm timing against your ship’s all-aboard.",
      },
      {
        title: "Off-road toward Koiliomenos and Loucha",
        detail:
          "Leave the harbour behind on exhilarating tracks into the island’s green interior, with photo stops that frame valleys and bays.",
      },
      {
        title: "Exo Chora olive tree and tastings",
        detail:
          "Pause at a storied ancient olive tree, then sample island olive oil and wine with time for a quiet coffee in village atmosphere.",
      },
      {
        title: "Anafonitria, Orthonies and Panagia Spiliotissa",
        detail:
          "Continue through historic villages to the Church of Agios Georgios Krimnon and the Monastery of Panagia Spiliotissa for panoramic views and cultural context.",
      },
      {
        title: "Traditional lunch and return",
        detail:
          "Enjoy a traditional Greek lunch before a relaxing return to the cruise pier with a planned buffer before all-aboard.",
      },
    ],
    included: [
      "Port meeting and return planning in Zakynthos",
      "Small-group round-trip 4x4 transport",
      "English-speaking multilingual guide commentary",
      "Olive oil and wine tasting as stated on your voucher",
      "Traditional Greek lunch as stated on your voucher",
      "Return planned around the ship’s all-aboard",
    ],
    notIncluded: [
      "Personal purchases and extra drinks",
      "Gratuities",
      "Hotel or airport transfers",
      "Optional museum or site fees unless stated on your voucher",
    ],
    portLogistics: PORT_LOGISTICS,
    tips: [
      "Wear comfortable flat shoes suitable for light village walking and uneven surfaces",
      "Bring sun protection — Ionian light is strong even on inland ridges",
      "If your priority is Navagio or the Blue Caves from the water, consider an organised boat day instead",
      "If you prefer cafés and harbour wandering, Walk It Yourself remains excellent",
      "Navagio Beach itself may be closed to landings — never assume you will walk onto the sand",
      RETURN_GUARANTEE,
    ],
    faqs: [
      {
        question: "Why is this Editor's Choice?",
        answer:
          "Among Zakynthos’s organised Shore Excursions Group options, this 4x4 island day currently delivers the strongest overall cruise experience: interior villages, olive-grove character, panoramic viewpoints, tastings and a traditional lunch in one coherent circuit. Coastal boat days for Navagio and the Blue Caves are superb when coastline is your priority — this is the day we choose when the island’s scenic heartland is the goal.",
      },
      {
        question: "Does this tour visit Navagio Beach or the Blue Caves?",
        answer:
          "This is an inland and ridge-line island experience focused on villages, olive groves and panoramas. For the famous west-coast caves and shipwreck cove from the water, an organised boat trip is usually the better match. Access onto Navagio Beach itself is also subject to safety restrictions — expect viewpoints or water perspectives rather than a guaranteed beach landing.",
      },
      {
        question: "Do I need this tour, or can I stay in Zakynthos Town?",
        answer:
          "You can — and many should — stay closer. Choose the 4x4 day when you want island interior scenery and guided village narrative; choose a boat day when coastline is the priority; choose independence when harbour cafés and a self-guided town walk are enough.",
      },
    ],
    relatedExcursionSlugs: [],
    featured: true,
    bookingStatus: "comingSoon",
    returnGuarantee: RETURN_GUARANTEE,
    walkingLevel: "Easy — light walking at village and monastery stops; limited climbing",
    cruiseSuitability:
      "Needs a full usable day ashore (approximately seven hours plus return buffer)",
    editorChoice: true,
    whyWeChose: {
      lead: "Zakynthos’s emerald interior — olive groves, quiet villages and Ionian panoramas — is the organised day that most completely rewards a generous cruise call when coastline is not your only priority.",
      whyRecommended:
        "Independent Zakynthos Town is superb for harbour cafés, Solomos Square and a relaxed promenade day. When guests want the island beyond the waterfront, this small-group 4x4 journey delivers scenic tracks, tastings, monastery atmosphere and a traditional lunch under cruise-aware timing.",
      whoItSuits:
        "First-time visitors to the Ionian, photography travellers and anyone who prefers panoramic island character over a purely harbour stroll — provided the ship’s usable hours support a seven-hour circuit.",
      whatMakesItSpecial:
        "You leave understanding why Zakynthos is more than a postcard cove — olive trees, village lanes and ridge-line light — while still returning under cruise-aware timing.",
      cruiseFit:
        "A full-day island format that needs honest hours ashore and a solid return buffer. Soft-sell honesty: a town walk and a coastal boat day are also excellent; this is for those who want the island’s scenic heartland when schedule allows.",
      theExperience:
        "You discover why Zakynthos is called the Emerald Jewel of the Ionian — and you still walk back to the ship with composure.",
    },
    supplier: SEG_SUPPLIER,
  },
];

export function getExcursionBySlug(slug: string): ExcursionPage | undefined {
  return excursions.find((e) => e.slug === slug);
}

export function getFeaturedExcursions(): ExcursionPage[] {
  return excursions.filter((e) => e.featured);
}

export function getEditorChoiceExcursion(): ExcursionPage | undefined {
  return excursions.find((e) => e.editorChoice);
}

export function getAllExcursionSlugs(): string[] {
  return excursions.map((e) => e.slug);
}
