"use server";
import { redirect } from "next/navigation";
import { skapaCheckout } from "@/lib/kop";
import { kopOppet } from "@/lib/stripe";
import type { Svar } from "@/app/actions";
import { arVara, barnPa, type Vara } from "@/lib/spel";

export async function startaKop(_: Svar, f: FormData): Promise<Svar> {
  if (!kopOppet()) return { fel: "Spelet släpps snart. Köpet är inte öppet än." };
  if (f.get("villkor") !== "on" || f.get("anger") !== "on") return { fel: "Kryssa i båda rutorna för att fortsätta." };
  const epost = String(f.get("epost") || "").trim().slice(0, 120);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(epost)) return { fel: "Skriv en giltig e-postadress." };
  let url: string;
  try {
    // Barndeckaren och paketet går bara att köpa där barndeckaren är påslagen
    const onskad = f.get("vara");
    const vara: Vara = arVara(onskad) && (onskad === "klovskar" || barnPa()) ? onskad : "klovskar";
    url = await skapaCheckout({ present: f.get("present") === "1", epost, vara });
  } catch (e) {
    console.error("[köp]", e);
    return { fel: "Betalningen kunde inte startas just nu. Försök igen om en stund." };
  }
  redirect(url);
}
