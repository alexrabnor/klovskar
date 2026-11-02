import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { inloggad } from "@/lib/session";
import { arOppen } from "@/lib/tid";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const i = await inloggad();
  if (!i) return new Response(null, { status: 401 });
  const nr = Number(req.nextUrl.searchParams.get("lucka"));
  if (!arOppen(i.lag, nr, i.nu)) return Response.json({ kommentarer: [] });
  const rader = db().prepare("SELECT id, namn, text, skapad, spelare_id FROM klov_kommentar WHERE lag_id = ? AND lucka_nr = ? ORDER BY id")
    .all(i.lag.id, nr) as { id: number; namn: string; text: string; skapad: string; spelare_id: number | null }[];
  return Response.json({ kommentarer: rader.map(({ spelare_id, ...r }) => ({ ...r, egen: spelare_id === i.spelare.id })) });
}

export async function POST(req: NextRequest) {
  const i = await inloggad();
  if (!i) return new Response(null, { status: 401 });
  const { lucka, text } = await req.json().catch(() => ({}));
  const nr = Number(lucka);
  const t = String(text ?? "").trim().slice(0, 2000);
  if (!t || !arOppen(i.lag, nr, i.nu)) return new Response(null, { status: 400 });
  db().prepare("INSERT INTO klov_kommentar (lag_id, lucka_nr, spelare_id, namn, text) VALUES (?, ?, ?, ?, ?)").run(i.lag.id, nr, i.spelare.id, i.spelare.namn, t);
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const i = await inloggad();
  if (!i) return new Response(null, { status: 401 });
  db().prepare("DELETE FROM klov_kommentar WHERE id = ? AND lag_id = ? AND spelare_id = ?").run(Number(req.nextUrl.searchParams.get("id")), i.lag.id, i.spelare.id);
  return Response.json({ ok: true });
}
