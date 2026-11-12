import Link from "next/link";
import type { Metadata } from "next";
import { Sidfot } from "@/components/Sidfot";

export const metadata: Metadata = { title: "Integritet" };
export const dynamic = "force-dynamic";

export default function Integritet() {
  const namn = process.env.SALJARE_NAMN || "Säljaren";
  const epost = process.env.SALJARE_EPOST || "";
  return (
    <>
      <main className="sida prosa">
        <Link href="/" className="liten">← Startsidan</Link>
        <h1 className="rubrik-mellan">Integritet</h1>
        <p>Personuppgiftsansvarig är {namn}{epost && <> (<a href={`mailto:${epost}`}>{epost}</a>)</>}.</p>
        <h2>Vad vi sparar</h2>
        <ul>
          <li><b>Köparens e-postadress</b>, för att skicka aktiveringskoden och kvittot och kunna hjälpa till om något går fel.</li>
          <li><b>Lagets namn och spelarnas visningsnamn</b> – det ni själva skriver in. Inga riktiga namn krävs.</li>
          <li><b>Det ni gör i spelet:</b> anteckningar, anslagstavla, röster och anklagelse. Det syns bara för ert eget lag, utom lagets namn och poäng på topplistan om ni väljer det.</li>
          <li><b>Lagledarens e-post</b> om den anges, för lagledarlänken och morgonmejlen.</li>
          <li><b>Notisprenumeration</b> om du slår på påminnelser – en adress från din webbläsare, utan personuppgifter.</li>
        </ul>
        <h2>Var det sparas</h2>
        <p>På en server i Sverige som säljaren själv driver. Betalningen hanteras av Stripe och e-posten skickas via Brevo; båda följer GDPR. Vi använder inga analysverktyg och inga annonskakor. Spelet använder två nödvändiga kakor för att komma ihåg vilket lag du spelar i och om du är lagledare.</p>
        <h2>Hur länge</h2>
        <p>E-postadresser raderas automatiskt 13 månader efter att lagets sista lucka öppnat. Används en köpt kod aldrig raderas e-postadressen 13 månader efter köpet. Laget, spelarnas visningsnamn och det ni gjort i spelet sparas så länge spelet finns, så att ni kan gå tillbaka till ert fall. Vill ni att laget raderas tidigare räcker det att höra av sig. Bokföringsuppgifter om köpet (belopp och datum) sparas så länge lagen kräver.</p>
        <h2>Dina rättigheter</h2>
        <p>Du kan när som helst be om att få se, rätta eller radera dina uppgifter. Hör av dig till e-postadressen ovan. Du kan också klaga hos Integritetsskyddsmyndigheten, imy.se.</p>
      </main>
      <Sidfot />
    </>
  );
}
