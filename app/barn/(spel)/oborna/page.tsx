import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { struknaFigurer } from "@/lib/barn";
import { FIGURER, SOTIS } from "@/content/barn/figurer";
import { Bild } from "@/components/Bild";

export const metadata: Metadata = { title: "Öborna" };

export default async function Oborna() {
  const { lag, nu } = await kravInloggad("barn");
  const strukna = struknaFigurer(lag, nu);
  return (
    <main className="sida">
      <header className="stack">
        <p className="etikett">Måsholmen</p>
        <h1 className="rubrik-mellan">Öborna</h1>
        <p className="dampad">Alla som bor på ön. När Sotis har visat att någon inte kan ha tagit stjärnan stryks den här.</p>
      </header>
      <div className="bildram" style={{ borderRadius: 16 }}><Bild namn="barn-figurer" alt="Alla öborna på Måsholmen bredvid varandra." /></div>
      <ul className="figurer">
        {FIGURER.map((f) => {
          const lucka = strukna.get(f.id);
          return (
            <li key={f.id} className={lucka ? "struken" : undefined}>
              <span className="roll">{f.roll}{lucka ? ` · struken i lucka ${lucka}` : ""}</span>
              <span className="namn">{f.namn}</span>
              <span>{f.kort}</span>
            </li>
          );
        })}
        <li>
          <span className="roll">{SOTIS.roll} · berättare</span>
          <span className="namn">{SOTIS.namn}</span>
          <span>{SOTIS.kort}</span>
        </li>
      </ul>
    </main>
  );
}
