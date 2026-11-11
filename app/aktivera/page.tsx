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
  return (
    <main className="sida">
      <Link href="/borja" className="liten">← Tillbaka</Link>
      <header className="stack">
        <p className="etikett">Skapa lag</p>
        <h1 className="rubrik-mellan">Välkomna till Klovskär</h1>
        <p className="dampad">Den som skapar laget blir lagledare: lämnar in anklagelsen på julafton och kan bjuda in, ta bort och ändra.</p>
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
