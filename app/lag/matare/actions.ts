"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { inloggad } from "@/lib/session";
import { speldag } from "@/lib/tid";
import { personMedId } from "@/content/personer";

export async function rosta(f: FormData) {
  const i = await inloggad();
  if (!i) return;
  const dag = speldag(i.lag, i.nu);
  const vem = String(f.get("misstankt"));
  if (dag < 1 || !personMedId(vem)) return;
  // En röst per spelare och dag – man får ändra sig samma dag
  db().prepare(`INSERT INTO klov_rost (lag_id, spelare_id, dag, misstankt) VALUES (?, ?, ?, ?)
    ON CONFLICT(spelare_id, dag) DO UPDATE SET misstankt = excluded.misstankt`).run(i.lag.id, i.spelare.id, dag, vem);
  revalidatePath("/lag/matare");
}
