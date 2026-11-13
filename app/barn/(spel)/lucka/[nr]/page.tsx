import Link from "next/link";
import type { Metadata } from "next";
import { kravInloggad, markeraOppnad } from "@/lib/session";
import { gjordaUppdrag, oppenBarnLucka } from "@/lib/barn";
import { arOppen, oppningstid } from "@/lib/tid";
import { BarnLucka } from "@/components/barn/BarnLucka";

export const metadata: Metadata = { title: "Lucka" };

export default async function BarnLuckSida({ params }: { params: Promise<{ nr: string }> }) {
  const nr = Number((await params).nr);
  const { lag, spelare, nu } = await kravInloggad("barn");
  const lucka = oppenBarnLucka(lag, nr, nu);
  if (!lucka) {
    const giltig = Number.isInteger(nr) && nr >= 1 && nr <= 24;
    return (
      <main className="sida">
        <h1 className="rubrik-mellan">{giltig ? `Lucka ${nr} är inte öppen än` : "Den luckan finns inte"}</h1>
        {giltig && <p className="dampad">Den öppnar {new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", dateStyle: "full", timeStyle: "short" }).format(new Date(oppningstid(lag.startdatum, nr)))}.</p>}
        <p><Link href="/barn/kalender">← Till kalendern</Link></p>
      </main>
    );
  }
  markeraOppnad(spelare.id, nr);
  return (
    <main className="sida">
      <BarnLucka lucka={lucka} gjort={gjordaUppdrag(lag.id).has(nr)} spara />
      {nr === 24 && <div><Link className="knapp" href="/barn/diplom">Öppna diplomet</Link></div>}
      <nav className="rad" style={{ justifyContent: "space-between" }} aria-label="Bläddra">
        {nr > 1 ? <Link href={`/barn/lucka/${nr - 1}`}>← Lucka {nr - 1}</Link> : <span />}
        {nr < 24 && arOppen(lag, nr + 1, nu) ? <Link href={`/barn/lucka/${nr + 1}`}>Lucka {nr + 1} →</Link> : <Link href="/barn/kalender">Kalendern</Link>}
      </nav>
    </main>
  );
}
