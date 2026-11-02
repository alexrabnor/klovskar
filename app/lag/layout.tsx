import Link from "next/link";
import { kravInloggad } from "@/lib/session";
import { vantandeOvertag } from "@/lib/lag";
import { godkann, neka } from "@/app/actions";
import { Flikar } from "./Flikar";
import { LjudKnapp } from "@/components/Ljud";

export const dynamic = "force-dynamic";

export default async function LagLayout({ children }: { children: React.ReactNode }) {
  const { lag, spelare, arLedare } = await kravInloggad();
  const overtag = vantandeOvertag(lag.id).filter((o) => o.spelare_id !== spelare.id || arLedare);
  return (
    <>
      <header className="topp">
        <div className="topp-inre">
          <Link href="/lag" className="topp-namn">Klovskär</Link>
          <span className="topp-hoger">
            <span className="topp-lag">{lag.namn}{arLedare ? " · lagledare" : ""}</span>
            <LjudKnapp />
          </span>
        </div>
      </header>
      {overtag.map((o) => (
        <div key={o.id} className="overtag-ruta">
          <span>Någon vill logga in som <b>{o.namn}</b> på en ny enhet. Är det verkligen {o.namn}?</span>
          <form action={godkann}><input type="hidden" name="id" value={o.id} /><button className="knapp knapp-liten">Godkänn</button></form>
          <form action={neka}><input type="hidden" name="id" value={o.id} /><button className="knapp knapp-sekundar knapp-liten">Neka</button></form>
        </div>
      ))}
      {children}
      <Flikar />
    </>
  );
}
