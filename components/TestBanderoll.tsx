import { kopOppet, stripeLage } from "@/lib/stripe";

export function TestBanderoll() {
  const testDatum = process.env.TESTLAGE_DATUM?.trim();
  // Bara när köpet faktiskt är öppet i testläge – annars finns inget att varna för
  const testBetalning = kopOppet() && stripeLage() === "test";
  if (!testDatum && !testBetalning) return null;
  return (
    <div className="testbanderoll" role="status">
      {testBetalning && <span>TESTLÄGE – inga riktiga pengar</span>}
      {testDatum && <span>Simulerat datum: {testDatum.replace("T", " ")}</span>}
    </div>
  );
}
