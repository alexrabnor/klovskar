import Link from "next/link";
import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { facitOppet } from "@/lib/tid";
import { db } from "@/lib/db";
import { FACIT_STEG, NYCKELLEDTRADAR } from "@/content/facit";
import { MAX_POANG, type Poang } from "@/lib/poang";
import { PERSONER } from "@/content/personer";
import { MOTIV, METOD } from "@/lib/anklagelse-val";
import { Avslojande } from "./Avslojande";
import { Text } from "@/components/Text";

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
  const FALL_MAX = 5 + 3 + 3 + 2;
  const rad = (etikett: string, ert: string, poang: number, max: number) => (
    <tr><td>{etikett}</td><td>{ert}</td><td className="tal">{poang} / {max}</td></tr>
  );
  return (
    <main className="sida">
      <Avslojande steg={FACIT_STEG.map((s) => ({ rubrik: s.rubrik, innehall: <Text text={s.text} /> }))}>
        <section className="stack">
          <p className="etikett">Lagets resultat</p>
          <h2 className="rubrik-stor">Fallet: {fall} av {FALL_MAX}</h2>
          <p className="dampad">Chiffer: {p.bonus} av 6 · Totalt {p.totalt} av {MAX_POANG} poäng</p>
          <div className="rull-x">
            <table className="tabell">
              <thead><tr><th>Del</th><th>Ert svar</th><th>Poäng</th></tr></thead>
              <tbody>
                {rad("Mördaren", PERSONER.find((x) => x.id === u.mordare)?.namn ?? "–", p.mordare, 5)}
                {rad("Motiv", MOTIV.find((x) => x.id === u.motiv)?.text ?? "–", p.motiv, 3)}
                {rad("Metod", METOD.find((x) => x.id === u.metod)?.text ?? "–", p.metod, 3)}
                {rad("Tid", u.tid ?? "–", p.tid, 2)}
                {rad("Chiffer (frivilliga)", `${p.bonus} lösta`, p.bonus, 6)}
              </tbody>
            </table>
          </div>
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
