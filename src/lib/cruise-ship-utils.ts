import type { CruiseShipSummary } from "@/lib/cruise-ship-types";

export function slugifyShipName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCruiseShipPath(slug: string): string {
  return `/cruise-ships/${slug}`;
}

export const cruiseShipsHubPath = "/cruise-ships";

export function groupShipsByCruiseLine(
  ships: CruiseShipSummary[],
): { cruiseLine: string; ships: CruiseShipSummary[] }[] {
  const groups = new Map<string, CruiseShipSummary[]>();

  for (const ship of ships) {
    const line = ship.cruiseLine || "Not listed";
    const existing = groups.get(line) ?? [];
    existing.push(ship);
    groups.set(line, existing);
  }

  return [...groups.entries()]
    .map(([cruiseLine, lineShips]) => ({
      cruiseLine,
      ships: lineShips.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      ),
    }))
    .sort((a, b) =>
      a.cruiseLine.localeCompare(b.cruiseLine, undefined, { sensitivity: "base" }),
    );
}
