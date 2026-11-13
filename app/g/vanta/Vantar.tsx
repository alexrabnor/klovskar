"use client";
import { useEffect, useState } from "react";

export function Vantar({ h }: { h: string }) {
  const [status, setStatus] = useState<"vantar" | "borta">("vantar");
  useEffect(() => {
    let aktiv = true;
    const kolla = async () => {
      const r = await fetch(`/api/overtag/${encodeURIComponent(h)}`, { method: "POST" }).catch(() => null);
      if (!aktiv || !r) return;
      const d = await r.json().catch(() => ({}));
      if (d.status === "ok") window.location.href = typeof d.hem === "string" && d.hem.startsWith("/") ? d.hem : "/lag";
      else if (d.status === "borta") setStatus("borta");
    };
    kolla();
    const t = setInterval(kolla, 4000);
    return () => { aktiv = false; clearInterval(t); };
  }, [h]);
  if (status === "borta") return <p className="fel">Förfrågan har nekats eller gått ut. Försök igen.</p>;
  return <p className="panel">Väntar på godkännande …</p>;
}
