import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { LUCKOR } from "@/content/luckor";
import { PERSONER } from "@/content/personer";
import { arOppen } from "@/lib/tid";
import { Tavla } from "./Tavla";

export const metadata: Metadata = { title: "Anslagstavlan" };

export default async function TavlaSida() {
  const { lag, nu } = await kravInloggad();
  const luckor = LUCKOR.filter((l) => arOppen(lag, l.nr, nu)).map((l) => ({ nr: l.nr, titel: l.titel }));
  return (
    <main className="sida sida-bred">
      <header className="stack">
        <h1 className="rubrik-mellan">Anslagstavlan</h1>
        <p className="dampad">Fäst luckor, personer och egna lappar. Dra korten. Välj <b>Röd tråd</b> och tryck på två kort för att binda ihop dem. Laget ser samma tavla.</p>
      </header>
      <Tavla luckor={luckor} personer={PERSONER.map((p) => ({ id: p.id, namn: p.namn }))} />
    </main>
  );
}
