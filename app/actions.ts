"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  Fel, adventStart, bytLagkod, bytStartdatum, gaMed, godkannOvertag, nekaOvertag, satDelegering,
  satLagInstallningar, skapaLag, taBortSpelare, rensaNamn,
} from "@/lib/lag";
import { LEDARKAKA, SPELARKAKA, ADMINKAKA, adminKakvarde, inloggad, kakOpt, kakor, ledarLag } from "@/lib/session";
import { spelHem, type Spel } from "@/lib/spel";
import { lagMedId } from "@/lib/db";
import { mejlaLedarlank } from "@/lib/mail";

export type Svar = { fel?: string; ok?: string } | undefined;

const felText = (e: unknown) => (e instanceof Fel ? e.message : (console.error(e), "Något gick fel. Försök igen om en stund."));

export async function aktivera(_: Svar, f: FormData): Promise<Svar> {
  let mal: string;
  try {
    const lage = String(f.get("startlage") || "advent");
    const startdatum = lage === "eget" ? String(f.get("startdatum") || "") : adventStart();
    const { lag, spelare } = skapaLag({
      kod: String(f.get("kod") || ""),
      lagnamn: String(f.get("lagnamn") || ""),
      startdatum,
      namn: String(f.get("namn") || ""),
      epost: rensaNamn(f.get("epost"), 120) || undefined,
    });
    const k = await cookies();
    k.set(kakor(lag.spel).spelare, spelare.token, kakOpt);
    k.set(kakor(lag.spel).ledare, lag.ledare_token, kakOpt);
    mal = lag.spel === "barn" ? "/barn/valkommen" : `/lag/valkommen?id=${lag.id}`;
    mejlaLedarlank(lag).catch((e) => console.error("[mejl] ledarlänk", e));
  } catch (e) {
    return { fel: felText(e) };
  }
  redirect(mal);
}

export async function gaMedILag(_: Svar, f: FormData): Promise<Svar> {
  let mal: string;
  try {
    const r = gaMed(String(f.get("lagkod") || ""), String(f.get("namn") || ""));
    if (r.slag === "ny") {
      (await cookies()).set(kakor(r.spel).spelare, r.spelare.token, kakOpt);
      mal = spelHem(r.spel);
    } else {
      mal = `/g/vanta?h=${encodeURIComponent(r.hemlighet)}&namn=${encodeURIComponent(r.namn)}`;
    }
  } catch (e) {
    return { fel: felText(e) };
  }
  redirect(mal);
}

/** Godkänn att någon tar över ett namn – av annan spelare i laget eller av lagledaren. */
/** Formulären i barndeckaren skickar med spel=barn, så att rätt lag och rätt kakor används. */
const spelFran = (f: FormData): Spel => (f.get("spel") === "barn" ? "barn" : "klovskar");
const layoutFor = (spel: Spel) => (spel === "barn" ? "/barn" : "/lag");

export async function godkann(f: FormData) {
  const id = Number(f.get("id"));
  const spel = spelFran(f);
  const i = await inloggad(spel);
  const ledare = await ledarLag(spel);
  const lagId = i?.lag.id ?? ledare?.id;
  if (!lagId) return;
  const somLedare = !!ledare && ledare.id === lagId;
  try {
    godkannOvertag(lagId, id, somLedare ? null : i!.spelare.id);
  } catch (e) {
    console.warn(felText(e));
  }
  revalidatePath(layoutFor(spel), "layout");
}

export async function neka(f: FormData) {
  const spel = spelFran(f);
  const i = await inloggad(spel);
  const ledare = await ledarLag(spel);
  const lagId = i?.lag.id ?? ledare?.id;
  if (lagId) nekaOvertag(lagId, Number(f.get("id")));
  revalidatePath(layoutFor(spel), "layout");
}

export async function loggaUt() {
  const k = await cookies();
  k.delete(SPELARKAKA);
  k.delete(LEDARKAKA);
  redirect("/");
}

// ------------------------------------------------------------------ lagledare

async function kravLedare() {
  const lag = await ledarLag();
  if (!lag) throw new Fel("Bara lagledaren kan göra det här.");
  return lag;
}

export async function ledarStartdatum(_: Svar, f: FormData): Promise<Svar> {
  try {
    const lag = await kravLedare();
    const lage = String(f.get("startlage") || "advent");
    bytStartdatum(lag, lage === "eget" ? String(f.get("startdatum") || "") : adventStart());
    revalidatePath("/lag", "layout");
    return { ok: "Startdatumet är ändrat." };
  } catch (e) {
    return { fel: felText(e) };
  }
}

export async function ledarTaBort(f: FormData) {
  const lag = await kravLedare();
  taBortSpelare(lag, Number(f.get("id")));
  revalidatePath("/lag", "layout");
}

export async function ledarNyLagkod() {
  const lag = await kravLedare();
  bytLagkod(lag);
  revalidatePath("/lag", "layout");
}

export async function ledarDelegera(f: FormData) {
  const lag = await kravLedare();
  satDelegering(lag, Number(f.get("id")), f.get("pa") === "1");
  revalidatePath("/lag", "layout");
}

export async function ledarInstallningar(_: Svar, f: FormData): Promise<Svar> {
  try {
    const lag = await kravLedare();
    const epost = rensaNamn(f.get("epost"), 120);
    if (epost && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(epost)) return { fel: "E-postadressen ser inte rätt ut." };
    satLagInstallningar(lag, { synlig: f.get("synlig") === "on", morgonmejl: f.get("morgonmejl") === "on", epost: epost || null });
    const ny = lagMedId(lag.id)!;
    if (epost && epost !== lag.ledare_epost) mejlaLedarlank(ny).catch(() => {});
    revalidatePath("/lag", "layout");
    return { ok: "Sparat." };
  } catch (e) {
    return { fel: felText(e) };
  }
}

// ------------------------------------------------------------------ admin

// Koden är en sexsiffrig PIN, så felförsök räknas globalt: tio fel stänger inloggningen en kvart.
const adminFel: number[] = [];
const SPARR_MS = 15 * 60 * 1000;

export async function adminLoggaIn(_: Svar, f: FormData): Promise<Svar> {
  const losen = process.env.ADMIN_LOSEN;
  const nu = Date.now();
  while (adminFel.length && adminFel[0] < nu - SPARR_MS) adminFel.shift();
  if (adminFel.length >= 10) return { fel: "För många felförsök. Försök igen om en kvart." };
  if (!losen || String(f.get("losen")) !== losen) {
    adminFel.push(nu);
    await new Promise((r) => setTimeout(r, 800));
    return { fel: "Fel lösenord." };
  }
  adminFel.length = 0;
  (await cookies()).set(ADMINKAKA, adminKakvarde(losen), { ...kakOpt, maxAge: 60 * 60 * 24 * 30 });
  redirect(f.get("till") === "/barn/admin" ? "/barn/admin" : "/admin");
}
