import Link from "next/link";
import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { upplastBonus } from "@/lib/innehall";
import { bonusNr } from "@/content/bonus";
import { arOppen } from "@/lib/tid";
import { Dokument } from "@/components/Dokument";
import { Zoombar } from "@/components/Zoombar";
import { Gatan, type KlientGata } from "./Gatan";
import { Signalflaggor } from "@/components/Signalflaggor";

export const metadata: Metadata = { title: "Bonuslucka" };

export default async function BonusSida({ params }: { params: Promise<{ nr: string }> }) {
  const nr = Number((await params).nr);
  const { lag, nu } = await kravInloggad();
  const b = bonusNr(nr);
  if (!b || !arOppen(lag, b.synsFran, nu)) {
    return (
      <main className="sida">
        <h1 className="rubrik-mellan">Inget chiffer här än</h1>
        <p><Link href="/lag/bonus">← Bonusluckor</Link></p>
      </main>
    );
  }
  const upplast = upplastBonus(lag, nr, nu);
  if (!upplast) {
    // Bara gåtan skickas – aldrig svaret eller bonusinnehållet
    return (
      <main className="sida">
        <Link href="/lag/bonus" className="liten">← Bonusluckor</Link>
        <header className="stack">
          <p className="etikett">Bonus {nr} · chiffer från lucka {b.synsFran}</p>
          <h1 className="rubrik-mellan">Ett olöst meddelande</h1>
        </header>
        <Gatan
          nr={nr}
          gata={(b.gata.typ === "flaggor" ? { typ: "flaggor", ledtrad: b.gata.ledtrad } : b.gata) as KlientGata}
          flaggor={b.gata.typ === "flaggor" ? <Signalflaggor bokstaver={b.gata.flaggor} /> : undefined}
        />
      </main>
    );
  }
  return (
    <main className="sida">
      <Link href="/lag/bonus" className="liten">← Bonusluckor</Link>
      <header className="luckhuvud">
        <p className="datum">Bonuslucka {nr}</p>
        <h1 className="rubrik-stor">{upplast.titel}</h1>
        <p className="ingress">{upplast.ingress}</p>
      </header>
      {upplast.bilder.map((bild, i) => <Zoombar key={bild.namn} namn={bild.namn} alt={bild.alt} prioritet={i === 0} />)}
      {upplast.avsnitt.map((a, i) => <Dokument key={i} a={a} />)}
    </main>
  );
}
