"use client";
import { useEffect, useState, type ReactNode } from "react";
import { bildUrl } from "@/components/Bild";

/** Dramatiskt avslöjande: bilden först, sedan facit steg för steg, sist resultatet. */
export function Avslojande({ steg, children }: { steg: { rubrik: string; innehall: ReactNode }[]; children: ReactNode }) {
  const [i, setI] = useState(-1);
  useEffect(() => {
    try { if (localStorage.getItem("klov-facit-sett") === "ja") setI(steg.length); } catch {}
  }, [steg.length]);
  useEffect(() => {
    if (i >= steg.length) try { localStorage.setItem("klov-facit-sett", "ja"); } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [i, steg.length]);

  if (i < 0) {
    return (
      <section className="stack facit-start">
        <p className="etikett">Salongen, julafton kl. 18.40</p>
        <h1 className="rubrik-stor">Sanningen</h1>
        <p className="ingress">Kommissarie Sandahl stänger sin anteckningsbok och ser sig om i rummet.</p>
        <div><button className="knapp" onClick={() => setI(0)}>Låt henne berätta</button></div>
      </section>
    );
  }
  if (i < steg.length) {
    const s = steg[i];
    return (
      <section className="stack facit-steg" key={i}>
        {i === 0 && (
          <div className="bildram facit-bild">
            <img src={bildUrl("facit", 1600)} alt="Husfrun Margit Lund står med böjt huvud i salongen. På bordet ligger nyckelknippan. Över bilden en röd stämpel: Fallet löst." />
          </div>
        )}
        <p className="etikett">{i + 1} / {steg.length}</p>
        <h2 className="rubrik-stor">{s.rubrik}</h2>
        <div className="dok dok-scen"><div className="dok-text">{s.innehall}</div></div>
        <div className="rad">
          <button className="knapp" onClick={() => setI(i + 1)}>{i + 1 < steg.length ? "Nästa" : "Se resultatet"}</button>
          {i > 0 && <button className="knapp knapp-sekundar" onClick={() => setI(i - 1)}>Tillbaka</button>}
        </div>
      </section>
    );
  }
  return (
    <>
      {children}
      <div><button className="lank-knapp" onClick={() => setI(0)}>Läs facit igen</button></div>
    </>
  );
}
