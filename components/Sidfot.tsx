import Link from "next/link";

export function Sidfot() {
  const namn = process.env.SALJARE_NAMN;
  const epost = process.env.SALJARE_EPOST;
  const adress = process.env.SALJARE_ADRESS;
  return (
    <footer className="sidfot">
      <p>Mordet på Klovskär – Adventsmysteriet 2026</p>
      <p>
        <Link href="/villkor">Köpvillkor</Link> · <Link href="/integritet">Integritet</Link> · <Link href="/topplista">Topplista</Link>
      </p>
      {(namn || epost) && <p>Säljare: {[namn, adress].filter(Boolean).join(", ")}{namn && epost ? " · " : ""}{epost && <a href={`mailto:${epost}`}>{epost}</a>}</p>}
      <p className="liten">Alla personer och händelser är påhittade.</p>
    </footer>
  );
}
