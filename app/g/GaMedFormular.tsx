"use client";
import { useBehallAction } from "@/lib/behall-formular";
import { gaMedILag } from "@/app/actions";

export function GaMedFormular({ kod, lagnamn }: { kod: string; lagnamn?: string }) {
  const [svar, skicka, vantar] = useBehallAction(gaMedILag, undefined);
  return (
    <form onSubmit={skicka} className="panel stack">
      {lagnamn ? (
        <><p>Du är inbjuden till <b>{lagnamn}</b>.</p><input type="hidden" name="lagkod" value={kod} /></>
      ) : (
        <div className="falt">
          <label htmlFor="lagkod">Lagkod</label>
          <input id="lagkod" name="lagkod" type="text" required defaultValue={kod} maxLength={8} autoCapitalize="characters" autoComplete="off" placeholder="KLV4X2" style={{ fontFamily: "var(--f-m)", letterSpacing: ".15em", textTransform: "uppercase" }} />
        </div>
      )}
      <div className="falt">
        <label htmlFor="namn">Ditt namn i laget</label>
        <input id="namn" name="namn" type="text" required maxLength={30} autoComplete="given-name" placeholder="Förnamn eller smeknamn" />
        <span className="liten dampad">Har du spelat förut på en annan enhet? Skriv samma namn, så får någon i laget godkänna att det är du.</span>
      </div>
      {svar?.fel && <p className="fel" role="alert">{svar.fel}</p>}
      <button className="knapp" type="submit" disabled={vantar}>{vantar ? "Går med …" : "Gå med"}</button>
    </form>
  );
}
