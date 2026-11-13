import "server-only";
import { db, type Lag } from "./db";
import { arOppen, facitOppet } from "./tid";
import { LUCKOR, luckaNr } from "@/content/luckor";
import { BONUS, bonusNr } from "@/content/bonus";
import { bildensAtkomst } from "./bilder";
import type { Lucka } from "@/content/typer";

/** Smakprov: dessa luckor kan läsas utan köp. */
export const SMAKPROV = [1, 2];

/** Hämtar en lucka ENDAST om laget har den öppen. Annars null – innehållet lämnar aldrig servern. */
export function oppenLucka(lag: Lag, nr: number, nu: number): Lucka | null {
  if (lag.spel !== "klovskar" || !arOppen(lag, nr, nu)) return null;
  return luckaNr(nr) ?? null;
}

export function smakprov(nr: number): Lucka | null {
  return SMAKPROV.includes(nr) ? luckaNr(nr) ?? null : null;
}

export function upplastaBonusar(lagId: number): Set<number> {
  const r = db().prepare("SELECT bonus_nr FROM klov_bonus WHERE lag_id = ?").all(lagId) as { bonus_nr: number }[];
  return new Set(r.map((x) => x.bonus_nr));
}

/** Bonusar vars chiffer syns (lucka öppen) – utan svar och utan innehåll. */
export function synligaChiffer(lag: Lag, nu: number) {
  const upplasta = upplastaBonusar(lag.id);
  return BONUS.filter((b) => arOppen(lag, b.synsFran, nu)).map((b) => ({
    nr: b.nr, titel: b.titel, synsFran: b.synsFran, upplast: upplasta.has(b.nr),
  }));
}

export function upplastBonus(lag: Lag, nr: number, nu: number) {
  const b = bonusNr(nr);
  if (!b || !arOppen(lag, b.synsFran, nu)) return null;
  return upplastaBonusar(lag.id).has(nr) ? b : null;
}

/** Får detta lag (eller en besökare utan lag) se bilden? */
export function farSeBild(namn: string, lag: Lag | null, nu: number, admin: boolean): boolean {
  const a = bildensAtkomst(namn);
  if (a.slag === "okand") return false;
  if (a.slag === "publik") return true;
  if (admin) return true;
  if (!lag) return false;
  // Ett lag ser bara sitt eget spels bilder
  if (a.slag === "barnlucka") return lag.spel === "barn" && arOppen(lag, a.nr, nu);
  if (lag.spel !== "klovskar") return false;
  if (a.slag === "lucka") return arOppen(lag, a.nr, nu);
  if (a.slag === "bonus") return !!upplastBonus(lag, a.nr, nu);
  if (a.slag === "facit") return facitOppet(lag, nu);
  return false;
}

export { LUCKOR };

/** Luckor där laget har löst uppgiften. */
export function lostaUppgifter(lagId: number): Set<number> {
  const r = db().prepare("SELECT lucka_nr FROM klov_uppgift WHERE lag_id = ?").all(lagId) as { lucka_nr: number }[];
  return new Set(r.map((x) => x.lucka_nr));
}
