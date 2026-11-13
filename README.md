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

## Barndeckaren – Stjärnan som försvann

Ett andra spel i samma app, för barn 6–10 år. Alla beslut står under "Barndeckaren" i [BESLUT.md](BESLUT.md).

| Fil | Vad |
| --- | --- |
| `content/barn/luckor.ts` | Alla 24 luckor: text, fråga, uppdrag – **hemligt** |
| `content/barn/figurer.ts` | Öborna – publikt |
| `app/barn/` | Startsida, smakprov, spelet (`(spel)/`) och egen admin (`admin/`) |
| `lib/barn.ts`, `lib/spel.ts` | Datumlås och märken för barnlag, speltyp och påslagning |

Barndeckaren syns bara där `BARN=1`. Prova den på egen adress:

```bash
cp .env .env.barn
```

```bash
docker compose -f docker-compose.barn.yml up -d --build
```

Den startar på port 3132 med egen databas (`barndeckare_data`). Admin finns på `/barn/admin`, med samma lösenord som `/admin`.

Bilderna ligger i samma `bilder/`-mapp med `barn-` först i namnet: `barn-omslag`, `barn-figurer`, `barn-karta` och `barn-lucka-01` … `barn-lucka-24`. Ingen ombyggnad behövs när en bild läggs dit.

Flytta till adventdeckare.se: sätt `BARN=1` i huvudsajtens `.env` och bygg om. Då finns `/barn` där, och paketet går att köpa.
