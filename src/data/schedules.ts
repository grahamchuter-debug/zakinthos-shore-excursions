import zakinthosSchedule from "./imported-schedules/zakinthos.json";
import type { ScheduleEntry, ShipSchedulePort } from "./types";
import {
  filterEntriesByMonth,
  filterEntriesByYear,
  getMonthsWithEntries,
  type ScheduleYear,
} from "@/lib/schedule-utils";

/**
 * Schedule framework is ready for Zakynthos.
 * Do not publish sample or fictitious ship calls as live data.
 * Keep entries empty until confirmed schedules are available.
 */
const SCHEDULE_FAQS = [
  {
    question: "How accurate are Zakynthos cruise ship schedules?",
    answer: "Schedules are compiled from published cruise timetables and updated periodically. Always confirm arrival, departure and all-aboard times with your cruise line.",
  },
  {
    question: "Where do cruise ships berth in Zakynthos?",
    answer:
      "Cruise ships typically use passenger facilities near Zakynthos Town harbour on the Ionian Sea. Walking time into the promenade and centre is often realistic for many guests; follow terminal or tender-pier signage on the day.",
  },
  {
    question: "Is a Zakynthos call long enough for Blue Caves or the island 4x4 day?",
    answer:
      "A full day in port can support a cruise-timed Editor’s Choice 4x4 excursion or a coastal boat circuit. Blue Caves days usually fit a solid half to full day. Shorter calls are better suited to harbour walking and Zakynthos Town.",
  },
];

const SCHEDULE_TIPS = [
  "Confirm all-aboard time rather than relying only on the published departure",
  "Allow a generous buffer when returning from boat embarkation points or inland circuits",
  "Keep a lighter Plan B (Zakynthos Town on foot) if your call is shortened",
  "The harbour is close — independent exploration works well on shorter windows",
  "Never risk missing the ship for a coastal or inland itinerary that cannot guarantee return",
];

export const schedulePorts: ShipSchedulePort[] = [
  {
    slug: "zakinthos",
    name: "Zakynthos",
    country: "Greece",
    seoTitle: "Zakynthos Cruise Ship Schedule — Ionian Islands Port Calls",
    metaDescription:
      "Zakynthos cruise ship schedule framework for planning town walks, Blue Caves and island adventures when hours allow. Confirmed calls publish when verified.",
    intro:
      "Zakynthos is an Ionian harbour island — and a gateway to Blue Caves, Navagio viewpoints and olive-grove panoramas when your hours ashore allow.",
    description:
      "Ionian Islands harbour town with access to Solomos Square, coastal boat days and inland scenic circuits.",
    scheduleOverview:
      "Verified published calls for this planning window. Always confirm arrival, departure and all-aboard times with your cruise line.",
    planningTips: SCHEDULE_TIPS,
    faqs: SCHEDULE_FAQS,
  },
];

const scheduleData: Record<string, ScheduleEntry[]> = {
  zakinthos: zakinthosSchedule as ScheduleEntry[],
};

export function getSchedulePortBySlug(slug: string): ShipSchedulePort | undefined {
  return schedulePorts.find((port) => port.slug === slug);
}

export function getAllSchedulePortSlugs(): string[] {
  return schedulePorts.map((port) => port.slug);
}

export function getScheduleEntries(slug: string): ScheduleEntry[] {
  return scheduleData[slug] ?? [];
}

export function getScheduleEntryCount(slug: string): number {
  return getScheduleEntries(slug).length;
}

export function getScheduleEntriesForYear(slug: string, year: ScheduleYear): ScheduleEntry[] {
  return filterEntriesByYear(getScheduleEntries(slug), year);
}

export function getScheduleEntriesForMonth(slug: string, monthKey: string): ScheduleEntry[] {
  return filterEntriesByMonth(getScheduleEntries(slug), monthKey);
}

export function getScheduleMonths(slug: string): string[] {
  return getMonthsWithEntries(getScheduleEntries(slug));
}

export function getScheduleYears(slug: string): ScheduleYear[] {
  const years = new Set<ScheduleYear>();
  for (const entry of getScheduleEntries(slug)) {
    const y = Number(entry.date.slice(0, 4)) as ScheduleYear;
    if (y) years.add(y);
  }
  return [...years].sort();
}

export function getVerifiedMonthKeys(slug: string): string[] {
  return getMonthsWithEntries(getScheduleEntries(slug));
}

export function searchSchedulesByShip(query: string): { portSlug: string; entries: ScheduleEntry[] }[] {
  const normalised = query.toLowerCase().trim();
  if (!normalised) return [];

  return schedulePorts
    .map((port) => ({
      portSlug: port.slug,
      entries: getScheduleEntries(port.slug).filter(
        (entry) =>
          entry.ship.toLowerCase().includes(normalised) ||
          entry.cruiseLine.toLowerCase().includes(normalised),
      ),
    }))
    .filter((result) => result.entries.length > 0);
}

export function getTodayTomorrowEntries(slug: string): {
  today: ScheduleEntry[];
  tomorrow: ScheduleEntry[];
} {
  const entries = getScheduleEntries(slug);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateKey = (date: Date) => date.toISOString().slice(0, 10);

  return {
    today: entries.filter((entry) => entry.date === dateKey(today)),
    tomorrow: entries.filter((entry) => entry.date === dateKey(tomorrow)),
  };
}
