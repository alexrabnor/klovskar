"use client";
import { useActionState } from "react";
import { startaKop } from "./actions";

export function KopFormular({ present }: { present: boolean }) {
  const [svar, skicka, vantar] = useActionState(startaKop, undefined);
  return (
    <form action={skicka} className="panel stack">
      <input type="hidden" name="present" value={present ? "1" : "0"} />
      <div className="falt">
        <label htmlFor="epost">{present ? "Din e-post – presentkortet skickas hit" : "E-post – koden skickas hit"}</label>
        <input id="epost" name="epost" type="email" autoComplete="email" required placeholder="namn@exempel.se" />
      </div>
      <label className="kryss" htmlFor="villkor">
        <input id="villkor" name="villkor" type="checkbox" required />
        <span>Jag har läst <a href="/villkor" target="_blank">köpvillkoren</a>.</span>
      </label>
      <label className="kryss" htmlFor="anger">
        <input id="anger" name="anger" type="checkbox" required />
        <span>
          Jag vill att spelet levereras direkt och förstår att <b>ångerrätten upphör när aktiveringskoden har visats</b>.
          (Har laget inte öppnat någon lucka får du ändå pengarna tillbaka om du hör av dig.)
        </span>
      </label>
      {svar?.fel && <p className="fel" role="alert">{svar.fel}</p>}
      <button className="knapp" type="submit" disabled={vantar}>{vantar ? "Öppnar betalningen …" : "Till betalning"}</button>
    </form>
  );
}
