import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { db } from "@/lib/db";
import { speldag } from "@/lib/tid";
import { PERSONER } from "@/content/personer";
import { rosta } from "./actions";

export const metadata: Metadata = { title: "Misstankemätaren" };

// En färg per misstänkt, valda för att gå att skilja åt mot den mörka bakgrunden
const FARG: Record<string, string> = {
  ingrid: "#c9a0dc", carl: "#e2a24a", elsa: "#7fb3d5", margit: "#e07a6c",
  bertil: "#8fc79a", sven: "#d6cfa3", johan: "#a3a9b8",
};

export default async function Matare() {
  const { lag, spelare, nu } = await kravInloggad();
  const dag = speldag(lag, nu);
  const roster = db().prepare("SELECT dag, misstankt, COUNT(*) n FROM klov_rost WHERE lag_id = ? GROUP BY dag, misstankt").all(lag.id) as { dag: number; misstankt: string; n: number }[];
  const min = db().prepare("SELECT misstankt FROM klov_rost WHERE spelare_id = ? AND dag = ?").get(spelare.id, dag) as { misstankt: string } | undefined;
  const idag = PERSONER.map((p) => ({ ...p, n: roster.find((r) => r.dag === dag && r.misstankt === p.id)?.n ?? 0 }));
  const totaltIdag = idag.reduce((s, p) => s + p.n, 0);
  const maxIdag = Math.max(1, ...idag.map((p) => p.n));

  // Linjen över tid: andel av dagens röster per person
  const dagar = Array.from({ length: Math.max(dag, 1) }, (_, i) => i + 1);
  const andel = (d: number, id: string) => {
    const tot = roster.filter((r) => r.dag === d).reduce((s, r) => s + r.n, 0);
    return tot ? (roster.find((r) => r.dag === d && r.misstankt === id)?.n ?? 0) / tot : null;
  };
  const W = 640, H = 240, VM = 34, HM = 12, TM = 12, BM = 26;
  const x = (d: number) => VM + ((d - 1) / Math.max(1, dagar.length - 1)) * (W - VM - HM);
  const y = (v: number) => TM + (1 - v) * (H - TM - BM);
  const harHistorik = roster.length > 0;

  return (
    <main className="sida">
      <header className="stack">
        <p className="etikett">Misstankemätaren</p>
        <h1 className="rubrik-mellan">Vem tror ni att det är?</h1>
        <p className="dampad">En röst per person och dag. Du kan ändra dig fram till nästa lucka.</p>
      </header>

      {dag < 1 ? (
        <p className="panel">Röstningen öppnar med lucka 1.</p>
      ) : (
        <form action={rosta} className="panel stack">
          <p><b>Dag {dag}:</b> {min ? <>du misstänker <b>{PERSONER.find((p) => p.id === min.misstankt)?.namn}</b>.</> : "du har inte röstat i dag."}</p>
          <div className="personer">
            {PERSONER.map((p) => (
              <button key={p.id} name="misstankt" value={p.id} className={`person${min?.misstankt === p.id ? " vald" : ""}`} aria-pressed={min?.misstankt === p.id}>
                <span className="person-namn">{p.namn}</span>
                <span className="person-roll">{p.roll}</span>
              </button>
            ))}
          </div>
        </form>
      )}

      {dag >= 1 && (
        <section className="stack">
          <h2 style={{ fontSize: 22 }}>I dag ({totaltIdag} {totaltIdag === 1 ? "röst" : "röster"})</h2>
          <div className="staplar">
            {idag.map((p) => (
              <div key={p.id} className="stapel-rad">
                <span className="stapel-namn">{p.namn}</span>
                <span className="stapel-spar"><span className="stapel" style={{ width: `${(p.n / maxIdag) * 100}%`, background: FARG[p.id] }} /></span>
                <span className="stapel-tal">{p.n}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {harHistorik && dagar.length > 1 && (
        <section className="stack">
          <h2 style={{ fontSize: 22 }}>Hur misstankarna har svängt</h2>
          <div className="rull-x">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Andel av lagets röster per misstänkt och dag" style={{ width: "100%", minWidth: 480 }}>
              {[0, 0.5, 1].map((v) => (
                <g key={v}>
                  <line x1={VM} x2={W - HM} y1={y(v)} y2={y(v)} stroke="var(--linje)" strokeWidth="1" />
                  <text x={VM - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--dampad)">{v * 100}%</text>
                </g>
              ))}
              {dagar.filter((d) => d === 1 || d % 4 === 0 || d === dagar.length).map((d) => (
                <text key={d} x={x(d)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--dampad)">{d}</text>
              ))}
              {PERSONER.map((p) => {
                const pts = dagar.map((d) => [d, andel(d, p.id)] as const).filter(([, v]) => v !== null) as [number, number][];
                if (!pts.some(([, v]) => v > 0)) return null;
                const sista = pts[pts.length - 1];
                return (
                  <g key={p.id}>
                    <polyline points={pts.map(([d, v]) => `${x(d)},${y(v)}`).join(" ")} fill="none" stroke={FARG[p.id]} strokeWidth="2.2" strokeLinejoin="round" />
                    <circle cx={x(sista[0])} cy={y(sista[1])} r="3.5" fill={FARG[p.id]} />
                  </g>
                );
              })}
            </svg>
          </div>
          <ul className="teckenforklaring">
            {PERSONER.map((p) => <li key={p.id}><span style={{ background: FARG[p.id] }} />{p.namn}</li>)}
          </ul>
        </section>
      )}
    </main>
  );
}
