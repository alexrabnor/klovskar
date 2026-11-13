import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { spelareILag } from "@/lib/db";
import { MAX_SPELARE, forstaLuckanOppnad } from "@/lib/lag";
import { Kopiera } from "@/components/Kopiera";
import { oppningstid } from "@/lib/tid";
import { barnTaBortSpelare, loggaUtBarn } from "../../actions";

export const metadata: Metadata = { title: "Laget" };

const BAS = process.env.BAS_URL || "https://adventdeckare.se";

export default async function BarnLaget() {
  const { lag, spelare, arLedare, nu } = await kravInloggad("barn");
  const alla = spelareILag(lag.id);
  const start = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", dateStyle: "long" }).format(new Date(oppningstid(lag.startdatum, 1)));
  return (
    <main className="sida">
      <header className="stack">
        <p className="etikett">Laget · för den vuxna</p>
        <h1 className="rubrik-mellan">{lag.namn}</h1>
        <p className="dampad">Lucka 1 {forstaLuckanOppnad(lag, nu) ? "öppnade" : "öppnar"} {start}. {alla.length} av {MAX_SPELARE} enheter är med.</p>
      </header>

      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Läs på fler enheter</h2>
        <p>Vill mormor läsa samma kalender, eller ska barnen ha den på plattan? Skicka länken. Hela {MAX_SPELARE} enheter kan vara med, och alla delar samma detektivpass.</p>
        <Kopiera text={`${BAS}/g/${lag.kod}`} etikett="Kopiera inbjudan" visa />
        <p className="dampad liten">Lagkod: <b style={{ letterSpacing: ".1em" }}>{lag.kod}</b></p>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Detektiver</h2>
        <ul className="spelarlista">
          {alla.map((s) => (
            <li key={s.id}>
              <span>{s.namn}{s.id === spelare.id && <span className="dampad"> (den här enheten)</span>}</span>
              {arLedare && s.id !== spelare.id && (
                <form action={barnTaBortSpelare}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="lank-knapp liten">Ta bort</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Din inloggningslänk</h2>
        <p>Spara länken om du byter telefon. Den loggar in som <b>{spelare.namn}</b>. Dela den inte.</p>
        <Kopiera text={`${BAS}/in/${spelare.token}`} etikett="Kopiera min länk" />
      </section>

      {arLedare && (
        <section className="panel stack">
          <h2 style={{ fontSize: 22 }}>Lagledare</h2>
          <p className="dampad">Du skapade laget. Med lagledarlänken kan du ta bort enheter som inte ska vara med.</p>
          <Kopiera text={`${BAS}/ledare/${lag.ledare_token}`} etikett="Kopiera lagledarlänk" />
        </section>
      )}

      <form action={loggaUtBarn}><button className="lank-knapp">Logga ut från den här enheten</button></form>
    </main>
  );
}
