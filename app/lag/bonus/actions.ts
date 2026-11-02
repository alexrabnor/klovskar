"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { inloggad } from "@/lib/session";
import { arOppen } from "@/lib/tid";
import { arRattSvar, bonusNr } from "@/content/bonus";
import type { Svar } from "@/app/actions";

export async function losBonus(_: Svar, f: FormData): Promise<Svar> {
  const i = await inloggad();
  if (!i) return { fel: "Du är inte inloggad." };
  const b = bonusNr(Number(f.get("nr")));
  if (!b || !arOppen(i.lag, b.synsFran, i.nu)) return { fel: "Chiffret är inte synligt än." };
  // Lite eftertanke mellan gissningarna gör det meningslöst att prova sig fram maskinellt
  await new Promise((r) => setTimeout(r, 600));
  if (!arRattSvar(b, String(f.get("svar") ?? ""))) return { fel: "Det stämmer inte. Försök igen." };
  db().prepare("INSERT OR IGNORE INTO klov_bonus (lag_id, bonus_nr, upplast_av) VALUES (?, ?, ?)").run(i.lag.id, b.nr, i.spelare.namn);
  revalidatePath("/lag/bonus", "layout");
  return { ok: "Rätt!" };
}
