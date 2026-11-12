import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { kravInloggad } from "@/lib/session";
import { arOppen, oppningstid } from "@/lib/tid";
import { PERSONER } from "@/content/personer";
import { MOTIV, METOD } from "@/lib/anklagelse-val";
import { Formular } from "./Formular";

export const metadata: Metadata = { title: "Anklagelsen" };

export default async function Anklagelse() {
  const { lag, farLamnaIn, arLedare, nu } = await kravInloggad();
  if (lag.anklagelse_inlamnad) redirect("/lag/facit");
  if (!arOppen(lag, 24, nu)) {
    return (
      <main className="sida">
        <h1 className="rubrik-mellan">Anklagelsen</h1>
        <p>Formuläret öppnar med lucka 24, {new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", dateStyle: "full", timeStyle: "short" }).format(new Date(oppningstid(lag.startdatum, 24)))}.</p>
        <p><Link href="/lag">← Kalendern</Link></p>
      </main>
    );
  }
  return (
    <main className="sida">
      <header className="stack">
        <p className="etikett">Lucka 24 · julafton</p>
        <h1 className="rubrik-mellan">Er anklagelse</h1>
        <p className="dampad">Alla i laget kan ändra i utkastet – det sparas av sig självt. {farLamnaIn ? (arLedare ? "Du är lagledare och lämnar in när ni är överens." : "Du har rätt att lämna in.") : "Lagledaren lämnar in när ni är överens."}</p>
      </header>
      <Formular personer={PERSONER.map((p) => ({ id: p.id, namn: p.namn, roll: p.roll }))} motiv={[...MOTIV]} metod={[...METOD]} farLamnaIn={farLamnaIn} />
    </main>
  );
}
