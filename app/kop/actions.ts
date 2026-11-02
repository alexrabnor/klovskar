"use server";
import { redirect } from "next/navigation";
import { skapaCheckout } from "@/lib/kop";
import type { Svar } from "@/app/actions";

export async function startaKop(_: Svar, f: FormData): Promise<Svar> {
  if (f.get("villkor") !== "on" || f.get("anger") !== "on") return { fel: "Kryssa i båda rutorna för att fortsätta." };
  const epost = String(f.get("epost") || "").trim().slice(0, 120);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(epost)) return { fel: "Skriv en giltig e-postadress." };
  let url: string;
  try {
    url = await skapaCheckout({ present: f.get("present") === "1", epost });
  } catch (e) {
    console.error("[köp]", e);
    return { fel: "Betalningen kunde inte startas just nu. Försök igen om en stund." };
  }
  redirect(url);
}
