"use client";
import { useEffect, useState } from "react";

type Lage = "laddar" | "saknas" | "ios-hemskarm" | "nekad" | "av" | "pa";

function base64TillUint8(b64: string) {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export function PushKnapp() {
  const [lage, setLage] = useState<Lage>("laddar");
  const [nyckel, setNyckel] = useState<string | null>(null);
  const [meddelande, setMeddelande] = useState("");

  useEffect(() => {
    (async () => {
      const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const hemskarm = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone;
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setLage(ios && !hemskarm ? "ios-hemskarm" : "saknas");
        return;
      }
      const r = await fetch("/api/push").then((x) => x.json()).catch(() => ({ nyckel: null }));
      if (!r.nyckel) { setLage("saknas"); return; }
      setNyckel(r.nyckel);
      if (Notification.permission === "denied") { setLage("nekad"); return; }
      const reg = await navigator.serviceWorker.register("/sw.js");
      const sub = await reg.pushManager.getSubscription();
      setLage(sub ? "pa" : "av");
    })();
  }, []);

  const slaPa = async () => {
    setMeddelande("");
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const tillat = await Notification.requestPermission();
      if (tillat !== "granted") { setLage("nekad"); return; }
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64TillUint8(nyckel!) });
      await fetch("/api/push", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prenumeration: sub.toJSON() }) });
      setLage("pa");
    } catch (e) {
      setMeddelande(`Det gick inte att slå på påminnelser: ${(e as Error).message}`);
    }
  };

  const slaAv = async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      await fetch("/api/push", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint }) });
      await sub.unsubscribe();
    }
    setLage("av");
  };

  const testa = async () => {
    setMeddelande("Skickar …");
    const r = await fetch("/api/push", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ test: true }) }).then((x) => x.json()).catch(() => null);
    if (!r) setMeddelande("Servern svarade inte.");
    else if (r.skickade > 0) setMeddelande("Testnotisen är skickad. Kom den inte fram? Kontrollera att notiser är tillåtna för webbläsaren i telefonens inställningar och att Stör ej är avstängt.");
    else setMeddelande("Ingen enhet var registrerad. Slå av och på påminnelserna igen.");
  };

  if (lage === "laddar") return <p className="dampad">Kontrollerar …</p>;
  if (lage === "saknas") return <p className="dampad">Den här webbläsaren kan inte ta emot påminnelser. Be lagledaren slå på morgonmejlet i stället.</p>;
  if (lage === "ios-hemskarm") {
    return (
      <div className="stack">
        <p>På iPhone kommer påminnelser bara om spelet ligger på hemskärmen:</p>
        <ol style={{ margin: 0, paddingLeft: 22 }}>
          <li>Tryck på dela-knappen (fyrkanten med en pil uppåt) i Safari.</li>
          <li>Välj <b>Lägg till på hemskärmen</b>.</li>
          <li>Öppna Klovskär från hemskärmen och kom tillbaka hit.</li>
        </ol>
      </div>
    );
  }
  if (lage === "nekad") return <p className="dampad">Notiser är blockerade för den här sidan. Tillåt dem i webbläsarens inställningar och ladda om.</p>;
  return (
    <div className="stack">
      <p>{lage === "pa" ? "Du får en notis när en ny lucka öppnar (kl. 06.00)." : "Få en notis när en ny lucka öppnar."}</p>
      <div className="rad">
        {lage === "pa"
          ? <><button className="knapp knapp-sekundar" onClick={testa}>Skicka testnotis</button><button className="lank-knapp" onClick={slaAv}>Stäng av</button></>
          : <button className="knapp" onClick={slaPa}>Påminn mig</button>}
      </div>
      {meddelande && <p className="liten dampad" role="status">{meddelande}</p>}
    </div>
  );
}
