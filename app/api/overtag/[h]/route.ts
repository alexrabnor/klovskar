import { cookies } from "next/headers";
import { db, lagMedId } from "@/lib/db";
import { hamtaGodkantOvertag } from "@/lib/lag";
import { kakOpt, kakor, ledarLag } from "@/lib/session";
import { spelHem } from "@/lib/spel";

export const dynamic = "force-dynamic";

export async function POST(_: Request, { params }: { params: Promise<{ h: string }> }) {
  const h = (await params).h;
  // Lagledaren som går med på en ny enhet behöver inte vänta på sig själv
  for (const ledare of [await ledarLag("klovskar"), await ledarLag("barn")]) {
    if (ledare) db().prepare("UPDATE klov_overtag SET godkand = 1 WHERE hemlighet = ? AND lag_id = ?").run(h, ledare.id);
  }
  const r = hamtaGodkantOvertag(h);
  if (r === "vantar") return Response.json({ status: "vantar" });
  if (!r) return Response.json({ status: "borta" });
  const spel = lagMedId(r.lag_id)?.spel ?? "klovskar";
  (await cookies()).set(kakor(spel).spelare, r.token, kakOpt);
  return Response.json({ status: "ok", hem: spelHem(spel) });
}
