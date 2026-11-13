import Link from "next/link";
import type { Metadata } from "next";
import { hamtaSession, koderForSession } from "@/lib/kop";
import { Kopiera } from "@/components/Kopiera";
import { SPELNAMN } from "@/lib/spel";
import type { Kod } from "@/lib/db";

export const metadata: Metadata = { title: "Tack för köpet", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Tack({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const id = (await searchParams).session_id;
  let koder: Kod[] = [];
  if (id && /^cs_[A-Za-z0-9_]+$/.test(id)) {
    try {
      koder = await koderForSession(await hamtaSession(id));
    } catch (e) {
      console.error("[tack]", e);
    }
  }
  if (koder.length === 0) {
    return (
      <main className="sida">
        <h1 className="rubrik-mellan">Vi väntar på betalningen</h1>
        <p>Vi har inte fått bekräftelse från Stripe än. Ladda om sidan om en liten stund. Koden kommer också med e-post så snart betalningen är klar.</p>
        <p className="dampad">Har det gått mer än en kvart? Svara på kvittomejlet så hjälper vi dig.</p>
      </main>
    );
  }
  const present = koder[0].typ === "present";
  const flera = koder.length > 1;
  const baraBarn = koder.every((k) => k.spel === "barn");
  return (
    <div className={baraBarn ? "barn" : undefined}>
      <main className="sida">
        <header className="stack">
          <p className="etikett">Tack för köpet</p>
          <h1 className="rubrik-mellan">{present ? (flera ? "Här är presentkorten" : "Här är presentkortet") : flera ? "Här är era aktiveringskoder" : "Här är er aktiveringskod"}</h1>
          {flera && <p className="dampad">Ni har fått en kod till varje spel. Varje kod skapar sitt eget lag.</p>}
        </header>
        {koder.map((kod) => (
          <section key={kod.kod} className="stack">
            {flera && <h2 style={{ fontSize: 22 }}>{SPELNAMN[kod.spel]}</h2>}
            <div className="stor-kod">{kod.kod}</div>
            <div className="rad">
              <Kopiera text={kod.kod} etikett="Kopiera koden" />
              {present
                ? <Link className="knapp" href={`/presentkort/${kod.kod}`}>Öppna presentkortet</Link>
                : <Link className="knapp" href={`/aktivera?kod=${kod.kod}`}>Skapa {flera ? "laget" : "ert lag"}</Link>}
            </div>
          </section>
        ))}
        {present
          ? <p>Koden finns också på presentkortet, som du kan skriva ut eller skicka vidare som länk. Vi har mejlat allt till {koder[0].epost}. Hittar du inte mejlet? Titta i skräpposten.</p>
          : <p>Vi har också mejlat {flera ? "koderna" : "koden"} till {koder[0].epost}. Hittar ni inte mejlet? Titta i skräpposten. Skapa laget nu, eller när det passar.</p>}
      </main>
    </div>
  );
}
