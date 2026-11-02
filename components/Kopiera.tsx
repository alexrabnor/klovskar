"use client";
import { useState } from "react";

export function Kopiera({ text, etikett = "Kopiera", visa = false }: { text: string; etikett?: string; visa?: boolean }) {
  const [klart, setKlart] = useState<"" | "ok" | "fel">("");
  const kopiera = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setKlart("ok");
    } catch {
      setKlart("fel");
    }
    setTimeout(() => setKlart(""), 2500);
  };
  const knapp = (
    <button type="button" className="knapp knapp-sekundar knapp-liten" onClick={kopiera}>
      {klart === "ok" ? "Kopierat" : klart === "fel" ? "Markera och kopiera själv" : etikett}
    </button>
  );
  if (!visa) return <div>{knapp}</div>;
  return (
    <div className="kopiera-rad">
      <code>{text}</code>
      {knapp}
    </div>
  );
}
