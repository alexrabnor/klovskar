import "server-only";
import { db, type Lag } from "./db";
import { antalOppna, oppningstid, lagetsNu, serverNu } from "./tid";
import { luckaNr } from "@/content/luckor";
import { pushaTillSpelare } from "./push";
import { mejlaMorgon } from "./mail";

/** Notiser skickas bara för luckor som öppnat de senaste tre timmarna – aldrig en hel hög vid ikappläsning. */
const FONSTER_MS = 3 * 3600_000;

let pagar = false;

/** Körs varje minut. Skickar push och morgonmejl för nyöppnade luckor, en gång per lag och lucka. */
export async function skickaNyaLuckor(nu = serverNu()) {
  if (pagar) return;
  pagar = true;
  try {
    const lagen = db().prepare("SELECT * FROM klov_lag").all() as Lag[];
    const skickat = db().prepare("SELECT 1 FROM klov_utskick WHERE lag_id = ? AND lucka_nr = ?");
    const markera = db().prepare("INSERT OR IGNORE INTO klov_utskick (lag_id, lucka_nr) VALUES (?, ?)");
    for (const lag of lagen) {
      const n = antalOppna(lag, nu);
      for (let nr = 1; nr <= n; nr++) {
        if (skickat.get(lag.id, nr)) continue;
        markera.run(lag.id, nr);
        const farsk = lagetsNu(lag, nu) - oppningstid(lag.startdatum, nr) < FONSTER_MS;
        if (!farsk || nr < n) continue;
        const l = luckaNr(nr);
        if (!l) continue;
        const spelare = (db().prepare("SELECT id FROM klov_spelare WHERE lag_id = ?").all(lag.id) as { id: number }[]).map((s) => s.id);
        await pushaTillSpelare(spelare, { titel: `Lucka ${nr} är öppen`, text: l.teaser, url: `/lag/lucka/${nr}` });
        await mejlaMorgon(lag, nr, l.teaser).catch((e) => console.error("[mejl] morgon", e));
      }
    }
  } catch (e) {
    console.error("[utskick]", e);
  } finally {
    pagar = false;
  }
}
