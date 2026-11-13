import "server-only";
import type Stripe from "stripe";
import { db, kodMedSession, type Kod } from "./db";
import { nyAktiveringskod } from "./slump";
import { stripe, stripeLage, prisFor } from "./stripe";
import { arVara, type Spel, type Vara } from "./spel";
import { mejlaKop } from "./mail";

const BAS = () => process.env.BAS_URL || "https://adventdeckare.se";

const VARUTEXT: Record<Vara, { namn: string; beskrivning: string }> = {
  klovskar: {
    namn: "Mordet på Klovskär (Adventsmysteriet 2026)",
    beskrivning: "Adventsmysteriet 2026 – 24 luckor för ett lag där hela 5 personer kan vara med. Digital leverans direkt.",
  },
  barn: {
    namn: "Stjärnan som försvann (adventsdeckare för barn)",
    beskrivning: "Adventsdeckare för barn 6–10 år – 24 luckor med frivilliga uppdrag. Digital leverans direkt.",
  },
  bada: {
    namn: "Mordet på Klovskär + Stjärnan som försvann",
    beskrivning: "Båda adventsdeckarna: en för de vuxna och en för barnen, 24 luckor var. En kod per spel. Digital leverans direkt.",
  },
};

export async function skapaCheckout(opts: { present: boolean; epost?: string; vara?: Vara }): Promise<string> {
  const vara = opts.vara ?? "klovskar";
  const fraga = `${vara === "klovskar" ? "" : `spel=${vara}`}${opts.present ? `${vara === "klovskar" ? "" : "&"}present=1` : ""}`;
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    locale: "sv",
    customer_email: opts.epost || undefined,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "sek",
        unit_amount: prisFor(vara) * 100,
        product_data: {
          name: `${VARUTEXT[vara].namn} – ${opts.present ? "presentkort" : "lag"}`,
          description: VARUTEXT[vara].beskrivning,
        },
      },
    }],
    metadata: { typ: opts.present ? "present" : "kop", app: "klovskar", vara },
    payment_intent_data: { metadata: { app: "klovskar" } },
    invoice_creation: { enabled: true },
    success_url: `${BAS()}/kop/tack?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BAS()}/kop${fraga ? `?${fraga}` : ""}`,
  };
  // Managed Payments (Stripe som säljare) ska aldrig gälla här: villkoren anger
  // Alexander Rabnor som säljare, och det kräver skattekod per produkt.
  const s = await stripe().checkout.sessions.create({
    ...params,
    managed_payments: { enabled: false },
  } as Stripe.Checkout.SessionCreateParams);
  if (!s.url) throw new Error("Stripe gav ingen betalningslänk");
  return s.url;
}

/** Paketets andra kod delar Stripe-session med den första. Kolumnen är unik, så barnkoden får ett suffix. */
const BARNSUFFIX = "#barn";

/**
 * Skapar aktiveringskoderna för en betald session: en kod per spel som ingår i köpet.
 * Idempotent: webhooken och tacksidan kan båda anropa den, och koderna skapas bara en gång.
 * I ett paket bär Klovskärkoden hela beloppet och barnkoden 0 kr, så att intäkten inte räknas dubbelt.
 */
export async function koderForSession(session: Stripe.Checkout.Session): Promise<Kod[]> {
  if (session.payment_status !== "paid" || session.metadata?.app !== "klovskar") return [];
  const vara: Vara = arVara(session.metadata?.vara) ? session.metadata.vara : "klovskar";
  const typ = session.metadata?.typ === "present" ? "present" : "kop";
  const epost = session.customer_details?.email || session.customer_email || null;
  const rader: { nyckel: string; spel: Spel; ore: number }[] =
    vara === "bada"
      ? [{ nyckel: session.id, spel: "klovskar", ore: session.amount_total ?? 0 }, { nyckel: session.id + BARNSUFFIX, spel: "barn", ore: 0 }]
      : [{ nyckel: session.id, spel: vara, ore: session.amount_total ?? 0 }];
  const ins = db().prepare(`INSERT INTO klov_kod (kod, typ, stripe_session, epost, belopp_ore, testlage, spel)
    VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(stripe_session) DO NOTHING`);
  const nya = db().transaction(() => {
    let n = 0;
    for (const r of rader) n += ins.run(nyAktiveringskod(), typ, r.nyckel, epost, r.ore, session.livemode ? 0 : 1, r.spel).changes;
    return n;
  })();
  const koder = rader.map((r) => kodMedSession(r.nyckel)!);
  if (nya > 0 && epost) {
    mejlaKop(epost, koder, typ).catch((e) => console.error("[mejl] köp", e));
  }
  return koder;
}

/** Markerar alla koder från ett köp som återbetalda. */
export function aterbetalaSession(sessionId: string) {
  db().prepare("UPDATE klov_kod SET aterbetald = 1 WHERE stripe_session IN (?, ?)").run(sessionId, sessionId + BARNSUFFIX);
}

export async function hamtaSession(id: string) {
  return stripe().checkout.sessions.retrieve(id);
}

export function aktuelltLage() {
  return stripeLage();
}
