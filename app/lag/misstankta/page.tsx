import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { PERSONER } from "@/content/personer";
import { ZoombarMedInfo } from "@/components/ZoombarServer";
import { Misstankta } from "@/components/Interaktioner";

export const metadata: Metadata = { title: "De misstänkta" };

export default async function MisstanktaSida() {
  await kravInloggad();
  return (
    <main className="sida">
      <h1 className="rubrik-mellan">De misstänkta</h1>
      <ZoombarMedInfo namn="misstankta" alt="Sju svartvita porträtt på en träskiva med namnlappar." prioritet />
      <Misstankta personer={PERSONER} />
    </main>
  );
}
