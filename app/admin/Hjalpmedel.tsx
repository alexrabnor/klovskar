"use client";
import { useState } from "react";

/** Kopiera en text (lagkod, länk) så den kan skickas vidare till en spelare. */
export function Kopiera({ text, etikett }: { text: string; etikett: string }) {
  const [klar, setKlar] = useState(false);
  return (
    <button
      type="button"
      className="knapp knapp-sekundar knapp-liten"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setKlar(true); setTimeout(() => setKlar(false), 1500); }
        catch { window.prompt("Kopiera:", text); }
      }}
    >
      {klar ? "Kopierat" : etikett}
    </button>
  );
}

/**
 * Sökfält som filtrerar lagkort och kodrader på sidan. Varje rad bär sin sökbara
 * text i data-sok (lagnamn, lagkod, aktiveringskod, spelare, e-post).
 */
export function AdminSok() {
  const [q, setQ] = useState("");
  const filtrera = (v: string) => {
    setQ(v);
    const ord = v.trim().toLowerCase().replace(/[\s-]/g, "");
    document.querySelectorAll<HTMLElement>("[data-sok]").forEach((el) => {
      el.hidden = !!ord && !el.dataset.sok!.includes(ord);
    });
  };
  return (
    <div className="falt" style={{ maxWidth: 520 }}>
      <label htmlFor="admin-sok">Sök lag, lagkod, aktiveringskod, spelare eller e-post</label>
      <input id="admin-sok" type="search" value={q} onChange={(e) => filtrera(e.target.value)} placeholder="t.ex. Rabnor, 8X62XH eller 7FSW-RVE7" autoComplete="off" />
    </div>
  );
}
