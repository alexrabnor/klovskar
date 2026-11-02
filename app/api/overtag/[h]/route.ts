import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { hamtaGodkantOvertag } from "@/lib/lag";
import { SPELARKAKA, kakOpt, ledarLag } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(_: Request, { params }: { params: Promise<{ h: string }> }) {
  const h = (await params).h;
  // Lagledaren som går med på en ny enhet behöver inte vänta på sig själv
  const ledare = await ledarLag();
  if (ledare) db().prepare("UPDATE klov_overtag SET godkand = 1 WHERE hemlighet = ? AND lag_id = ?").run(h, ledare.id);
  const r = hamtaGodkantOvertag(h);
  if (r === "vantar") return Response.json({ status: "vantar" });
  if (!r) return Response.json({ status: "borta" });
  (await cookies()).set(SPELARKAKA, r.token, kakOpt);
  return Response.json({ status: "ok" });
}
