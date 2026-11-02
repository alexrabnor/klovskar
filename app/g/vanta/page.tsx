import type { Metadata } from "next";
import { Vantar } from "./Vantar";

export const metadata: Metadata = { title: "Väntar på godkännande", robots: { index: false } };

export default async function Vanta({ searchParams }: { searchParams: Promise<{ h?: string; namn?: string }> }) {
  const { h = "", namn = "" } = await searchParams;
  return (
    <main className="sida">
      <h1 className="rubrik-mellan">Är det du, {namn}?</h1>
      <p>Det finns redan en <b>{namn}</b> i laget. Be någon annan i laget – eller lagledaren – att öppna appen och trycka <b>Godkänn</b>. Den här sidan uppdateras av sig själv.</p>
      <Vantar h={h} />
      <p className="dampad liten">Är du inte samma person? <a href="/g">Gå tillbaka</a> och välj ett annat namn.</p>
    </main>
  );
}
