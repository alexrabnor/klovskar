import Link from "next/link";

export function BarnSidfot() {
  const namn = process.env.SALJARE_NAMN;
  const epost = process.env.SALJARE_EPOST;
  const adress = process.env.SALJARE_ADRESS;
  return (
    <footer className="sidfot">
      <p>Stjärnan som försvann – adventsdeckare för barn</p>
      <p><Link href="/villkor">Köpvillkor</Link> · <Link href="/integritet">Integritet</Link></p>
      {(namn || epost) && <p>Säljare: {[namn, adress].filter(Boolean).join(", ")}{namn && epost ? " · " : ""}{epost && <a href={`mailto:${epost}`}>{epost}</a>}</p>}
      <p className="liten">Alla personer, djur och händelser är påhittade.</p>
    </footer>
  );
}
