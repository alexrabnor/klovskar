import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { kodMedKod } from "@/lib/db";
import { Bild } from "@/components/Bild";

export const metadata: Metadata = { title: "Presentkort", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Presentkort({ params }: { params: Promise<{ kod: string }> }) {
  const kod = kodMedKod(decodeURIComponent((await params).kod));
  if (!kod) notFound();
  const bas = (process.env.BAS_URL || "https://klovskar.alexcloud.se").replace(/^https?:\/\//, "");
  return (
    <main className="presentkort-sida">
      <article className="presentkort">
        <div className="presentkort-bild"><Bild namn="omslag" alt="Fyrtornet och hotellet på Klovskär en snöig natt." sizes="360px" prioritet /></div>
        <div className="presentkort-text">
          <p className="etikett">Presentkort</p>
          <h1>Mordet på Klovskär</h1>
          <p>Ett adventsmysterium i 24 luckor för dig och upp till nio vänner. Ni väljer själva när de 24 dagarna börjar.</p>
          <p className="presentkort-kod">{kod.kod}</p>
          <p className="liten">Skapa ert lag på <b>{bas}/aktivera</b></p>
          {kod.lag_id && <p className="liten" style={{ color: "#8a2f25" }}>Koden har redan använts.</p>}
        </div>
      </article>
      <p className="dampad liten utskrift-dold" style={{ textAlign: "center" }}>Skriv ut sidan eller ta en skärmbild och skicka vidare.</p>
    </main>
  );
}
