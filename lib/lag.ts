import "server-only";
import { db, kodMedKod, lagMedKod, spelareILag, type Lag, type Spelare } from "./db";
import { nyLagkod, nyToken } from "./slump";
import { oppningstid, serverNu, svensktDatum, lagetsNu, testarStartdatum } from "./tid";

export const MAX_SPELARE = 5;

export class Fel extends Error {}

export function rensaNamn(s: unknown, max = 40): string {
  return String(s ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

/** Adventsläget: 1 december i år, eller nästa år om årets kalender redan är slut. */
export function adventStart(nu = serverNu()): string {
  const idag = svensktDatum(nu);
  const ar = Number(idag.slice(0, 4));
  return idag > `${ar}-12-24` ? `${ar + 1}-12-01` : `${ar}-12-01`;
}

/** Hur många luckor som öppnas direkt om laget startar på detta datum nu. */
export function luckorDirekt(startdatum: string, nu = serverNu()): number {
  let n = 0;
  for (let nr = 1; nr <= 24; nr++) if (nu >= oppningstid(startdatum, nr)) n = nr;
  return n;
}

function unikLagkod(): string {
  for (let i = 0; i < 20; i++) {
    const k = nyLagkod();
    if (!lagMedKod(k)) return k;
  }
  throw new Fel("Kunde inte skapa en lagkod. Försök igen.");
}

export function giltigtStartdatum(s: string, nu = serverNu()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + "T12:00:00Z");
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) return false;
  // Max ett år bakåt (hela kalendern öppen direkt) och två år framåt
  const idag = svensktDatum(nu);
  const ar = Number(idag.slice(0, 4));
  return s >= `${ar - 1}-01-01` && s <= `${ar + 2}-12-31`;
}

export function skapaLag(opts: { kod: string; lagnamn: string; startdatum: string; namn: string; epost?: string }) {
  const d = db();
  return d.transaction(() => {
    const kod = kodMedKod(opts.kod);
    if (!kod) throw new Fel("Koden finns inte. Kontrollera stavningen – den ser ut som ABCD-EFGH-JKLM.");
    if (kod.lag_id) throw new Fel("Koden har redan använts för att skapa ett lag. Har ni redan ett lag? Be lagledaren om lagkoden.");
    if (kod.aterbetald) throw new Fel("Köpet för den här koden har återbetalats.");
    const lagnamn = rensaNamn(opts.lagnamn, 40);
    const namn = rensaNamn(opts.namn, 30);
    if (lagnamn.length < 2) throw new Fel("Ge laget ett namn.");
    if (namn.length < 1) throw new Fel("Skriv ditt namn eller smeknamn.");
    // En testarkod öppnar alla luckor direkt, oavsett vilket startdatum som valdes
    const testare = kod.typ === "testare";
    const startdatum = testare ? testarStartdatum(serverNu()) : opts.startdatum;
    if (!giltigtStartdatum(startdatum)) throw new Fel("Startdatumet ser inte rätt ut.");
    const epost = rensaNamn(opts.epost ?? kod.epost ?? "", 120) || null;
    const ledare = nyToken();
    const lagkod = unikLagkod();
    const lag = d.prepare(`INSERT INTO klov_lag (namn, kod, startdatum, ledare_token, ledare_epost, aktiveringskod, morgonmejl, synlig_i_topplista)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`).get(lagnamn, lagkod, startdatum, ledare, epost, kod.kod, 0, testare ? 0 : 1) as Lag;
    d.prepare("UPDATE klov_kod SET lag_id = ? WHERE kod = ?").run(lag.id, kod.kod);
    const spelare = d.prepare("INSERT INTO klov_spelare (lag_id, namn, token) VALUES (?, ?, ?) RETURNING *").get(lag.id, namn, nyToken()) as Spelare;
    return { lag, spelare };
  })();
}

export type GaMedResultat = { slag: "ny"; spelare: Spelare } | { slag: "overtag"; hemlighet: string; namn: string };

export function gaMed(lagkod: string, namnIn: string): GaMedResultat {
  const d = db();
  return d.transaction((): GaMedResultat => {
    const lag = lagMedKod(rensaNamn(lagkod, 12).replace(/\s/g, ""));
    if (!lag) throw new Fel("Det finns inget lag med den koden. Lagkoden har sex tecken, t.ex. KLV4X2.");
    const namn = rensaNamn(namnIn, 30);
    if (!namn) throw new Fel("Skriv ditt namn eller smeknamn.");
    const spelare = spelareILag(lag.id);
    const befintlig = spelare.find((s) => s.namn.toLowerCase() === namn.toLowerCase());
    if (befintlig) {
      const hemlighet = nyToken();
      d.prepare("DELETE FROM klov_overtag WHERE spelare_id = ? AND godkand = 0 AND skapad < datetime('now', '-1 day')").run(befintlig.id);
      d.prepare("INSERT INTO klov_overtag (lag_id, spelare_id, hemlighet) VALUES (?, ?, ?)").run(lag.id, befintlig.id, hemlighet);
      return { slag: "overtag", hemlighet, namn: befintlig.namn };
    }
    if (spelare.length >= MAX_SPELARE) throw new Fel(`Laget är fullt – max ${MAX_SPELARE} spelare. Lagledaren kan ta bort någon som inte spelar.`);
    const ny = d.prepare("INSERT INTO klov_spelare (lag_id, namn, token) VALUES (?, ?, ?) RETURNING *").get(lag.id, namn, nyToken()) as Spelare;
    return { slag: "ny", spelare: ny };
  })();
}

