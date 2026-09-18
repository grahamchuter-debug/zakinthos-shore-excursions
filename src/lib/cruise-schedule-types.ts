export type CruiseScheduleEntry = {
  date: string;
  ship: string;
  arrival: string;
  departure: string;
  cruiseLine: string;
};

/**
 * Display helper for schedule tables/cards.
 * Empty or placeholder times render as an em dash — never invent a clock time.
 */
export function formatScheduleTimeCell(value: string | null | undefined): string {
  if (value == null) return "—";
  const normalized = value.trim().toLowerCase();
  if (
    !normalized ||
    normalized === "tbc" ||
    normalized === "tb" ||
    normalized === "00:00" ||
    normalized === "0:00"
  ) {
    return "—";
  }
  return value.trim();
}

export function formatScheduleDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}
