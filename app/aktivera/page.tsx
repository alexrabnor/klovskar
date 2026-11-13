import Link from "next/link";
import type { Metadata } from "next";
import { AktiveraFormular } from "./AktiveraFormular";
import { adventStart, luckorDirekt } from "@/lib/lag";
import { kodMedKod } from "@/lib/db";
import { FORSTA_STARTDAG, serverNu, svensktDatum } from "@/lib/tid";

export const metadata: Metadata = { title: "Skapa lag" };
export const dynamic = "force-dynamic";

export default async function Aktivera({ searchParams }: { searchParams: Promise<{ kod?: string }> }) {
  const kod = (await searchParams).kod || "";
  const rad = kod ? kodMedKod(kod) : undefined;
  const advent = adventStart();
  // Koden avgör vilket spel laget hör till. Utan känd kod visas Klovskärs text, utom på barndeckarens egen adress.
  const barn = rad ? rad.spel === "barn" : process.env.STARTSIDA === "barn";
  return (
    <main className={barn ? "sida barn" : "sida"}>
      <Link href="/borja" className="liten">← Tillbaka</Link>
      <header className="stack">
        <p className="etikett">Skapa lag</p>
        <h1 className="rubrik-mellan">{barn ? "Välkomna till Måsholmen" : "Välkomna till Klovskär"}</h1>
        <p className="dampad">{barn
          ? "Den som skapar laget blir lagledare och kan lägga till fler enheter. Lagets namn står sedan på diplomet."
          : "Den som skapar laget blir lagledare: lämnar in anklagelsen på julafton och kan bjuda in, ta bort och ändra."}</p>
      </header>
      <AktiveraFormular
        kod={rad && !rad.lag_id ? rad.kod : kod}
        epost={rad && rad.typ === "kop" ? rad.epost ?? "" : ""}
        advent={advent}
        adventDirekt={luckorDirekt(advent)}
        minDatum={FORSTA_STARTDAG}
        forslag={FORSTA_STARTDAG > svensktDatum(serverNu()) ? FORSTA_STARTDAG : svensktDatum(serverNu())}
      />
    </main>
  );
}
