import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, lagMedId, lagMedLedarToken, spelareMedToken, type Lag, type Spelare } from "./db";
import { allaFarLamnaIn, serverNu } from "./tid";
import type { Spel } from "./spel";

export const SPELARKAKA = "klov_spelare";
export const LEDARKAKA = "klov_ledare";
export const ADMINKAKA = "klov_admin";

/**
 * Varje spel har egna kakor. En förälder kan då spela Klovskär och läsa barndeckaren
 * för barnen på samma telefon utan att lagen krockar.
 */
export function kakor(spel: Spel): { spelare: string; ledare: string } {
  return spel === "barn" ? { spelare: "barn_spelare", ledare: "barn_ledare" } : { spelare: SPELARKAKA, ledare: LEDARKAKA };
}

const ETT_AR = 60 * 60 * 24 * 365;

export const kakOpt = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ETT_AR,
};

export interface Inloggad {
  spelare: Spelare;
  lag: Lag;
  arLedare: boolean;
  /** Får lämna in anklagelsen (ledare, delegerad, eller alla efter 12 h). */
  farLamnaIn: boolean;
  nu: number;
}

/** Den inloggade spelaren i ett av spelen. Ett lag i det andra spelet räknas aldrig som inloggat här. */
export async function inloggad(spel: Spel = "klovskar"): Promise<Inloggad | null> {
  const k = await cookies();
  const namn = kakor(spel);
  const token = k.get(namn.spelare)?.value;
  if (!token) return null;
  const spelare = spelareMedToken(token);
  if (!spelare) return null;
  const lag = lagMedId(spelare.lag_id);
  if (!lag || lag.spel !== spel) return null;
  const ledarToken = k.get(namn.ledare)?.value;
  const arLedare = !!ledarToken && ledarToken === lag.ledare_token;
  const nu = serverNu();
  const farLamnaIn = arLedare || !!spelare.far_lamna_in || allaFarLamnaIn(lag, nu);
  return { spelare, lag, arLedare, farLamnaIn, nu };
}

/** För sidor i /lag: skicka till startsidan om man inte är med i ett lag. */
export async function kravInloggad(spel: Spel = "klovskar"): Promise<Inloggad> {
  const i = await inloggad(spel);
  if (!i) redirect(spel === "barn" ? "/barn" : "/borja");
  return i;
}

/** Lagledare utan spelarkaka (t.ex. presentköpare som inte spelar själv). */
export async function ledarLag(spel: Spel = "klovskar"): Promise<Lag | null> {
  const t = (await cookies()).get(kakor(spel).ledare)?.value;
  const lag = t ? lagMedLedarToken(t) : undefined;
  return lag && lag.spel === spel ? lag : null;
}

export async function arAdmin(): Promise<boolean> {
  const losen = process.env.ADMIN_LOSEN;
  if (!losen) return false;
  const v = (await cookies()).get(ADMINKAKA)?.value;
  return !!v && v === adminKakvarde(losen);
}

export function adminKakvarde(losen: string): string {
  // Kakan bär en hash av lösenordet, inte lösenordet
  return crypto.createHash("sha256").update("klovskar-admin:" + losen).digest("hex");
}

/** Markera att spelaren har öppnat en lucka (för olästmarkering). */
export function markeraOppnad(spelareId: number, nr: number) {
  db().prepare("INSERT OR IGNORE INTO klov_oppnad (spelare_id, lucka_nr) VALUES (?, ?)").run(spelareId, nr);
}

export function oppnadeAv(spelareId: number): Set<number> {
  const rader = db().prepare("SELECT lucka_nr FROM klov_oppnad WHERE spelare_id = ?").all(spelareId) as { lucka_nr: number }[];
  return new Set(rader.map((r) => r.lucka_nr));
}