export interface Overtag { id: number; lag_id: number; spelare_id: number; namn: string; skapad: string; godkand: number }

export function vantandeOvertag(lagId: number): Overtag[] {
  return db().prepare(`SELECT o.id, o.lag_id, o.spelare_id, s.namn, o.skapad, o.godkand FROM klov_overtag o
    JOIN klov_spelare s ON s.id = o.spelare_id WHERE o.lag_id = ? AND o.godkand = 0 AND o.skapad > datetime('now', '-1 day')
    ORDER BY o.skapad`).all(lagId) as Overtag[];
}

/** Ledare eller annan spelare i laget godkänner. Man kan inte godkänna sig själv. */
export function godkannOvertag(lagId: number, overtagId: number, godkannareSpelareId: number | null) {
  const o = db().prepare("SELECT * FROM klov_overtag WHERE id = ? AND lag_id = ?").get(overtagId, lagId) as Overtag | undefined;
  if (!o) throw new Fel("Förfrågan finns inte längre.");
  if (godkannareSpelareId !== null && o.spelare_id === godkannareSpelareId) throw new Fel("Någon annan i laget måste godkänna.");
  db().prepare("UPDATE klov_overtag SET godkand = 1 WHERE id = ?").run(overtagId);
}

export function nekaOvertag(lagId: number, overtagId: number) {
  db().prepare("DELETE FROM klov_overtag WHERE id = ? AND lag_id = ?").run(overtagId, lagId);
}

/** Den väntande webbläsaren hämtar spelarens token när förfrågan är godkänd. */
export function hamtaGodkantOvertag(hemlighet: string): Spelare | null | "vantar" {
  const o = db().prepare("SELECT * FROM klov_overtag WHERE hemlighet = ?").get(hemlighet) as (Overtag & { hemlighet: string }) | undefined;
  if (!o) return null;
  if (!o.godkand) return "vantar";
  db().prepare("DELETE FROM klov_overtag WHERE id = ?").run(o.id);
  return (db().prepare("SELECT * FROM klov_spelare WHERE id = ?").get(o.spelare_id) as Spelare) ?? null;
}

// ------------------------------------------------------------------ lagledarens verktyg

export function forstaLuckanOppnad(lag: Lag, nu = serverNu()): boolean {
  return lagetsNu(lag, nu) >= oppningstid(lag.startdatum, 1);
}

export function bytStartdatum(lag: Lag, startdatum: string, nu = serverNu()) {
  if (forstaLuckanOppnad(lag, nu)) throw new Fel("Första luckan har redan öppnat. Startdatumet går inte att ändra längre – kontakta oss om något blivit fel.");
  if (!giltigtStartdatum(startdatum, nu)) throw new Fel("Startdatumet ser inte rätt ut.");
  db().prepare("UPDATE klov_lag SET startdatum = ? WHERE id = ?").run(startdatum, lag.id);
}

export function taBortSpelare(lag: Lag, spelareId: number) {
  db().prepare("DELETE FROM klov_spelare WHERE id = ? AND lag_id = ?").run(spelareId, lag.id);
}

export function bytLagkod(lag: Lag): string {
  const k = unikLagkod();
  db().prepare("UPDATE klov_lag SET kod = ? WHERE id = ?").run(k, lag.id);
  return k;
}

export function satDelegering(lag: Lag, spelareId: number, pa: boolean) {
  db().prepare("UPDATE klov_spelare SET far_lamna_in = ? WHERE id = ? AND lag_id = ?").run(pa ? 1 : 0, spelareId, lag.id);
}

export function satLagInstallningar(lag: Lag, v: { synlig?: boolean; morgonmejl?: boolean; epost?: string | null }) {
  if (v.synlig !== undefined) db().prepare("UPDATE klov_lag SET synlig_i_topplista = ? WHERE id = ?").run(v.synlig ? 1 : 0, lag.id);
  if (v.morgonmejl !== undefined) db().prepare("UPDATE klov_lag SET morgonmejl = ? WHERE id = ?").run(v.morgonmejl ? 1 : 0, lag.id);
  if (v.epost !== undefined) db().prepare("UPDATE klov_lag SET ledare_epost = ? WHERE id = ?").run(v.epost || null, lag.id);
}
