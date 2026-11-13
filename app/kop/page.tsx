import Link from "next/link";
import type { Metadata } from "next";
import { KopFormular } from "./KopFormular";
import { kopOppet, prisFor, prisText } from "@/lib/stripe";
import { adventStart, luckorDirekt } from "@/lib/lag";
import { Sidfot } from "@/components/Sidfot";
import { BarnSidfot } from "@/components/barn/Sidfot";
import { arVara, barnPa, type Vara } from "@/lib/spel";

export const metadata: Metadata = { title: "Köp" };
export const dynamic = "force-dynamic";

const TEXT: Record<Vara, { rubrik: string; present: string; vad: string; smakprov: string }> = {
  klovskar: { rubrik: "Mordet på Klovskär – ett lag", present: "Ge bort Mordet på Klovskär i julklapp", vad: "för ett lag där hela 5 personer kan vara med", smakprov: "/smakprov/1" },
  barn: { rubrik: "Stjärnan som försvann – ett lag", present: "Ge bort Stjärnan som försvann i julklapp", vad: "för ett lag med hela 5 enheter", smakprov: "/barn/smakprov/1" },
  bada: { rubrik: "Båda deckarna", present: "Ge bort båda deckarna i julklapp", vad: "för båda spelen: Mordet på Klovskär för de vuxna och Stjärnan som försvann för barnen. Ni får en kod till varje spel", smakprov: "/barn/smakprov/1" },
};

export default async function Kop({ searchParams }: { searchParams: Promise<{ present?: string; spel?: string }> }) {
  const sp = await searchParams;
  const present = sp.present === "1";
  const vara: Vara = arVara(sp.spel) && barnPa() ? sp.spel : "klovskar";
  const t = TEXT[vara];
  const barn = vara !== "klovskar";
  const direkt = luckorDirekt(adventStart());
  const pris = vara === "klovskar" ? prisText() : `${prisFor(vara)} kr`;
  return (
    <div className={barn ? "barn" : undefined}>
      <main className="sida">
        <Link href={barn ? "/barn" : "/"} className="liten">← Tillbaka</Link>
        <header className="stack">
          <p className="etikett">{present ? "Julklapp" : "Köp"}</p>
          <h1 className="rubrik-mellan">{present ? t.present : t.rubrik}</h1>
          <p className="dampad">
            {pris} {t.vad}. Betalning med kort, Apple Pay, Google Pay eller Klarna via Stripe.
          </p>
        </header>
        {direkt > 0 && (
          <p className="panel">
            <b>Det är redan december.</b> Väljer ni att följa adventskalendern öppnas {direkt} {direkt === 1 ? "lucka" : "luckor"} direkt,
            så att ni kan läsa ikapp. Ni kan också välja ett eget startdatum när ni skapar laget.
          </p>
        )}
        {kopOppet()
          ? <KopFormular present={present} vara={vara} />
          : (
            <div className="panel stack">
              <p><b>Spelet släpps snart.</b> Köpet öppnar inom kort, i god tid före den 1 december.</p>
              <p className="dampad">Under tiden kan ni läsa de två första luckorna gratis.</p>
              <div><Link className="knapp knapp-sekundar" href={t.smakprov}>Läs lucka 1</Link></div>
            </div>
          )}
      </main>
      {barn ? <BarnSidfot /> : <Sidfot />}
    </div>
  );
}
