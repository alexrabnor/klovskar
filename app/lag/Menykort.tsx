import Link from "next/link";
import { Bild } from "@/components/Bild";

// Menyns bildkort. Bara publika bilder här – menyn får aldrig visa en låst luckbild.
export function Menykort({ oppna, allt = false }: { oppna: number; allt?: boolean }) {
  const kort: { href: string; text: string; bild: string; visa: boolean }[] = [
    { href: "/lag", text: "Kalendern", bild: "omslag", visa: allt },
    { href: "/lag/tavla", text: "Anslagstavlan", bild: "meny-tavla", visa: true },
    { href: "/lag/misstankta", text: "De misstänkta", bild: "misstankta", visa: true },
    { href: "/lag/karta", text: "Kartan", bild: "karta", visa: true },
    { href: "/lag/matare", text: "Misstankemätaren", bild: "meny-matare", visa: true },
    { href: "/lag/bonus", text: "Bonusluckor", bild: "koket", visa: oppna >= 7 },
    { href: "/lag/laget", text: "Laget", bild: "hotellet-dag", visa: true },
    { href: "/lag/anklagelse", text: "Anklagelsen", bild: "omslag", visa: oppna >= 24 },
    { href: "/topplista", text: "Topplistan", bild: "hotellet-dag", visa: allt },
  ];
  return (
    <nav className="menykort-rutnat" aria-label="Utredningen">
      {kort.filter((k) => k.visa).map((k) => (
        <Link key={k.href} href={k.href} className="menykort">
          <Bild namn={k.bild} alt="" sizes="(max-width: 760px) 50vw, 260px" />
          <span>{k.text}</span>
        </Link>
      ))}
    </nav>
  );
}
