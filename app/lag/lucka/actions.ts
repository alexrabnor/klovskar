"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { inloggad } from "@/lib/session";
import { oppenLucka } from "@/lib/innehall";

/** Laget har löst uppgiften i en lucka. Räknas i sammanställningen på julafton, ger inga poäng. */
export async function markeraUppgift(nr: number): Promise<void> {
  const i = await inloggad();
  if (!i) return;
  const lucka = oppenLucka(i.lag, Number(nr), i.nu);
  if (!lucka?.uppgift) return;
  db().prepare("INSERT OR IGNORE INTO klov_uppgift (lag_id, lucka_nr, lost_av) VALUES (?, ?, ?)").run(i.lag.id, lucka.nr, i.spelare.namn);
  revalidatePath(`/lag/lucka/${lucka.nr}`);
}
