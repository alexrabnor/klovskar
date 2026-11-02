import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { arAdmin } from "@/lib/session";
import { luckaNr } from "@/content/luckor";
import { PLATSER } from "@/content/karta";
import { PERSONER } from "@/content/personer";
import { BONUS } from "@/content/bonus";
import { LuckInnehall } from "@/components/LuckInnehall";

export const dynamic = "force-dynamic";

export default async function AdminLucka({ params }: { params: Promise<{ nr: string }> }) {
  if (!(await arAdmin())) redirect("/admin");
  const nr = Number((await params).nr);
  const l = luckaNr(nr);
  if (!l) notFound();
  const bonus = BONUS.find((b) => b.synsFran === nr);
  return (
    <main className="sida">
      <nav className="rad" style={{ justifyContent: "space-between" }}>
        <Link href="/admin">← Admin</Link>
        <span className="rad">{nr > 1 && <Link href={`/admin/lucka/${nr - 1}`}>← {nr - 1}</Link>}{nr < 24 && <Link href={`/admin/lucka/${nr + 1}`}>{nr + 1} →</Link>}</span>
      </nav>
      <p className="chip chip-varning" style={{ justifySelf: "start" }}>Förhandsvisning · {l.teaser}</p>
      <LuckInnehall lucka={l} platser={l.interaktion === "karta" ? PLATSER : undefined} personer={l.interaktion === "misstankta" ? PERSONER : undefined} />
      {l.fraga && <p className="fraga">{l.fraga}</p>}
      {bonus && <p className="panel">Chiffer till <Link href={`/admin/bonus/${bonus.nr}`}>bonus {bonus.nr}</Link> visas här. Svar: <code>{bonus.svar.join(" / ")}</code></p>}
    </main>
  );
}
