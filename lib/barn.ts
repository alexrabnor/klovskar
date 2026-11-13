import "server-only";
import { db, type Lag } from "./db";
import { arOppen } from "./tid";
import { BARNLUCKOR, barnLuckaNr } from "@/content/barn/luckor";
import type { BarnLucka } from "@/content/barn/typer";

/** Smakprov: dessa luckor kan läsas utan köp. */
export const BARN_SMAKPROV = [1, 2];

/** Hämtar en lucka ENDAST om barnlaget har den öppen. Annars null – innehållet lämnar aldrig servern. */
export function oppenBarnLucka(lag: Lag, nr: number, nu: number): BarnLucka | null {
  if (lag.spel !== "barn" || !arOppen(lag, nr, nu)) return null;
  return barnLuckaNr(nr) ?? null;
}

export function barnSmakprov(nr: number): BarnLucka | null {
  return BARN_SMAKPROV.includes(nr) ? barnLuckaNr(nr) ?? null : null;
}

/** Luckor där laget har gjort uppdraget. Delar tabell med Klovskärs uppgifter – ett lag hör bara till ett spel. */
export function gjordaUppdrag(lagId: number): Set<number> {
  const r = db().prepare("SELECT lucka_nr FROM klov_uppgift WHERE lag_id = ?").all(lagId) as { lucka_nr: number }[];
  return new Set(r.map((x) => x.lucka_nr));
}

export function sattUppdrag(lagId: number, nr: number, gjort: boolean, av: string) {
  if (gjort) db().prepare("INSERT OR IGNORE INTO klov_uppgift (lag_id, lucka_nr, lost_av) VALUES (?, ?, ?)").run(lagId, nr, av);
  else db().prepare("DELETE FROM klov_uppgift WHERE lag_id = ? AND lucka_nr = ?").run(lagId, nr);
}

/** Figurer som laget har kunnat stryka – bara utifrån luckor som redan är öppna. */
export function struknaFigurer(lag: Lag, nu: number): Map<string, number> {
  const m = new Map<string, number>();
  for (const l of BARNLUCKOR) if (l.stryk && arOppen(lag, l.nr, nu)) m.set(l.stryk, l.nr);
  return m;
}

/** Märkena i passet. Låsta luckor avslöjar varken symbol eller uppdrag. */
export function passetsMarken(lag: Lag, nu: number) {
  const gjorda = gjordaUppdrag(lag.id);
  return BARNLUCKOR.map((l) => {
    const oppen = arOppen(lag, l.nr, nu);
    return oppen
      ? { nr: l.nr, oppen, marke: l.uppdrag.marke, titel: l.uppdrag.titel, gjort: gjorda.has(l.nr) }
      : { nr: l.nr, oppen, marke: null, titel: null, gjort: false };
  });
}
