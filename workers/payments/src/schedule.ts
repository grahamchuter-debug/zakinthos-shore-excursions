/**
 * Date + ship validation against bundled schedule data (from public/data CSVs).
 */

import shipsByDate from "./data/ships-by-date.json";

export type ScheduleShip = {
  slug: string;
  name: string;
  arrival?: string | null;
  departure?: string | null;
};

/** Matches site schedule publication window (June 2026 – November 2028). */
export const BOOKABLE_WINDOW_START = "2026-06-01";
export const BOOKABLE_WINDOW_END = "2028-11-30";

export const CUSTOM_SHIP_SLUGS = new Set(["not-listed", "custom"]);

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const scheduleMap = shipsByDate as Record<string, ScheduleShip[]>;

export function slugifyShipName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Calendar YYYY-MM-DD in UTC (Worker has no local timezone config). */
export function utcTodayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d!));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m! - 1 &&
    dt.getUTCDate() === d
  );
}

/**
 * Bookable date: valid ISO, not before UTC today, within published schedule window.
 */
export function validateExcursionDate(
  excursionDate: string,
  todayIso: string = utcTodayIso(),
): { ok: true } | { ok: false; error: string } {
  if (!isValidIsoDate(excursionDate)) {
    return { ok: false, error: "excursionDate must be a valid YYYY-MM-DD date" };
  }
  if (excursionDate < todayIso) {
    return { ok: false, error: "excursionDate must not be in the past" };
  }
  if (
    excursionDate < BOOKABLE_WINDOW_START ||
    excursionDate > BOOKABLE_WINDOW_END
  ) {
    return {
      ok: false,
      error: `excursionDate must be between ${BOOKABLE_WINDOW_START} and ${BOOKABLE_WINDOW_END}`,
    };
  }
  return { ok: true };
}

export function getShipsOnDate(excursionDate: string): ScheduleShip[] {
  return scheduleMap[excursionDate] ?? [];
}

export type ResolvedShip = {
  shipId: string | null;
  shipName: string;
  isCustom: boolean;
};

/**
 * Resolve ship from schedule for the sailing date.
 * Custom / not-listed ships keep a sanitized client display name.
 * Listed ships always use the trusted schedule name.
 */
export function resolveShipForDate(args: {
  excursionDate: string;
  shipId?: string | null;
  shipNameHint?: string | null;
}): { ok: true; ship: ResolvedShip } | { ok: false; error: string } {
  const rawId = (args.shipId ?? "").trim();
  const hint = (args.shipNameHint ?? "").trim().slice(0, 120);

  if (!rawId || CUSTOM_SHIP_SLUGS.has(rawId)) {
    if (!hint) {
      return {
        ok: false,
        error: "shipName is required when the ship is not on the published schedule",
      };
    }
    return {
      ok: true,
      ship: {
        shipId: "not-listed",
        shipName: hint,
        isCustom: true,
      },
    };
  }

  const ships = getShipsOnDate(args.excursionDate);
  const match = ships.find((s) => s.slug === rawId);
  if (!match) {
    return {
      ok: false,
      error: "shipId is not valid for the selected excursionDate",
    };
  }

  return {
    ok: true,
    ship: {
      shipId: match.slug,
      shipName: match.name,
      isCustom: false,
    },
  };
}

export function getShipCallTimes(
  excursionDate: string,
  shipId: string | null,
  shipName: string,
): { arrival: string | null; departure: string | null } {
  const ships = getShipsOnDate(excursionDate);
  const slug = shipId?.trim() || slugifyShipName(shipName);
  const match =
    ships.find((s) => s.slug === slug) ??
    ships.find((s) => slugifyShipName(s.name) === slugifyShipName(shipName));
  return {
    arrival: match?.arrival ?? null,
    departure: match?.departure ?? null,
  };
}
