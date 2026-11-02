import Link from "next/link";
import type { Metadata } from "next";
import { GaMedFormular } from "./GaMedFormular";

export const metadata: Metadata = { title: "Gå med i ett lag" };

export default function GaMed() {
  return (
    <main className="sida">
      <Link href="/borja" className="liten">← Tillbaka</Link>
      <h1 className="rubrik-mellan">Gå med i ett lag</h1>
      <GaMedFormular kod="" />
    </main>
  );
}
