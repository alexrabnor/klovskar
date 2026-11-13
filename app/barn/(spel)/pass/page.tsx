import Link from "next/link";
import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { spelareILag } from "@/lib/db";
import { passetsMarken } from "@/lib/barn";
import { arOppen } from "@/lib/tid";

export const metadata: Metadata = { title: "Detektivpasset" };

export default async function Pass() {
  const { lag, nu } = await kravInloggad("barn");
  const marken = passetsMarken(lag, nu);
  const antal = marken.filter((m) => m.gjort).length;
  const detektiver = spelareILag(lag.id).map((s) => s.namn);
  return (
    <main className="sida">
      <header className="stack">
        <p className="etikett">Detektivpass</p>
        <h1 className="rubrik-mellan">{lag.namn}</h1>
        <p className="dampad">Detektiver: {detektiver.join(", ")}.</p>
      </header>
      <section className="panel stack">
        <h2 style={{ fontSize: 24 }}>{antal === 0 ? "Inga märken än" : antal === 1 ? "1 märke" : `${antal} märken`}</h2>
        <p className="dampad">Varje lucka har ett uppdrag. När ni har gjort det trycker ni på Vi gjorde det! i luckan, så tänds märket här.</p>
        <ul className="marken">
          {marken.map((m) => (
            <li key={m.nr}>
              {m.oppen ? (
                <Link href={`/barn/lucka/${m.nr}`} aria-label={`Lucka ${m.nr}: ${m.titel}${m.gjort ? " (gjort)" : ""}`}>
                  <span className={`marke${m.gjort ? "" : " marke-tomt"}`} aria-hidden="true">{m.marke}</span>
                  <span>{m.titel}</span>
                </Link>
              ) : (
                <>
                  <span className="marke marke-last" aria-hidden="true">{m.nr}</span>
                  <span>Lucka {m.nr}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
      {arOppen(lag, 24, nu) && (
        <section className="panel stack">
          <h2 style={{ fontSize: 24 }}>Fallet är löst</h2>
          <p>Ni har hjälpt Sotis hela vägen till julafton. Diplomet är ert.</p>
          <div><Link className="knapp" href="/barn/diplom">Öppna diplomet</Link></div>
        </section>
      )}
    </main>
  );
}
