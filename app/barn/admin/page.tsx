import Link from "next/link";
import type { Metadata } from "next";
import { arAdmin } from "@/lib/session";
import { db, type Kod, type Lag } from "@/lib/db";
import { antalOppna, serverNu } from "@/lib/tid";
import { stripeLage, stripeKonfigurerad, kopOppet } from "@/lib/stripe";
import { mejlKonfigurerat } from "@/lib/mail";
import { Inloggning } from "@/app/admin/Inloggning";
import { Kopiera } from "@/app/admin/Hjalpmedel";
import { adminLoggaUt, adminStartdatum, satForskjutning, skapaGratiskod, taBortLag } from "@/app/admin/actions";
import { BARNLUCKOR } from "@/content/barn/luckor";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

/** Barndeckarens egen admin. Samma lösenord som Klovskärs, men bara barnlag och barnkoder. */
export default async function BarnAdmin({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 100);
  if (!process.env.ADMIN_LOSEN) return <main className="sida"><h1 className="rubrik-mellan">Admin är avstängd</h1><p>Sätt ADMIN_LOSEN i .env.</p></main>;
  if (!(await arAdmin())) return <main className="sida"><h1 className="rubrik-mellan">Admin · Stjärnan som försvann</h1><Inloggning till="/barn/admin" /></main>;

  const d = db();
  const nu = serverNu();
  const allaLag = d.prepare(`SELECT l.*, (SELECT COUNT(*) FROM klov_spelare s WHERE s.lag_id = l.id) AS antal,
    (SELECT COUNT(*) FROM klov_uppgift u WHERE u.lag_id = l.id) AS marken
    FROM klov_lag l WHERE l.spel = 'barn' ORDER BY l.id DESC`).all() as (Lag & { antal: number; marken: number })[];
  const allaKoder = d.prepare("SELECT * FROM klov_kod WHERE spel = 'barn' ORDER BY skapad DESC").all() as Kod[];
  const spelare = d.prepare("SELECT s.lag_id, s.namn FROM klov_spelare s JOIN klov_lag l ON l.id = s.lag_id WHERE l.spel = 'barn' ORDER BY s.id").all() as { lag_id: number; namn: string }[];
  const spelarePerLag = new Map<number, string[]>();
  for (const s of spelare) spelarePerLag.set(s.lag_id, [...(spelarePerLag.get(s.lag_id) ?? []), s.namn]);
  const lagPerId = new Map(allaLag.map((l) => [l.id, l]));

  const norm = (t: string) => t.toLowerCase().replace(/[\s-]/g, "");
  const nq = norm(q);
  const traffar = (...delar: (string | null | undefined)[]) => !nq || norm(delar.filter(Boolean).join(" ")).includes(nq);
  const lagTraff = allaLag.filter((l) => traffar(l.namn, l.kod, l.ledare_epost, l.aktiveringskod, ...(spelarePerLag.get(l.id) ?? [])));
  const kodTraff = allaKoder.filter((k) => traffar(k.kod, k.epost, k.notering));
  const lagen = nq ? lagTraff : lagTraff.slice(0, 30);
  const koder = nq ? kodTraff : kodTraff.slice(0, 50);
  const bas = process.env.BAS_URL || "https://adventdeckare.se";
  // Ett paketköp bär hela beloppet på Klovskärkoden, så barnkoden därifrån har 0 kr
  const egna = d.prepare(`SELECT COUNT(*) st, COALESCE(SUM(belopp_ore), 0) ore FROM klov_kod
    WHERE spel = 'barn' AND typ IN ('kop', 'present') AND testlage = 0 AND aterbetald = 0 AND stripe_session NOT LIKE '%#barn'`).get() as { st: number; ore: number };
  const paket = d.prepare(`SELECT COUNT(*) st FROM klov_kod
    WHERE spel = 'barn' AND typ IN ('kop', 'present') AND testlage = 0 AND aterbetald = 0 AND stripe_session LIKE '%#barn'`).get() as { st: number };
  const status = (ok: boolean, text: string) => <span className={`chip ${ok ? "chip-ok" : "chip-varning"}`}>{text}</span>;

  return (
    <main className="sida sida-bred">
      <header className="rad" style={{ justifyContent: "space-between" }}>
        <h1 className="rubrik-mellan">Admin · Stjärnan som försvann</h1>
        <span className="rad">
          <Link href="/admin" className="liten">Klovskärs admin →</Link>
          <form action={adminLoggaUt}><button className="lank-knapp">Logga ut</button></form>
        </span>
      </header>
      <div className="rad">
        {status(stripeKonfigurerad(), `Stripe: ${stripeLage()}${stripeKonfigurerad() ? "" : " (nyckel saknas)"}`)}
        {status(kopOppet(), kopOppet() ? "Köpet är öppet" : "Köpet är stängt")}
        {status(mejlKonfigurerat(), mejlKonfigurerat() ? "E-post: på" : "E-post: BREVO_API_KEY saknas")}
        {process.env.TESTLAGE_DATUM ? status(false, `Simulerat datum ${process.env.TESTLAGE_DATUM}`) : status(true, "Verklig tid")}
      </div>

      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Förhandsvisa luckorna</h2>
        <div className="rad">
          {BARNLUCKOR.map((l) => <Link key={l.nr} href={`/barn/admin/lucka/${l.nr}`} className="chip">{l.nr}</Link>)}
        </div>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Försäljning (skarpa köp, ej återbetalda)</h2>
        <table className="tabell">
          <thead><tr><th>Köp</th><th>Antal</th><th>Belopp</th></tr></thead>
          <tbody>
            <tr><td>Bara barndeckaren</td><td className="tal">{egna.st}</td><td className="tal">{(egna.ore / 100).toLocaleString("sv-SE")} kr</td></tr>
            <tr><td>I paket med Klovskär</td><td className="tal">{paket.st}</td><td className="tal">räknas i Klovskärs admin</td></tr>
          </tbody>
        </table>
      </section>

      <form method="get" action="/barn/admin" className="panel stack" role="search">
        <div className="falt">
          <label htmlFor="admin-sok">Sök bland barnlag, namn och koder</label>
          <div className="rad" style={{ flexWrap: "nowrap" }}>
            <input id="admin-sok" name="q" type="search" defaultValue={q} placeholder="Lagnamn, lagkod, namn, e-post eller aktiveringskod" autoComplete="off" style={{ flex: 1, minWidth: 0 }} />
            <button className="knapp knapp-liten">Sök</button>
          </div>
        </div>
        <p className="dampad liten" style={{ margin: 0 }}>
          {q ? <>{lagTraff.length} lag och {kodTraff.length} koder matchar <b>{q}</b>. <Link href="/barn/admin">Rensa sökningen</Link></> : <>Totalt {allaLag.length} lag och {allaKoder.length} koder.</>}
        </p>
      </form>

      <section className="panel stack">
        <h2 style={{ fontSize: 22 }}>Gratiskoder</h2>
        <form action={skapaGratiskod} className="rad">
          <input type="hidden" name="spel" value="barn" />
          <input name="antal" type="number" min="1" max="20" defaultValue="1" aria-label="Antal" style={{ width: 90 }} />
          <input name="notering" type="text" placeholder="Notering, t.ex. testfamilj" aria-label="Notering" style={{ flex: "1 1 200px", width: "auto" }} />
          <label className="rad" style={{ gap: 6, alignItems: "center" }}>
            <input name="testare" type="checkbox" value="1" /> Testare – alla luckor öppna direkt
          </label>
          <button className="knapp knapp-liten">Skapa</button>
        </form>
        <div className="rull-x">
          <table className="tabell">
            <thead><tr><th>Kod</th><th>Typ</th><th>E-post / notering</th><th>Skapad</th><th>Lag</th></tr></thead>
            <tbody>
              {koder.map((k) => (
                <tr key={k.kod}>
                  <td style={{ whiteSpace: "nowrap" }}>{k.kod}</td>
                  <td>{k.typ}{k.stripe_session?.endsWith("#barn") ? " (paket)" : ""}{k.testlage ? " (test)" : ""}{k.aterbetald ? " – återbetald" : ""}</td>
                  <td>{k.epost || k.notering || ""}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{k.skapad.slice(0, 16)}</td>
                  <td>{k.lag_id && lagPerId.get(k.lag_id) ? <>{lagPerId.get(k.lag_id)!.namn} ({lagPerId.get(k.lag_id)!.kod})</> : k.lag_id ? `#${k.lag_id} (borttaget)` : "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="stack">
        <h2 style={{ fontSize: 22 }}>Lag ({q ? `${lagTraff.length} träffar` : lagen.length < allaLag.length ? `${lagen.length} senaste av ${allaLag.length}` : allaLag.length})</h2>
        {lagen.map((l) => {
          const dagar = Math.trunc(l.forskjutning_min / 1440), timmar = Math.round((l.forskjutning_min % 1440) / 60);
          return (
            <article key={l.id} className="panel stack">
              <div className="rad" style={{ justifyContent: "space-between" }}>
                <b>#{l.id} {l.namn}</b>
                <span className="dampad liten">{l.antal} enheter · {antalOppna(l, nu)} luckor öppna · {l.marken} märken · start {l.startdatum}</span>
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
                <span className="dampad">Namn: </span>{(spelarePerLag.get(l.id) ?? []).join(", ") || "inga än"}
                {l.ledare_epost ? <><span className="dampad"> · Ledarens e-post: </span>{l.ledare_epost}</> : null}
                {l.aktiveringskod ? <><span className="dampad"> · Aktiverad med </span>{l.aktiveringskod}</> : null}
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
              <form action={taBortLag} className="rad">
                <input type="hidden" name="id" value={l.id} />
                <input name="bekrafta" placeholder="Skriv lagnamnet för att ta bort" aria-label="Bekräfta lagnamn" style={{ width: 260, minHeight: 36, fontSize: 14 }} />
                <button className="lank-knapp liten">Ta bort lag</button>
              </form>
            </article>
          );
        })}
      </section>
    </main>
  );
}
