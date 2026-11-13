"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const IKON = {
  kalender: <path d="M4 6h16v14H4zM4 10h16M9 3v4M15 3v4" />,
  pass: <><path d="M6 3h12v18H6z" /><circle cx="12" cy="10" r="3" /><path d="M9 17h6" /></>,
  oborna: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 2 6 5.5" /></>,
  laget: <><path d="M12 3l2.6 5.6 6 .7-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.3l6-.7z" /></>,
};

const FLIKAR: [string, string, keyof typeof IKON][] = [
  ["/barn/kalender", "Kalendern", "kalender"],
  ["/barn/pass", "Passet", "pass"],
  ["/barn/oborna", "Öborna", "oborna"],
  ["/barn/laget", "Laget", "laget"],
];

export function Flikar() {
  const sokvag = usePathname();
  return (
    <nav className="flikar" aria-label="Huvudmeny">
      {FLIKAR.map(([href, text, ikon]) => {
        const aktiv = href === "/barn/kalender" ? sokvag === href || sokvag.startsWith("/barn/lucka") : sokvag.startsWith(href);
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
