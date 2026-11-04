# Mordet på Klovskär

Adventsmysterium i 24 luckor som säljs per lag – **adventdeckare.se**, port 3131.

Next.js 16 + SQLite (`better-sqlite3`) på volymen `klovskar_klovskar_data`. Alla beslut står i [BESLUT.md](BESLUT.md).

## Starta

```bash
docker compose up -d --build
```

## Innehåll

| Fil | Vad |
| --- | --- |
| `content/luckor.ts` | Alla 24 luckor – **hemligt**, bara serverkod |
| `content/bonus.ts` | Bonusluckor och chiffersvar – **hemligt** |
| `content/facit.ts` | Lösning, poängregler, nyckelledtrådar – **hemligt** |
| `content/personer.ts`, `content/karta.ts` | Publikt (smakprov) |
| `bilder/` | Spelets bilder, monterade read-only. `mappning.json` + `RAPPORT.md` beskriver dem |

Läckkollen (`scripts/kolla-lackor.mjs`) körs efter varje `npm run build` och stoppar bygget om hemligt innehåll hamnat i klientkoden.

## Byta en bild

Lägg filen i `bilder/` med målnamnet (t.ex. `lucka-05.jpg`). Ingen ombyggnad behövs.

## Stripe

1. Lägg in nycklar i `.env`: `STRIPE_TEST_SECRET_KEY` (och senare `STRIPE_LIVE_SECRET_KEY`).
2. Skapa en webhook i Stripe → Utvecklare → Webhooks:
   - URL: `https://adventdeckare.se/api/stripe/webhook`
   - Händelser: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`
   - Signeringshemligheten → `STRIPE_TEST_WEBHOOK_SECRET` (resp. `_LIVE_`).
3. `STRIPE_LAGE=test` visar en testbanderoll. Byt till `live` när allt är provat.
4. `docker compose up -d --build`.

## Testa

- `npm test` – datumlås och poäng (Vitest).
- `/admin` (lösenord `ADMIN_LOSEN` i `.env`): förhandsvisa alla luckor, skapa gratiskoder, flytta ett testlags klocka.
- `TESTLAGE_DATUM=2026-12-14T08:00` simulerar ett datum för hela servern. Lämna tomt i drift.
