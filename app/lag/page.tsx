import type { Metadata } from "next";
import { kravInloggad, oppnadeAv } from "@/lib/session";
import { LUCKOR } from "@/content/luckor";
import { arOppen, antalOppna, oppningstid, lagetsNu } from "@/lib/tid";
import { LuckKort } from "./LuckKort";
import { Snofall } from "@/components/Snofall";
import { Menykort } from "./Menykort";

export const metadata: Metadata = { title: "Kalendern" };

export default async function Kalender() {
  const { lag, spelare, nu } = await kravInloggad();
  const lasta = oppnadeAv(spelare.id);
  const oppna = antalOppna(lag, nu);
  const lagNu = lagetsNu(lag, nu);
  // Bara öppna luckor får titel och bild – låsta luckor skickar bara nummer och öppningstid
  const kort = LUCKOR.map((l) => {
    const oppen = arOppen(lag, l.nr, nu);
    return oppen
      ? { nr: l.nr, oppen, titel: l.titel, bild: l.bilder[0]?.namn ?? null, ny: !lasta.has(l.nr), oppnar: 0 }
      : { nr: l.nr, oppen, titel: null, bild: null, ny: false, oppnar: oppningstid(lag.startdatum, l.nr) - (lagNu - Date.now()) };
  });
  const forsta = oppningstid(lag.startdatum, 1);
  return (
    <>
      <Snofall tathet={40} />
      <main className="sida sida-bred" style={{ position: "relative", zIndex: 2 }}>
        <header className="stack">
          <p className="etikett">Hotell Fyrbåken · december 1962</p>
          <h1 className="rubrik-mellan">
            {oppna === 0 ? "Snart börjar det" : oppna === 24 ? "Julafton" : `Dag ${oppna} av 24`}
          </h1>
          {oppna === 0 && (
            <p className="dampad">Första luckan öppnar {new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", dateStyle: "full", timeStyle: "short" }).format(new Date(forsta))}.</p>
          )}
        </header>
        <div className="kalender">
          {kort.map((k) => <LuckKort key={k.nr} {...k} stor={k.nr === 13 || k.nr === 24} />)}
        </div>
        <Menykort oppna={oppna} />
      </main>
    </>
  );
}
