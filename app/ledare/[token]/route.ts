import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lagMedLedarToken, spelareMedToken } from "@/lib/db";
import { kakOpt, kakor } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Lagledarlänken från mejlet. Ger ledarrätt; den som inte spelar i laget på den här enheten går med först. */
export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const lag = lagMedLedarToken((await params).token);
  if (!lag) redirect("/borja");
  const k = await cookies();
  const namn = kakor(lag.spel);
  k.set(namn.ledare, lag.ledare_token, kakOpt);
  const s = spelareMedToken(k.get(namn.spelare)?.value || "");
  redirect(s && s.lag_id === lag.id ? (lag.spel === "barn" ? "/barn/laget" : "/lag/laget") : `/g/${lag.kod}`);
}
