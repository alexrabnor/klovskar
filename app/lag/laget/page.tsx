import type { Metadata } from "next";
import { kravInloggad } from "@/lib/session";
import { spelareILag } from "@/lib/db";
import { MAX_SPELARE, forstaLuckanOppnad } from "@/lib/lag";
import { Kopiera } from "@/components/Kopiera";
import { ledarDelegera, ledarNyLagkod, ledarTaBort, loggaUt } from "@/app/actions";
import { LedarInstallningar, LedarStartdatum } from "./LedarFormular";
import { PushKnapp } from "./PushKnapp";
import { oppningstid } from "@/lib/tid";

export const metadata: Metadata = { title: "Laget" };

const BAS = process.env.BAS_URL || "https://adventdeckare.se";

export default async function Laget() {
  const { lag, spelare, arLedare, nu } = await kravInloggad();
  const alla = spelareILag(lag.id);
  const start = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", dateStyle: "long" }).format(new Date(oppningstid(lag.startdatum, 1)));
  return (
    <main className="sida">
      <header className="stack">
        <p className="etikett">Laget</p>
        <h1 className="rubrik-mellan">{lag.namn}</h1>
        <p className="dampad">Lucka 1 {forstaLuckanOppnad(lag, nu) ? "öppnade" : "öppnar"} {start}. {alla.length} av {MAX_SPELARE} spelare.</p>
      </header>

      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Bjud in</h2>
        <Kopiera text={`${BAS}/g/${lag.kod}`} etikett="Kopiera inbjudan" visa />
        <p className="dampad liten">Lagkod: <b style={{ fontFamily: "var(--f-m)", letterSpacing: ".1em" }}>{lag.kod}</b></p>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Spelare</h2>
        <ul className="spelarlista">
          {alla.map((s) => (
            <li key={s.id}>
              <span>
                {s.namn}{s.id === spelare.id && <span className="dampad"> (du)</span>}
                {s.far_lamna_in ? <span className="chip chip-ok" style={{ marginLeft: 8 }}>får lämna in</span> : null}
              </span>
              {arLedare && s.id !== spelare.id && (
                <span className="rad">
                  <form action={ledarDelegera}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="pa" value={s.far_lamna_in ? "0" : "1"} />
                    <button className="lank-knapp liten">{s.far_lamna_in ? "Ta tillbaka inlämningsrätt" : "Låt lämna in"}</button>
                  </form>
                  <form action={ledarTaBort}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className="lank-knapp liten">Ta bort</button>
                  </form>
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Din inloggningslänk</h2>
        <p>Spara länken om du vill spela på fler enheter eller byter telefon. Den loggar in dig som <b>{spelare.namn}</b>. Dela den inte.</p>
        <Kopiera text={`${BAS}/in/${spelare.token}`} etikett="Kopiera min länk" />
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Påminnelser</h2>
        <PushKnapp />
      </section>

      {arLedare && (
        <>
          <section className="panel stack">
            <h2 style={{ fontSize: 22 }}>Lagledare</h2>
            <p className="dampad">Du är lagledare. Det är du som lämnar in anklagelsen – om du inte ger någon annan rätten. Har ingen lämnat in tolv timmar efter att lucka 24 öppnat får alla i laget göra det.</p>
            <Kopiera text={`${BAS}/ledare/${lag.ledare_token}`} etikett="Kopiera lagledarlänk" />
            <LedarInstallningar epost={lag.ledare_epost ?? ""} synlig={!!lag.synlig_i_topplista} morgonmejl={!!lag.morgonmejl} />
          </section>
          <section className="panel stack">
            <h2 style={{ fontSize: 22 }}>Startdatum</h2>
            {forstaLuckanOppnad(lag, nu)
              ? <p className="dampad">Första luckan har öppnat, så startdatumet ligger fast.</p>
              : <LedarStartdatum startdatum={lag.startdatum} />}
          </section>
          <section className="panel stack">
            <h2 style={{ fontSize: 22 }}>Ny lagkod</h2>
            <p className="dampad">Har inbjudan spridits för långt? En ny kod gör den gamla länken ogiltig. Den som redan är med påverkas inte.</p>
            <form action={ledarNyLagkod}><button className="knapp knapp-sekundar">Skapa ny lagkod</button></form>
          </section>
        </>
      )}

      <form action={loggaUt}><button className="lank-knapp">Logga ut från den här enheten</button></form>
    </main>
  );
}
