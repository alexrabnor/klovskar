import Link from "next/link";
import type { Metadata } from "next";
import { hamtaSession, kodForSession } from "@/lib/kop";
import { Kopiera } from "@/components/Kopiera";

export const metadata: Metadata = { title: "Tack för köpet", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Tack({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const id = (await searchParams).session_id;
  let kod = null;
  if (id && /^cs_[A-Za-z0-9_]+$/.test(id)) {
    try {
      kod = await kodForSession(await hamtaSession(id));
    } catch (e) {
      console.error("[tack]", e);
    }
  }
  if (!kod) {
    return (
      <main className="sida">
        <h1 className="rubrik-mellan">Vi väntar på betalningen</h1>
        <p>Vi har inte fått bekräftelse från Stripe än. Ladda om sidan om en liten stund. Koden kommer också med e-post så snart betalningen är klar.</p>
        <p className="dampad">Har det gått mer än en kvart? Svara på kvittomejlet så hjälper vi dig.</p>
      </main>
    );
  }
  const present = kod.typ === "present";
  return (
    <main className="sida">
      <header className="stack">
        <p className="etikett">Tack för köpet</p>
        <h1 className="rubrik-mellan">{present ? "Här är presentkortet" : "Här är er aktiveringskod"}</h1>
      </header>
      <div className="stor-kod">{kod.kod}</div>
      <Kopiera text={kod.kod} etikett="Kopiera koden" />
      {present ? (
        <div className="stack">
          <p>Koden finns också på presentkortet, som du kan skriva ut eller skicka vidare som länk. Vi har mejlat båda till {kod.epost}. Hittar du inte mejlet? Titta i skräpposten.</p>
          <div><Link className="knapp" href={`/presentkort/${kod.kod}`}>Öppna presentkortet</Link></div>
        </div>
      ) : (
        <div className="stack">
          <p>Vi har också mejlat koden till {kod.epost}. Hittar ni inte mejlet? Titta i skräpposten. Skapa laget nu, eller när det passar.</p>
          <div><Link className="knapp" href={`/aktivera?kod=${kod.kod}`}>Skapa ert lag</Link></div>
        </div>
      )}
    </main>
  );
}
