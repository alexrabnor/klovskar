"use client";
import { useActionState } from "react";
import { adminLoggaIn } from "@/app/actions";

export function Inloggning({ till }: { till?: string }) {
  const [svar, skicka, vantar] = useActionState(adminLoggaIn, undefined);
  return (
    <form action={skicka} className="panel stack" style={{ maxWidth: 380 }}>
      {till && <input type="hidden" name="till" value={till} />}
      <div className="falt">
        <label htmlFor="losen">Lösenord</label>
        <input id="losen" name="losen" type="password" autoComplete="current-password" required />
      </div>
      {svar?.fel && <p className="fel">{svar.fel}</p>}
      <div><button className="knapp" disabled={vantar}>Logga in</button></div>
    </form>
  );
}
