"use client";
import { useState } from "react";
import type { BarnSvar } from "@/content/barn/typer";

/** Dagens fråga. Fel svar ger en ledtråd från Sotis och man får försöka igen – frågan stoppar aldrig. */
export function Fraga({ text, val }: { text: string; val: BarnSvar[] }) {
  const [valt, setValt] = useState<number | null>(null);
  const [fel, setFel] = useState<number[]>([]);
  const lost = valt !== null && !!val[valt].ratt;
  const valj = (i: number) => {
    if (lost) return;
    setValt(i);
    if (!val[i].ratt) setFel((f) => (f.includes(i) ? f : [...f, i]));
  };
  return (
    <section className="barn-fraga" aria-labelledby="fraga-rubrik">
      <p className="etikett">Dagens fråga</p>
      <h2 id="fraga-rubrik">{text}</h2>
      <div className="barn-val">
        {val.map((v, i) => {
          const lage = lost && valt === i ? "ratt" : fel.includes(i) ? "fel" : undefined;
          return (
            <button key={i} type="button" onClick={() => valj(i)} data-lage={lage} aria-pressed={valt === i} disabled={lost && valt !== i}>
              <span className="prick" aria-hidden="true">{lage === "ratt" ? "✓" : lage === "fel" ? "✗" : ""}</span>
              <span>{v.text}</span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        {valt !== null && (
          <div className="barn-svar">
            <span className="vem">{lost ? "Rätt! Sotis säger" : "Sotis ger en ledtråd"}</span>
            <span>{val[valt].svar}</span>
          </div>
        )}
      </div>
    </section>
  );
}
