import Link from "next/link";
import type { Metadata } from "next";
import { INTRO_TOM, ORD_PRIS_KR, introAktiv, prisKr } from "@/lib/stripe";
import { Sidfot } from "@/components/Sidfot";

export const metadata: Metadata = { title: "Köpvillkor" };
export const dynamic = "force-dynamic";

export default function Villkor() {
  const namn = process.env.SALJARE_NAMN || "Säljaren";
  const epost = process.env.SALJARE_EPOST || "";
  const adress = process.env.SALJARE_ADRESS || "";
  return (
    <>
      <main className="sida prosa">
        <Link href="/" className="liten">← Startsidan</Link>
        <h1 className="rubrik-mellan">Köpvillkor</h1>
        <h2>Säljare</h2>
        <p>{namn}{adress && <>, {adress}</>}{epost && <>, e-post <a href={`mailto:${epost}`}>{epost}</a></>}.</p>
        <h2>Vad du köper</h2>
        <p>En aktiveringskod till det digitala spelet Mordet på Klovskär, Adventsmysteriet 2026. Koden skapar ett lag där hela fem personer kan vara med och ger tillgång till 24 luckor som öppnas en per dag, sex bonusluckor och facit. Spelet spelas i webbläsaren på adventdeckare.se.</p>
        <h2>Pris och betalning</h2>
        <p>Priset är {prisKr()} kr per lag{introAktiv() && <> (introduktionspris t.o.m. {INTRO_TOM} 2026, därefter ordinarie pris {ORD_PRIS_KR} kr)</>}. Priset som gäller är det som visas när du betalar. Betalning sker med kort, Apple Pay, Google Pay eller Klarna via Stripe. Vi ser aldrig dina kortuppgifter.</p>
        <h2>Leverans</h2>
        <p>Koden visas direkt efter betalningen och skickas till den e-postadress du anger. Ett presentkort levereras på samma sätt.</p>
        <h2>Ångerrätt</h2>
        <p>Enligt lagen om distansavtal har du normalt 14 dagars ångerrätt. För digitalt innehåll gäller den inte om du uttryckligen samtyckt till att leveransen påbörjas direkt och bekräftat att ångerrätten då upphör. Det gör du med kryssrutan före betalningen.</p>
        <p><b>Vår egen garanti:</b> har laget inte öppnat någon lucka får du pengarna tillbaka om du hör av dig, även efter att koden visats.</p>
        <h2>Tillgång</h2>
        <p>Mordet på Klovskär är Adventsmysteriet 2026. Laget behåller tillgången till spelet, sina anteckningar och facit så länge spelet finns, och minst till och med den 31 december 2027. Spelet kräver internetuppkoppling.</p>
        <h2>Fel och reklamation</h2>
        <p>Fungerar något inte som det ska, kontakta oss så rättar vi det eller betalar tillbaka.</p>
      </main>
      <Sidfot />
    </>
  );
}
