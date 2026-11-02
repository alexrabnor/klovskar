import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { smakprov } from "@/lib/innehall";
import { PERSONER } from "@/content/personer";
import { LuckInnehall } from "@/components/LuckInnehall";
import { prisKr } from "@/lib/stripe";
import { Sidfot } from "@/components/Sidfot";

export const metadata: Metadata = { title: "Smakprov" };
export const dynamic = "force-dynamic";

export default async function Smakprov({ params }: { params: Promise<{ nr: string }> }) {
  const nr = Number((await params).nr);
  const lucka = smakprov(nr);
  if (!lucka) notFound();
  return (
    <>
      <main className="sida">
        <Link href="/" className="liten">← Startsidan</Link>
        <p className="chip chip-varning" style={{ justifySelf: "start" }}>Gratis smakprov</p>
        <LuckInnehall lucka={lucka} personer={lucka.interaktion === "misstankta" ? PERSONER : undefined} />
        <div className="panel stack">
          {nr === 1
            ? <><p>Nästa lucka: gästlistan och de sju misstänkta.</p><div><Link className="knapp knapp-sekundar" href="/smakprov/2">Läs lucka 2</Link></div></>
            : <p>Resten av utredningen – 22 luckor till, sex bonusluckor och facit på julafton – får ni när ni köper spelet.</p>}
          <div className="rad">
            <Link className="knapp" href="/kop">Köp för {prisKr()} kr</Link>
            <Link className="knapp knapp-sekundar" href="/kop?present=1">Ge bort</Link>
          </div>
        </div>
      </main>
      <Sidfot />
    </>
  );
}
