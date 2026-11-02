import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, lagMedId, lagMedLedarToken, spelareMedToken, type Lag, type Spelare } from "./db";
import { allaFarLamnaIn, serverNu } from "./tid";

export const SPELARKAKA = "klov_spelare";
export const LEDARKAKA = "klov_ledare";
export const ADMINKAKA = "klov_admin";

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

export async function inloggad(): Promise<Inloggad | null> {
  const k = await cookies();
  const token = k.get(SPELARKAKA)?.value;
  if (!token) return null;
  const spelare = spelareMedToken(token);
  if (!spelare) return null;
  const lag = lagMedId(spelare.lag_id);
  if (!lag) return null;
  const ledarToken = k.get(LEDARKAKA)?.value;
  const arLedare = !!ledarToken && ledarToken === lag.ledare_token;
  const nu = serverNu();
  const farLamnaIn = arLedare || !!spelare.far_lamna_in || allaFarLamnaIn(lag, nu);
  return { spelare, lag, arLedare, farLamnaIn, nu };
}

/** För sidor i /lag: skicka till startsidan om man inte är med i ett lag. */
export async function kravInloggad(): Promise<Inloggad> {
  const i = await inloggad();
  if (!i) redirect("/borja");
  return i;
}

/** Lagledare utan spelarkaka (t.ex. presentköpare som inte spelar själv). */
export async function ledarLag(): Promise<Lag | null> {
  const t = (await cookies()).get(LEDARKAKA)?.value;
  return t ? lagMedLedarToken(t) ?? null : null;
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
