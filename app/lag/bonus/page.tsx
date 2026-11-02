import Link from "next/link";
import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { synligaChiffer } from "@/lib/innehall";

export const metadata: Metadata = { title: "Bonusluckor" };

export default async function BonusLista() {
  const { lag, nu } = await kravInloggad();
  const chiffer = synligaChiffer(lag, nu);
  return (
    <main className="sida">
      <header className="stack">
        <p className="etikett">Bonusluckor</p>
        <h1 className="rubrik-mellan">Sex hemliga luckor</h1>
        <p className="dampad">Under december dyker det upp chiffer i luckorna. Varje löst chiffer öppnar en bonuslucka med extra material – och ger laget en poäng på julafton.</p>
      </header>
      {chiffer.length === 0 && <p className="panel">Inga chiffer än. Det första dyker upp i lucka 7.</p>}
      <ul className="bonuslista">
        {chiffer.map((c) => (
          <li key={c.nr}>
            <Link href={`/lag/bonus/${c.nr}`} className="panel bonuskort">
              <span className="etikett">Bonus {c.nr} · från lucka {c.synsFran}</span>
              <span className="bonus-titel">{c.upplast ? c.titel : "Olöst chiffer"}</span>
              <span className={`chip ${c.upplast ? "chip-ok" : "chip-varning"}`}>{c.upplast ? "Upplåst" : "Väntar på svar"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
