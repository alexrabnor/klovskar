import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { MAX_POANG } from "@/lib/poang";
import { Sidfot } from "@/components/Sidfot";

export const metadata: Metadata = { title: "Topplista" };
export const dynamic = "force-dynamic";

export default function Topplista() {
  const lag = db().prepare(`SELECT l.namn, l.poang, a.inlamnad_tid FROM klov_lag l JOIN klov_anklagelse a ON a.lag_id = l.id
    WHERE l.anklagelse_inlamnad = 1 AND l.synlig_i_topplista = 1 ORDER BY l.poang DESC, a.inlamnad_tid ASC LIMIT 200`).all() as { namn: string; poang: number; inlamnad_tid: string }[];
  const tid = (s: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", dateStyle: "medium", timeStyle: "short" }).format(new Date(s.replace(" ", "T") + "Z"));
  return (
    <>
      <main className="sida">
        <Link href="/" className="liten">← Startsidan</Link>
        <h1 className="rubrik-mellan">Topplistan</h1>
        <p className="dampad">Lag som har lämnat in sin anklagelse. Vid lika poäng vinner den som lämnade in först. Max {MAX_POANG} poäng.</p>
        {lag.length === 0 ? <p className="panel">Inga lag har lämnat in än.</p> : (
          <div className="rull-x">
            <table className="tabell">
              <thead><tr><th>#</th><th>Lag</th><th>Poäng</th><th>Inlämnat</th></tr></thead>
              <tbody>{lag.map((l, i) => <tr key={i}><td className="tal">{i + 1}</td><td>{l.namn}</td><td className="tal">{l.poang}</td><td>{tid(l.inlamnad_tid)}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </main>
      <Sidfot />
    </>
  );
}
