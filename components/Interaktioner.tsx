"use client";
import { useEffect, useMemo, useState } from "react";
import { bildUrl } from "./Bild";
import { Zoombar } from "./Zoombar";
import type { Plats } from "@/content/karta";
import type { Person } from "@/content/personer";

export function Karta({ platser }: { platser: Plats[] }) {
  const [vald, setVald] = useState<Plats | null>(null);
  return (
    <div className="stack">
      <div className="karta">
        <img src={bildUrl("karta", 1600)} alt="Handritad karta över Klovskär 1962." />
        {platser.map((p) => (
          <button key={p.id} type="button" className={`karta-punkt${vald?.id === p.id ? " vald" : ""}`} style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onClick={() => setVald(p)} aria-label={p.namn} aria-pressed={vald?.id === p.id}><span /></button>
        ))}
      </div>
      <div className="panel karta-info" aria-live="polite">
        {vald ? <><h3>{vald.namn}</h3><p>{vald.text}</p></> : <p className="dampad">Tryck på en plats på kartan.</p>}
      </div>
    </div>
  );
}

export function Loggbok({ namn, alt, transkription }: { namn: string; alt: string; transkription: string }) {
  const [visa, setVisa] = useState(false);
  return (
    <div className="stack">
      <Zoombar namn={namn} alt={alt} prioritet />
      <div>
        <button type="button" className="knapp knapp-sekundar" onClick={() => setVisa((v) => !v)} aria-expanded={visa}>
          {visa ? "Dölj transkription" : "Läs transkription"}
        </button>
      </div>
      {visa && <pre className="dok dok-utlatande transkription">{transkription}</pre>}
    </div>
  );
}

/** Pussel: dra (eller tryck) bitarna i rätt ordning. */
export function Pussel({ bitar }: { bitar: string[] }) {
  const blandade = useMemo(() => {
    const idx = bitar.map((_, i) => i);
    // Deterministisk blandning (fast frö) så att server- och klientrendering stämmer
    let fro = 1962;
    const slump = () => { fro = (fro * 1103515245 + 12345) % 2147483648; return fro / 2147483648; };
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(slump() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    // Ingen bit får börja på rätt plats
    for (let i = 0; i < idx.length; i++) if (idx[i] === i) { const j = (i + 1) % idx.length; [idx[i], idx[j]] = [idx[j], idx[i]]; }
    return idx;
  }, [bitar]);
  const [ordning, setOrdning] = useState<number[]>(blandade);
  const [vald, setVald] = useState<number | null>(null);
  const [drar, setDrar] = useState<number | null>(null);
  const klar = ordning.every((v, i) => v === i);

  useEffect(() => {
    try { if (localStorage.getItem("klov-pussel-6") === "klar") setOrdning(bitar.map((_, i) => i)); } catch {}
  }, [bitar]);
  useEffect(() => {
    if (klar) try { localStorage.setItem("klov-pussel-6", "klar"); } catch {}
  }, [klar]);

  const byt = (a: number, b: number) => {
    const n = [...ordning];
    [n[a], n[b]] = [n[b], n[a]];
    setOrdning(n);
  };
  const tryck = (pos: number) => {
    if (klar) return;
    if (vald === null) setVald(pos);
    else { if (vald !== pos) byt(vald, pos); setVald(null); }
  };

  return (
    <div className="stack">
      <p className="dampad liten">{klar ? "Brevet är helt." : "Tryck på två bitar för att byta plats på dem, eller dra en bit till rätt ställe. Börja med datumet."}</p>
      <ol className={`pussel${klar ? " pussel-klar" : ""}`}>
        {ordning.map((bit, pos) => (
          <li key={bit}
            draggable={!klar}
            onDragStart={() => setDrar(pos)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (drar !== null && drar !== pos) byt(drar, pos); setDrar(null); }}
            onClick={() => tryck(pos)}
            className={`pussel-bit${vald === pos ? " vald" : ""}${ordning[pos] === pos ? " ratt" : ""}`}
            style={{ transform: klar ? "none" : `rotate(${((bit * 37) % 7) - 3}deg)` }}
          >
            {bitar[bit]}
          </li>
        ))}
      </ol>
      {klar && <p className="ok">Ni har fått ihop brevet. Läs det igen, långsamt.</p>}
    </div>
  );
}

export function Misstankta({ personer }: { personer: Person[] }) {
  const [vald, setVald] = useState<Person | null>(null);
  return (
    <div className="stack">
      <div className="personer">
        {personer.map((p) => (
          <button key={p.id} type="button" className={`person${vald?.id === p.id ? " vald" : ""}`} onClick={() => setVald(p)} aria-pressed={vald?.id === p.id}>
            <span className="person-namn">{p.namn}</span>
            <span className="person-roll">{p.roll}, {p.alder}</span>
          </button>
        ))}
      </div>
      {vald && (
        <div className="dok dok-kort" aria-live="polite">
          <h3 className="dok-rubrik">{vald.namn}, {vald.alder} år – {vald.roll}</h3>
          <div className="dok-text"><p>{vald.kort}</p></div>
        </div>
      )}
    </div>
  );
}
