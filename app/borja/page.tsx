import Link from "next/link";
import type { Metadata } from "next";
import { kopOppet, prisFor, prisKr } from "@/lib/stripe";

export const metadata: Metadata = { title: "Börja" };
export const dynamic = "force-dynamic";

export default function Borja() {
  // På barndeckarens egen adress leder allt tillbaka dit
  const barn = process.env.STARTSIDA === "barn";
  return (
    <main className={barn ? "sida barn" : "sida"}>
      <Link href={barn ? "/barn" : "/"} className="liten">← Startsidan</Link>
      <h1 className="rubrik-mellan">Hur vill du börja?</h1>
      <div className="stack">
        <Link href="/g" className="panel valkort">
          <span className="etikett">Jag har en lagkod</span>
          <span>Någon i laget har skickat sex tecken till dig, t.ex. <code>KLV4X2</code>. Gå med i laget.</span>
        </Link>
        <Link href="/aktivera" className="panel valkort">
          <span className="etikett">Jag har en aktiveringskod</span>
          <span>Du har köpt spelet eller fått ett presentkort. Skapa ert lag och bli lagledare.</span>
        </Link>
        <Link href={barn ? "/kop?spel=barn" : "/kop"} className="panel valkort">
          <span className="etikett">Jag har ingen kod</span>
          <span>{barn ? (kopOppet() ? `Köp barndeckaren för ${prisFor("barn")} kr.` : "Spelet släpps snart.") : kopOppet() ? `Köp spelet för ${prisKr()} kr för ett helt lag.` : "Spelet släpps snart. Köpet öppnar i god tid före den 1 december."}</span>
        </Link>
      </div>
      <p className="dampad liten">Har du bytt telefon? Använd din personliga inloggningslänk, eller gå med i laget igen med samma namn – någon i laget får godkänna.</p>
    </main>
  );
}
