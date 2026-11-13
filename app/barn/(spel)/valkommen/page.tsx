import Link from "next/link";
import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { Kopiera } from "@/components/Kopiera";
import { oppningstid } from "@/lib/tid";
import { MAX_SPELARE } from "@/lib/lag";

export const metadata: Metadata = { title: "Laget är skapat" };

const BAS = process.env.BAS_URL || "https://adventdeckare.se";

export default async function BarnValkommen() {
  const { lag, arLedare } = await kravInloggad("barn");
  const start = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", dateStyle: "full", timeStyle: "short" }).format(new Date(oppningstid(lag.startdatum, 1)));
  return (
    <main className="sida">
      <header className="stack">
        <p className="etikett">Laget är skapat</p>
        <h1 className="rubrik-mellan">Välkomna till Måsholmen, {lag.namn}</h1>
        <p>Lucka 1 öppnar {start}.</p>
      </header>
      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Så går det till</h2>
        <ol className="steg">
          <li><b>Öppna dagens lucka.</b> Läs berättelsen högt. Det tar ett par minuter.</li>
          <li><b>Titta på bilden.</b> Sotis har gömt sig i varenda en.</li>
          <li><b>Svara på frågan.</b> Blir det fel får ni en ledtråd och försöker igen.</li>
          <li><b>Gör uppdraget om ni vill.</b> Det ger ett märke i detektivpasset, men nästa lucka öppnas oavsett.</li>
        </ol>
      </section>
      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Fler enheter?</h2>
        <p>Skicka länken till den som också ska kunna läsa. Hela {MAX_SPELARE} enheter kan vara med.</p>
        <Kopiera text={`${BAS}/g/${lag.kod}`} etikett="Kopiera inbjudan" visa />
      </section>
      {arLedare && (
        <section className="panel stack">
          <h2 style={{ fontSize: 22 }}>Spara din lagledarlänk</h2>
          <p>Med den kommer du alltid tillbaka som lagledare, på vilken enhet som helst.</p>
          <Kopiera text={`${BAS}/ledare/${lag.ledare_token}`} etikett="Kopiera lagledarlänk" visa />
          {lag.ledare_epost && <p className="dampad liten">Vi har också mejlat den till {lag.ledare_epost}.</p>}
        </section>
      )}
      <div><Link className="knapp" href="/barn/kalender">Till kalendern</Link></div>
    </main>
  );
}
