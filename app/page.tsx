import Link from "next/link";
import { Bild } from "@/components/Bild";
import { Snofall } from "@/components/Snofall";
import { Sidfot } from "@/components/Sidfot";
import { prisKr } from "@/lib/stripe";
import { inloggad } from "@/lib/session";
import { PERSONER } from "@/content/personer";

export const dynamic = "force-dynamic";

const FRAGOR: [string, string][] = [
  ["Hur fungerar det?", "Ni köper en kod, skapar ett lag och delar lagkoden med upp till nio vänner. Varje morgon kl. 06.00 öppnas en ny lucka med kommissarie Sandahls material: förhör, brev, kvitton, fotografier. Ni diskuterar i appen, fäster ledtrådar på en gemensam anslagstavla och röstar om vem ni tror är skyldig. På julafton lämnar ni in er anklagelse – och får veta sanningen."],
  ["Vi köper sent – går det ändå?", "Ja. I adventsläget öppnas alla luckor som redan passerat direkt, så ni kan läsa ikapp. Ni kan också välja ett eget startdatum, så att de 24 dagarna börjar när det passar er."],
  ["Kan vi spela i januari eller i sommar?", "Ja. Välj \"eget startdatum\" när ni skapar laget. Luckorna öppnas då en per dag från det datumet."],
  ["Hur länge har vi tillgång?", "Spelet är ert. Ni kan gå tillbaka till luckorna, era anteckningar och facit så länge spelet finns, och minst till och med 31 december 2027. Mordet på Klovskär är Adventsmysteriet 2026 – nästa jul kommer ett nytt fall."],
  ["Hur många kan spela?", "Upp till tio personer per lag. Alla spelar i mobilen eller datorn – ingen app att installera, inga konton, inga lösenord."],
  ["Passar det barn?", "Vi rekommenderar 12 år och uppåt. Det handlar om ett mord, men utan blod och utan våld i bild. Mer mysrysare än thriller."],
  ["Går gåtan att lösa?", "Ja. Allt ni behöver finns i lucka 1–23. Den som läser noga kan lösa fallet före julafton – men det är lätt att ta fel spår."],
];

export default async function Start() {
  const i = await inloggad();
  const pris = prisKr();
  return (
    <>
      <Snofall />
      <main style={{ position: "relative", zIndex: 2 }}>
        <section className="landning-hero">
          <div className="landning-bild">
            <Bild namn="omslag" alt="Hotell Fyrbåken och fyrtornet på Klovskär en snöig decembernatt, med titeln Mordet på Klovskär – ett adventsmysterium i 24 luckor." sizes="(max-width: 860px) 100vw, 460px" prioritet />
          </div>
          <div className="landning-text">
            <p className="etikett">Adventsmysteriet 2026 · 24 luckor</p>
            <h1 className="rubrik-stor">Mordet på Klovskär</h1>
            <p className="landning-ingress">
              December 1962. Isen har lagt sig runt en ö längst ut i Bohuslän och färjan går inte.
              Redaren Harald Ekberg hittas död i fyrtornets spiraltrappa. Sju personer var på ön den natten.
            </p>
            <p className="landning-ingress dampad">
              Varje morgon öppnas en ny lucka med kommissarie Sandahls material. Ni löser fallet tillsammans – och på julafton lämnar ni in er anklagelse.
            </p>
            <div className="rad">
              <Link className="knapp" href="/kop">Köp för {pris} kr</Link>
              <Link className="knapp knapp-sekundar" href="/kop?present=1">Ge bort i present</Link>
            </div>
            <p className="liten dampad">
              {i ? <>Ni spelar redan som <b>{i.lag.namn}</b>. <Link href="/lag">Till kalendern →</Link></> : <>Har ni redan en kod eller en lagkod? <Link href="/borja">Börja här →</Link></>}
            </p>
          </div>
        </section>

        <div className="sida">
          <section className="stack">
            <h2 className="rubrik-mellan">Så går det till</h2>
            <ol className="steg">
              <li><b>Köp en kod.</b> {pris} kr för hela laget. Koden kommer direkt och via mejl.</li>
              <li><b>Bjud in laget.</b> Upp till tio personer. Dela lagkoden – ingen behöver konto eller lösenord.</li>
              <li><b>En lucka varje morgon.</b> Kl. 06.00 kommer nytt material: telegram, förhör, kvitton och fotografier från utredningen.</li>
              <li><b>Lös mordet till julafton.</b> Lämna in vem, varför, hur och när. Sedan får ni facit – och se vilka ledtrådar ni missade.</li>
            </ol>
          </section>

          <section className="stack">
            <p className="etikett">Gratis smakprov</p>
            <h2 className="rubrik-mellan">Läs de två första luckorna</h2>
            <div className="smakprov-rutnat">
              <Link href="/smakprov/1" className="menykort"><Bild namn="lucka-01" alt="" sizes="360px" /><span>Lucka 1 · Telegrammet</span></Link>
              <Link href="/smakprov/2" className="menykort"><Bild namn="misstankta" alt="" sizes="360px" /><span>Lucka 2 · De sju</span></Link>
            </div>
            <p className="dampad liten">De misstänkta: {PERSONER.map((p) => p.namn).join(", ")}.</p>
          </section>

          <section className="stack">
            <h2 className="rubrik-mellan">I spelet</h2>
            <ul className="funktioner">
              <li><b>24 luckor</b> i dokumentstil – telegram på gult papper, maskinskrivna förhör, kvitton och handskrivna brev.</li>
              <li><b>En gemensam anslagstavla</b> där laget fäster ledtrådar och drar röda trådar mellan dem.</li>
              <li><b>Misstankemätaren:</b> alla röstar varje dag, och ni ser hur misstankarna svänger under december.</li>
              <li><b>Sex hemliga bonusluckor</b> bakom chiffer, morse och signalflaggor.</li>
              <li><b>Facit på julafton</b> med poäng och en lista över varje ledtråd ni gick förbi.</li>
            </ul>
          </section>

          <section className="stack" id="present">
            <div className="panel present-panel">
              <p className="etikett">Julklapp</p>
              <h2 className="rubrik-mellan">Ge bort ett mord</h2>
              <p>Köp som present så får du ett presentkort med koden – att skriva ut, lägga under granen eller skicka vidare. Mottagaren väljer själv när deras 24 dagar börjar.</p>
              <div><Link className="knapp" href="/kop?present=1">Köp presentkort – {pris} kr</Link></div>
            </div>
          </section>

          <section className="stack">
            <h2 className="rubrik-mellan">Vanliga frågor</h2>
            <div className="fragor">
              {FRAGOR.map(([f, s]) => (
                <details key={f}><summary>{f}</summary><p>{s}</p></details>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Sidfot />
    </>
  );
}
