/**
 * Sync ship-by-date catalogue (with times) into the Worker from public/data CSVs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const csvDir = path.join(repoRoot, "public/data");
const outPath = path.join(__dirname, "../src/data/ships-by-date.json");

function slugifyShipName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const map = {};
for (const file of fs
  .readdirSync(csvDir)
  .filter((f) => f.endsWith(".csv"))
  .sort()) {
  const lines = fs
    .readFileSync(path.join(csvDir, file), "utf8")
    .trim()
    .split(/\r?\n/)
    .slice(1);
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(",");
    const date = parts[0]?.trim();
    const ship = parts[1]?.trim();
    const arrival = parts[2]?.trim() || null;
    const departure = parts[3]?.trim() || null;
    if (!date || !ship || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const slug = slugifyShipName(ship);
    if (!map[date]) map[date] = [];
    if (!map[date].some((s) => s.slug === slug)) {
      map[date].push({
        slug,
        name: ship,
        arrival,
        departure,
      });
    }
  }
}

for (const date of Object.keys(map)) {
  map[date].sort((a, b) => a.name.localeCompare(b.name, "en"));
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(map)}\n`);
console.log(
  `Synced ${Object.keys(map).length} dates → ${path.relative(repoRoot, outPath)}`,
);
