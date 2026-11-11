"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import type { Gata } from "@/content/bonus";
import type { ReactNode } from "react";

/** Gåtan utan facit. Flaggorna skickas som färdigritad SVG från servern – aldrig som bokstäver. */
export type KlientGata = Exclude<Gata, { typ: "flaggor" }> | { typ: "flaggor"; ledtrad: string };
import { losBonus } from "../actions";
import { bildUrl } from "@/components/Bild";

/** Vad laget ska få fram – säger formen på svaret, aldrig svaret. */
const UPPDRAG: Record<KlientGata["typ"], { gor: string; falt: string }> = {
  caesar: { gor: "Flytta tillbaka varje bokstav tre steg i alfabetet. Då får ni fram ett ord.", falt: "Ordet ni fick fram" },
  morse: { gor: "Titta på lampan och översätt blinkningarna till bokstäver. Då får ni fram ett ord.", falt: "Ordet ni fick fram" },
  anagram: { gor: "Kasta om bokstäverna så att de bildar ett ord.", falt: "Ordet ni fick fram" },
  koordinat: { gor: "Hitta rutan på kartan och se vad som ligger där.", falt: "Namnet på platsen" },
  flaggor: { gor: "Varje flagga är en bokstav. Läs dem i ordning så får ni fram ett ord.", falt: "Ordet ni fick fram" },
  siffror: { gor: "Svaret är ett klockslag med fyra siffror, utan punkt.", falt: "Fyra siffror" },
};

export function Gatan({ nr, gata, flaggor }: { nr: number; gata: KlientGata; flaggor?: ReactNode }) {
  const [svar, skicka, vantar] = useActionState(losBonus, undefined);
  const uppdrag = UPPDRAG[gata.typ];
  return (
    <div className="stack">
      <div className="panel stack" style={{ gap: 6 }}>
        <p style={{ margin: 0 }}><b>Så funkar det:</b> någon på ön har lämnat ett hemligt meddelande. Knäck det och skriv in det ni får fram längst ner. Rätt svar öppnar en bonuslucka med extra material och ger laget en poäng när ni lämnar in på julafton.</p>
        <p className="dampad liten" style={{ margin: 0 }}>Det är frivilligt – fallet går att lösa utan bonusluckorna. Ni kan gissa hur många gånger som helst.</p>
      </div>
      <p className="etikett" style={{ margin: "8px 0 0" }}>Meddelandet</p>
      {gata.typ === "caesar" && (
        <>
          <div className="chiffertext">{gata.chiffer}</div>
          <p className="alfabet" aria-label="Alfabetet">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
        </>
      )}
      {gata.typ === "morse" && <Morse morse={gata.morse} />}
      {gata.typ === "anagram" && (
        <div className="brickor">{gata.bokstaver.split("").map((b, i) => <span key={i} className="bricka">{b}</span>)}</div>
      )}
      {gata.typ === "koordinat" && <Rutnat />}
      {gata.typ === "flaggor" && (
        flaggor
      )}
      <div className="stack" style={{ gap: 4 }}>
        <p className="etikett" style={{ margin: 0 }}>Ledtråd</p>
        <p className="ingress" style={{ fontSize: 22, margin: 0 }}>{gata.ledtrad}</p>
      </div>
      <p style={{ margin: 0 }}><b>Ert uppdrag:</b> {uppdrag.gor}</p>
      {svar?.ok ? (
        <div className="panel stack">
          <p className="ok">Rätt! Bonuslucka {nr} är upplåst.</p>
          <div><a className="knapp" href={`/lag/bonus/${nr}`}>Öppna</a></div>
        </div>
      ) : (
        <form action={skicka} className="panel stack">
          <input type="hidden" name="nr" value={nr} />
          <div className="falt">
            <label htmlFor="svar">{uppdrag.falt}</label>
            <input id="svar" name="svar" type="text" required autoComplete="off" autoCapitalize="characters" inputMode={gata.typ === "siffror" ? "numeric" : "text"} style={{ fontFamily: "var(--f-m)", letterSpacing: ".1em", textTransform: "uppercase" }} />
          </div>
          {svar?.fel && <p className="fel" role="alert">{svar.fel}</p>}
          <div><button className="knapp" disabled={vantar}>{vantar ? "Prövar …" : "Lås upp bonusluckan"}</button></div>
        </form>
      )}
    </div>
  );
}

/** Blinkande lampa som spelar morsekoden. Punkt = 1 enhet, streck = 3, mellan tecken 3, mellan bokstäver 7. */
function Morse({ morse }: { morse: string }) {
  const [pa, setPa] = useState(false);
  const [spelar, setSpelar] = useState(false);
  const [visaText, setVisaText] = useState(false);
  const avbryt = useRef(false);

  const spela = async () => {
    avbryt.current = false;
    setSpelar(true);
    const E = 260;
    const vanta = (ms: number) => new Promise((r) => setTimeout(r, ms));
    for (let varv = 0; varv < 2 && !avbryt.current; varv++) {
      for (const bokstav of morse.split(" ")) {
        for (const tecken of bokstav) {
          if (avbryt.current) break;
          setPa(true);
          await vanta(tecken === "." ? E : E * 3);
          setPa(false);
          await vanta(E);
        }
        await vanta(E * 3);
      }
      await vanta(E * 8);
    }
    setSpelar(false);
  };
  useEffect(() => () => { avbryt.current = true; }, []);

  return (
    <div className="stack">
      <div className="lampa-ram"><div className={`lampa${pa ? " pa" : ""}`} aria-hidden="true" /></div>
      <div className="rad">
        <button type="button" className="knapp knapp-sekundar" onClick={spela} disabled={spelar}>{spelar ? "Lampan blinkar …" : "Titta på lampan"}</button>
        <button type="button" className="lank-knapp" onClick={() => setVisaText((v) => !v)}>{visaText ? "Dölj" : "Visa"} som prickar och streck</button>
      </div>
      {visaText && <p className="chiffertext" style={{ fontSize: 26 }}>{morse.split(" ").join("   ")}</p>}
    </div>
  );
}

function Rutnat() {
  const [vald, setVald] = useState<string | null>(null);
  return (
    <div className="stack">
      <div className="rutnat-karta">
        <img src={bildUrl("karta", 1600)} alt="Kartan över Klovskär med ett rutnät i blyerts, kolumner A–F och rader 1–6." />
        <div className="rutor">
          {Array.from({ length: 36 }, (_, i) => {
            const k = "ABCDEF"[i % 6] + (Math.floor(i / 6) + 1);
            return <button key={k} type="button" className={`ruta${vald === k ? " vald" : ""}`} onClick={() => setVald(k)} aria-label={`Ruta ${k}`}>{k}</button>;
          })}
        </div>
      </div>
      {vald && <p className="dampad liten">Du har markerat ruta {vald}.</p>}
    </div>
  );
}
