// Körs en gång när servern startar. Här lever schemajobben: morgonens notiser och gallringen.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  if (!process.env.ADMIN_LOSEN) console.warn("[klovskar] ADMIN_LOSEN saknas – /admin är avstängd.");
  if (process.env.TESTLAGE_DATUM?.trim()) console.warn(`[klovskar] TESTLÄGE: simulerat datum ${process.env.TESTLAGE_DATUM}`);
  const { skickaNyaLuckor } = await import("./lib/utskick");
  setTimeout(() => skickaNyaLuckor(), 10_000);
  setInterval(() => skickaNyaLuckor(), 60_000);
  const { gallra } = await import("./lib/gallring");
  const gallraSakert = () => { try { gallra(); } catch (e) { console.error("[gallring]", e); } };
  setTimeout(gallraSakert, 30_000);
  setInterval(gallraSakert, 60 * 60_000);
  // Skapa alla bildstorlekar i förväg – en utbytt bild får nya varianter vid nästa omstart eller första visning
  const { vamCache } = await import("./lib/bilder");
  setTimeout(() => {
    const t = Date.now();
    vamCache().then((n) => console.log(`[bilder] ${n} varianter klara på ${Math.round((Date.now() - t) / 1000)} s`)).catch((e) => console.error("[bilder]", e));
  }, 5_000);
}
