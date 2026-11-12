import Link from "next/link";
import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { facitOppet } from "@/lib/tid";
import { db } from "@/lib/db";
import { FACIT_STEG, NYCKELLEDTRADAR, MORDARE, RATT_MOTIV, RATT_METOD, TID_FRAN, TID_TILL } from "@/content/facit";
import { MAX_POANG, type Poang } from "@/lib/poang";
import { PERSONER } from "@/content/personer";
import { MOTIV, METOD } from "@/lib/anklagelse-val";
import { Avslojande } from "./Avslojande";
import { Text } from "@/components/Text";
import { LUCKOR } from "@/content/luckor";
import { lostaUppgifter } from "@/lib/innehall";

export const metadata: Metadata = { title: "Facit" };

export default async function Facit() {
  const { lag, nu } = await kravInloggad();
  if (!facitOppet(lag, nu)) {
    return (
      <main className="sida">
        <h1 className="rubrik-mellan">Facit är låst</h1>
        <p>Facit öppnar när laget har lämnat in sin anklagelse på julafton.</p>
        <p><Link href="/lag/anklagelse">Till anklagelsen →</Link></p>
      </main>
    );
  }
  const a = db().prepare("SELECT utkast, poang_detaljer, inlamnad_av FROM klov_anklagelse WHERE lag_id = ?").get(lag.id) as { utkast: string; poang_detaljer: string; inlamnad_av: string };
  const u = JSON.parse(a.utkast);
  const p = JSON.parse(a.poang_detaljer) as Poang;
  const fall = p.mordare + p.motiv + p.metod + p.tid;
  const antalUppgifter = LUCKOR.filter((l) => l.uppgift).length;
  const uppgifter = lostaUppgifter(lag.id).size;
  const FALL_MAX = 5 + 3 + 3 + 2;
  const klock = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}.${String(min % 60).padStart(2, "0")}`;
  const delar = [
    { del: "Mördaren", ert: PERSONER.find((x) => x.id === u.mordare)?.namn ?? "–", ratt: PERSONER.find((x) => x.id === MORDARE)!.namn, poang: p.mordare, max: 5 },
    { del: "Motiv", ert: MOTIV.find((x) => x.id === u.motiv)?.text ?? "–", ratt: MOTIV.find((x) => x.id === RATT_MOTIV)!.text, poang: p.motiv, max: 3 },
    { del: "Metod", ert: METOD.find((x) => x.id === u.metod)?.text ?? "–", ratt: METOD.find((x) => x.id === RATT_METOD)!.text, poang: p.metod, max: 3 },
    { del: "Tidpunkt", ert: u.tid ? u.tid.replace(":", ".") : "–", ratt: `${klock(TID_FRAN)}–${klock(TID_TILL)}`, poang: p.tid, max: 2 },
    { del: "Chiffer (frivilliga)", ert: `${p.bonus} lösta`, ratt: "6 lösta", poang: p.bonus, max: 6, valfri: true },
  ];
  return (
    <main className="sida">
      <Avslojande steg={FACIT_STEG.map((s) => ({ rubrik: s.rubrik, innehall: <Text text={s.text} /> }))}>
        <section className="stack">
          <p className="etikett">Lagets resultat</p>
          <h2 className="rubrik-stor">Fallet: {fall} av {FALL_MAX}</h2>
          <ol className="resultat">
            {delar.map((d) => (
              <li key={d.del} className={d.valfri ? "res-valfri" : d.poang === d.max ? "res-ratt" : d.poang > 0 ? "res-delvis" : "res-fel"}>
                <div className="resultat-topp">
                  <span className="resultat-del">{d.del}</span>
                  <span className="resultat-poang">{d.poang} / {d.max} p</span>
                </div>
                <dl>
                  <div><dt>Ert svar</dt><dd>{d.ert}</dd></div>
                  <div><dt>Rätt svar</dt><dd>{d.ratt}</dd></div>
                </dl>
              </li>
            ))}
            <li className="resultat-total">
              <span>Totalt</span>
              <span className="resultat-poang">{p.totalt} / {MAX_POANG} p</span>
            </li>
          </ol>
          <p className="dampad liten">Uppgifterna i luckorna ger inga poäng. Ni löste {uppgifter} av {antalUppgifter}.</p>
          {u.motivText?.trim() && (
            <div className="panel stack">
              <p className="etikett">Ert motiv med egna ord</p>
              <p>{u.motivText}</p>
            </div>
          )}
          <p className="dampad liten">Inlämnat av {a.inlamnad_av}. {lag.synlig_i_topplista ? <>Laget syns på <Link href="/topplista">topplistan</Link>.</> : "Laget syns inte på topplistan."}</p>
        </section>
        <section className="stack">
          <h2 className="rubrik-mellan">Såg ni det här?</h2>
          <ul className="ledtradar">
            {NYCKELLEDTRADAR.map((l, i) => (
              <li key={i}><Link href={`/lag/lucka/${l.lucka}`}>Lucka {l.lucka}</Link><span>{l.text}</span></li>
            ))}
          </ul>
        </section>
      </Avslojande>
    </main>
  );
}
