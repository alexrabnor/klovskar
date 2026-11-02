import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { spelareMedToken } from "@/lib/db";
import { SPELARKAKA, kakOpt } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Personlig inloggningslänk – fungerar på valfri enhet. */
export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const s = spelareMedToken((await params).token);
  if (!s) redirect("/borja");
  (await cookies()).set(SPELARKAKA, s.token, kakOpt);
  redirect("/lag");
}
