import { stripeLage } from "@/lib/stripe";

export function TestBanderoll() {
  const testDatum = process.env.TESTLAGE_DATUM?.trim();
  const testBetalning = stripeLage() === "test";
  if (!testDatum && !testBetalning) return null;
  return (
    <div className="testbanderoll" role="status">
      {testBetalning && <span>TESTLÄGE – inga riktiga pengar</span>}
      {testDatum && <span>Simulerat datum: {testDatum.replace("T", " ")}</span>}
    </div>
  );
}
