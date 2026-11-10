import type { Lucka } from "@/content/typer";
import type { Plats } from "@/content/karta";
import type { Person } from "@/content/personer";
import { Dokument } from "./Dokument";
import { Zoombar } from "./Zoombar";
import { Karta, Loggbok, Misstankta, Pussel } from "./Interaktioner";
import { berattelseDatum } from "@/lib/tid";
import { SaSpelarNi } from "./SaSpelarNi";
import { Uppgift } from "./Uppgift";

/** Gemensam rendering av en lucka – används i laget, i smakprovet och i admin. */
export function LuckInnehall({ lucka, platser, personer }: { lucka: Lucka; platser?: Plats[]; personer?: Person[] }) {
  const loggbok = lucka.interaktion === "loggbok" && lucka.transkription;
  const karta = lucka.interaktion === "karta" && platser;
  return (
    <>
      <header className="luckhuvud">
        <p className="datum">Lucka {lucka.nr} · {berattelseDatum(lucka.nr)}</p>
        <h1 className="rubrik-stor">{lucka.titel}</h1>
        <p className="ingress">{lucka.ingress}</p>
      </header>
      {lucka.nr === 1 && <SaSpelarNi />}
      {karta ? (
        <Karta platser={platser} />
      ) : loggbok ? (
        <Loggbok namn={lucka.bilder[0].namn} alt={lucka.bilder[0].alt} transkription={lucka.transkription!} />
      ) : (
        lucka.bilder.map((b, i) => <Zoombar key={b.namn} namn={b.namn} alt={b.alt} prioritet={i === 0} />)
      )}
      {loggbok && lucka.bilder.slice(1).map((b) => <Zoombar key={b.namn} namn={b.namn} alt={b.alt} />)}
      {lucka.interaktion === "misstankta" && personer && <Misstankta personer={personer} />}
      {lucka.avsnitt.map((a, i) => <Dokument key={i} a={a} />)}
      {lucka.interaktion === "pussel" && lucka.pussel && (
        <section className="stack">
          <h2 className="rubrik-mellan">Lägg ihop brevet</h2>
          <Pussel bitar={lucka.pussel} />
        </section>
      )}
      {lucka.uppgift && <Uppgift nr={lucka.nr} u={lucka.uppgift} />}
    </>
  );
}
