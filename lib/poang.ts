import "server-only";
import { MORDARE, RATT_METOD, RATT_MOTIV, TID_FRAN, TID_TILL } from "@/content/facit";
import type { Utkast } from "./anklagelse-val";

export interface Poang {
  mordare: number;
  motiv: number;
  metod: number;
  tid: number;
  bonus: number;
  totalt: number;
}

export const MAX_POANG = 5 + 3 + 3 + 2 + 6;

export function raknaPoang(u: Utkast, antalBonus: number): Poang {
  const mordare = u.mordare === MORDARE ? 5 : 0;
  const motiv = u.motiv === RATT_MOTIV ? 3 : 0;
  const metod = u.metod === RATT_METOD ? 3 : 0;
  let tid = 0;
  if (u.tid) {
    const [h, m] = u.tid.split(":").map(Number);
    const min = h * 60 + m;
    if (min >= TID_FRAN && min <= TID_TILL) tid = 2;
  }
  const bonus = Math.max(0, Math.min(6, antalBonus));
  return { mordare, motiv, metod, tid, bonus, totalt: mordare + motiv + metod + tid + bonus };
}
