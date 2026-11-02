import Link from "next/link";
import { redirect } from "next/navigation";
import { arAdmin } from "@/lib/session";
import { FACIT_STEG, NYCKELLEDTRADAR } from "@/content/facit";
import { Text } from "@/components/Text";
import { Bild } from "@/components/Bild";

export const dynamic = "force-dynamic";

export default async function AdminFacit() {
  if (!(await arAdmin())) redirect("/admin");
  return (
    <main className="sida">
      <Link href="/admin">← Admin</Link>
      <h1 className="rubrik-mellan">Facit</h1>
      <div className="bildram"><Bild namn="facit" alt="Facitbilden." /></div>
      {FACIT_STEG.map((s) => (
        <section key={s.rubrik} className="dok dok-scen"><h3 className="dok-rubrik">{s.rubrik}</h3><div className="dok-text"><Text text={s.text} /></div></section>
      ))}
      <h2 className="rubrik-mellan">Nyckelledtrådar</h2>
      <ul className="ledtradar">{NYCKELLEDTRADAR.map((l, i) => <li key={i}><Link href={`/admin/lucka/${l.lucka}`}>Lucka {l.lucka}</Link><span>{l.text}</span></li>)}</ul>
    </main>
  );
}
