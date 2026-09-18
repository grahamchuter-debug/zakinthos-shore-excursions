import type { CruiseScheduleEntry } from "@/lib/cruise-schedule-types";
import {
  selectScheduleEntryForBooking,
  toBookingShipVisit,
  type BookingShipVisit,
  type BookingShipsByDate,
} from "@/lib/booking/booking-ship-types";

export type {
  BookingShipVisit,
  BookingShipsByDate,
} from "@/lib/booking/booking-ship-types";
export {
  formatVerifiedShipTime,
  formatVerifiedShipTimingLine,
  toBookingShipVisit,
} from "@/lib/booking/booking-ship-types";

/**
 * Sample Zakynthos cruise calls for booking date/ship selection.
 * Replace with imported schedule feeds when production data is connected.
 */
const SAMPLE_ZAKYNTHOS_SCHEDULE: readonly CruiseScheduleEntry[] = [
  {
    date: "2026-09-12",
    ship: "MSC Seaside",
    arrival: "07:00",
    departure: "18:00",
    cruiseLine: "MSC Cruises",
  },
  {
    date: "2026-09-12",
    ship: "Costa Smeralda",
    arrival: "08:00",
    departure: "19:00",
    cruiseLine: "Costa Cruises",
  },
  {
    date: "2026-09-19",
    ship: "MSC Grandiosa",
    arrival: "07:30",
    departure: "18:30",
    cruiseLine: "MSC Cruises",
  },
  {
    date: "2026-09-19",
    ship: "Costa Toscana",
    arrival: "08:00",
    departure: "18:00",
    cruiseLine: "Costa Cruises",
  },
  {
    date: "2026-10-03",
    ship: "MSC Divina",
    arrival: "07:00",
    departure: "17:00",
    cruiseLine: "MSC Cruises",
  },
  {
    date: "2026-10-03",
    ship: "Explora II",
    arrival: "08:00",
    departure: "18:00",
    cruiseLine: "Explora Journeys",
  },
  {
    date: "2026-10-17",
    ship: "Costa Deliziosa",
    arrival: "07:00",
    departure: "18:00",
    cruiseLine: "Costa Cruises",
  },
  {
    date: "2026-11-07",
    ship: "MSC Magnifica",
    arrival: "08:00",
    departure: "17:30",
    cruiseLine: "MSC Cruises",
  },
];

export function loadAllZakynthosScheduleEntries(): CruiseScheduleEntry[] {
  return [...SAMPLE_ZAKYNTHOS_SCHEDULE];
}

export function getZakynthosShipsOnDate(
  isoDate: string,
  entries: readonly CruiseScheduleEntry[] = loadAllZakynthosScheduleEntries(),
): BookingShipVisit[] {
  const byShip = new Map<string, CruiseScheduleEntry[]>();

  for (const entry of entries) {
    if (entry.date !== isoDate) continue;
    const list = byShip.get(entry.ship) ?? [];
    list.push(entry);
    byShip.set(entry.ship, list);
  }

  return [...byShip.values()]
    .map((group) => toBookingShipVisit(selectScheduleEntryForBooking(group)))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}

export function buildBookingShipsByDate(
  entries: readonly CruiseScheduleEntry[] = loadAllZakynthosScheduleEntries(),
): BookingShipsByDate {
  const grouped = new Map<string, Map<string, CruiseScheduleEntry[]>>();

  for (const entry of entries) {
    const byShip = grouped.get(entry.date) ?? new Map();
    const list = byShip.get(entry.ship) ?? [];
    list.push(entry);
    byShip.set(entry.ship, list);
    grouped.set(entry.date, byShip);
  }

  const map: BookingShipsByDate = {};

  for (const [date, byShip] of grouped) {
    map[date] = [...byShip.values()]
      .map((group) => toBookingShipVisit(selectScheduleEntryForBooking(group)))
      .sort((a, b) => a.name.localeCompare(b.name, "en"));
  }

  return map;
}

/** Compatibility aliases */
export const loadAllSavonaScheduleEntries = loadAllZakynthosScheduleEntries;
export const getSavonaShipsOnDate = getZakynthosShipsOnDate;
export const loadAllVolosScheduleEntries = loadAllZakynthosScheduleEntries;
