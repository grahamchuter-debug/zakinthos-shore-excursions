#!/usr/bin/env node
/**
 * Download Malaga / Andalusia images from Wikimedia Commons (CC-licensed).
 */
import { writeFileSync, mkdirSync, readFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(import.meta.dirname, "..", "public/images");
const SOURCE = join(import.meta.dirname, "..", "image-sources");
const UA = "MalagaShoreExcursions/1.0 (https://malagashoreexcursions.com; image setup)";

/** Unique primary subjects — avoid generic beaches. */
const IMAGE_FILES = {
  "hero-home.jpg": [
    "File:Caminito del Rey, Málaga, España, 2023-05-18, DD 14.jpg",
    "File:Caminito del Rey, Málaga, España, 2023-05-18, DD 49.jpg",
  ],
  "og-default.jpg": [
    "File:Alhambra - panoramio (3).jpg",
    "File:Alhambra Granada Spain.jpg",
  ],
  "cruise-port.jpg": [
    "File:Muelle 1, Port of Málaga.jpg",
    "File:Puerto de Málaga.jpg",
  ],
  "alhambra.jpg": [
    "File:Alhambra - panoramio (3).jpg",
    "File:Alhambra Granada Spain.jpg",
  ],
  "granada.jpg": [
    "File:View of Albaicín from Alhambra. Granada, Spain.jpg",
    "File:Albaicin 2012 San Nicolas Sacromonte.jpg",
  ],
  "ronda.jpg": [
    "File:View of Puente Nuevo bridge in Ronda Spain.jpg",
    "File:Puente Nuevo in Ronda.jpg",
    "File:Puente Nuevo Ronda.jpg",
  ],
  "caminito.jpg": [
    "File:Caminito del Rey, Málaga, España, 2023-05-18, DD 49.jpg",
    "File:Caminito del Rey, Málaga, España, 2023-05-18, DD 14.jpg",
  ],
  "mijas.jpg": [
    "File:Mijas Pueblo.jpg",
  ],
  "historic.jpg": [
    "File:Catedral de Málaga.jpg",
  ],
  "alcazaba.jpg": [
    "File:Alcazaba of Málaga.jpg",
  ],
  "food.jpg": [
    "File:Tapas in Barcelona 02.jpg",
    "File:( Tapas in Spain, Madrid ).jpg",
  ],
  "wine.jpg": [
    "File:Venenciadora serving Sherry.jpg",
    "File:Lustau 003An2019.jpg",
  ],
  "coast.jpg": [
    "File:Paseo del Parque Málaga.jpg",
    "File:Muelle 1, Port of Málaga.jpg",
  ],
  "white-villages.jpg": [
    "File:Frigiliana 20230910.jpg",
    "File:FrigilianaPano3.jpg",
  ],
  "compare.jpg": [
    "File:View of Puente Nuevo bridge in Ronda Spain.jpg",
    "File:Alhambra Granada Spain.jpg",
  ],
  "family.jpg": [
    "File:Catedral de Málaga.jpg",
    "File:Muelle 1, Port of Málaga.jpg",
  ],
  "walking.jpg": [
    "File:Calle Larios 6, Málaga 002.jpg",
    "File:Calle Larios 14, Málaga 001.jpg",
  ],
  "photography.jpg": [
    "File:Caminito del Rey, Málaga, España, 2023-05-18, DD 14.jpg",
    "File:View of Puente Nuevo bridge in Ronda Spain.jpg",
  ],
  "private.jpg": [
    "File:View of Puente Nuevo bridge in Ronda Spain.jpg",
    "File:Frigiliana 20230910.jpg",
  ],
};

async function commonsThumbUrl(title, width = 2400) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("titles", title);
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url");
  api.searchParams.set("iiurlwidth", String(width));
  api.searchParams.set("format", "json");
  api.searchParams.set("origin", "*");

  const res = await fetch(api, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`API ${res.status} for ${title}`);
  const data = await res.json();
  const page = Object.values(data.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  return info?.thumburl || info?.url || null;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Download ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  return buf.length;
}

async function resolveAndSave(filename, candidates) {
  for (const title of candidates) {
    try {
      const url = await commonsThumbUrl(title);
      if (!url) {
        console.warn(`  no url: ${title}`);
        continue;
      }
      const outPath = join(OUT, filename);
      const srcPath = join(SOURCE, filename);
      const bytes = await download(url, outPath);
      copyFileSync(outPath, srcPath);
      console.log(`✓ ${filename} ← ${title} (${Math.round(bytes / 1024)}KB)`);
      return true;
    } catch (err) {
      console.warn(`  fail ${title}: ${err.message}`);
    }
  }
  console.error(`✗ FAILED ${filename}`);
  return false;
}

mkdirSync(OUT, { recursive: true });
mkdirSync(SOURCE, { recursive: true });

let ok = 0;
for (const [file, candidates] of Object.entries(IMAGE_FILES)) {
  if (await resolveAndSave(file, candidates)) ok++;
}
console.log(`\nDownloaded ${ok}/${Object.keys(IMAGE_FILES).length} images`);
if (ok < Object.keys(IMAGE_FILES).length) process.exit(1);
