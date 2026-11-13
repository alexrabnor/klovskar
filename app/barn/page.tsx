import Link from "next/link";
import { Bild } from "@/components/Bild";
import { Snofall } from "@/components/Snofall";
import { BarnSidfot } from "@/components/barn/Sidfot";
import { kopOppet, prisFor } from "@/lib/stripe";
import { inloggad } from "@/lib/session";
import { FIGURER } from "@/content/barn/figurer";

const FRAGOR: [string, string][] = [
  ["Vilken ålder passar det?", "Ungefär 6–10 år. Berättelsen läses högt av en vuxen eller ett äldre syskon, och den som kan läsa själv klarar den också. Ingen dör och ingen är elak. Något försvinner, och förklaringen är snäll."],
  ["Hur lång tid tar en lucka?", "Ett par minuter att läsa, en bild att titta i och en fråga med tre svar. Uppdraget tar tio till tjugo minuter om ni vill göra det."],
  ["Måste man göra uppdragen?", "Nej. De är frivilliga. Den som gör dem får ett märke i detektivpasset, men nästa lucka öppnas nästa morgon oavsett."],
  ["Vad behövs till uppdragen?", "Sådant som finns hemma: papper, tejp, mjöl, en ficklampa, toarullar, en citron. Varje uppdrag säger vad som behövs. Några större uppdrag passar bäst en ledig dag."],
  ["Vi köper sent – går det ändå?", "Ja. Följer ni adventskalendern öppnas alla luckor som redan passerat direkt. Ni kan också välja ett eget startdatum, så att de 24 dagarna börjar när det passar."],
  ["Kan flera läsa samma kalender?", "Ja. Hela fem enheter kan vara med i samma lag och dela detektivpass. Ingen app, inga konton och inga lösenord."],
  ["Vad är skillnaden mot Mordet på Klovskär?", "Klovskär är för vuxna och ungdomar från 12 år: ett mord, förhör och dokument att tolka. Stjärnan som försvann är skriven för barn. Köper ni båda får ni en kod till varje spel."],
];

export default async function BarnStart() {
  const i = await inloggad("barn");
  const oppet = kopOppet();
  const pris = prisFor("barn"), bada = prisFor("bada");
  return (
    <>
      <Snofall />
      <main style={{ position: "relative", zIndex: 2 }}>
        <section className="landning-hero">
          <div className="landning-bild">
            <Bild namn="barn-omslag" alt="Fyren på Måsholmen en blå vinterkväll. Toppen är mörk och kroken är tom. Fyrkatten Sotis sitter på en klippa och tittar upp." sizes="(max-width: 860px) 100vw, 460px" prioritet />
          </div>
          <div className="landning-text">
            <p className="etikett">Adventsdeckare för barn 6–10 år · {pris} kr</p>
            <h1 className="rubrik-stor">Stjärnan som försvann</h1>
            <p className="landning-ingress">
              Varje jul lyser en guldstjärna i fyren på Måsholmen, så att julbåten hittar hem. Den första december är kroken tom.
              Fyrkatten Sotis behöver hjälp av riktiga detektiver.
            </p>
            <p className="landning-ingress dampad">
              En lucka varje morgon i 24 dagar: en kort berättelse att läsa högt, en bild att leta i, en fråga och ett uppdrag att göra på riktigt.
            </p>
            <div className="rad">
              {oppet ? (
                <>
                  <Link className="knapp" href="/kop?spel=barn">Köp för {pris} kr</Link>
                  <Link className="knapp knapp-sekundar" href="/kop?spel=barn&present=1">Ge bort i julklapp</Link>
                </>
              ) : (
                <>
                  <span className="slapps-snart">Släpps snart</span>
                  <Link className="knapp" href="/barn/smakprov/1">Läs lucka 1 gratis</Link>
                </>
              )}
            </div>
            <p className="liten dampad">
              {i ? <>Ni läser redan som <b>{i.lag.namn}</b>. <Link href="/barn/kalender">Till kalendern →</Link></> : <>Har ni redan en kod eller en lagkod? <Link href="/borja">Börja här →</Link></>}
            </p>
          </div>
        </section>

        <div className="sida">
          <section className="stack">
            <h2 className="rubrik-mellan">Så går det till</h2>
            <ol className="steg">
              <li><b>Öppna dagens lucka.</b> Sotis berättar vad som har hänt på ön. Det tar ett par minuter att läsa högt.</li>
              <li><b>Leta i bilden.</b> Ledtråden finns där, och Sotis har gömt sig i varenda bild.</li>
              <li><b>Svara på frågan.</b> Tre svar att välja på. Blir det fel får ni en ledtråd och försöker igen.</li>
              <li><b>Gör dagens uppdrag.</b> Ta fingeravtryck med blyerts och tejp, gör fotspår i mjöl, skicka ficklampssignaler. Helt frivilligt.</li>
            </ol>
          </section>

          <section className="stack">
            <p className="etikett">Gratis smakprov</p>
            <h2 className="rubrik-mellan">Läs de två första luckorna</h2>
            <div className="smakprov-rutnat">
              <Link href="/barn/smakprov/1" className="menykort"><Bild namn="barn-lucka-01" alt="" sizes="360px" /><span>Lucka 1 · Den tomma kroken</span></Link>
              <Link href="/barn/smakprov/2" className="menykort"><Bild namn="barn-lucka-02" alt="" sizes="360px" /><span>Lucka 2 · Alla på ön</span></Link>
            </div>
            <p className="dampad liten">På ön bor {FIGURER.map((f) => f.namn).join(", ")}.</p>
          </section>

          <section className="stack">
            <h2 className="rubrik-mellan">Det här ingår</h2>
            <ul className="funktioner">
              <li><b>24 luckor</b> med en illustrerad bild och en berättelse i varje.</li>
              <li><b>24 uppdrag</b> med saker som finns hemma. De större ligger på helgerna.</li>
              <li><b>Ett detektivpass</b> där märkena tänds, ett för varje uppdrag ni gör.</li>
              <li><b>Misstänkta att stryka.</b> Barnen utesluter en i taget tills bara en är kvar.</li>
              <li><b>Ett diplom på julafton</b> med lagets namn, att skriva ut.</li>
            </ul>
          </section>

          <section className="stack" id="pris">
            <h2 className="rubrik-mellan">Pris</h2>
            <div className="barn-priser">
              <div className="panel barn-pris">
                <p className="etikett">Barndeckaren</p>
                <p className="kr">{pris} kr</p>
                <p className="dampad">Stjärnan som försvann. En kod, ett lag, hela 5 enheter.</p>
                {oppet && <div><Link className="knapp knapp-liten" href="/kop?spel=barn">Köp</Link></div>}
              </div>
              <div className="panel barn-pris">
                <p className="etikett">Båda deckarna</p>
                <p className="kr">{bada} kr</p>
                <p className="dampad">Stjärnan som försvann för barnen och Mordet på Klovskär för de vuxna. En kod till varje spel.</p>
                {oppet && <div><Link className="knapp knapp-liten" href="/kop?spel=bada">Köp båda</Link></div>}
              </div>
            </div>
            {!oppet && <p className="dampad">Köpet öppnar inom kort.</p>}
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
      <BarnSidfot />
    </>
  );
}
