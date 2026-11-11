import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { inloggad } from "@/lib/session";
import { arOppen } from "@/lib/tid";
import { luckaNr } from "@/content/luckor";
import { personMedId } from "@/content/personer";

export const dynamic = "force-dynamic";

const BREDD = 1400, HOJD = 1000;
const klamra = (v: unknown, max: number) => Math.max(0, Math.min(max, Number(v) || 0));

export async function GET() {
  const i = await inloggad();
  if (!i) return new Response(null, { status: 401 });
  const kort = db().prepare("SELECT id, typ, referens, text, x, y, skapad_av FROM klov_tavla_kort WHERE lag_id = ? ORDER BY id").all(i.lag.id) as
    { id: number; typ: string; referens: string | null; text: string | null; x: number; y: number; skapad_av: string | null }[];
  const tradar = db().prepare("SELECT id, fran_kort, till_kort FROM klov_tavla_trad WHERE lag_id = ?").all(i.lag.id);
  return Response.json({
    kort: kort.map((k) => {
      if (k.typ === "lucka") {
        const nr = Number(k.referens);
        const l = arOppen(i.lag, nr, i.nu) ? luckaNr(nr) : null;
        return { ...k, rubrik: `Lucka ${nr}`, text: l?.titel ?? "", bild: l?.bilder[0]?.namn ?? null };
      }
      if (k.typ === "person") {
        const p = personMedId(String(k.referens));
        return { ...k, rubrik: p?.namn ?? "?", text: p?.roll ?? "", bild: p ? `portratt-${p.id}` : null };
      }
      return { ...k, rubrik: k.skapad_av ?? "Lapp", bild: null };
    }),
    tradar,
  });
}

export async function POST(req: NextRequest) {
  const i = await inloggad();
  if (!i) return new Response(null, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const d = db();
  const lag = i.lag.id;
  switch (b.op) {
    case "nytt": {
      const typ = ["lucka", "person", "lapp"].includes(b.typ) ? b.typ : null;
      if (!typ) return new Response(null, { status: 400 });
      if (typ === "lucka" && !arOppen(i.lag, Number(b.referens), i.nu)) return new Response(null, { status: 400 });
      if (typ === "person" && !personMedId(String(b.referens))) return new Response(null, { status: 400 });
      const text = typ === "lapp" ? String(b.text ?? "").trim().slice(0, 280) : null;
      if (typ === "lapp" && !text) return new Response(null, { status: 400 });
      const antal = (d.prepare("SELECT COUNT(*) n FROM klov_tavla_kort WHERE lag_id = ?").get(lag) as { n: number }).n;
      if (antal >= 120) return Response.json({ fel: "Tavlan är full. Ta bort några kort först." }, { status: 400 });
      d.prepare("INSERT INTO klov_tavla_kort (lag_id, typ, referens, text, x, y, skapad_av) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .run(lag, typ, typ === "lapp" ? null : String(b.referens), text, klamra(b.x, BREDD - 180), klamra(b.y, HOJD - 120), i.spelare.namn);
      break;
    }
    case "flytta":
      d.prepare("UPDATE klov_tavla_kort SET x = ?, y = ? WHERE id = ? AND lag_id = ?").run(klamra(b.x, BREDD - 180), klamra(b.y, HOJD - 120), Number(b.id), lag);
      break;
    case "tabort":
      d.prepare("DELETE FROM klov_tavla_kort WHERE id = ? AND lag_id = ?").run(Number(b.id), lag);
      break;
    case "trad": {
      const a = Number(b.fran), c = Number(b.till);
      if (a === c) break;
      const finns = d.prepare("SELECT COUNT(*) n FROM klov_tavla_kort WHERE lag_id = ? AND id IN (?, ?)").get(lag, a, c) as { n: number };
      if (finns.n !== 2) return new Response(null, { status: 400 });
      const [fran, till] = a < c ? [a, c] : [c, a];
      d.prepare("INSERT OR IGNORE INTO klov_tavla_trad (lag_id, fran_kort, till_kort) VALUES (?, ?, ?)").run(lag, fran, till);
      break;
    }
    case "tabortTrad":
      d.prepare("DELETE FROM klov_tavla_trad WHERE id = ? AND lag_id = ?").run(Number(b.id), lag);
      break;
    default:
      return new Response(null, { status: 400 });
  }
  return Response.json({ ok: true });
}
