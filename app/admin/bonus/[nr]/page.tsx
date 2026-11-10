import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { arAdmin } from "@/lib/session";
import { bonusNr } from "@/content/bonus";
import { Dokument } from "@/components/Dokument";
import { ZoombarMedInfo } from "@/components/ZoombarServer";
import { Signalflaggor } from "@/components/Signalflaggor";

export const dynamic = "force-dynamic";

export default async function AdminBonus({ params }: { params: Promise<{ nr: string }> }) {
  if (!(await arAdmin())) redirect("/admin");
  const b = bonusNr(Number((await params).nr));
  if (!b) notFound();
  return (
    <main className="sida">
      <Link href="/admin">← Admin</Link>
      <h1 className="rubrik-mellan">Bonus {b.nr}: {b.titel}</h1>
      <p className="panel">Syns från lucka {b.synsFran}. Gåta: {b.gata.typ}. Ledtråd: {b.gata.ledtrad}<br />Svar: <code>{b.svar.join(" / ")}</code></p>
      {b.gata.typ === "flaggor" && <Signalflaggor bokstaver={b.gata.flaggor} />}
      <p className="ingress">{b.ingress}</p>
      {b.bilder.map((x) => <ZoombarMedInfo key={x.namn} namn={x.namn} alt={x.alt} />)}
      {b.avsnitt.map((a, i) => <Dokument key={i} a={a} />)}
    </main>
  );
}
