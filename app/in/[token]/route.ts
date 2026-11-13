import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lagMedId, spelareMedToken } from "@/lib/db";
import { kakOpt, kakor } from "@/lib/session";
import { spelHem } from "@/lib/spel";

export const dynamic = "force-dynamic";

/** Personlig inloggningslänk – fungerar på valfri enhet. */
export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const s = spelareMedToken((await params).token);
  const lag = s && lagMedId(s.lag_id);
  if (!s || !lag) redirect("/borja");
  (await cookies()).set(kakor(lag.spel).spelare, s.token, kakOpt);
  redirect(spelHem(lag.spel));
}
