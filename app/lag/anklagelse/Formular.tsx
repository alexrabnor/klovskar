"use client";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import type { Utkast } from "@/lib/anklagelse-val";
import { lamnaIn } from "./actions";
import { bildUrl } from "@/components/Bild";

type Val = { id: string; text: string };

export function Formular({ personer, motiv, metod, farLamnaIn }: { personer: { id: string; namn: string; roll: string }[]; motiv: Val[]; metod: Val[]; farLamnaIn: boolean }) {
  const [u, setU] = useState<Utkast>({});
  const [info, setInfo] = useState("");
  const [bekrafta, setBekrafta] = useState(false);
  const [svar, skicka, vantar] = useActionState(lamnaIn, undefined);
  const andrad = useRef(0);
  // Senaste utkastet – varje ändring bygger på det, inte på en gammal renderings kopia
  const senaste = useRef<Utkast>({});
  const sparTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hamta = useCallback(async () => {
    // Skriv inte över det man håller på att skriva
    if (Date.now() - andrad.current < 4000) return;
    const r = await fetch("/api/lag/anklagelse", { cache: "no-store" }).catch(() => null);
    if (!r?.ok) return;
    const d = await r.json();
    if (d.inlamnad) { window.location.href = "/lag/facit"; return; }
    senaste.current = d.utkast ?? {};
    setU(senaste.current);
    if (d.av) setInfo(`Senast ändrat av ${d.av}`);
  }, []);

  useEffect(() => {
    hamta();
    const t = setInterval(() => { if (!document.hidden) hamta(); }, 8000);
    return () => clearInterval(t);
  }, [hamta]);

  const satt = (nytt: Partial<Utkast>) => {
    const n = { ...senaste.current, ...nytt };
    senaste.current = n;
    setU(n);
    andrad.current = Date.now();
    if (sparTimer.current) clearTimeout(sparTimer.current);
    sparTimer.current = setTimeout(async () => {
      const r = await fetch("/api/lag/anklagelse", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(n) }).catch(() => null);
      setInfo(r?.ok ? "Utkastet är sparat" : r?.status === 409 ? "Laget har redan lämnat in" : "Kunde inte spara – kontrollera nätet");
    }, 700);
  };

  const komplett = !!(u.mordare && u.motiv && u.metod && u.tid);
  const namn = personer.find((p) => p.id === u.mordare)?.namn;

  return (
    <div className="stack">
      <fieldset className="panel stack anklagelse-del">
        <legend>1. Vem dödade Harald Ekberg?</legend>
        <div className="personer">
          {personer.map((p) => (
            <button key={p.id} type="button" className={`person${u.mordare === p.id ? " vald" : ""}`} aria-pressed={u.mordare === p.id} onClick={() => satt({ mordare: p.id })}>
              <img src={bildUrl(`portratt-${p.id}`, 320)} alt="" loading="lazy" decoding="async" />
              <span className="person-text">
                <span className="person-namn">{p.namn}</span>
                <span className="person-roll">{p.roll}</span>
              </span>
              {u.mordare === p.id && <span className="person-stampel">Anklagad</span>}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="panel stack anklagelse-del">
        <legend>2. Varför?</legend>
        <p className="dampad liten">Välj det motiv som väger tyngst.</p>
        {motiv.map((m) => (
          <label key={m.id} className="kryss val" htmlFor={`motiv-${m.id}`}>
            <input id={`motiv-${m.id}`} type="radio" name="motiv" checked={u.motiv === m.id} onChange={() => satt({ motiv: m.id })} />
            <span>{m.text}</span>
          </label>
        ))}
        <div className="falt">
          <label htmlFor="motivText">Med egna ord</label>
          <textarea id="motivText" value={u.motivText ?? ""} onChange={(e) => satt({ motivText: e.target.value })} maxLength={1500} placeholder="Vi tror att …" />
        </div>
      </fieldset>

      <fieldset className="panel stack anklagelse-del">
        <legend>3. Hur?</legend>
        {metod.map((m) => (
          <label key={m.id} className="kryss val" htmlFor={`metod-${m.id}`}>
            <input id={`metod-${m.id}`} type="radio" name="metod" checked={u.metod === m.id} onChange={() => satt({ metod: m.id })} />
            <span>{m.text}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="panel stack anklagelse-del">
        <legend>4. När dog han?</legend>
        <div className="falt" style={{ maxWidth: 320 }}>
          <label htmlFor="tid">Klockslag natten mot 1 december</label>
          <input id="tid" type="time" value={u.tid ?? ""} onChange={(e) => satt({ tid: e.target.value })} />
        </div>
      </fieldset>

      {info && <p className="dampad liten" role="status">{info}</p>}

      {farLamnaIn ? (
        <div className="stack">
          {svar?.fel && <p className="fel" role="alert">{svar.fel}</p>}
          <div><button type="button" className="knapp" disabled={!komplett} onClick={() => setBekrafta(true)}>Lämna in anklagelsen</button></div>
          {!komplett && <p className="dampad liten">Fyll i alla fyra delarna först.</p>}
        </div>
      ) : (
        <p className="panel">När ni är överens lämnar lagledaren in.</p>
      )}

      {bekrafta && (
        <div className="dialog-bakgrund" role="dialog" aria-modal="true" aria-labelledby="bekrafta-rubrik">
          <form action={skicka} className="dialog">
            <h2 id="bekrafta-rubrik" style={{ fontSize: 24 }}>Lämna in?</h2>
            <p>Ni anklagar <b>{namn}</b>. Det går inte att ändra efteråt, och hela laget får se facit direkt.</p>
            <input type="hidden" name="utkast" value={JSON.stringify(u)} />
            <div className="rad">
              <button className="knapp" disabled={vantar}>{vantar ? "Lämnar in …" : "Ja, lämna in"}</button>
              <button type="button" className="knapp knapp-sekundar" onClick={() => setBekrafta(false)}>Vänta lite</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
