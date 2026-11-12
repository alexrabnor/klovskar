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
