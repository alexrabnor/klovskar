"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { inloggad, kakor, ledarLag } from "@/lib/session";
import { oppenBarnLucka, sattUppdrag } from "@/lib/barn";
import { taBortSpelare } from "@/lib/lag";

/** Laget har gjort (eller ångrat) dagens uppdrag. Servern litar på klienten – det finns inget att vinna på att fuska. */
export async function markeraUppdrag(nr: number, gjort: boolean): Promise<void> {
  const i = await inloggad("barn");
  if (!i) return;
  const lucka = oppenBarnLucka(i.lag, Number(nr), i.nu);
  if (!lucka) return;
  sattUppdrag(i.lag.id, lucka.nr, !!gjort, i.spelare.namn);
  revalidatePath("/barn", "layout");
}

export async function barnTaBortSpelare(f: FormData) {
  const lag = await ledarLag("barn");
  if (!lag) return;
  taBortSpelare(lag, Number(f.get("id")));
  revalidatePath("/barn", "layout");
}

export async function loggaUtBarn() {
  const k = await cookies();
  k.delete(kakor("barn").spelare);
  k.delete(kakor("barn").ledare);
  redirect("/barn");
}
