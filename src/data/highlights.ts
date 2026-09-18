import type { AttractionPage } from "./types";

export const highlights: AttractionPage[] = [
  {
    slug: "zakynthos-town",
    title: "Zakynthos Town",
    seoTitle: "Zakynthos Town Harbour — Cruise Visitor Highlight",
    metaDescription:
      "Zakynthos Town cruise guide — Solomos Square, harbour promenade and how the civic centre anchors an independent walking day.",
    attractionName: "Zakynthos Town",
    tagline: "The island’s harbour living room on the Ionian Sea.",
    overview:
      "Zakynthos Town is where cruise days start — cafés, squares and harbour light with olive hills rising inland.",
    body: [
      "Solomos Square and the harbour promenade form the natural arrival corridor from most cruise landings.",
      "Walk it slowly; this is character, not merely transit between ship and shopping street.",
      "Use it as your orientation spine on Walk It Yourself and as your return path to the terminal.",
    ],
    distanceFromPort: "Often begins near cruise passenger access — typically about 10–25 minutes depending on berth or tender",
    travelTime: "Walking from many landings",
    timeNeeded: "1–3 hours as a town loop or linger",
    gettingThere: [
      {
        method: "Walk from terminal",
        detail: "Follow terminal signage toward Zakynthos Town and the harbour.",
        time: "10–25 min",
        cost: "Free",
      },
      {
        method: "Taxi",
        detail: "Short hop if mobility or heat is a factor.",
        time: "5–10 min",
        cost: "Metered fare",
      },
    ],
    highlights: [
      "Solomos Square",
      "Harbour promenade cafés",
      "Shopping streets and civic atmosphere",
    ],
    tips: [
      "Sun protection at midday",
      "Soft morning and late light are kinder for photographs",
    ],
    faqs: [
      {
        question: "Is the town enough for a short call?",
        answer:
          "Yes — Solomos Square, harbour promenade and a café stop can fill a short, satisfying day without leaving the centre.",
      },
    ],
    relatedAttractionSlugs: ["solomos-square", "harbour", "ionian-sea"],
  },
  {
    slug: "solomos-square",
    title: "Solomos Square",
    seoTitle: "Solomos Square Zakynthos — Cruise Highlight",
    metaDescription:
      "Solomos Square Zakynthos cruise guide — civic heart of town for day visitors walking from the cruise port and harbour cafés.",
    attractionName: "Solomos Square",
    tagline: "The civic heart of Zakynthos Town.",
    overview:
      "Solomos Square is Zakynthos Town’s most useful orientation landmark for cruise visitors — open light, public buildings and easy routes to harbour and shopping streets.",
    body: [
      "Treat it as your meeting hub if your party splits and reunites.",
      "Pair it with a harbour stroll and café pause rather than treating it as a single isolated stop.",
      "It is also the natural start of Walk It Yourself.",
    ],
    distanceFromPort: "Short walk from most cruise passenger access points",
    travelTime: "Often 10–25 minutes on foot depending on landing",
    timeNeeded: "15–30 minutes including photographs",
    gettingThere: [
      {
        method: "Walk",
        detail: "Follow signs toward the town centre and Solomos Square.",
        time: "10–25 min",
        cost: "Free",
      },
    ],
    highlights: [
      "Civic orientation hub",
      "Strong town photography",
      "Navigation anchor for independent walks",
    ],
    tips: [
      "Use the square to reset direction before the harbour return",
      "Morning light is usually kinder than harsh midday",
    ],
    faqs: [
      {
        question: "Is there an entrance fee?",
        answer: "No — Solomos Square is a public civic space.",
      },
    ],
    relatedAttractionSlugs: ["zakynthos-town", "harbour", "ionian-sea"],
  },
  {
    slug: "navagio",
    title: "Navagio (Shipwreck Beach)",
    seoTitle: "Navagio Shipwreck Beach from Zakynthos — Cruise Highlight",
    metaDescription:
      "Navagio Beach from Zakynthos cruise port — honest access advice, viewpoints and boat perspectives for cruise day visitors.",
    attractionName: "Navagio / Shipwreck Beach",
    tagline: "Greece’s most famous cove — admire it honestly.",
    overview:
      "Navagio is Zakynthos’s global icon: turquoise water, pale cliffs and a rusted wreck. Cruise visitors should plan for viewpoints or water perspectives rather than assuming a beach landing.",
    body: [
      "Access onto the beach itself has been subject to safety restrictions. Do not promise yourself sand underfoot unless authorities have reopened access for your dates.",
      "Organised boat trips commonly approach the cove from the water and often pair with Blue Caves.",
      "Cliff viewpoints require transfer time and still may not include beach access.",
    ],
    distanceFromPort: "West-coast boat or road transfer from Zakynthos Town — timing varies by route",
    travelTime: "Typically part of a half to full coastal day",
    timeNeeded: "Half day or more including transfers and coastal cruising",
    gettingThere: [
      {
        method: "Organised boat trip",
        detail: "Recommended for cruise timing — often combined with Blue Caves.",
        time: "Half to full day",
        cost: "Excursion or boat fare",
      },
      {
        method: "Viewpoint transfer",
        detail: "Possible when cliff viewpoints are open and timing allows.",
        time: "Custom",
        cost: "Taxi or tour fare",
      },
    ],
    highlights: [
      "World-famous shipwreck cove",
      "Best from viewpoints or the water",
      "Beach landings may be restricted",
    ],
    tips: [
      "Confirm current access rules before assuming a landing",
      "Bring sun protection for open decks and viewpoints",
    ],
    faqs: [
      {
        question: "Can I walk on Navagio Beach?",
        answer:
          "Do not assume so. Plan for approved viewpoints or water perspectives unless beach access is clearly open for your sailing dates.",
      },
    ],
    relatedAttractionSlugs: ["blue-caves", "ionian-sea", "zakynthos-town"],
  },
  {
    slug: "blue-caves",
    title: "Blue Caves",
    seoTitle: "Blue Caves Zakynthos — Cruise Highlight",
    metaDescription:
      "Blue Caves from Zakynthos cruise port — luminous sea caves, dramatic cliffs and when a boat day makes honest cruise sense.",
    attractionName: "Blue Caves",
    tagline: "Luminous arches and turquoise Ionian water.",
    overview:
      "The Blue Caves are among the Ionian’s most beautiful sea-cave experiences — refracted light, dramatic limestone and boat-level perspectives on Zakynthos’s west coast.",
    body: [
      "Expect weather dependence and embarkation logistics. Calm seas reward; rough water can reshape plans.",
      "Many visitors combine Blue Caves with Navagio viewpoints from the water.",
      "Organised boat days manage timing better than improvisation against all-aboard.",
    ],
    distanceFromPort: "West-coast boat departure from Zakynthos area — timing varies",
    travelTime: "Typically part of a half to full coastal day",
    timeNeeded: "Half day or more including transfers and coastal cruising",
    gettingThere: [
      {
        method: "Organised boat trip",
        detail: "Recommended for cruise timing — see Blue Caves Guide.",
        time: "Half to full day",
        cost: "Excursion or boat fare",
      },
    ],
    highlights: [
      "Luminous sea caves",
      "Dramatic cliff scenery",
      "Often paired with Navagio viewpoints",
    ],
    tips: [
      "Accept weather-driven changes calmly",
      "Protect embarkation and return queues in your buffer",
    ],
    faqs: [
      {
        question: "Is this walkable from the ship?",
        answer:
          "No. You need a boat. Walking applies only to harbour and town days.",
      },
    ],
    relatedAttractionSlugs: ["navagio", "ionian-sea", "zakynthos-town"],
  },
  {
    slug: "harbour",
    title: "Harbour Promenade",
    seoTitle: "Zakynthos Harbour Promenade — Cruise Highlight",
    metaDescription:
      "Zakynthos harbour promenade cruise guide — café terraces, Ionian light and the waterfront spine of an independent town day.",
    attractionName: "Zakynthos harbour promenade",
    tagline: "Café terraces beside Ionian water.",
    overview:
      "The harbour promenade is Zakynthos Town’s everyday waterfront — boats, cafés and the open light that makes a cruise call feel coastal and unhurried.",
    body: [
      "You do not need a boat trip to appreciate it; the promenade is the everyday viewpoint.",
      "Photographers should favour softer morning or late light.",
      "The harbour also explains why seafood and café culture sit at the heart of local food life.",
    ],
    distanceFromPort: "Immediate from many cruise landings and a short walk from Solomos Square",
    travelTime: "Immediate to short walk",
    timeNeeded: "Ongoing as setting — 20–60 minutes for a dedicated linger",
    gettingThere: [
      {
        method: "Walk",
        detail: "Step onto the harbour promenade from passenger access or Solomos Square.",
        time: "5–20 min",
        cost: "Free",
      },
    ],
    highlights: [
      "Harbour photography",
      "Café culture",
      "Coastal atmosphere without leaving town",
    ],
    tips: [
      "Use the harbour as your orientation when returning to the ship",
      "Combine with a café pause rather than a single snapshot",
    ],
    faqs: [
      {
        question: "Is a boat trip necessary to enjoy the harbour?",
        answer:
          "No. The promenade already delivers the harbour experience; boat options are for west-coast caves and cliffs.",
      },
    ],
    relatedAttractionSlugs: ["zakynthos-town", "solomos-square", "ionian-sea"],
  },
  {
    slug: "ionian-sea",
    title: "Ionian Sea",
    seoTitle: "Ionian Sea Zakynthos — Cruise Highlight",
    metaDescription:
      "Ionian Sea from Zakynthos — turquoise water, cliff light and the coastal setting that frames town, caves and olive hills.",
    attractionName: "Ionian Sea",
    tagline: "The turquoise stage for Zakynthos’s coastal drama.",
    overview:
      "The Ionian Sea is Zakynthos’s defining colour — turquoise shallows, deep-blue cliffs and the luminous water that makes Blue Caves and Navagio world-famous.",
    body: [
      "From town you meet it at the harbour; from a boat you meet it as caves and cliff walls.",
      "Respect weather and sea state on coastal days.",
      "Never plan a day that depends on a Navagio beach landing being open.",
    ],
    distanceFromPort: "Immediate from the harbour; west-coast drama by boat",
    travelTime: "Immediate in town; half day or more by boat for caves",
    timeNeeded: "Ongoing as setting",
    gettingThere: [
      {
        method: "Walk",
        detail: "Reach harbour viewpoints from the cruise landing.",
        time: "5–20 min",
        cost: "Free",
      },
      {
        method: "Organised boat",
        detail: "For Blue Caves and west-coast cliff perspectives.",
        time: "Half to full day",
        cost: "Boat or excursion fare",
      },
    ],
    highlights: [
      "Turquoise Ionian colour",
      "Coastal cave and cliff drama",
      "Harbour frames in town",
    ],
    tips: [
      "Midday haze can flatten sea colour — softer light is kinder",
      "Protect sun cover on open decks",
    ],
    faqs: [
      {
        question: "Can I swim during a cruise call?",
        answer:
          "Sometimes via beach or boat stops when timing and conditions allow — but never at the expense of your all-aboard buffer, and not by assuming Navagio Beach access.",
      },
    ],
    relatedAttractionSlugs: ["harbour", "blue-caves", "navagio"],
  },
];

export function getHighlightBySlug(slug: string): AttractionPage | undefined {
  return highlights.find((h) => h.slug === slug);
}

export function getAllHighlightSlugs(): string[] {
  return highlights.map((h) => h.slug);
}
