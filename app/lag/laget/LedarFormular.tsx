"use client";
import { useBehallAction } from "@/lib/behall-formular";
import { useState } from "react";
import { ledarInstallningar, ledarStartdatum } from "@/app/actions";
import { FORSTA_STARTDAG } from "@/lib/tid";

export function LedarInstallningar({ epost, synlig, morgonmejl }: { epost: string; synlig: boolean; morgonmejl: boolean }) {
  const [svar, skicka, vantar] = useBehallAction(ledarInstallningar, undefined);
  return (
    <form onSubmit={skicka} className="stack">
      <div className="falt">
        <label htmlFor="ledare-epost">Din e-post</label>
        <input id="ledare-epost" name="epost" type="email" defaultValue={epost} placeholder="namn@exempel.se" />
      </div>
      <label className="kryss" htmlFor="morgonmejl">
        <input id="morgonmejl" name="morgonmejl" type="checkbox" defaultChecked={morgonmejl} />
        <span>Mejla mig varje morgon när en ny lucka öppnar</span>
      </label>
      <label className="kryss" htmlFor="synlig">
        <input id="synlig" name="synlig" type="checkbox" defaultChecked={synlig} />
        <span>Visa laget på topplistan efter julafton</span>
      </label>
      {svar?.fel && <p className="fel">{svar.fel}</p>}
      {svar?.ok && <p className="ok">{svar.ok}</p>}
      <div><button className="knapp knapp-sekundar" disabled={vantar}>Spara</button></div>
    </form>
  );
}

export function LedarStartdatum({ startdatum }: { startdatum: string }) {
  const [svar, skicka, vantar] = useBehallAction(ledarStartdatum, undefined);
  const [lage, setLage] = useState<"advent" | "eget">(startdatum.endsWith("-12-01") ? "advent" : "eget");
  return (
    <form onSubmit={skicka} className="stack">
      <label className="kryss" htmlFor="sd-advent">
        <input id="sd-advent" type="radio" name="startlage" value="advent" checked={lage === "advent"} onChange={() => setLage("advent")} />
        <span>Följ adventskalendern (1 december)</span>
      </label>
      <label className="kryss" htmlFor="sd-eget">
        <input id="sd-eget" type="radio" name="startlage" value="eget" checked={lage === "eget"} onChange={() => setLage("eget")} />
        <span>Eget startdatum</span>
      </label>
      {lage === "eget" && <input name="startdatum" type="date" defaultValue={startdatum} min={FORSTA_STARTDAG} required aria-label="Startdatum" />}
      {svar?.fel && <p className="fel">{svar.fel}</p>}
      {svar?.ok && <p className="ok">{svar.ok}</p>}
      <div><button className="knapp knapp-sekundar" disabled={vantar}>Byt startdatum</button></div>
    </form>
  );
}
