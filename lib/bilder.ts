import "server-only";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BILD_DIR = process.env.BILD_DIR || path.join(process.cwd(), "bilder");
const CACHE_DIR = path.join(path.dirname(process.env.DB_PATH || path.join(process.cwd(), "data", "x")), "bildcache");
const ANDELSER = [".jpg", ".jpeg", ".png", ".webp"];
export const BREDDER = [320, 640, 960, 1600] as const;

/** Bilder som alltid får visas: smakprov (lucka 1–2), meny och startsida. */
const PUBLIKA = new Set(["omslag", "hotellet-dag", "koket", "karta", "misstankta", "brottsplats", "lucka-01"]);

export type Atkomst =
  | { slag: "publik" }
  | { slag: "lucka"; nr: number }
  | { slag: "bonus"; nr: number }
  | { slag: "facit" }
  | { slag: "okand" };

export function bildensAtkomst(namn: string): Atkomst {
  if (PUBLIKA.has(namn) || namn.startsWith("meny-")) return { slag: "publik" };
  let m = /^lucka-(\d{2})[ab]?$/.exec(namn);
  if (m) return { slag: "lucka", nr: Number(m[1]) };
  m = /^bonus-(\d)$/.exec(namn);
  if (m) return { slag: "bonus", nr: Number(m[1]) };
  if (namn === "facit") return { slag: "facit" };
  return { slag: "okand" };
}

export function hittaBildfil(namn: string): string | null {
  if (!/^[a-z0-9-]+$/.test(namn)) return null;
  for (const e of ANDELSER) {
    const p = path.join(/* turbopackIgnore: true */ BILD_DIR, namn + e);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/** Skalad webp-version, cachad på disk. Nyckeln innehåller filens mtime så att en utbytt bild slår igenom. */
export async function skaladBild(fil: string, namn: string, bredd: number): Promise<Buffer> {
  const mtime = Math.floor(fs.statSync(fil).mtimeMs);
  const cachefil = path.join(CACHE_DIR, `${namn}-${bredd}-${mtime}.webp`);
  if (fs.existsSync(cachefil)) return fs.readFileSync(cachefil);
  const buf = await sharp(fil).rotate().resize({ width: bredd, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachefil, buf);
  return buf;
}

export function platshallareSvg(namn: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
<defs><pattern id="r" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 24 L24 0" stroke="#24404b" stroke-width="1"/></pattern></defs>
<rect width="800" height="600" fill="#132329"/><rect width="800" height="600" fill="url(#r)"/>
<rect x="250" y="250" width="300" height="100" fill="#0e1a1f" stroke="#e2a24a" stroke-width="2" stroke-dasharray="6 6"/>
<text x="400" y="296" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#e2a24a">Bild saknas</text>
<text x="400" y="328" text-anchor="middle" font-family="monospace" font-size="16" fill="#9fb0b3">${namn.replace(/[^a-z0-9-]/g, "")}</text>
</svg>`;
}
