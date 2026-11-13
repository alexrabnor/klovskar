import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { barnSmakprov } from "@/lib/barn";
import { BarnLucka } from "@/components/barn/BarnLucka";
import { BarnSidfot } from "@/components/barn/Sidfot";
import { kopOppet, prisFor } from "@/lib/stripe";

export const metadata: Metadata = { title: "Smakprov" };

export default async function BarnSmakprov({ params }: { params: Promise<{ nr: string }> }) {
  const nr = Number((await params).nr);
  const lucka = barnSmakprov(nr);
  if (!lucka) notFound();
  return (
    <>
      <main className="sida">
        <Link href="/barn" className="liten">← Startsidan</Link>
        <p className="chip chip-varning" style={{ justifySelf: "start" }}>Gratis smakprov</p>
        <BarnLucka lucka={lucka} />
        <div className="panel stack">
          {nr === 1
            ? <><p>Nästa lucka: Sotis presenterar alla som bor på ön.</p><div><Link className="knapp knapp-sekundar" href="/barn/smakprov/2">Läs lucka 2</Link></div></>
            : <p>Resten av berättelsen – 22 luckor till, detektivpasset och diplomet på julafton – får ni när ni köper spelet.</p>}
          {kopOppet() ? (
            <div className="rad">
              <Link className="knapp" href="/kop?spel=barn">Köp för {prisFor("barn")} kr</Link>
              <Link className="knapp knapp-sekundar" href="/kop?spel=bada">Båda deckarna {prisFor("bada")} kr</Link>
            </div>
          ) : <p className="dampad"><b>Spelet släpps snart.</b> Köpet öppnar inom kort.</p>}
        </div>
      </main>
      <BarnSidfot />
    </>
  );
}
