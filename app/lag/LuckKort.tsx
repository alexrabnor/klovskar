"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { bildUrl } from "@/components/Bild";

function nedrakning(ms: number): string {
  if (ms <= 0) return "Öppnar nu";
  const min = Math.floor(ms / 60000);
  const d = Math.floor(min / 1440), h = Math.floor((min % 1440) / 60), m = min % 60;
  if (d > 0) return `${d} d ${h} h`;
  if (h > 0) return `${h} h ${m} min`;
  return `${m} min`;
}

export function LuckKort({ nr, oppen, titel, bild, ny, oppnar, stor }: {
  nr: number; oppen: boolean; titel: string | null; bild: string | null; ny: boolean; oppnar: number; stor: boolean;
}) {
  const router = useRouter();
  const [kvar, setKvar] = useState<number | null>(null);
  const [animerar, setAnimerar] = useState(false);
  useEffect(() => {
    if (oppen) return;
    const t = () => {
      const k = oppnar - Date.now();
      setKvar(k);
      if (k <= 0) router.refresh();
    };
    t();
    const id = setInterval(t, 30000);
    return () => clearInterval(id);
  }, [oppen, oppnar, router]);

  const klass = `lucka${stor ? " lucka-stor" : ""}`;
  if (!oppen) {
    return (
      <div className={`${klass} lucka-last`} aria-label={`Lucka ${nr}, låst`}>
        <span className="lucka-nr">{nr}</span>
        <span className="nedrakning">{kvar === null ? "" : nedrakning(kvar)}</span>
      </div>
    );
  }
  const href = `/lag/lucka/${nr}`;
  const klick = (e: React.MouseEvent) => {
    if (!ny || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    setAnimerar(true);
    setTimeout(() => router.push(href), 700);
  };
  return (
    <Link href={href} className={klass} onClick={klick} aria-label={`Lucka ${nr}: ${titel}${ny ? " (ny)" : ""}`}>
      {bild && <img src={bildUrl(bild, 320)} srcSet={`${bildUrl(bild, 320)} 320w, ${bildUrl(bild, 640)} 640w`} sizes={stor ? "50vw" : "25vw"} alt="" loading="lazy" />}
      {ny && <span className="lucka-ny">Ny</span>}
      <span className="lucka-titel">{titel}</span>
      <span className="lucka-nr">{nr}</span>
      {animerar && <span className="lucka-dorr oppnar" aria-hidden="true"><span>{nr}</span></span>}
    </Link>
  );
}
