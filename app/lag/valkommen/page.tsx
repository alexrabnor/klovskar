import Link from "next/link";
import { SaSpelarNi } from "@/components/SaSpelarNi";
import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { Kopiera } from "@/components/Kopiera";
import { oppningstid } from "@/lib/tid";

export const metadata: Metadata = { title: "Laget är skapat" };

const BAS = process.env.BAS_URL || "https://adventdeckare.se";

export default async function Valkommen() {
  const { lag, arLedare } = await kravInloggad();
  const start = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", dateStyle: "full", timeStyle: "short" }).format(new Date(oppningstid(lag.startdatum, 1)));
  return (
    <main className="sida">
      <header className="stack">
        <p className="etikett">Laget är skapat</p>
        <h1 className="rubrik-mellan">Välkomna, {lag.namn}</h1>
        <p>Lucka 1 öppnar {start}.</p>
      </header>
      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>1. Bjud in laget</h2>
        <p>Skicka länken till dina medspelare – hela fem personer kan vara med i laget. De skriver bara sitt namn.</p>
        <Kopiera text={`${BAS}/g/${lag.kod}`} etikett="Kopiera inbjudan" visa />
        <p className="dampad liten">Lagkod: <b style={{ fontFamily: "var(--f-m)", letterSpacing: ".1em" }}>{lag.kod}</b></p>
      </section>
      {arLedare && (
        <section className="panel stack">
          <h2 style={{ fontSize: 22 }}>2. Spara din lagledarlänk</h2>
          <p>Med den här länken är du lagledare på vilken enhet som helst. Det är du som lämnar in anklagelsen på julafton. Dela den inte.</p>
          <Kopiera text={`${BAS}/ledare/${lag.ledare_token}`} etikett="Kopiera lagledarlänk" visa />
          {lag.ledare_epost ? <p className="dampad liten">Vi har också mejlat den till {lag.ledare_epost}.</p> : <p className="dampad liten">Lägg till din e-post under Laget så mejlar vi den till dig.</p>}
        </section>
      )}
      <SaSpelarNi />
      <div><Link className="knapp" href="/lag">Till kalendern</Link></div>
    </main>
  );
}
