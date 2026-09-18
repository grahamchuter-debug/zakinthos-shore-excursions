import { SIGNATURE_EXPERIENCE_PATH, signatureRivieraExperience } from "./signature-experience";

export interface PlannerInput {
  arrivalTime?: string;
  departureTime?: string;
  adults: number;
  children: number;
  interests: string[];
  mobility: "full" | "some" | "limited";
  budget: "budget" | "mid" | "premium";
  travelStyle: "diy" | "guided";
}

export interface PlannerLink {
  label: string;
  href: string;
  why: string;
}

export interface PlannerResult {
  headline: string;
  summary: string;
  excursions: PlannerLink[];
  transfers: PlannerLink[];
  stay: PlannerLink[];
  logistics: PlannerLink[];
  dayPlan: { time: string; text: string }[];
}

export const PLANNER_VISITOR_TYPES = [
  {
    id: "independent",
    label: "Independent Zakynthos explorer",
    description: "A low-risk town day using walking, harbour cafés and your own return buffer.",
  },
  {
    id: "coastal",
    label: "Coastal Blue Caves visitor",
    description: "A boat day for passengers who want luminous caves and cliff drama.",
  },
  {
    id: "island",
    label: "Island interior traveller",
    description: "Olive groves, villages and panoramic ridges on the Editor’s Choice 4x4 day.",
  },
  {
    id: "food",
    label: "Food & harbour life traveller",
    description: "Ionian cuisine, olive oil and café culture near the harbour.",
  },
] as const;

export const INTEREST_OPTIONS = [
  { id: "coastal", label: "Blue Caves & coastline" },
  { id: "island", label: "Island interior / 4x4" },
  { id: "city-walk", label: "Zakynthos Town walk" },
  { id: "food", label: "Food & harbour cafés" },
  { id: "navagio", label: "Navagio viewpoints" },
  { id: "wildlife", label: "Loggerhead turtles" },
  { id: "photography", label: "Photography & scenery" },
  { id: "family", label: "Family-friendly" },
  { id: "independent", label: "Independent travel" },
];

type PlanKey = "independent" | "coastal" | "island" | "food";

export const ZAKYNTHOS_DAY_PLANS: Record<
  PlanKey,
  { headline: string; summary: string; minimumHours: number; links: PlannerLink[]; dayPlan: PlannerResult["dayPlan"] }
> = {
  independent: {
    headline: "Independent Zakynthos Town harbour & centre",
    summary:
      "The most flexible choice: walk from the passenger area to Solomos Square, the harbour promenade, cafés and a relaxed town pace.",
    minimumHours: 3,
    links: [
      {
        label: "Walking from Zakynthos Port",
        href: "/guides/walking-from-port",
        why: "Walking route, timing and return-to-ship advice.",
      },
      {
        label: "Walk It Yourself",
        href: "/guides/explore-independently",
        why: "Full DIY harbour-to-centre plan without an organised tour.",
      },
    ],
    dayPlan: [
      { time: "Morning", text: "Walk from the cruise port to Solomos Square and the harbour promenade." },
      { time: "Late morning", text: "Optional museum, St Mark’s Square or shopping streets." },
      { time: "Afternoon", text: "Café linger — then return with a buffer." },
    ],
  },
  coastal: {
    headline: "Blue Caves & coastal drama",
    summary:
      "An organised boat day for luminous sea caves, dramatic cliffs and often Navagio viewpoints from the water — without assuming beach landings.",
    minimumHours: 5,
    links: [
      {
        label: "Blue Caves Guide",
        href: "/guides/blue-caves-guide",
        why: "Honest coastal planning for cruise visitors.",
      },
      {
        label: "Navagio Guide",
        href: "/guides/navagio-guide",
        why: "Viewpoint and access-restriction advice for Shipwreck Beach.",
      },
      {
        label: "Boat day or Zakynthos Town?",
        href: "/compare/boat-or-zakynthos-town",
        why: "Honest trade-offs before committing to boat time.",
      },
    ],
    dayPlan: [
      { time: "Meet", text: "Join your organised boat departure with timing confirmed against all-aboard." },
      { time: "Guided day", text: "Blue Caves arches, cliff light and optional Navagio viewpoints from the water." },
      { time: "Return", text: "Disembark and return to the cruise pier with a planned buffer." },
    ],
  },
  island: {
    headline: "Editor's Choice island 4x4",
    summary:
      "Premium Land Rover panoramas through olive groves and villages — our strongest organised catalogue day when hours allow.",
    minimumHours: 7,
    links: [
      {
        label: "Panoramic Island Views by 4x4",
        href: "/shore-excursions/panoramic-island-views-4x4",
        why: "Editor’s Choice introduction for cruise visitors who want the island beyond the harbour.",
      },
      {
        label: "Boat day or Island 4x4?",
        href: "/compare/boat-or-island-4x4",
        why: "Compare coastline against inland panoramas.",
      },
    ],
    dayPlan: [
      { time: "Morning", text: "Meet near the pier and climb into the island interior." },
      { time: "Midday", text: "Villages, tastings and panoramic stops, then traditional lunch." },
      { time: "Afternoon", text: "Return to Zakynthos with a comfortable ship buffer." },
    ],
  },
  food: {
    headline: "Food & harbour café culture",
    summary:
      "Ionian seafood, olive oil and unhurried cafés — the everyday Zakynthos visitors remember longest.",
    minimumHours: 3,
    links: [
      {
        label: "Food Guide",
        href: "/guides/food-guide",
        why: "Local tasting ideas without a long boat or road day.",
      },
      {
        label: "Walk It Yourself",
        href: "/guides/explore-independently",
        why: "Harbour café stops built into a self-guided town loop.",
      },
    ],
    dayPlan: [
      { time: "Morning", text: "Harbour orientation and Solomos Square." },
      { time: "Midday", text: "Seafood, meze or café lunch near the promenade." },
      { time: "Afternoon", text: "Shopping linger, then return with a buffer." },
    ],
  },
};

