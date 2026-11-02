"use client";
import { useCallback, useEffect, useState } from "react";

interface K { id: number; namn: string; text: string; skapad: string; egen: boolean }

const tid = (s: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(s.replace(" ", "T") + "Z"));

export function Kommentarer({ lucka }: { lucka: number }) {
  const [lista, setLista] = useState<K[]>([]);
  const [text, setText] = useState("");
  const [fel, setFel] = useState("");
  const [skickar, setSkickar] = useState(false);

  const hamta = useCallback(async () => {
    const r = await fetch(`/api/lag/kommentarer?lucka=${lucka}`, { cache: "no-store" }).catch(() => null);
    if (r?.ok) setLista((await r.json()).kommentarer);
  }, [lucka]);

  useEffect(() => {
    hamta();
    const t = setInterval(() => { if (!document.hidden) hamta(); }, 10000);
    return () => clearInterval(t);
  }, [hamta]);

  const skicka = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSkickar(true); setFel("");
    const r = await fetch("/api/lag/kommentarer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lucka, text }) }).catch(() => null);
    setSkickar(false);
    if (r?.ok) { setText(""); hamta(); } else setFel("Kommentaren kunde inte sparas. Försök igen.");
  };

  const taBort = async (id: number) => {
    await fetch(`/api/lag/kommentarer?id=${id}`, { method: "DELETE" }).catch(() => null);
    hamta();
  };

  return (
    <section className="stack" aria-labelledby="kommentarer-rubrik">
      <h2 id="kommentarer-rubrik" className="rubrik-mellan">Lagets anteckningar</h2>
      <div className="kommentarer">
        {lista.length === 0 && <p className="dampad">Ingen har skrivit något om den här luckan än. Vad lade ni märke till?</p>}
        {lista.map((k) => (
          <article key={k.id} className="kommentar">
            <div className="rad" style={{ justifyContent: "space-between" }}>
              <span className="kommentar-namn">{k.namn}</span>
              <span className="kommentar-tid">{tid(k.skapad)}</span>
            </div>
            <p style={{ whiteSpace: "pre-wrap" }}>{k.text}</p>
            {k.egen && <button type="button" className="lank-knapp liten" onClick={() => taBort(k.id)}>Ta bort</button>}
          </article>
        ))}
      </div>
      <form onSubmit={skicka} className="stack">
        <label htmlFor={`kommentar-${lucka}`} className="dampad liten">Skriv en anteckning till laget</label>
        <textarea id={`kommentar-${lucka}`} value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder="Jag tror att …" />
        {fel && <p className="fel">{fel}</p>}
        <div><button className="knapp" disabled={skickar || !text.trim()}>{skickar ? "Sparar …" : "Skicka"}</button></div>
      </form>
    </section>
  );
}
