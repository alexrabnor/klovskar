"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const IKON = {
  kalender: <path d="M4 6h16v14H4zM4 10h16M9 3v4M15 3v4" />,
  tavla: <><path d="M3 5h18v13H3z" /><path d="M7 9l5 4 5-3" /><circle cx="7" cy="9" r="1.3" /><circle cx="12" cy="13" r="1.3" /><circle cx="17" cy="10" r="1.3" /></>,
  matare: <><path d="M4 16a8 8 0 0 1 16 0" /><path d="M12 16l4-5" /></>,
  meny: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  laget: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 2 6 5.5" /></>,
};

const FLIKAR: [string, string, keyof typeof IKON][] = [
  ["/lag", "Kalendern", "kalender"],
  ["/lag/tavla", "Tavlan", "tavla"],
  ["/lag/matare", "Mätaren", "matare"],
  ["/lag/meny", "Mer", "meny"],
  ["/lag/laget", "Laget", "laget"],
];

export function Flikar() {
  const sokvag = usePathname();
  return (
    <nav className="flikar" aria-label="Huvudmeny">
      {FLIKAR.map(([href, text, ikon]) => {
        const aktiv = href === "/lag" ? sokvag === "/lag" || sokvag.startsWith("/lag/lucka") : sokvag.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={aktiv ? "page" : undefined}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{IKON[ikon]}</svg>
            {text}
          </Link>
        );
      })}
    </nav>
  );
}
