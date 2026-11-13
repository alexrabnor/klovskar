// Två spel i samma app. Ett lag hör till exakt ett spel, och en aktiveringskod likaså.
export type Spel = "klovskar" | "barn";

/** Det man köper: ett av spelen, eller båda i ett paket (då skapas en kod per spel). */
export type Vara = Spel | "bada";

export const SPELNAMN: Record<Spel, string> = {
  klovskar: "Mordet på Klovskär",
  barn: "Stjärnan som försvann",
};

export const arSpel = (s: unknown): s is Spel => s === "klovskar" || s === "barn";
export const arVara = (s: unknown): s is Vara => arSpel(s) || s === "bada";

/** Lagets startsida i spelet. */
export const spelHem = (spel: Spel) => (spel === "barn" ? "/barn/kalender" : "/lag");

/** Barndeckaren visas bara där BARN=1 (eller där den är startsida). Annars finns /barn inte. */
export function barnPa(env: Record<string, string | undefined> = process.env): boolean {
  return env.BARN === "1" || env.STARTSIDA === "barn";
}
