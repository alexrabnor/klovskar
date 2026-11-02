import Link from "next/link";
import type { Metadata } from "next";
import { kravInloggad, markeraOppnad } from "@/lib/session";
import { oppenLucka } from "@/lib/innehall";
import { BONUS } from "@/content/bonus";
import { PLATSER } from "@/content/karta";
import { PERSONER } from "@/content/personer";
import { arOppen, oppningstid } from "@/lib/tid";
import { LuckInnehall } from "@/components/LuckInnehall";
import { Kommentarer } from "./Kommentarer";
import { LuckLjud } from "@/components/Ljud";
import { LUCKLJUD } from "@/content/ljud";

export const metadata: Metadata = { title: "Lucka" };

export default async function LuckSida({ params }: { params: Promise<{ nr: string }> }) {
  const nr = Number((await params).nr);
  const { lag, spelare, nu, farLamnaIn } = await kravInloggad();
  const lucka = oppenLucka(lag, nr, nu);
  if (!lucka) {
    const giltig = Number.isInteger(nr) && nr >= 1 && nr <= 24;
    return (
      <main className="sida">
        <h1 className="rubrik-mellan">{giltig ? `Lucka ${nr} är inte öppen än` : "Den luckan finns inte"}</h1>
        {giltig && <p className="dampad">Den öppnar {new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", dateStyle: "full", timeStyle: "short" }).format(new Date(oppningstid(lag.startdatum, nr)))}.</p>}
        <p><Link href="/lag">← Till kalendern</Link></p>
      </main>
    );
  }
  markeraOppnad(spelare.id, nr);
  const bonus = BONUS.find((b) => b.synsFran === nr);
  return (
    <main className="sida">
      <LuckLjud stamning={LUCKLJUD[nr]} />
      <LuckInnehall
        lucka={lucka}
        platser={lucka.interaktion === "karta" ? PLATSER : undefined}
        personer={lucka.interaktion === "misstankta" ? PERSONER : undefined}
      />
      {lucka.interaktion === "anklagelse" && (
        <div className="panel stack">
          <p>Hela laget kan skriva i utkastet. {farLamnaIn ? "Du kan lämna in." : "Lagledaren lämnar in."}</p>
          <div><Link className="knapp" href="/lag/anklagelse">Till anklagelsen</Link></div>
        </div>
      )}
      {bonus && (
        <Link href={`/lag/bonus/${bonus.nr}`} className="panel chiffer-tips">
          <span className="etikett">Ett chiffer har dykt upp</span>
          <span>Någon har lämnat ett meddelande. Löser ni det öppnas bonuslucka {bonus.nr}.</span>
        </Link>
      )}
      {lucka.fraga && <p className="fraga">{lucka.fraga}</p>}
      <Kommentarer lucka={nr} />
      <nav className="rad" style={{ justifyContent: "space-between" }} aria-label="Bläddra">
        {nr > 1 ? <Link href={`/lag/lucka/${nr - 1}`}>← Lucka {nr - 1}</Link> : <span />}
        {nr < 24 && arOppen(lag, nr + 1, nu) ? <Link href={`/lag/lucka/${nr + 1}`}>Lucka {nr + 1} →</Link> : <Link href="/lag">Kalendern</Link>}
      </nav>
    </main>
  );
}
