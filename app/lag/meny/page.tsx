import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { antalOppna } from "@/lib/tid";
import { Menykort } from "../Menykort";

export const metadata: Metadata = { title: "Utredningen" };

export default async function Meny() {
  const { lag, nu } = await kravInloggad();
  return (
    <main className="sida sida-bred">
      <h1 className="rubrik-mellan">Utredningen</h1>
      <Menykort oppna={antalOppna(lag, nu)} allt />
    </main>
  );
}
