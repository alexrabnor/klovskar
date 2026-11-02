import "server-only";
import { db } from "./db";
import { EPOST_SPARAS_MANADER, manaderEfterSistaLuckan } from "./tid";

/**
 * Laget behåller spelet för alltid, men e-postadresser behövs bara under spelet.
 * 13 månader efter lucka 24 raderas lagledarens e-post, morgonmejlen stängs av och
 * köparens e-post tas bort från koden. Köpet i sig (belopp, datum) sparas för bokföringen.
 *
 * Använder riktig tid – aldrig TESTLAGE_DATUM eller ett lags testklocka.
 */
export function gallra(nu = Date.now()): number {
  const lag = db().prepare(`
    SELECT l.id, l.startdatum FROM klov_lag l
    WHERE l.ledare_epost IS NOT NULL OR EXISTS (SELECT 1 FROM klov_kod k WHERE k.lag_id = l.id AND k.epost IS NOT NULL)
  `).all() as { id: number; startdatum: string }[];
  const utgangna = lag.filter((l) => manaderEfterSistaLuckan(l.startdatum, EPOST_SPARAS_MANADER) <= nu);
  if (!utgangna.length) return 0;
  const rensa = db().transaction((id: number) => {
    db().prepare("UPDATE klov_lag SET ledare_epost = NULL, morgonmejl = 0 WHERE id = ?").run(id);
    db().prepare("UPDATE klov_kod SET epost = NULL WHERE lag_id = ?").run(id);
  });
  for (const l of utgangna) rensa(l.id);
  console.log(`[gallring] tog bort e-post för ${utgangna.length} lag: ${utgangna.map((l) => l.id).join(", ")}`);
  return utgangna.length;
}
