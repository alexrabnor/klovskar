import Link from "next/link";
import type { Metadata } from "next";
import { lagMedKod, spelareILag } from "@/lib/db";
import { MAX_SPELARE } from "@/lib/lag";
import { GaMedFormular } from "../GaMedFormular";
import { Bild } from "@/components/Bild";

export const metadata: Metadata = { title: "Inbjudan" };
export const dynamic = "force-dynamic";

export default async function Inbjudan({ params }: { params: Promise<{ kod: string }> }) {
  const kod = (await params).kod.toUpperCase();
  const lag = lagMedKod(kod);
  if (!lag) {
    return (
      <main className="sida">
        <h1 className="rubrik-mellan">Lagkoden finns inte</h1>
        <p>Koden <code>{kod}</code> hittades inte. Lagledaren kan ha bytt den. Be om en ny länk.</p>
        <p><Link href="/g">Skriv in en kod</Link></p>
      </main>
    );
  }
  const antal = spelareILag(lag.id).length;
  return (
    <main className="sida">
      <div className="bildram"><Bild namn="hotellet-dag" alt="Hotell Fyrbåken och fyrtornet på Klovskär i vinterljus." prioritet /></div>
      <header className="stack">
        <p className="etikett">Mordet på Klovskär</p>
        <h1 className="rubrik-mellan">{lag.namn} behöver dig</h1>
        <p className="dampad">{antal} av {MAX_SPELARE} platser är tagna – hela 5 personer kan vara med i laget. Varje morgon öppnas en ny lucka, och på julafton lämnar laget in sin anklagelse.</p>
      </header>
      <GaMedFormular kod={lag.kod} lagnamn={lag.namn} />
    </main>
  );
}
