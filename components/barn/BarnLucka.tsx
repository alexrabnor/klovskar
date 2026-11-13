import type { BarnLucka as Lucka } from "@/content/barn/typer";
import { figurMedId } from "@/content/barn/figurer";
import { ZoombarMedInfo } from "@/components/ZoombarServer";
import { Fraga } from "./Fraga";
import { UppdragKnapp } from "./UppdragKnapp";

export const barnBild = (nr: number) => `barn-lucka-${String(nr).padStart(2, "0")}`;

/** Gemensam rendering av en barnlucka – används i laget, i smakprovet och i admin. */
export function BarnLucka({ lucka, gjort, spara }: { lucka: Lucka; gjort?: boolean; spara?: boolean }) {
  const struken = lucka.stryk ? figurMedId(lucka.stryk) : undefined;
  return (
    <>
      <header className="barn-huvud">
        <p className="datum">Lucka {lucka.nr}</p>
        <h1 className="rubrik-stor">{lucka.titel}</h1>
      </header>
      <div>
        <ZoombarMedInfo namn={barnBild(lucka.nr)} alt={lucka.bildAlt} prioritet />
        <p className="barn-bildtext">Sotis har gömt sig i bilden. Hittar du honom?</p>
      </div>
      <div className="barn-text">
        {lucka.text.map((t, i) => <p key={i} className={/^[\d\s–-]+$/.test(t) ? "kod" : undefined}>{t}</p>)}
      </div>
      {struken && (
        <p className="barn-stryk">
          <span>Nu kan ni stryka <b>{struken.namn}</b> från listan över misstänkta.</span>
        </p>
      )}
      <Fraga key={lucka.nr} text={lucka.fraga.text} val={lucka.fraga.val} />
      <section className="barn-uppdrag" aria-labelledby="uppdrag-rubrik">
        <div className="barn-uppdrag-topp">
          <span className="marke" aria-hidden="true">{lucka.uppdrag.marke}</span>
          <div>
            <p className="etikett">Dagens uppdrag{lucka.uppdrag.stor ? " · lite större" : ""}</p>
            <h2 id="uppdrag-rubrik">{lucka.uppdrag.titel}</h2>
          </div>
        </div>
        <p>{lucka.uppdrag.text}</p>
        <p className="behovs"><b>Det här behövs:</b> {lucka.uppdrag.behovs}</p>
        {spara && <UppdragKnapp nr={lucka.nr} gjort={!!gjort} />}
        <p className="frivilligt">Uppdraget är frivilligt. Nästa lucka öppnas i morgon oavsett.</p>
      </section>
    </>
  );
}
