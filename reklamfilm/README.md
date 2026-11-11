# Reklamfilm – Mordet på Klovskär

En 29 sekunder lång film för sociala medier, byggd med [Remotion](https://www.remotion.dev).
Den använder bara publika bilder från spelet (omslag, hotellet, telegrammet i lucka 1, brottsplatsen, de misstänkta och kartan) och avslöjar inget om lösningen.

| Komposition | Format | Till |
| --- | --- | --- |
| `Reklam-9x16` | 1080×1920 | Reels, TikTok, Stories, Shorts |
| `Reklam-4x5` | 1080×1350 | Facebook- och Instagram-flödet |

Texten ligger inom säkra zonen, så att knapparna och bildtexten i TikTok och Reels inte täcker den.

## Scener

1. **Ankomst**: "December 1962 · Isen har lagt sig runt Klovskär."
2. **Telegram**: "Redaren Harald Ekberg hittas död i fyrtornet."
3. **Trappan**: "Färjan går inte. Ingen kan lämna ön."
4. **De sju**: "Sju personer var på ön den natten. En av dem är mördaren."
5. **Luckor**: "24 luckor · En ny varje morgon kl. 06.00 …"
6. **Slut**: omslaget, priset och adventdeckare.se

## Ljud

- **Berättarröst:** `public/ljud/berattare.mp3`, gjord i ElevenLabs (eleven_v4). Scenerna och texterna är tajmade efter pauserna i den. Den börjar `RÖST_START` bildrutor in i filmen (se `src/Reklamfilm.tsx`). Om du byter röstfil måste `SCENER` och textrutornas `fran` justeras efter de nya pauserna. Kommersiell användning kräver en betald ElevenLabs-plan.
- **Bakgrund:** vind, hav, klocka och prassel från spelets egna CC0-ljud (se `../public/ljud/KALLOR.md`), nedtonade under rösten.

## Kör

```bash
npm i
npm run dev                                   # Remotion Studio: förhandsvisa och redigera
npx remotion render Reklam-9x16 out/Reklam-9x16.mp4 --crf=18
npx remotion render Reklam-4x5 out/Reklam-4x5.mp4 --crf=18
```

Pristexten och webbadressen är props (`pris`, `webb` i `src/Root.tsx`), så de kan ändras i Studio eller med `--props`, till exempel när introduktionspriset tar slut:

```bash
npx remotion render Reklam-9x16 out/ordinarie.mp4 --props='{"pris":"199 kr per lag","webb":"adventdeckare.se"}'
```

Typsnitten (DM Serif Display, Special Elite och Source Serif 4, alla med SIL OFL) ligger i `public/typsnitt`, så renderingen fungerar utan nät.
