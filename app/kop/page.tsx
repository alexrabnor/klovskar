import Link from "next/link";
import type { Metadata } from "next";
import { KopFormular } from "./KopFormular";
import { prisKr, stripeKonfigurerad } from "@/lib/stripe";
import { adventStart, luckorDirekt } from "@/lib/lag";
import { Sidfot } from "@/components/Sidfot";

export const metadata: Metadata = { title: "Köp" };
export const dynamic = "force-dynamic";

export default async function Kop({ searchParams }: { searchParams: Promise<{ present?: string }> }) {
  const present = (await searchParams).present === "1";
  const direkt = luckorDirekt(adventStart());
  return (
    <>
      <main className="sida">
        <Link href="/" className="liten">← Tillbaka</Link>
        <header className="stack">
          <p className="etikett">{present ? "Presentkort" : "Köp"}</p>
          <h1 className="rubrik-mellan">{present ? "Ge bort Mordet på Klovskär" : "Mordet på Klovskär – ett lag"}</h1>
          <p className="dampad">
            Introduktionspris {prisKr()} kr (ord. 199 kr) för ett lag där hela 5 personer kan vara med. Betalning med kort, Apple Pay eller Google Pay via Stripe.
          </p>
        </header>
        {direkt > 0 && (
          <p className="panel">
            <b>Det är redan december.</b> Väljer ni att följa adventskalendern öppnas {direkt} {direkt === 1 ? "lucka" : "luckor"} direkt,
            så att ni kan läsa ikapp. Ni kan också välja ett eget startdatum när ni skapar laget.
          </p>
        )}
        {stripeKonfigurerad()
          ? <KopFormular present={present} />
          : <p className="panel fel">Betalningen är inte aktiverad än. Försök igen senare.</p>}
      </main>
      <Sidfot />
    </>
  );
}
