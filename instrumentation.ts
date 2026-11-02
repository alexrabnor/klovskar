// Körs en gång när servern startar. Här lever schemajobbet för morgonens notiser.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  if (!process.env.ADMIN_LOSEN) console.warn("[klovskar] ADMIN_LOSEN saknas – /admin är avstängd.");
  if (process.env.TESTLAGE_DATUM?.trim()) console.warn(`[klovskar] TESTLÄGE: simulerat datum ${process.env.TESTLAGE_DATUM}`);
  const { skickaNyaLuckor } = await import("./lib/utskick");
  setTimeout(() => skickaNyaLuckor(), 10_000);
  setInterval(() => skickaNyaLuckor(), 60_000);
}
