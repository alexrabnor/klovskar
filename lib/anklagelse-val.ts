// Valen i anklagelseformuläret. Publika – säger inget om vilket som är rätt.

export const MOTIV = [
  { id: "pengar", text: "Pengar eller arv" },
  { id: "hamnd", text: "Hämnd" },
  { id: "hemlighet", text: "Skydda en hemlighet" },
  { id: "svartsjuka", text: "Svartsjuka" },
  { id: "skulder", text: "Skulder" },
] as const;

export const METOD = [
  { id: "gift", text: "Han dog av giftet" },
  { id: "somnmedel", text: "Sömnmedel och en knuff" },
  { id: "slag", text: "Slag mot huvudet" },
  { id: "olycka", text: "Det var en olycka" },
] as const;

export interface Utkast {
  mordare?: string;
  motiv?: string;
  motivText?: string;
  metod?: string;
  tid?: string;
}

export function rensaUtkast(u: unknown): Utkast {
  const o = (u && typeof u === "object" ? u : {}) as Record<string, unknown>;
  const s = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : undefined);
  const tid = s(o.tid, 5);
  return {
    mordare: s(o.mordare, 20),
    motiv: MOTIV.some((m) => m.id === o.motiv) ? (o.motiv as string) : undefined,
    motivText: s(o.motivText, 1500),
    metod: METOD.some((m) => m.id === o.metod) ? (o.metod as string) : undefined,
    tid: tid && /^\d{2}:\d{2}$/.test(tid) ? tid : undefined,
  };
}
