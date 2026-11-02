import "server-only";
import type { Avsnitt, Bild } from "./typer";

// HEMLIGT: svaren finns bara här och jämförs på servern.

export type Gata =
  | { typ: "caesar"; chiffer: string; ledtrad: string }
  | { typ: "morse"; morse: string; ledtrad: string }
  | { typ: "anagram"; bokstaver: string; ledtrad: string }
  | { typ: "koordinat"; ledtrad: string }
  | { typ: "flaggor"; flaggor: string[]; ledtrad: string }
  | { typ: "siffror"; ledtrad: string };

export interface Bonus {
  nr: number;
  titel: string;
  /** Chiffret syns när denna lucka är öppen. */
  synsFran: number;
  gata: Gata;
  /** Godkända svar efter normalisering (versaler, inga mellanslag). */
  svar: string[];
  bilder: Bild[];
  ingress: string;
  avsnitt: Avsnitt[];
}

/** Versaler, utan mellanslag och skiljetecken. Å/Ä/Ö behålls. */
export function normaliseraSvar(s: string): string {
  return s.toUpperCase().replace(/[^A-ZÅÄÖ0-9]/g, "");
}

export function arRattSvar(b: Bonus, gissning: string): boolean {
  const g = normaliseraSvar(gissning);
  return g.length > 0 && b.svar.includes(g);
}

