import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { PLATSER } from "@/content/karta";
import { Karta } from "@/components/Interaktioner";

export const metadata: Metadata = { title: "Kartan" };

export default async function KartSida() {
  await kravInloggad();
  return (
    <main className="sida">
      <h1 className="rubrik-mellan">Klovskär</h1>
      <Karta platser={PLATSER} />
    </main>
  );
}
