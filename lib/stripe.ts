import "server-only";
import Stripe from "stripe";

export type StripeLage = "test" | "live";

export function stripeLage(): StripeLage {
  return process.env.STRIPE_LAGE === "live" ? "live" : "test";
}

function nyckel(): string | undefined {
  return stripeLage() === "live" ? process.env.STRIPE_LIVE_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY;
}

export function webhookHemlighet(): string | undefined {
  return stripeLage() === "live" ? process.env.STRIPE_LIVE_WEBHOOK_SECRET : process.env.STRIPE_TEST_WEBHOOK_SECRET;
}

export function stripeKonfigurerad(): boolean {
  return !!nyckel();
}

/**
 * Är butiken öppen för kunder? Bara i live-läge – i testläge skulle ett riktigt kort nekas
 * och testkortet ge en riktig kod gratis. TESTKOP=1 öppnar ändå, för att prova köpkedjan.
 */
export function kopOppet(): boolean {
  return stripeKonfigurerad() && (stripeLage() === "live" || process.env.TESTKOP === "1");
}

let klient: Stripe | null = null;
let klientLage: StripeLage | null = null;

export function stripe(): Stripe {
  const k = nyckel();
  if (!k) throw new Error(`Stripe-nyckel för ${stripeLage()}läge saknas i .env`);
  if (!klient || klientLage !== stripeLage()) {
    klient = new Stripe(k);
    klientLage = stripeLage();
  }
  return klient;
}

export const ORD_PRIS_KR = 199;

/** Introduktionspriset gäller t.o.m. detta datum (svensk tid). Därefter ordinarie pris automatiskt. */
export const INTRO_TOM = "15 december";
const INTRO_SLUT = Date.parse("2026-12-16T00:00:00+01:00");

export function introAktiv(nu = Date.now()): boolean {
  return nu < INTRO_SLUT;
}

export function prisKr(nu = Date.now()): number {
  if (!introAktiv(nu)) return ORD_PRIS_KR;
  const p = Number(process.env.PRIS_KR);
  return Number.isFinite(p) && p > 0 ? p : ORD_PRIS_KR;
}

/** "Introduktionspris 99 kr t.o.m. 15 december (ord. 199 kr)" – eller bara "199 kr" när det gått ut. */
export function prisText(): string {
  const p = prisKr();
  return p < ORD_PRIS_KR ? `Introduktionspris ${p} kr t.o.m. ${INTRO_TOM} (ord. ${ORD_PRIS_KR} kr)` : `${p} kr`;
}
