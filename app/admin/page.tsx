import Link from "next/link";
import type { Metadata } from "next";
import { arAdmin } from "@/lib/session";
import { db, type Kod, type Lag } from "@/lib/db";
import { antalOppna, serverNu } from "@/lib/tid";
import { stripeLage, stripeKonfigurerad } from "@/lib/stripe";
import { mejlKonfigurerat } from "@/lib/mail";
import { pushKonfigurerad } from "@/lib/push";
import { Inloggning } from "./Inloggning";
import { Kopiera } from "./Hjalpmedel";
import { adminLoggaUt, adminStartdatum, nollstallAnklagelse, satForskjutning, skapaGratiskod, taBortLag } from "./actions";
import { LUCKOR } from "@/content/luckor";
import { BONUS } from "@/content/bonus";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Admin({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 100);
  if (!process.env.ADMIN_LOSEN) return <main className="sida"><h1 className="rubrik-mellan">Admin är avstängd</h1><p>Sätt ADMIN_LOSEN i .env.</p></main>;
  if (!(await arAdmin())) return <main className="sida"><h1 className="rubrik-mellan">Admin</h1><Inloggning /></main>;

  const d = db();
  const nu = serverNu();
  const allaLag = d.prepare("SELECT l.*, (SELECT COUNT(*) FROM klov_spelare s WHERE s.lag_id = l.id) AS antal FROM klov_lag l ORDER BY l.id DESC").all() as (Lag & { antal: number })[];
  const allaKoder = d.prepare("SELECT * FROM klov_kod ORDER BY skapad DESC").all() as Kod[];
  const spelare = d.prepare("SELECT lag_id, namn, far_lamna_in FROM klov_spelare ORDER BY id").all() as { lag_id: number; namn: string; far_lamna_in: number }[];
  const spelarePerLag = new Map<number, typeof spelare>();
  for (const s of spelare) spelarePerLag.set(s.lag_id, [...(spelarePerLag.get(s.lag_id) ?? []), s]);
  const lagPerId = new Map(allaLag.map((l) => [l.id, l]));
  const aktiveringskoder = new Map<number, string[]>();
  for (const k of allaKoder) if (k.lag_id) aktiveringskoder.set(k.lag_id, [...(aktiveringskoder.get(k.lag_id) ?? []), k.kod]);

  // Sökningen görs här på servern mot ALLA lag, spelare och koder – inte bara de som visas.
  // Mellanslag och bindestreck räknas bort, så "7fsw rve7" hittar 7FSW-RVE7-GAN8.
  const norm = (t: string) => t.toLowerCase().replace(/[\s-]/g, "");
  const nq = norm(q);
  const traffar = (...delar: (string | null | undefined)[]) => !nq || norm(delar.filter(Boolean).join(" ")).includes(nq);
  const lagTraff = allaLag.filter((l) => traffar(l.namn, l.kod, l.ledare_epost, ...(aktiveringskoder.get(l.id) ?? []), ...(spelarePerLag.get(l.id) ?? []).map((s) => s.namn)));
  const lagTraffId = new Set(lagTraff.map((l) => l.id));
  const kodTraff = allaKoder.filter((k) => traffar(k.kod, k.epost, k.notering) || (!!nq && !!k.lag_id && lagTraffId.has(k.lag_id)));
  const VISA_LAG = 30, VISA_KODER = 50;
  const lagen = nq ? lagTraff : lagTraff.slice(0, VISA_LAG);
  const koder = nq ? kodTraff : kodTraff.slice(0, VISA_KODER);
  const bas = process.env.BAS_URL || "https://adventdeckare.se";
  const intakter = d.prepare(`SELECT substr(skapad, 1, 4) ar, COUNT(*) st, SUM(belopp_ore) ore FROM klov_kod
    WHERE typ IN ('kop', 'present') AND testlage = 0 AND aterbetald = 0 GROUP BY ar ORDER BY ar DESC`).all() as { ar: string; st: number; ore: number }[];
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

      <form method="get" action="/admin" className="panel stack" role="search">
        <div className="falt">
          <label htmlFor="admin-sok">Sök bland alla lag, spelare och koder</label>
          <div className="rad" style={{ flexWrap: "nowrap" }}>
            <input id="admin-sok" name="q" type="search" defaultValue={q} placeholder="Lagnamn, lagkod, spelarnamn, e-post eller aktiveringskod" autoComplete="off" style={{ flex: 1, minWidth: 0 }} />
            <button className="knapp knapp-liten">Sök</button>
          </div>
        </div>
        {q ? (
          <p className="liten" style={{ margin: 0 }}>
            {lagTraff.length} lag och {kodTraff.length} koder matchar <b>{q}</b>. <Link href="/admin">Rensa sökningen</Link>
          </p>
        ) : (
          <p className="dampad liten" style={{ margin: 0 }}>Totalt {allaLag.length} lag, {spelare.length} spelare och {allaKoder.length} koder. Utan sökning visas de senaste {VISA_LAG} lagen och {VISA_KODER} koderna.</p>
        )}
      </form>

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
          <label className="rad" style={{ gap: 6, alignItems: "center" }}>
            <input name="testare" type="checkbox" value="1" /> Testare – alla luckor öppna direkt, syns inte i topplistan
          </label>
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
                  <td>{k.lag_id && lagPerId.get(k.lag_id) ? <>{lagPerId.get(k.lag_id)!.namn} <span style={{ fontFamily: "var(--f-m)", whiteSpace: "nowrap" }}>({lagPerId.get(k.lag_id)!.kod})</span></> : k.lag_id ? `#${k.lag_id} (borttaget)` : "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="stack">
        <h2 style={{ fontSize: 22 }}>Lag ({q ? `${lagTraff.length} träffar` : lagen.length < allaLag.length ? `${lagen.length} senaste av ${allaLag.length}` : allaLag.length})</h2>
        <p className="dampad liten" style={{ margin: 0 }}>Någon som inte kommer in i sitt lag? Sök fram laget och skicka länken. Den som öppnar den skriver sitt eget namn och är med direkt.</p>
        {lagen.map((l) => {
          const dagar = Math.trunc(l.forskjutning_min / 1440), timmar = Math.round((l.forskjutning_min % 1440) / 60);
          return (
            <article key={l.id} className="panel stack">
              <div className="rad" style={{ justifyContent: "space-between" }}>
                <b>#{l.id} {l.namn}</b>
                <span className="dampad liten">{l.antal} spelare · {antalOppna(l, nu)} luckor öppna · start {l.startdatum}{l.anklagelse_inlamnad ? ` · inlämnat, ${l.poang} p` : ""}</span>
              </div>
              <div className="admin-lagkod">
                <div>
                  <span className="etikett">Lagkod</span>
                  <span className="admin-lagkod-kod">{l.kod}</span>
                  <span className="liten dampad admin-lagkod-lank">{bas}/g/{l.kod}</span>
                </div>
                <div className="rad">
                  <Kopiera text={l.kod} etikett="Kopiera kod" />
                  <Kopiera text={`${bas}/g/${l.kod}`} etikett="Kopiera länk" />
                </div>
              </div>
              <p className="liten" style={{ margin: 0 }}>
                <span className="dampad">Spelare: </span>
                {(spelarePerLag.get(l.id) ?? []).map((s) => s.namn + (s.far_lamna_in ? " (får lämna in)" : "")).join(", ") || "inga än"}
                {l.ledare_epost ? <><span className="dampad"> · Ledarens e-post: </span>{l.ledare_epost}</> : null}
                {aktiveringskoder.get(l.id) ? <><span className="dampad"> · Aktiverad med </span><span style={{ fontFamily: "var(--f-m)" }}>{aktiveringskoder.get(l.id)!.join(", ")}</span></> : null}
              </p>
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
