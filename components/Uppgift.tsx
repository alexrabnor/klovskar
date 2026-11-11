"use client";
import { useEffect, useRef, useState } from "react";
import type { Uppgift as UppgiftData } from "@/content/typer";
import { markeraUppgift } from "@/app/lag/lucka/actions";

/** En liten uppgift i en lucka: välj en rad, räkna, kryssa i eller ställ en klocka. */
export function Uppgift({ nr, u, redanLost, spara }: { nr: number; u: UppgiftData; redanLost?: boolean; spara?: boolean }) {
  // Laget delar lösningen: den sparas på servern, inte i telefonen
  const [lost, setLost] = useState(!!redanLost);
  const [svar, setSvar] = useState<string | null>(null);
  const losRuta = useRef<HTMLDivElement>(null);
  const nyssLost = useRef(false);

  useEffect(() => {
    if (lost && nyssLost.current) losRuta.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [lost]);

  const ratt = () => {
    setSvar(null);
    nyssLost.current = true;
    setLost(true);
    if (spara) markeraUppgift(nr).catch(() => {});
  };

  return (
    <section className="stack uppgift">
      <p className="uppgift-etikett">Uppgift</p>
      <h2 className="rubrik-mellan">{u.rubrik}</h2>
      <p>{u.fraga}</p>
      {u.typ === "rad" && <Rader u={u} lost={lost} onRatt={ratt} onFel={setSvar} />}
      {u.typ === "tal" && <Tal u={u} lost={lost} onRatt={ratt} onFel={setSvar} />}
      {u.typ === "flerval" && <Flerval u={u} lost={lost} onRatt={ratt} onFel={setSvar} />}
      {u.typ === "klocka" && <Klocka u={u} lost={lost} onRatt={ratt} onFel={setSvar} />}
      {!lost && svar && <p className="uppgift-fel" role="status">{svar}</p>}
      {lost && (
        <div className="pussel-lost" role="status" ref={losRuta}>
          <b>✓ Rätt.</b> {u.lost}
        </div>
      )}
    </section>
  );
}

type Del<T extends UppgiftData["typ"]> = {
  u: Extract<UppgiftData, { typ: T }>;
  lost: boolean;
  onRatt: () => void;
  onFel: (s: string) => void;
};

function Rader({ u, lost, onRatt, onFel }: Del<"rad">) {
  const [vald, setVald] = useState<number | null>(null);
  return (
    <ul className="uppgift-rader">
      {u.rader.map((r, i) => {
        const klass = lost && i === u.ratt ? " ratt" : !lost && vald === i ? " fel" : "";
        return (
          <li key={i}>
            <button type="button" className={`uppgift-rad${klass}`} disabled={lost} aria-pressed={vald === i}
              onClick={() => { setVald(i); if (i === u.ratt) onRatt(); else onFel(r.svar ?? u.fel); }}>
              {r.text}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Tal({ u, lost, onRatt, onFel }: Del<"tal">) {
  const [v, setV] = useState("");
  const kolla = (e: React.FormEvent) => {
    e.preventDefault();
    const tal = Number(v.replace(/\s/g, "").replace(",", ".").replace(/[^\d.]/g, ""));
    if (v.trim() && Number.isFinite(tal) && tal >= u.godkand[0] && tal <= u.godkand[1]) onRatt();
    else onFel(u.fel);
  };
  return (
    <form className="rad" onSubmit={kolla}>
      <label htmlFor="uppgift-tal" className="dold">Svar i {u.enhet}</label>
      <input id="uppgift-tal" type="text" inputMode="decimal" autoComplete="off" value={v} disabled={lost}
        onChange={(e) => setV(e.target.value)} placeholder="0,0" style={{ width: 120 }} />
      <span>{u.enhet}</span>
      {!lost && <button className="knapp knapp-liten">Kontrollera</button>}
    </form>
  );
}

function Flerval({ u, lost, onRatt, onFel }: Del<"flerval">) {
  const [valda, setValda] = useState<string[]>([]);
  const vaxla = (x: string) => setValda((v) => (v.includes(x) ? v.filter((y) => y !== x) : [...v, x]));
  const kolla = () => {
    const fel = valda.find((x) => !u.ratt.includes(x));
    if (fel) return onFel(u.felval[fel] ?? u.saknas);
    if (u.ratt.every((x) => valda.includes(x))) return onRatt();
    onFel(u.saknas);
  };
  const visade = lost ? u.ratt : valda;
  return (
    <div className="stack">
      <div className="uppgift-val">
        {u.val.map((x) => (
          <button key={x} type="button" className={`uppgift-valknapp${visade.includes(x) ? " vald" : ""}`}
            aria-pressed={visade.includes(x)} disabled={lost} onClick={() => vaxla(x)}>
            {x}
          </button>
        ))}
      </div>
      {!lost && <button type="button" className="knapp knapp-liten" style={{ justifySelf: "start" }} onClick={kolla} disabled={!valda.length}>Kontrollera</button>}
    </div>
  );
}

const tillMin = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
const visaTid = (min: number) => `${String(Math.floor(min / 60) % 24).padStart(2, "0")}.${String(min % 60).padStart(2, "0")}`;

function Klocka({ u, lost, onRatt, onFel }: Del<"klocka">) {
  const start = tillMin(u.start);
  const [min, setMin] = useState(start);
  const visad = lost ? Math.round((u.godkand[0] + u.godkand[1]) / 2) : min;
  // Visarna: minutvisaren 6° per minut, timvisaren 0,5° per minut
  const minVinkel = (visad % 60) * 6;
  const timVinkel = ((visad / 60) % 12) * 30;
  const steg = (d: number) => setMin((m) => (m + d + 1440) % 1440);
  const kolla = () => {
    if (min >= u.godkand[0] && min <= u.godkand[1]) onRatt();
    else onFel(min === start ? u.felStart : u.fel);
  };
  return (
    <div className="uppgift-klocka">
      <svg viewBox="0 0 200 200" width="200" height="200" role="img" aria-label={`Fickuret visar ${visaTid(visad)}`}>
        <circle cx="100" cy="100" r="94" fill="#f2ead8" stroke="#b9772a" strokeWidth="6" />
        {Array.from({ length: 60 }, (_, i) => (
          <line key={i} x1="100" y1="12" x2="100" y2={i % 5 ? 18 : 26} stroke="#222c3a" strokeWidth={i % 5 ? 1 : 3}
            transform={`rotate(${i * 6} 100 100)`} />
        ))}
        {[12, 3, 6, 9].map((t, i) => {
          const a = (i * 90 - 90) * (Math.PI / 180);
          return <text key={t} x={100 + 62 * Math.cos(a)} y={100 + 62 * Math.sin(a) + 7} textAnchor="middle" fontSize="20" fill="#222c3a" fontFamily="Georgia, serif">{t}</text>;
        })}
        <line x1="100" y1="100" x2="100" y2="52" stroke="#222c3a" strokeWidth="6" strokeLinecap="round" transform={`rotate(${timVinkel} 100 100)`} />
        <line x1="100" y1="100" x2="100" y2="24" stroke="#222c3a" strokeWidth="3" strokeLinecap="round" transform={`rotate(${minVinkel} 100 100)`} />
        <circle cx="100" cy="100" r="5" fill="#b9772a" />
      </svg>
      <div className="stack" style={{ gap: 10 }}>
        <p className="uppgift-tid" aria-live="polite">{visaTid(visad)}</p>
        {!lost && (
          <>
            <div className="rad" style={{ gap: 6 }}>
              <button type="button" className="knapp knapp-sekundar knapp-liten" onClick={() => steg(-60)} aria-label="En timme bakåt">−1 h</button>
              <button type="button" className="knapp knapp-sekundar knapp-liten" onClick={() => steg(-1)} aria-label="En minut bakåt">−1 min</button>
              <button type="button" className="knapp knapp-sekundar knapp-liten" onClick={() => steg(1)} aria-label="En minut framåt">+1 min</button>
              <button type="button" className="knapp knapp-sekundar knapp-liten" onClick={() => steg(60)} aria-label="En timme framåt">+1 h</button>
            </div>
            <div className="rad" style={{ gap: 6 }}>
              <button type="button" className="knapp knapp-liten" onClick={kolla}>Kontrollera</button>
              <button type="button" className="lank-knapp" onClick={() => setMin(start)}>Börja om</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
