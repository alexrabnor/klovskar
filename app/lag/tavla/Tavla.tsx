"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { bildUrl } from "@/components/Bild";

interface Kort { id: number; typ: "lucka" | "person" | "lapp"; referens: string | null; rubrik: string; text: string; x: number; y: number; bild: string | null }
interface Trad { id: number; fran_kort: number; till_kort: number }

const BREDD = 1400, HOJD = 1000, KB = 170, KH = 104;

async function skicka(body: object) {
  const r = await fetch("/api/lag/tavla", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
  if (!r?.ok) {
    const d = await r?.json().catch(() => null);
    throw new Error(d?.fel || "Det gick inte att spara. Försök igen.");
  }
}

export function Tavla({ luckor, personer }: { luckor: { nr: number; titel: string }[]; personer: { id: string; namn: string }[] }) {
  const [kort, setKort] = useState<Kort[]>([]);
  const [tradar, setTradar] = useState<Trad[]>([]);
  const [tradlage, setTradlage] = useState(false);
  const [forsta, setForsta] = useState<number | null>(null);
  const [vald, setVald] = useState<number | null>(null);
  const [fel, setFel] = useState("");
  const [lapp, setLapp] = useState("");
  const drag = useRef<{ id: number; dx: number; dy: number; flyttad: boolean } | null>(null);
  const yta = useRef<HTMLDivElement>(null);
  const skala = useRef(1);

  const hamta = useCallback(async () => {
    if (drag.current) return;
    const r = await fetch("/api/lag/tavla", { cache: "no-store" }).catch(() => null);
    if (!r?.ok) return;
    const d = await r.json();
    setKort(d.kort);
    setTradar(d.tradar);
  }, []);

  useEffect(() => {
    hamta();
    const t = setInterval(() => { if (!document.hidden) hamta(); }, 10000);
    return () => clearInterval(t);
  }, [hamta]);

  const kor = async (body: object) => {
    setFel("");
    try { await skicka(body); } catch (e) { setFel((e as Error).message); }
    hamta();
  };

  // Nya kort hamnar där man tittar just nu
  const ledigPlats = () => {
    const el = yta.current?.parentElement;
    const s = skala.current;
    const x = el ? (el.scrollLeft + el.clientWidth / 2) / s - KB / 2 : 40;
    const y = el ? (el.scrollTop + 60) / s : 40;
    return { x: Math.round(x + (Math.random() * 60 - 30)), y: Math.round(y + Math.random() * 40) };
  };

  const ned = (e: React.PointerEvent, k: Kort) => {
    if (tradlage) return;
    const r = yta.current!.getBoundingClientRect();
    const s = r.width / BREDD;
    skala.current = s;
    drag.current = { id: k.id, dx: (e.clientX - r.left) / s - k.x, dy: (e.clientY - r.top) / s - k.y, flyttad: false };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const flytta = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const r = yta.current!.getBoundingClientRect();
    const s = r.width / BREDD;
    const x = Math.max(0, Math.min(BREDD - KB, (e.clientX - r.left) / s - d.dx));
    const y = Math.max(0, Math.min(HOJD - KH, (e.clientY - r.top) / s - d.dy));
    d.flyttad = true;
    setKort((ks) => ks.map((k) => (k.id === d.id ? { ...k, x, y } : k)));
  };
  const upp = (k: Kort) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.flyttad) {
      const ny = kort.find((x) => x.id === k.id);
      if (ny) kor({ op: "flytta", id: k.id, x: Math.round(ny.x), y: Math.round(ny.y) });
    } else setVald((v) => (v === k.id ? null : k.id));
  };
  const klickKort = (k: Kort) => {
    if (!tradlage) return;
    if (forsta === null) setForsta(k.id);
    else { if (forsta !== k.id) kor({ op: "trad", fran: forsta, till: k.id }); setForsta(null); }
  };

  const mitt = (id: number) => {
    const k = kort.find((x) => x.id === id);
    return k ? { x: k.x + KB / 2, y: k.y + 14 } : null;
  };

  return (
    <div className="stack">
      <div className="tavla-verktyg">
        <select aria-label="Fäst en lucka" value="" onChange={(e) => { if (e.target.value) kor({ op: "nytt", typ: "lucka", referens: e.target.value, ...ledigPlats() }); }}>
          <option value="">+ Fäst en lucka</option>
          {luckor.map((l) => <option key={l.nr} value={l.nr}>Lucka {l.nr} – {l.titel}</option>)}
        </select>
        <select aria-label="Fäst en person" value="" onChange={(e) => { if (e.target.value) kor({ op: "nytt", typ: "person", referens: e.target.value, ...ledigPlats() }); }}>
          <option value="">+ Fäst en person</option>
          {personer.map((p) => <option key={p.id} value={p.id}>{p.namn}</option>)}
        </select>
        <form className="tavla-ny-lapp" onSubmit={(e) => { e.preventDefault(); if (lapp.trim()) { kor({ op: "nytt", typ: "lapp", text: lapp, ...ledigPlats() }); setLapp(""); } }}>
          <input type="text" aria-label="Text på lappen" placeholder="Skriv en lapp …" value={lapp} onChange={(e) => setLapp(e.target.value)} maxLength={280} />
          <button className="knapp knapp-liten" disabled={!lapp.trim()}>Fäst</button>
        </form>
        <button type="button" className={`knapp knapp-liten ${tradlage ? "" : "knapp-sekundar"}`} aria-pressed={tradlage} onClick={() => { setTradlage((v) => !v); setForsta(null); }}>
          {tradlage ? (forsta ? "Välj kort nr 2 …" : "Välj kort nr 1 …") : "Röd tråd"}
        </button>
      </div>
      {fel && <p className="fel">{fel}</p>}
      <div className="tavla-rull">
        <div ref={yta} className={`tavla${tradlage ? " tavla-tradlage" : ""}`} style={{ aspectRatio: `${BREDD} / ${HOJD}` }}>
          <svg viewBox={`0 0 ${BREDD} ${HOJD}`} className="tavla-tradar" aria-hidden="true">
            {tradar.map((t) => {
              const a = mitt(t.fran_kort), b = mitt(t.till_kort);
              if (!a || !b) return null;
              const mx = (a.x + b.x) / 2, my = Math.max(a.y, b.y) + 40;
              return (
                <g key={t.id}>
                  <path d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`} fill="none" stroke="#7a1d17" strokeWidth="5" opacity=".5" />
                  <path d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`} fill="none" stroke="var(--trad)" strokeWidth="3" />
                </g>
              );
            })}
          </svg>
          {kort.map((k) => (
            <div key={k.id}
              className={`tavla-kort tavla-${k.typ}${forsta === k.id ? " forsta" : ""}${vald === k.id ? " vald" : ""}`}
              style={{ left: `${(k.x / BREDD) * 100}%`, top: `${(k.y / HOJD) * 100}%`, width: `${(KB / BREDD) * 100}%`, minHeight: `${(KH / HOJD) * 100}%`, transform: `rotate(${((k.id * 37) % 7) - 3}deg)` }}
              onPointerDown={(e) => ned(e, k)} onPointerMove={flytta} onPointerUp={() => upp(k)} onClick={() => klickKort(k)}
              role="button" tabIndex={0} aria-label={`${k.rubrik}: ${k.text}`}
            >
              <span className="nal" aria-hidden="true" />
              {k.bild && <img src={bildUrl(k.bild, 320)} alt="" draggable={false} />}
              <b>{k.rubrik}</b>
              <span>{k.text}</span>
              {vald === k.id && !tradlage && (
                <button type="button" className="tavla-tabort" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); kor({ op: "tabort", id: k.id }); setVald(null); }}>Ta bort</button>
              )}
            </div>
          ))}
          {kort.length === 0 && <p className="tavla-tom">Tavlan är tom. Fäst er första ledtråd med knapparna ovanför.</p>}
        </div>
      </div>
      {tradar.length > 0 && (
        <details className="liten">
          <summary className="dampad">Trådar ({tradar.length})</summary>
          <ul>
            {tradar.map((t) => {
              const a = kort.find((k) => k.id === t.fran_kort), b = kort.find((k) => k.id === t.till_kort);
              return <li key={t.id}>{a?.rubrik} – {b?.rubrik} <button className="lank-knapp" onClick={() => kor({ op: "tabortTrad", id: t.id })}>klipp av</button></li>;
            })}
          </ul>
        </details>
      )}
    </div>
  );
}
