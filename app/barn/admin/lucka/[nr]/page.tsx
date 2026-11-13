import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { arAdmin } from "@/lib/session";
import { barnLuckaNr } from "@/content/barn/luckor";
import { BarnLucka } from "@/components/barn/BarnLucka";

export default async function BarnAdminLucka({ params }: { params: Promise<{ nr: string }> }) {
  if (!(await arAdmin())) redirect("/barn/admin");
  const nr = Number((await params).nr);
  const l = barnLuckaNr(nr);
  if (!l) notFound();
  return (
    <main className="sida">
      <nav className="rad" style={{ justifyContent: "space-between" }}>
        <Link href="/barn/admin">← Admin</Link>
        <span className="rad">{nr > 1 && <Link href={`/barn/admin/lucka/${nr - 1}`}>← {nr - 1}</Link>}{nr < 24 && <Link href={`/barn/admin/lucka/${nr + 1}`}>{nr + 1} →</Link>}</span>
      </nav>
      <p className="chip chip-varning" style={{ justifySelf: "start" }}>Förhandsvisning · {l.teaser}</p>
      <BarnLucka lucka={l} />
    </main>
  );
}
