import Link from "next/link";
import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { PERSONER } from "@/content/personer";
import { ZoombarMedInfo } from "@/components/ZoombarServer";
import { Misstankta } from "@/components/Interaktioner";

export const metadata: Metadata = { title: "De misstänkta" };

export default async function MisstanktaSida({ searchParams }: { searchParams: Promise<{ fran?: string }> }) {
  await kravInloggad();
  const n = Number((await searchParams).fran);
  const fran = Number.isInteger(n) && n >= 1 && n <= 24 ? n : null;
  const tillbaka = fran && <p className="liten"><Link href={`/lag/lucka/${fran}`}>← Tillbaka till lucka {fran}</Link></p>;
  return (
    <main className="sida">
      {tillbaka}
      <h1 className="rubrik-mellan">De misstänkta</h1>
      <ZoombarMedInfo namn="misstankta" alt="Sju svartvita porträtt på en träskiva med namnlappar." prioritet />
      <Misstankta personer={PERSONER} />
      {tillbaka}
    </main>
  );
}
