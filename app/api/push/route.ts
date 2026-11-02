import { NextRequest } from "next/server";
import { inloggad } from "@/lib/session";
import { pushKonfigurerad, pushaTillSpelare, sparaPrenumeration, taBortPrenumeration } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ nyckel: pushKonfigurerad() ? process.env.VAPID_PUBLIC_KEY : null });
}

export async function POST(req: NextRequest) {
  const i = await inloggad();
  if (!i) return new Response(null, { status: 401 });
  const { prenumeration, test } = await req.json().catch(() => ({}));
  if (prenumeration?.endpoint) sparaPrenumeration(i.spelare.id, prenumeration);
  if (test) {
    const n = await pushaTillSpelare([i.spelare.id], { titel: "Testnotis från Klovskär", text: "Fyren blinkar. Notiserna fungerar.", url: "/lag/laget" });
    return Response.json({ skickade: n });
  }
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const i = await inloggad();
  if (!i) return new Response(null, { status: 401 });
  const { endpoint } = await req.json().catch(() => ({}));
  if (endpoint) taBortPrenumeration(endpoint);
  return Response.json({ ok: true });
}
