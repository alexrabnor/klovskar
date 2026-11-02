"use server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { inloggad } from "@/lib/session";
import { arOppen } from "@/lib/tid";
import { rensaUtkast } from "@/lib/anklagelse-val";
import { raknaPoang } from "@/lib/poang";
import { upplastaBonusar } from "@/lib/innehall";
import { personMedId } from "@/content/personer";
import type { Svar } from "@/app/actions";

export async function lamnaIn(_: Svar, f: FormData): Promise<Svar> {
  const i = await inloggad();
  if (!i) return { fel: "Du är inte inloggad." };
  if (!arOppen(i.lag, 24, i.nu)) return { fel: "Anklagelsen kan lämnas in först när lucka 24 har öppnat." };
  if (!i.farLamnaIn) return { fel: "Bara lagledaren – eller den lagledaren har gett rätten – kan lämna in." };
  const utkast = rensaUtkast(JSON.parse(String(f.get("utkast") || "{}")));
  if (!utkast.mordare || !personMedId(utkast.mordare)) return { fel: "Välj vem ni anklagar." };
  if (!utkast.motiv || !utkast.metod || !utkast.tid) return { fel: "Fyll i motiv, metod och tid innan ni lämnar in." };
  const d = db();
  const klart = d.transaction(() => {
    const lag = d.prepare("SELECT anklagelse_inlamnad FROM klov_lag WHERE id = ?").get(i.lag.id) as { anklagelse_inlamnad: number };
    if (lag.anklagelse_inlamnad) return false;
    const p = raknaPoang(utkast, upplastaBonusar(i.lag.id).size);
    d.prepare(`INSERT INTO klov_anklagelse (lag_id, utkast, uppdaterad_av, uppdaterad, inlamnad, inlamnad_tid, inlamnad_av, poang_detaljer)
      VALUES (?, ?, ?, datetime('now'), 1, datetime('now'), ?, ?)
      ON CONFLICT(lag_id) DO UPDATE SET utkast = excluded.utkast, inlamnad = 1, inlamnad_tid = excluded.inlamnad_tid,
        inlamnad_av = excluded.inlamnad_av, poang_detaljer = excluded.poang_detaljer`)
      .run(i.lag.id, JSON.stringify(utkast), i.spelare.namn, i.spelare.namn, JSON.stringify(p));
    d.prepare("UPDATE klov_lag SET anklagelse_inlamnad = 1, poang = ? WHERE id = ?").run(p.totalt, i.lag.id);
    return true;
  })();
  if (!klart) return { fel: "Laget har redan lämnat in." };
  redirect("/lag/facit");
}
