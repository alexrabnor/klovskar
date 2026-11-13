"use client";
import { useState, useTransition } from "react";
import { markeraUppdrag } from "@/app/barn/actions";

/** "Vi gjorde det!" – ingen kontroll. Märket hamnar i lagets detektivpass, och går att ångra. */
export function UppdragKnapp({ nr, gjort }: { nr: number; gjort: boolean }) {
  const [klart, setKlart] = useState(gjort);
  const [vantar, starta] = useTransition();
  const satt = (v: boolean) => {
    setKlart(v);
    starta(async () => { await markeraUppdrag(nr, v); });
  };
  if (klart) {
    return (
      <div className="rad" role="status">
        <b>Märket sitter i ert detektivpass!</b>
        <button type="button" className="lank-knapp liten" onClick={() => satt(false)} disabled={vantar}>Ångra</button>
      </div>
    );
  }
  return <div><button type="button" className="knapp" onClick={() => satt(true)} disabled={vantar}>Vi gjorde det!</button></div>;
}
