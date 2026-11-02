"use client";
import { useActionState, useState } from "react";
import { aktivera } from "@/app/actions";

export function AktiveraFormular({ kod, epost, advent, adventDirekt }: { kod: string; epost: string; advent: string; adventDirekt: number }) {
  const [svar, skicka, vantar] = useActionState(aktivera, undefined);
  const [lage, setLage] = useState<"advent" | "eget">("advent");
  const adventAr = advent.slice(0, 4);
  return (
    <form action={skicka} className="panel stack">
      <div className="falt">
        <label htmlFor="kod">Aktiveringskod</label>
        <input id="kod" name="kod" type="text" required defaultValue={kod} autoCapitalize="characters" autoComplete="off" placeholder="ABCD-EFGH-JKLM" style={{ fontFamily: "var(--f-m)", letterSpacing: ".08em" }} />
      </div>
      <div className="falt">
        <label htmlFor="lagnamn">Lagets namn</label>
        <input id="lagnamn" name="lagnamn" type="text" required maxLength={40} placeholder="t.ex. Familjen Holmgren" />
      </div>
      <div className="falt">
        <label htmlFor="namn">Ditt namn i laget</label>
        <input id="namn" name="namn" type="text" required maxLength={30} autoComplete="given-name" placeholder="Förnamn eller smeknamn" />
      </div>
      <fieldset className="falt" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="falt-namn">När ska luckorna öppnas?</legend>
        <label className="kryss" htmlFor="lage-advent">
          <input id="lage-advent" type="radio" name="startlage" value="advent" checked={lage === "advent"} onChange={() => setLage("advent")} />
          <span><b>Följ adventskalendern</b> – lucka 1 öppnar 1 december {adventAr} kl. 06.00.
            {adventDirekt > 0 && <> Det betyder att <b>{adventDirekt} {adventDirekt === 1 ? "lucka öppnas" : "luckor öppnas"} direkt</b>.</>}</span>
        </label>
        <label className="kryss" htmlFor="lage-eget">
          <input id="lage-eget" type="radio" name="startlage" value="eget" checked={lage === "eget"} onChange={() => setLage("eget")} />
          <span><b>Eget startdatum</b> – 24 dagar från dagen ni väljer.</span>
        </label>
        {lage === "eget" && <input id="startdatum" name="startdatum" type="date" required aria-label="Startdatum" />}
      </fieldset>
      <div className="falt">
        <label htmlFor="epost">Din e-post (valfritt) – för lagledarlänken</label>
        <input id="epost" name="epost" type="email" defaultValue={epost} autoComplete="email" placeholder="namn@exempel.se" />
      </div>
      {svar?.fel && <p className="fel" role="alert">{svar.fel}</p>}
      <button className="knapp" type="submit" disabled={vantar}>{vantar ? "Skapar laget …" : "Skapa laget"}</button>
    </form>
  );
}
