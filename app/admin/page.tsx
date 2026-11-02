import Link from "next/link";
import type { Metadata } from "next";
import { arAdmin } from "@/lib/session";
import { db, type Kod, type Lag } from "@/lib/db";
import { antalOppna, serverNu } from "@/lib/tid";
import { stripeLage, stripeKonfigurerad } from "@/lib/stripe";
import { mejlKonfigurerat } from "@/lib/mail";
import { pushKonfigurerad } from "@/lib/push";
import { Inloggning } from "./Inloggning";
import { adminLoggaUt, adminStartdatum, nollstallAnklagelse, satForskjutning, skapaGratiskod, taBortLag } from "./actions";
import { LUCKOR } from "@/content/luckor";
import { BONUS } from "@/content/bonus";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Admin() {
  if (!process.env.ADMIN_LOSEN) return <main className="sida"><h1 className="rubrik-mellan">Admin är avstängd</h1><p>Sätt ADMIN_LOSEN i .env.</p></main>;
  if (!(await arAdmin())) return <main className="sida"><h1 className="rubrik-mellan">Admin</h1><Inloggning /></main>;

  const d = db();
  const nu = serverNu();
  const lagen = d.prepare("SELECT l.*, (SELECT COUNT(*) FROM klov_spelare s WHERE s.lag_id = l.id) AS antal FROM klov_lag l ORDER BY l.id DESC").all() as (Lag & { antal: number })[];
  const koder = d.prepare("SELECT * FROM klov_kod ORDER BY skapad DESC LIMIT 200").all() as Kod[];
  const intakter = d.prepare(`SELECT substr(skapad, 1, 4) ar, COUNT(*) st, SUM(belopp_ore) ore FROM klov_kod
    WHERE typ != 'gratis' AND testlage = 0 AND aterbetald = 0 GROUP BY ar ORDER BY ar DESC`).all() as { ar: string; st: number; ore: number }[];
  const status = (ok: boolean, text: string) => <span className={`chip ${ok ? "chip-ok" : "chip-varning"}`}>{text}</span>;

  return (
    <main className="sida sida-bred">
      <header className="rad" style={{ justifyContent: "space-between" }}>
        <h1 className="rubrik-mellan">Admin</h1>
        <form action={adminLoggaUt}><button className="lank-knapp">Logga ut</button></form>
      </header>
      <div className="rad">
        {status(stripeKonfigurerad(), `Stripe: ${stripeLage()}${stripeKonfigurerad() ? "" : " (nyckel saknas)"}`)}
        {status(mejlKonfigurerat(), mejlKonfigurerat() ? "E-post: på" : "E-post: BREVO_API_KEY saknas")}
        {status(pushKonfigurerad(), pushKonfigurerad() ? "Push: på" : "Push: VAPID saknas")}
        {process.env.TESTLAGE_DATUM ? status(false, `Simulerat datum ${process.env.TESTLAGE_DATUM}`) : status(true, "Verklig tid")}
      </div>

      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Förhandsvisa innehållet</h2>
        <div className="rad">
          {LUCKOR.map((l) => <Link key={l.nr} href={`/admin/lucka/${l.nr}`} className="chip">{l.nr}</Link>)}
        </div>
        <div className="rad">
          {BONUS.map((b) => <Link key={b.nr} href={`/admin/bonus/${b.nr}`} className="chip">Bonus {b.nr}</Link>)}
          <Link href="/admin/facit" className="chip">Facit</Link>
        </div>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Intäkter (skarpa köp, ej återbetalda)</h2>
        {intakter.length === 0 ? <p className="dampad">Inga skarpa köp än.</p> : (
          <table className="tabell"><thead><tr><th>År</th><th>Antal</th><th>Belopp</th></tr></thead>
            <tbody>{intakter.map((r) => <tr key={r.ar}><td>{r.ar}</td><td className="tal">{r.st}</td><td className="tal">{(r.ore / 100).toLocaleString("sv-SE")} kr</td></tr>)}</tbody></table>
        )}
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Gratiskoder</h2>
        <form action={skapaGratiskod} className="rad">
          <input name="antal" type="number" min="1" max="20" defaultValue="1" aria-label="Antal" style={{ width: 90 }} />
          <input name="notering" type="text" placeholder="Notering, t.ex. testgrupp" aria-label="Notering" style={{ flex: "1 1 200px", width: "auto" }} />
          <button className="knapp knapp-liten">Skapa</button>
        </form>
        <div className="rull-x">
          <table className="tabell">
            <thead><tr><th>Kod</th><th>Typ</th><th>E-post / notering</th><th>Skapad</th><th>Lag</th></tr></thead>
            <tbody>
              {koder.map((k) => (
                <tr key={k.kod}>
                  <td style={{ fontFamily: "var(--f-m)", whiteSpace: "nowrap" }}>{k.kod}</td>
                  <td>{k.typ}{k.testlage ? " (test)" : ""}{k.aterbetald ? " – återbetald" : ""}</td>
                  <td>{k.epost || k.notering || ""}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{k.skapad.slice(0, 16)}</td>
                  <td>{k.lag_id ? `#${k.lag_id}` : "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="stack">
        <h2 style={{ fontSize: 22 }}>Lag ({lagen.length})</h2>
        {lagen.map((l) => {
          const dagar = Math.trunc(l.forskjutning_min / 1440), timmar = Math.round((l.forskjutning_min % 1440) / 60);
          return (
            <article key={l.id} className="panel stack">
              <div className="rad" style={{ justifyContent: "space-between" }}>
                <b>#{l.id} {l.namn}</b>
                <span className="dampad liten">Kod {l.kod} · {l.antal} spelare · {antalOppna(l, nu)} luckor öppna{l.anklagelse_inlamnad ? ` · inlämnat, ${l.poang} p` : ""}</span>
              </div>
              <form action={adminStartdatum} className="rad">
                <input type="hidden" name="id" value={l.id} />
                <label className="liten dampad" htmlFor={`sd-${l.id}`}>Startdatum</label>
                <input id={`sd-${l.id}`} type="date" name="startdatum" defaultValue={l.startdatum} style={{ width: "auto" }} />
                <button className="knapp knapp-sekundar knapp-liten">Spara</button>
              </form>
              <form action={satForskjutning} className="rad">
                <input type="hidden" name="id" value={l.id} />
                <span className="liten dampad">Testklocka: flytta lagets tid</span>
                <input type="number" name="dagar" defaultValue={dagar} aria-label="Dagar" style={{ width: 80 }} /> <span className="liten">dygn</span>
                <input type="number" name="timmar" defaultValue={timmar} aria-label="Timmar" style={{ width: 80 }} /> <span className="liten">tim</span>
                <button className="knapp knapp-sekundar knapp-liten">Flytta</button>
              </form>
              <div className="rad">
                {l.anklagelse_inlamnad ? (
                  <form action={nollstallAnklagelse}><input type="hidden" name="id" value={l.id} /><button className="lank-knapp liten">Ångra inlämningen</button></form>
                ) : null}
                <form action={taBortLag} className="rad">
                  <input type="hidden" name="id" value={l.id} />
                  <input name="bekrafta" placeholder="Skriv lagnamnet för att ta bort" aria-label="Bekräfta lagnamn" style={{ width: 260, minHeight: 36, fontSize: 14 }} />
                  <button className="lank-knapp liten">Ta bort lag</button>
                </form>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
