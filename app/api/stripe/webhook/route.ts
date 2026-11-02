import { NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe, webhookHemlighet } from "@/lib/stripe";
import { kodForSession } from "@/lib/kop";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const hemlighet = webhookHemlighet();
  if (!hemlighet) return new Response("Webhook-hemlighet saknas", { status: 500 });
  const kropp = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(kropp, req.headers.get("stripe-signature") || "", hemlighet);
  } catch (e) {
    console.warn("[webhook] ogiltig signatur", (e as Error).message);
    return new Response("Ogiltig signatur", { status: 400 });
  }
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    await kodForSession(event.data.object as Stripe.Checkout.Session);
  }
  if (event.type === "charge.refunded") {
    const pi = (event.data.object as Stripe.Charge).payment_intent;
    if (typeof pi === "string") {
      const sessioner = await stripe().checkout.sessions.list({ payment_intent: pi, limit: 1 });
      const s = sessioner.data[0];
      if (s) db().prepare("UPDATE klov_kod SET aterbetald = 1 WHERE stripe_session = ?").run(s.id);
    }
  }
  return Response.json({ mottaget: true });
}
