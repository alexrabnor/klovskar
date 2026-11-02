import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { inloggad } from "@/lib/session";
import { arOppen } from "@/lib/tid";
import { rensaUtkast } from "@/lib/anklagelse-val";

export const dynamic = "force-dynamic";

interface Rad { utkast: string; uppdaterad_av: string | null; uppdaterad: string | null; inlamnad: number }

export async function GET() {
  const i = await inloggad();
  if (!i) return new Response(null, { status: 401 });
  if (!arOppen(i.lag, 24, i.nu)) return Response.json({ stangd: true });
  const r = db().prepare("SELECT utkast, uppdaterad_av, uppdaterad, inlamnad FROM klov_anklagelse WHERE lag_id = ?").get(i.lag.id) as Rad | undefined;
  return Response.json({ utkast: r ? JSON.parse(r.utkast) : {}, av: r?.uppdaterad_av ?? null, tid: r?.uppdaterad ?? null, inlamnad: !!r?.inlamnad });
}

export async function PUT(req: NextRequest) {
  const i = await inloggad();
  if (!i) return new Response(null, { status: 401 });
  if (!arOppen(i.lag, 24, i.nu)) return new Response(null, { status: 403 });
  const utkast = rensaUtkast(await req.json().catch(() => ({})));
  const r = db().prepare(`INSERT INTO klov_anklagelse (lag_id, utkast, uppdaterad_av, uppdaterad) VALUES (?, ?, ?, datetime('now'))
    ON CONFLICT(lag_id) DO UPDATE SET utkast = excluded.utkast, uppdaterad_av = excluded.uppdaterad_av, uppdaterad = excluded.uppdaterad
    WHERE klov_anklagelse.inlamnad = 0`).run(i.lag.id, JSON.stringify(utkast), i.spelare.namn);
  if (r.changes === 0) return Response.json({ inlamnad: true }, { status: 409 });
  return Response.json({ ok: true });
}
