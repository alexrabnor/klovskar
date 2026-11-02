import "server-only";
import type Stripe from "stripe";
import { db, kodMedSession, type Kod } from "./db";
import { nyAktiveringskod } from "./slump";
import { stripe, stripeLage, prisKr } from "./stripe";
import { mejlaKop } from "./mail";

const BAS = () => process.env.BAS_URL || "https://klovskar.alexcloud.se";

export async function skapaCheckout(opts: { present: boolean; epost?: string }): Promise<string> {
  const s = await stripe().checkout.sessions.create({
    mode: "payment",
    locale: "sv",
    customer_email: opts.epost || undefined,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "sek",
        unit_amount: prisKr() * 100,
        product_data: {
          name: opts.present ? "Mordet på Klovskär – presentkort" : "Mordet på Klovskär – lag",
          description: "Adventsmysterium i 24 luckor för ett lag på upp till 10 spelare. Digital leverans direkt.",
        },
      },
    }],
    metadata: { typ: opts.present ? "present" : "kop", app: "klovskar" },
    payment_intent_data: { metadata: { app: "klovskar" } },
    invoice_creation: { enabled: true },
    success_url: `${BAS()}/kop/tack?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BAS()}/kop${opts.present ? "?present=1" : ""}`,
  });
  if (!s.url) throw new Error("Stripe gav ingen betalningslänk");
  return s.url;
}

/**
 * Skapar aktiveringskoden för en betald session. Idempotent: webhooken och tacksidan
 * kan båda anropa den, och bara en kod skapas per session.
 */
export async function kodForSession(session: Stripe.Checkout.Session): Promise<Kod | null> {
  if (session.payment_status !== "paid" || session.metadata?.app !== "klovskar") return null;
  const finns = kodMedSession(session.id);
  if (finns) return finns;
  const typ = session.metadata?.typ === "present" ? "present" : "kop";
  const epost = session.customer_details?.email || session.customer_email || null;
  const kod = nyAktiveringskod();
  const r = db().prepare(`INSERT INTO klov_kod (kod, typ, stripe_session, epost, belopp_ore, testlage)
    VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(stripe_session) DO NOTHING`)
    .run(kod, typ, session.id, epost, session.amount_total ?? 0, session.livemode ? 0 : 1);
  const rad = kodMedSession(session.id)!;
  if (r.changes > 0 && epost) {
    mejlaKop(epost, rad.kod, typ).catch((e) => console.error("[mejl] köp", e));
  }
  return rad;
}

export async function hamtaSession(id: string) {
  return stripe().checkout.sessions.retrieve(id);
}

export function aktuelltLage() {
  return stripeLage();
}
