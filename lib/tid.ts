// Datumlåset. Rena funktioner utan databas så att de går att testa.
// All tid räknas i Europe/Stockholm, oavsett serverns eller klientens tidszon.

export const ZON = "Europe/Stockholm";
export const OPPNAR_KL = 6;
export const ANTAL_LUCKOR = 24;

/** Stockholms UTC-offset i minuter vid ett givet ögonblick (60 eller 120). */
function offsetMin(utcMs: number): number {
  const delar = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZON, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const v = (t: string) => Number(delar.find((d) => d.type === t)!.value);
  const somUtc = Date.UTC(v("year"), v("month") - 1, v("day"), v("hour"), v("minute"), v("second"));
  return Math.round((somUtc - utcMs) / 60000);
}

/** Svensk väggklockstid → UTC-millisekunder. */
export function stockholm(ar: number, man: number, dag: number, tim = 0, min = 0): number {
  const gissning = Date.UTC(ar, man - 1, dag, tim, min);
  // Två varv räcker även runt sommartidsbytet
  let utc = gissning - offsetMin(gissning) * 60000;
  utc = gissning - offsetMin(utc) * 60000;
  return utc;
}

/** "2026-12-14T08:00" eller "2026-12-14" tolkat som svensk tid. */
export function tolkaSvenskTid(s: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?$/.exec(s.trim());
  if (!m) return null;
  return stockholm(+m[1], +m[2], +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
}

/** Svenskt datum (YYYY-MM-DD) för ett ögonblick. */
export function svensktDatum(utcMs: number): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: ZON, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(utcMs));
}

/** Serverns "nu". TESTLAGE_DATUM gäller bara om variabeln är satt. */
export function serverNu(env: Record<string, string | undefined> = process.env, verklig = Date.now()): number {
  const t = env.TESTLAGE_DATUM?.trim();
  if (!t) return verklig;
  const tolkad = tolkaSvenskTid(t);
  return tolkad ?? verklig;
}

/** Startdatum för ett testarlag: 24 dagar bakåt, så att alla luckor redan är öppna. */
export function testarStartdatum(nu: number): string {
  return svensktDatum(nu - ANTAL_LUCKOR * 86400000);
}

/** När lucka nr öppnas för ett lag med startdatum "YYYY-MM-DD". */
export function oppningstid(startdatum: string, nr: number): number {
  const [a, m, d] = startdatum.split("-").map(Number);
  // Date.UTC rullar över månadsgränser åt oss; klockslaget sätts i svensk tid
  const dag = new Date(Date.UTC(a, m - 1, d + (nr - 1)));
  return stockholm(dag.getUTCFullYear(), dag.getUTCMonth() + 1, dag.getUTCDate(), OPPNAR_KL, 0);
}

/** Lagledarens e-post behövs bara under spelet. Den raderas 13 månader efter att lucka 24 öppnat. */
export const EPOST_SPARAS_MANADER = 13;

/** Samma klockslag (06.00 svensk tid) ett antal kalendermånader efter att lucka 24 öppnat. */
export function manaderEfterSistaLuckan(startdatum: string, manader: number): number {
  const [a, m, d] = svensktDatum(oppningstid(startdatum, 24)).split("-").map(Number);
  const mal = new Date(Date.UTC(a, m - 1 + manader, 1));
  const sistaDag = new Date(Date.UTC(mal.getUTCFullYear(), mal.getUTCMonth() + 1, 0)).getUTCDate();
  return stockholm(mal.getUTCFullYear(), mal.getUTCMonth() + 1, Math.min(d, sistaDag), OPPNAR_KL, 0);
}

export interface LagTid {
  startdatum: string;
  /** Adminens tidsförskjutning för testlag, i minuter. */
  forskjutning_min: number;
}

/** Lagets "nu": serverns tid plus eventuell testförskjutning. */
export function lagetsNu(lag: LagTid, nu: number): number {
  return nu + (lag.forskjutning_min || 0) * 60000;
}

export function arOppen(lag: LagTid, nr: number, nu: number): boolean {
  if (!Number.isInteger(nr) || nr < 1 || nr > ANTAL_LUCKOR) return false;
  return lagetsNu(lag, nu) >= oppningstid(lag.startdatum, nr);
}

/** Antal öppna luckor (0–24). */
export function antalOppna(lag: LagTid, nu: number): number {
  let n = 0;
  for (let nr = 1; nr <= ANTAL_LUCKOR; nr++) if (arOppen(lag, nr, nu)) n = nr;
  return n;
}

/** Facit kräver inlämnad anklagelse OCH att lucka 24 har öppnat. */
export function facitOppet(lag: LagTid & { anklagelse_inlamnad: number | boolean }, nu: number): boolean {
  return !!lag.anklagelse_inlamnad && arOppen(lag, 24, nu);
}

/** Alla i laget får lämna in 12 timmar efter att lucka 24 öppnat. */
export function allaFarLamnaIn(lag: LagTid, nu: number): boolean {
  return lagetsNu(lag, nu) >= oppningstid(lag.startdatum, 24) + 12 * 3600_000;
}

/** Spelets dagnummer (1–24) för rösterna, 0 före start. */
export function speldag(lag: LagTid, nu: number): number {
  return antalOppna(lag, nu);
}

/** Datumet i berättelsen för lucka nr ("7 december 1962"). */
export function berattelseDatum(nr: number): string {
  return `${nr} december 1962`;
}

/** Spelet släpps 1 december 2026 – inget betalande lag får starta tidigare. */
export const FORSTA_STARTDAG = "2026-12-01";

/** Får ett lag välja det här startdatumet? Testare och admin går förbi regeln. */
export function startdatumEfterSlapp(s: string): boolean {
  return s >= FORSTA_STARTDAG;
}
