# Beslut – Mordet på Klovskär

Beslut från genomgången av byggprompten 2026-11-02. Där detta krockar med
byggprompten gäller detta dokument.

## Tidsplan
- **Allt** ska vara klart och testat före 1 december 2026 – spelet ska säljas.
- Testläge och `/admin` byggs tidigt så att hela december kan spelas igenom i förväg.

## Stack och drift (avviker från prompten)
- **Next.js 16** (App Router, TS, Tailwind), inte 14.
- `node:24-alpine` (Node 20 är EOL).
- **Ingen Caddy.** Appen går direkt på port via Cloudflare Tunnel (`adventdeckare.se` → `192.168.0.155:PORT`; `adventdeckare.alexcloud.se` ligger kvar som alias tills Stripe-webhooken bytts).
- Registreras i dashboard2 (`GAMES` i `src/constants.ts`) + spelarkivet, inte `apps.json`.
- Favicon, OG-taggar, cache-headers enligt CLAUDE.md.
- **SQLite** (`better-sqlite3@^12`) på namngiven volym (`klovskar_data`), inte Directus.
  Skäl: lagkoder = lösenord, köpares e-post = personuppgifter, delade Directus-policyn
  får inte kunna läcka dem, och spelet ska inte stå still om Directus går ner.
  Volymen läggs in i `~/backup/backup.sh`. Directus används bara för OG/hero-bild.
- "Setup-skript för Directus" ersätts av en SQLite-schemamigrering vid start.

## Hemlighetsskydd
- `import "server-only"` i `content/luckor.ts`, `content/facit.ts`, `content/bonus.ts` och DB-lagret.
- Efterbyggtest som söker i `.next/static` efter facit- och bonussträngar och fallerar bygget vid träff.
- Lucka-, bild- och ljudfiler serveras endast via `/api/bild/[namn]` / `/api/ljud/[namn]` med datumkontroll.

## Försäljning
- Privatpersoner köper. **Introduktionspris 99 kr per lag** (ord. 199 kr, max 5 spelare). Pris i `PRIS_KR` + Stripe.
- **Stripe Payment Link + webhook** → engångs-aktiveringskod på tacksidan + mejl via Brevo.
- Både **testläge och skarpt läge**: `STRIPE_LAGE=test|live`, två nyckelpar i `.env`.
  Testläge visar banderoll "TESTLÄGE – inga riktiga pengar" över hela sajten.
- `/admin` kan skapa gratiskoder och visar intäktssummering per år.
- **Presentkort:** samma köp, mejlet innehåller presentkort (bild/PDF) med koden.
- Säljare = privatperson tills vidare: `SALJARE_NAMN`, `SALJARE_EPOST` i `.env`.
- Ångerrätt: obligatorisk kryssruta om direkt leverans. Policy: pengarna tillbaka om ingen lucka öppnats.
- Sidor `/villkor` och `/integritet`. Köpar-e-post och speldata raderas 12 mån efter lagets sista lucka.

## Landningssida
- `/` = säljsida: hero (omslag), "Så funkar det", gratis smakprov (lucka 1 + 2 alltid publika),
  vanliga frågor (sent köp, januari, 12+, antal spelare), presentkort, sidfot med säljare/villkor.
- Spelet ligger under `/lag/...`.

## Startdatum per lag
- Varje lag har `startdatum` (förval 1 dec). Lucka N öppnas startdatum + (N−1) dagar kl. 06.00 Europe/Stockholm.
- Val vid lagskapande: "Följ adventskalendern" eller "Eget startdatum".
- Sent köp i adventsläge → varning före köp om hur många luckor som öppnas direkt.
- I spelet visas "Dag 7 · 7 december 1962" oavsett verkligt datum.
- `/admin` kan tidsförskjuta ett enskilt testlag. `TESTLAGE_DATUM` finns kvar globalt för tester.

## Spelare och lagledare
- Personlig återinloggningslänk (`/in/<token>`) under "Min profil", fungerar på flera enheter.
- Namnövertagning: lagkod + befintligt namn → annan spelare (eller lagledaren) godkänner.
- **Lagledare = köparen** via lagledarlänk i köpmejlet: byta startdatum (före första luckan),
  ta bort spelare, byta lagkod, godkänna övertagningar, lämna in anklagelsen.
- **Anklagelsen:** alla redigerar utkastet, **bara lagledaren lämnar in** (kan ge rätten vidare).
  Har ingen lämnat in 12 h efter att lucka 24 öppnats får alla rätt.

