"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ADMINKAKA, arAdmin } from "@/lib/session";
import { nyAktiveringskod } from "@/lib/slump";
import { stripeLage } from "@/lib/stripe";
import { lagMedId } from "@/lib/db";
import { giltigtStartdatum } from "@/lib/lag";

/** Båda adminsidorna visar lag och koder, så båda laddas om. */
function uppdatera() {
  revalidatePath("/admin");
  revalidatePath("/barn/admin");
}

async function krav() {
  if (!(await arAdmin())) throw new Error("Inte admin");
}

export async function skapaGratiskod(f: FormData) {
  await krav();
  const antal = Math.max(1, Math.min(20, Number(f.get("antal")) || 1));
  const notering = String(f.get("notering") || "").slice(0, 120) || null;
  const typ = f.get("testare") ? "testare" : "gratis";
  // Barnens admin skickar med spel=barn. Koden bestämmer vilket spel laget hör till.
  const spel = f.get("spel") === "barn" ? "barn" : "klovskar";
  const ins = db().prepare("INSERT INTO klov_kod (kod, typ, notering, testlage, spel) VALUES (?, ?, ?, ?, ?)");
  for (let i = 0; i < antal; i++) ins.run(nyAktiveringskod(), typ, notering, stripeLage() === "test" ? 1 : 0, spel);
  uppdatera();
}

/** Flytta ett lags klocka – för testlag. Påverkar bara det laget. */
export async function satForskjutning(f: FormData) {
  await krav();
  const dagar = Number(f.get("dagar")) || 0;
  const timmar = Number(f.get("timmar")) || 0;
  db().prepare("UPDATE klov_lag SET forskjutning_min = ? WHERE id = ?").run(Math.round((dagar * 24 + timmar) * 60), Number(f.get("id")));
  uppdatera();
}

export async function adminStartdatum(f: FormData) {
  await krav();
  const s = String(f.get("startdatum"));
  if (giltigtStartdatum(s)) db().prepare("UPDATE klov_lag SET startdatum = ? WHERE id = ?").run(s, Number(f.get("id")));
  uppdatera();
}

/** Ångra en inlämning, t.ex. när ett testlag ska spela slutet igen. */
export async function nollstallAnklagelse(f: FormData) {
  await krav();
  const id = Number(f.get("id"));
  db().prepare("UPDATE klov_lag SET anklagelse_inlamnad = 0, poang = NULL WHERE id = ?").run(id);
  db().prepare("UPDATE klov_anklagelse SET inlamnad = 0, inlamnad_tid = NULL, inlamnad_av = NULL, poang_detaljer = NULL WHERE lag_id = ?").run(id);
  uppdatera();
}

export async function taBortLag(f: FormData) {
  await krav();
  const id = Number(f.get("id"));
  if (String(f.get("bekrafta")) !== lagMedId(id)?.namn) return;
  db().prepare("UPDATE klov_kod SET lag_id = NULL WHERE lag_id = ?").run(id);
  db().prepare("DELETE FROM klov_lag WHERE id = ?").run(id);
  uppdatera();
}

export async function adminLoggaUt() {
  (await cookies()).delete(ADMINKAKA);
  redirect("/");
}
