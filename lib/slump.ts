import crypto from "node:crypto";

// Inga lättförväxlade tecken (0/O, 1/I/L)
const ALFABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function slumpKod(langd: number): string {
  const bytes = crypto.randomBytes(langd);
  let s = "";
  for (let i = 0; i < langd; i++) s += ALFABET[bytes[i] % ALFABET.length];
  return s;
}

/** Lagkod, 6 tecken, t.ex. KLV4X2. */
export const nyLagkod = () => slumpKod(6);

/** Aktiveringskod, t.ex. 7Q4M-X2PA-HK9D. */
export const nyAktiveringskod = () => {
  const s = slumpKod(12);
  return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8)}`;
};

/** Hemlig token för inloggnings- och lagledarlänkar. */
export const nyToken = () => crypto.randomBytes(24).toString("base64url");