## Texterna och gåtans rättvisa
- Jag skriver alla texter; story bible gäller vid konflikt.
- Margits alibi 23.47: Ingrid och doktorn gick ner till köket strax före halv tolv – förankras i lucka 16 och 18.
- Bonus 6 (2252) är medvetet en belöning snarare än en ny ledtråd.
- Varje nyckelsiffra (22.52, 23.47, O, AB, 22.50) står **även i text/transkription**, inte bara i bild.
- **Blindtest:** separat agent får bara lucka 1–23 och ska lösa fallet; justera om det är för lätt/svårt.
- Granskning i `/admin` + kompisgrupp på testlag med tidigt startdatum.

## Bilder
- Källa: 33 Gemini-bilder i `~/apps/filsamlare/uploads` (2026-11-02 00.46–00.49), 32 unika
  (`…livdml….jpg` och `… (1).jpg` är identiska). Kopieras till `bilder/`, originalen orörda.
- `Gemini_Generated_Image_8a05l68a05l68a05.jpg` är en **menybild**.
- Menybilder döps `meny-kalender`, `meny-tavla`, `meny-misstankta`, `meny-karta`,
  `meny-matare`, `meny-laget`, `meny-anklagelse`. Menyn = rutnät av bildkort.
- Användaren gör om saknade/felaktiga bilder själv i Gemini. Efter steg 0 levereras en
  **Artifact** med rapporten och en färdig prompt per saknad/felaktig bild. Platshållare tills dess.

## Ljud
- Stämningsljud + prassel när en lucka öppnas. **Av som standard**, knapp i toppen (sparas i localStorage).
  Ingen ledtråd får hänga på ljud.
- Sju loopar (vind, inne, brasa, kök, klocka, hav, is) från Freesound, alla CC0 – se `public/ljud/KALLOR.md`.
  Bearbetas med `scripts/bygg-ljud.sh`. Lucka → stämning i `content/ljud.ts` (publikt, avslöjar inget).
- Web Audio (inte `<audio loop>`) så skarven blir ljudlös. Pausas när fliken döljs.
- Röster väntar tills spelet är testat (kräver betald ElevenLabs för kommersiellt bruk).

## Notiser
- Web push med VAPID (`web-push`), opt-in under "Laget", guide för iPhone-hemskärm.
- Schemalagt jobb varje dag 06.00 som går igenom alla lag (startdatum varierar).
- Teaser-text per lucka i `content/luckor.ts`, utan spoilers.
- Valfri morgonmejl till lagledaren via Brevo.
- Byggs sist men före 1 december.

---

# Val under bygget

## Drift
- Port **3131** (första lediga). Container `klovskar-app-1`, volym `klovskar_klovskar_data` (inlagd i `~/backup/backup.sh`).
- Dockerfile i två steg: bygget kräver devDependencies (TypeScript, Tailwind), körsteget bara produktionsberoenden. `npm start` = `next start`.
- `bilder/` monteras read-only i containern – en utbytt bild slår igenom utan ombyggnad (skalade webp-versioner cachas med filens mtime i nyckeln).
- npm 11 blockerar installationsskript som standard: `better-sqlite3` och `sharp` är godkända i `allowScripts` i package.json.

## Säkerhet och datumlås
- **Ingen `next/image`.** Dess optimerare cachar per URL för alla besökare och skulle kunna servera en låst bild. Alla bilder går via `/api/bild/[namn]`, som kontrollerar luckan för lagets kaka. Låsta bilder får `Cache-Control: private` och 404 – samma svar oavsett om filen finns.
- Publika bilder: omslag, hotellet-dag, koket, karta, misstankta, brottsplats, lucka-01 (smakprov) och `meny-*`.
- **Signalflaggorna i bonus 5 ritas på servern.** Skickades bokstäverna som data till gåt-komponenten skulle svaret synas i sidkällan.
- Läckkoll efter varje bygge (`scripts/kolla-lackor.mjs`): söker i `.next/static`, förrenderade sidor och `public/` efter facit-, bonus- och sena luckfraser. Bygget fallerar vid träff. Verifierat att den slår larm.
- Tokens (spelare, lagledare) lagras i klartext i SQLite. Filen har ingen nätverksyta, och klartext krävs för att profilsidan ska kunna visa den personliga inloggningslänken.
- Testklocka per lag (`forskjutning_min`) i `/admin` – påverkar bara det laget. `TESTLAGE_DATUM` finns kvar för hela servern och är av när variabeln är tom.