function parseHour(value?: string): number | null {
  if (!value) return null;
  const m = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return Number(m[1]) + Number(m[2]) / 60;
}

function usableHours(input: PlannerInput): number {
  const arrival = parseHour(input.arrivalTime);
  const departure = parseHour(input.departureTime);
  if (arrival == null || departure == null) return 8;
  let hours = departure - arrival;
  if (hours <= 0) hours += 24;
  return Math.max(1, hours - 1.5);
}

function selectPlan(input: PlannerInput, hours: number): PlanKey {
  const interests = input.interests;
  if (interests.includes("food") && !interests.includes("coastal") && !interests.includes("island") && !interests.includes("navagio")) {
    return "food";
  }
  if (interests.includes("coastal") || interests.includes("navagio")) {
    return hours >= 5 ? "coastal" : "independent";
  }
  if (interests.includes("island") || interests.includes("photography")) {
    return hours >= 7 ? "island" : hours >= 5 ? "coastal" : "independent";
  }
  if (
    input.travelStyle === "diy" ||
    input.mobility === "limited" ||
    interests.includes("independent") ||
    interests.includes("city-walk") ||
    interests.includes("wildlife") ||
    hours < 5
  ) {
    if (input.travelStyle === "guided" && hours >= 5 && !interests.includes("independent")) {
      if (interests.includes("food")) return "food";
      return "coastal";
    }
    return "independent";
  }
  if (interests.includes("family") && hours < 7) return "coastal";
  return hours >= 7 && input.travelStyle === "guided" ? "island" : "coastal";
}

export function generateZakynthosPlan(input: PlannerInput): PlannerResult {
  const hours = usableHours(input);
  const key = selectPlan(input, hours);
  const plan = ZAKYNTHOS_DAY_PLANS[key];
  const partySize = input.adults + input.children;
  const excursions = [...plan.links];

  if (input.budget === "premium") {
    excursions.push({
      label: signatureRivieraExperience.title,
      href: SIGNATURE_EXPERIENCE_PATH,
      why: "Future maximum-eight-guest Ionian concept — in preparation and not bookable.",
    });
  }

  if (input.interests.includes("wildlife")) {
    excursions.push({
      label: "Loggerhead Turtle Guide",
      href: "/guides/loggerhead-turtle-guide",
      why: "Ethical wildlife context without forcing a rushed chase.",
    });
  }

  if (input.interests.includes("family") && key === "independent") {
    excursions.push({
      label: "One Day in Zakynthos",
      href: "/guides/one-day-in-zakynthos",
      why: "Family-friendly pacing ideas across town and optional coastal days.",
    });
  }

  return {
    headline: plan.headline,
    summary: `${plan.summary} Your call provides about ${hours.toFixed(1)} usable hours for ${partySize} guest${partySize === 1 ? "" : "s"}. ${hours < plan.minimumHours ? `This is shorter than the ${plan.minimumHours}-hour minimum we recommend for this style, so prefer Zakynthos Town on foot or a nearer coastal option.` : ""}`.trim(),
    excursions,
    transfers: [
      {
        label: "Zakynthos Cruise Port Guide",
        href: "/cruise-port-guide",
        why: "Terminal walking times, taxis and town access.",
      },
    ],
    stay: [],
    logistics: [
      {
        label: "Zakynthos Ship Schedule",
        href: "/ship-schedules/zakinthos",
        why: "Recheck the published arrival and departure for your call.",
      },
      {
        label: "Compare Zakynthos options",
        href: "/compare",
        why: "Review honest trade-offs before booking a boat or inland day.",
      },
    ],
    dayPlan: [
      ...plan.dayPlan,
      {
        time: "Return buffer",
        text: "Reach the Zakynthos terminal 60–90 minutes before all-aboard; boat and inland days require additional contingency. Never risk missing the ship for an itinerary that cannot guarantee return.",
      },
    ],
  };
}

/** Compatibility aliases expected by CruisePlanner and legacy callers */
export function generateSavonaPlan(input: PlannerInput): PlannerResult {
  return generateZakynthosPlan(input);
}

export function generateSplitPlan(input: PlannerInput): PlannerResult {
  return generateZakynthosPlan(input);
}

export function generateVolosPlan(input: PlannerInput): PlannerResult {
  return generateZakynthosPlan(input);
}