export const BONUS: Bonus[] = [
  {
    nr: 1,
    titel: "Besättningslistan",
    synsFran: 7,
    gata: {
      typ: "caesar",
      chiffer: "VYDQKLOG",
      ledtrad: "Skrivet med blyerts på baksidan av Holms tidningsurklipp. Varje bokstav har flyttats tre steg framåt i alfabetet. Det svenska alfabetet tar slut vid Z här – Å, Ä och Ö används inte.",
    },
    svar: ["SVANHILD"],
    bilder: [{ namn: "bonus-1", alt: "En maskinskriven besättningslista för M/S Svanhild där raden Lars Holm, däcksman, 19 år är inringad med blyerts. Längst ner en handskriven rad: Skrovet rostigt – åtgärdas EJ före resan. H.E." }],
    ingress: "Ordet öppnade en låda i Holms byrå. Den här listan låg överst.",
    avsnitt: [
      {
        format: "dokument",
        rubrik: "Rederi AB Ekberg – M/S Svanhild, besättning november 1954",
        text: `Nils Ottosson, befälhavare
Gustav Ek, styrman
Ragnar Lind, maskinist
**Lars Holm, däcksman, 19 år** *(inringad)*
Erik Sjöberg, kock
Olof Persson, matros

Längst ner, med bläck: *"Skrovet rostigt – åtgärdas EJ före resan. H.E."*`,
      },
      {
        format: "anteckningsbok",
        rubrik: "Bertils bevis",
        text: `H.E. är Harald Ekberg. Han visste att skrovet var rostigt och lät fartyget gå ändå. Fyra man dog, bland dem en nittonåring från Klovskär.

Holm har haft den här listan i åtta år. Han fick den av maskinisten Lind, som överlevde. Han har aldrig visat den för någon.

– Jag tänkte ge den till journalisten, sa han när jag frågade. När allt var klart. Det var det enda jag tänkte göra.

Det är ett starkt motiv. Det är också ett motiv som har funnits i åtta år utan att något hänt. Varför skulle Holm vänta till just den här natten?`,
      },
    ],
  },
  {
    nr: 2,
    titel: "Kommissariens dagbok",
    synsFran: 10,
    gata: {
      typ: "morse",
      morse: ".-.. -.-- -.- - .-",
      ledtrad: "Natten mot den 10 december blinkade ett ljus i fönstret i Holms stuga, om och om igen. Kort och långt. Mellan orden en längre paus.",
    },
    svar: ["LYKTA"],
    bilder: [{ namn: "bonus-2", alt: "En uppslagen läderinbunden dagbok med en pressad viol och prydlig handstil: Alla ljuger. Frågan är vem som ljuger om rätt sak." }],
    ingress: "Mina privata anteckningar. Jag brukar inte visa dem för någon.",
    avsnitt: [
      {
        format: "anteckningsbok",
        rubrik: "Dagbok, G. Sandahl",
        text: `*10 december.*

Alla ljuger. Frågan är vem som ljuger om rätt sak.

Fru Ekberg ljuger om sitt äktenskap, men det har hon gjort i trettiofem år och det är inte mitt bord. Carl ljuger om var han var. Doktorn ljuger om något han är rädd för. Journalisten ljuger om varför han är här. Fröken Varg ljuger nog inte alls, och det gör henne farligast att tro på.

Fyrvaktaren? För uppenbart.

Holm lyste med sin lykta ut över isen i natt. Jag frågade honom i morse varför. Han sa att han lärde sig morse till sjöss och att han ibland "pratar med Lars". Jag skäms att jag frågade.

Husfrun lade en extra filt på min säng i kväll utan att jag bett om det. Hon vet vad alla behöver innan de vet det själva. Hon har nycklar till varenda dörr i huset.

Jag sover dåligt här. Det är för tyst när fyren inte blinkar.`,
      },
    ],
  },
  {
    nr: 3,
    titel: "Testamentets andra sida",
    synsFran: 13,
    gata: {
      typ: "anagram",
      bokstaver: "CUALI",
      ledtrad: "Bokstäverna stod skrivna på kuvertet som testamentet låg i, i Haralds handstil. Han skulle avslöja något just den dagen.",
    },
    svar: ["LUCIA"],
    bilder: [{ namn: "bonus-3", alt: "Testamentets andra sida med en kraftigt överstruken rad om att faderskapet ska bekräftas och initialerna S.A. och ett frågetecken i marginalen." }],
    ingress: "Utkastet hade en andra sida. Den låg för sig själv i kuvertet.",
    avsnitt: [
      {
        format: "dokument",
        rubrik: "Testamentet, sida 2",
        text: `… och detta under förutsättning att ~~faderskapet bekräftas av läkare före undertecknandet~~.

I marginalen, med blyerts: **S.A. ?**`,
      },
      {
        format: "anteckningsbok",
        rubrik: "S.A.",
        text: `S.A. – Sven Ahlgren. Harald ville ha doktorns ord på att Elsa var hans dotter innan han gav henne allt.

Raden är struken med så hårda tag att pennan gått igenom papperet. Någon var arg när den ströks. Harald själv, tror jag.

Om resultatet bekräftade faderskapet hade han inte behövt stryka villkoret i vredesmod. Han hade bara skrivit under.`,
      },
    ],
  },
  {
    nr: 4,
    titel: "Sjökortet",
    synsFran: 15,
    gata: {
      typ: "koordinat",
      ledtrad: "Carls sjökort har ett rutnät i blyerts. Han har ringat in rutan E5. Vilken ö ligger där? Titta på kartan över Klovskär – ön på isen i sydost.",
    },
    svar: ["KRÅKSKÄR", "KRAKSKAR"],
    bilder: [{ namn: "bonus-4", alt: "Ett gammalt sjökort med djupsiffror i vattnet och en blyertsritad streckad led från sjöboden på Klovskär till ön Kråkskär, markerad med ett kryss." }],
    ingress: "Sjökortet låg hoprullat i sparkens låda i sjöboden.",
    avsnitt: [
      {
        format: "anteckningsbok",
        rubrik: "Smugglarleden",
        text: `Carl har ritat sin väg över isen med blyerts. Från sjöbodens brygga rakt söderut, förbi grundet vid 4 meter, till den västra udden på Kråkskär. Ett kryss där lådorna läggs.

I marginalen tre datum: 16/11, 23/11, 30/11. Varje fredag.

Leden är en dryg kilometer. Med lastad spark en halvtimme. Från Kråkskär syns fyrtornet tydligt, men inte tornets dörr – den ligger på andra sidan klippan.

Carl kan inte ha varit vid tornet kl. 22.52 och vid Kråkskär kl. 22.50. Smugglarens lapp, sjökortet och spåren berättar samma sak.

Carl Ekberg är en smugglare och en dålig son. Men han är ingen mördare.`,
      },
    ],
  },
  {
    nr: 5,
    titel: "Margits receptbok",
    synsFran: 18,
    gata: {
      typ: "flaggor",
      flaggor: ["S", "A", "F", "F", "R", "A", "N"],
      ledtrad: "Holm hissade sju signalflaggor på flaggstången vid stugan i morse. Han säger att det är det enda ordet på ön som luktar jul. Signalflaggorna är de internationella.",
    },
    svar: ["SAFFRAN"],
    bilder: [{ namn: "bonus-5", alt: "En gammal receptbok uppslagen på Lussekatter med saffran på ett papper, en mjölig kavel och nybakade lussekatter." }],
    ingress: "Margit lånade ut sin receptbok till mig när jag frågade. Hon verkade glad att någon ville ha den.",
    avsnitt: [
      {
        format: "dokument",
        rubrik: "Lussekatter (Hotell Fyrbåken), ca 30 st.",
        text: `**Degen**
- 1 g saffran
- 1 sockerbit (att stöta saffranet med)
- 150 g smör
- 5 dl mjölk
- 50 g jäst (för söta degar)
- 1 ½ dl socker
- ½ tsk salt
- 1 ägg
- ca 14–15 dl vetemjöl

**Till garnering**
- russin
- 1 ägg till pensling

**Gör så här**
1. Stöt saffranet med sockerbiten i en mortel.
2. Smält smöret, häll i mjölken och värm till 37 grader – fingervarmt.
3. Smula jästen i en bunke och rör ut den med lite av mjölkblandningen. Häll i resten av vätskan, saffran, socker, salt och ägg.
4. Arbeta in mjölet lite i taget tills degen släpper bunkens kanter. Knåda länge, gärna tio minuter.
5. Låt jäsa under bakduk i 40 minuter.
6. Dela degen i ca 30 bitar, rulla längder och forma till S. Tryck ett russin i varje ögla.
7. Låt jäsa på plåt under bakduk i 30 minuter till.
8. Pensla med uppvispat ägg. Grädda mitt i ugnen i 225 grader, 5–8 minuter.

*Margits egen rad längst ner:* "Dubbel sats till Lucia. Herr E. vill ha sin toddy kvart över tio, så sätt degen före."`,
      },
    ],
  },
  {
    nr: 6,
    titel: "Fyrtornet i genomskärning",
    synsFran: 21,
    gata: {
      typ: "siffror",
      ledtrad: "När störde ljuset? Fyra siffror.",
    },
    svar: ["2252"],
    bilder: [{ namn: "bonus-6", alt: "En teknisk ritning av fyrtornet i genomskärning med etiketter för Lyktrummet, Urverket, Spiraltrappan och Ingång." }],
    ingress: "Lotsverkets ritning av tornet, som Holm hade i en rulle under sängen.",
    avsnitt: [
      {
        format: "dokument",
        rubrik: "Lotsverket – Klovskärs fyr, beskrivning",
        text: `**Lyktrummet:** gasljus (AGA) med roterande lins. Tänds och släcks av solventil. Synvidd 14 distansminuter.

**Urverket:** driver linsens rotation med ett lod som vevas upp en gång per kväll och räcker natten ut. Om urverket stannar står linsen still och fyren slutar blinka och lyser fast, tills urverket startas igen. Urverket nås från avsatsen under lyktrummet.

**Spiraltrappan:** gjutjärn, 34 steg, utan räcke mot mitten. Öppningen i mitten går ända ner.

**Ingång:** ekdörr med lås. Två nycklar (ombytt lås okt. 1962).`,
      },
      {
        format: "anteckningsbok",
        rubrik: "22.52",
        text: `Den som faller mot urverket från avsatsen stannar linsen. Fyren lyser fast i några sekunder i stället för att blinka. Från fyrvaktarstugan ser det ut som om ljuset "stör till".

Holm skrev det i loggen. Carl såg det från Kråkskär. Smugglaren svor åt det.

Det är den enda tiden den natten som ingen har kunnat ställa om.`,
      },
    ],
  },
];

export const bonusNr = (nr: number) => BONUS.find((b) => b.nr === nr);