## Köp
- **Stripe Checkout-session i stället för Payment Link.** Samma kundupplevelse, men priset tas från `PRIS_KR` och ångerrättskryssen ligger på vår egen sida före betalningen. Inget att konfigurera i Stripe utöver nycklar och webhook.
- Koden skapas idempotent både av webhooken och av tacksidan (som hämtar sessionen från Stripe), så köparen får sin kod även om webhooken är sen.
- Återbetalning i Stripe (`charge.refunded`) spärrar koden om den inte använts.
- Presentkort: HTML-mejl + sida `/presentkort/[kod]` att skriva ut eller skicka. Ingen PNG/PDF (Alpine saknar typsnitt för att rendera text i bild).

## Spelet
- **Motiv och metod är enkelval** (radioknappar) i anklagelsen, med fritext för motivet. Med flerval kunde ett lag kryssa i allt och få full pott.
- Poäng: mördare 5, motiv 3, metod 3, tid 22.40–23.05 2, bonus 1/st. Max 19.
- Alla kan redigera utkastet (sparas automatiskt, synkas var 8:e sekund). Lagledaren lämnar in; kan ge rätten till andra; alla får rätten 12 h efter lucka 24.
- Kommentarer och anslagstavla synkas med polling var 10:e sekund (ingen websocket).
- Röster: en per spelare och speldag, ändringsbar samma dag.
- Notiser: web push (VAPID) + valfritt morgonmejl till lagledaren. Schemajobbet körs varje minut i `instrumentation.ts` och skickar bara för luckor som öppnat de senaste tre timmarna – aldrig en hög vid ikappläsning.
- Pusslet (lucka 6) blandas med fast frö så att server och klient ritar samma ordning; ingen bit börjar på rätt plats.

## Gåtan
- Margits skostorlek anges inte; lucka 22 utesluter fru Ekberg (36) och fröken Varg (39), så spelaren får dra slutsatsen.
- Tornets dörr: Harald bytte lås i oktober, två nycklar (hans + husfruns). Löser varför fyrvaktaren inte har nyckel till sin egen fyr.
- Margit "hittade" kroppen kl. 07.10 och låste upp med sin nyckel (lucka 3) – en tidig, oskyldigt formulerad ledtråd.
- Bonusbilderna 2 och 5 hade för tydliga avslöjanden i bild (saffran i tornet, "tornet 22.45"). Rättningspromptar levererade; bonus 5:s text har en mild ledtråd (toddyn kl. tio).

## Tillgång och serie (2026-11-02)
- Spelet är **Adventsmysteriet 2026**. Nästa år kommer ett nytt fall; gamla fall kan säljas året runt.
- Köparen **behåller spelet**: "så länge spelet finns, och minst till och med 31 december 2027" (privatperson kan inte lova för alltid).
- Ingen spärr och ingen lagradering. `lib/gallring.ts` tar bara bort e-post (lagledare + köpare) 13 månader efter lucka 24; körs varje timme med riktig tid.


## Efter granskningen (2026-11-02)
- Bevisläckor täppta: tornet hänglåst av Sandahl från 1 dec och Margit gick aldrig upp (lucka 3, 22); galleridörren regelad inifrån (3, 5); fickuret stoppas av en glasskärva, kronan visar bara att visarna vridits (23).
- Margit visste dagen innan: Elsa hörde gräl och gråt i köket 29/11 (lucka 11, facit).
- Sandahls slutsatser i 20–23 ligger i `Avsnitt.tanke` och visas bakom "Sandahls tanke".
- Spelinstruktion (`components/SaSpelarNi.tsx`) på välkomstsidan och i lucka 1.
- Facit visar fallpoäng (av 13) och chiffer (av 6) var för sig, plus lagets egen motivtext. Metodvalet "Gift" heter "Han dog av giftet".
- Veronal 0,25 g/tablett (10 st = 2,5 g, inte dödligt); fyren luktar gas (AGA), inte fotogen.

## Uppgifter i luckorna (2026-11-10)
Lucka 5 (hitta 22.52 i loggboken), 12 (räkna 2,5 g Veronal), 20 (blodgrupper ett barn till en O-far kan ha) och 23 (ställ fickuret på 22.52). De bekräftar fakta laget redan har fått, men pekar aldrig ut mördaren, eftersom blindtestet visade att fallet redan är lätt. Svaren ligger i `content/luckor.ts` och skickas till klienten först när luckan är öppen. Klarmarkeringen sparas per enhet i localStorage, som pusslet i lucka 6.
