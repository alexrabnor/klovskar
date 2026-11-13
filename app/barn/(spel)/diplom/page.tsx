import Link from "next/link";
import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { spelareILag } from "@/lib/db";
import { gjordaUppdrag } from "@/lib/barn";
import { arOppen } from "@/lib/tid";

export const metadata: Metadata = { title: "Diplom" };

export default async function Diplom() {
  const { lag, nu } = await kravInloggad("barn");
  if (!arOppen(lag, 24, nu)) {
    return (
      <main className="sida">
        <h1 className="rubrik-mellan">Diplomet kommer på julafton</h1>
        <p className="dampad">När lucka 24 har öppnat och fallet är löst väntar diplomet här.</p>
        <p><Link href="/barn/kalender">← Till kalendern</Link></p>
      </main>
    );
  }
  const antal = gjordaUppdrag(lag.id).size;
  return (
    <main className="sida">
      <article className="diplom">
        <p className="etikett" style={{ color: "#a06a00" }}>Måsholmens fyr · julafton</p>
        <h1>Detektivdiplom</h1>
        <p>Härmed intygas att</p>
        <p className="lagnamn">{lag.namn}</p>
        <p className="namn">{spelareILag(lag.id).map((s) => s.namn).join(" · ")}</p>
        <p>har löst fallet med stjärnan som försvann, så att julbåten hittade hem i mörkret.</p>
        {antal > 0 && <p><b>{antal} av 24 uppdrag</b> klarade på vägen.</p>}
        <p className="liten">Undertecknat med en vit tass av Sotis, fyrkatt, och Algot, fyrvaktare.</p>
      </article>
      <p className="dampad liten utskrift-dold" style={{ textAlign: "center" }}>Skriv ut sidan från webbläsarens meny, eller ta en skärmbild.</p>
    </main>
  );
}
