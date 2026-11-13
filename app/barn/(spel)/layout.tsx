import Link from "next/link";
import { kravInloggad } from "@/lib/session";
import { vantandeOvertag } from "@/lib/lag";
import { godkann, neka } from "@/app/actions";
import { Flikar } from "./Flikar";

export default async function BarnSpelLayout({ children }: { children: React.ReactNode }) {
  const { lag, spelare, arLedare } = await kravInloggad("barn");
  const overtag = vantandeOvertag(lag.id).filter((o) => o.spelare_id !== spelare.id || arLedare);
  return (
    <>
      <header className="topp">
        <div className="topp-inre">
          <Link href="/barn/kalender" className="topp-namn">Måsholmen</Link>
          <span className="topp-hoger"><span className="topp-lag">{lag.namn}</span></span>
        </div>
      </header>
      {overtag.map((o) => (
        <div key={o.id} className="overtag-ruta">
          <span>Någon vill logga in som <b>{o.namn}</b> på en ny enhet. Är det verkligen {o.namn}?</span>
          <form action={godkann}><input type="hidden" name="spel" value="barn" /><input type="hidden" name="id" value={o.id} /><button className="knapp knapp-liten">Godkänn</button></form>
          <form action={neka}><input type="hidden" name="spel" value="barn" /><input type="hidden" name="id" value={o.id} /><button className="knapp knapp-sekundar knapp-liten">Neka</button></form>
        </div>
      ))}
      {children}
      <Flikar />
    </>
  );
}
