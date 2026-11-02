import "server-only";

// HEMLIGT: lösningen. Skickas bara till ett lag som lämnat in och passerat lucka 24.

export const MORDARE = "margit";
export const RATT_MOTIV = "hemlighet";
export const RATT_METOD = "somnmedel";
/** Mordtid inom 22.40–23.05 ger poäng (minuter efter midnatt). */
export const TID_FRAN = 22 * 60 + 40;
export const TID_TILL = 23 * 60 + 5;

export const FACIT_STEG: { rubrik: string; text: string }[] = [
  {
    rubrik: "Det var husfrun",
    text: `Margit Lund dödade Harald Ekberg strax före klockan 22.52 den 30 november 1962.

Hon stod vid fönstret med nyckelknippan i handen när jag sa det. Hon försökte inte förneka något. Hon frågade bara om fröken Varg måste vara kvar i rummet.`,
  },
  {
    rubrik: "Varför",
    text: `Våren 1935 blev Margit, då tjugofyra år, med barn. Fadern var en sjöman som försvann med sitt fartyg innan hon hann berätta. Hon hade varit Haralds älskarinna i ett halvår och lät honom tro att barnet var hans.

I tjugosju år betalade Harald tjugofem kronor i månaden till M.L. Margit skickade pengarna vidare till fosterfamiljen Varg. Hon såg sin dotter växa upp på avstånd och sa aldrig ett ord.

Ingrid anade en affär redan 1934, men visste aldrig att det fanns ett barn.

Sedan bjöd Harald hit Elsa och började tala om ett nytt testamente. Han ville ha det säkert och bad doktorn blodgruppera henne. Den 28 november kom svaret: Elsa har AB. Harald har O. En far med O kan aldrig få ett barn med AB.

Harald förstod att han blivit lurad i tjugosju år. Samma kväll sa han till Margit att betalningarna var slut och att han visste. På Luciadagen tänkte han stryka Elsa ur testamentet och avslöja inför alla vem som ljugit. Elsa skulle få veta allt på det värsta tänkbara sättet. Margit skulle förlora sin plats, sitt hem och sin dotter samtidigt.

Margit dödade honom för att skydda en hemlighet.`,
  },
  {
    rubrik: "Hur",
    text: `Under middagen stod doktorns väska i hallen. Margit gick förbi den med fat och kappor. Hon tog tio tabletter Veronal.

Kvart över tio bar hon in herr Ekbergs kvällstoddy till biblioteket, som hon gjort varje kväll i tio år. Hon hade rört ner tabletterna i den.

Elsa kom in och grälet började. När Elsa sprang därifrån tjugo i elva var Harald redan ostadig. Han tog glaset och gick mot tornet, som han alltid gjorde, för att se ljuset innan han sov.

Han ställde glaset på tredje trappsteget och tog sig upp till urverket för att veva det, som varje kväll. Margit gick efter från köksdörren längs grusgången – det var hennes steg och hennes nyckelknippa journalisten hörde under fönstret. Uppe på avsatsen, där Harald stod och svajade, tog hon honom i kragen och knuffade.

Han föll mot urverket. Linsen stannade och ljuset störde till – 22.52. Sedan föll han genom trappans öppna mitt, nästan hela vägen ner.`,
  },
  {
    rubrik: "Den falska tiden",
    text: `Margit gick ner förbi honom. Hon drog ut kronan på hans fickur, vred visarna fram till 23.47 och slog sönder glaset mot stengolvet. Hon låste tornet efter sig och gick tillbaka till köket.

Hon visste att fru Ekberg går ner efter varm mjölk när hon inte kan sova – mjölken stod redan varm på spisen – och att doktorn vill ha is till sin konjak. Kvart i tolv satt hon i köket med två vittnen och sa: "Nu är den kvart i tolv."

På lördagsmorgonen gick hon upp för att putsa mässingen, som alltid, låste upp och "hittade" honom.`,
  },
  {
    rubrik: "Det hon inte tänkte på",
    text: `Hon hade knådat saffransdeg hela kvällen. När hon tog Harald i kragen fastnade gult mjöl i den. Hennes sko lämnade ett avtryck i mjöl på avsatsen vid urverket.

Hon tänkte inte på fyrvaktarens loggbok. Bertil Holm skriver när något händer – och den natten hände något klockan 22.52. Han trodde att det var redaren som var klumpig med urverket.

Hon tänkte inte heller på att en urmakare kan se om ett ur stannat av sig självt.

Och hon glömde att det bara fanns två nycklar till tornet. Den ena låg i Haralds ficka.`,
  },
  {
    rubrik: "De andra",
    text: `**Bertil Holm** satt vid sitt fönster och förde loggbok, precis som han sa. Han hade ingen nyckel till tornet. Hans hat mot redaren var äkta, men han ville se honom avslöjad, inte död.

**Carl Ekberg** stod på isen vid Kråkskär och räknade pengar med en polsk smugglare kl. 22.50. Han har betalat sin skuld. Tullen får veta resten.

**Ingrid Ekberg** köpte råttgift mot råttor. Ingen dog av arsenik; Harald hade Veronal i blodet. Asken står i källaren, nästan full.

**Johan Strand** stal papper, inte liv. Hans artikel om Svanhild publiceras i januari.

**Doktor Ahlgren** ljög om Veronalet för att rädda sitt rykte och sa ingenting om blodgruppen av lojalitet med en död man.

**Elsa Varg** gick från biblioteket tjugo i elva och visste ingenting. Hon fick veta allt på julafton.`,
  },
  {
    rubrik: "Efteråt",
    text: `Isen släppte på juldagen. Margit Lund gick ombord på färjan mellan två konstaplar från Strömstad.

Elsa Varg följde med ner till bryggan. Hon sa inget. När färjan lade ut lyfte hon handen, och Margit lyfte sin.

Jag vet inte om det var förlåtelse. Jag tror att det var början på ett samtal som borde ha börjat 1935.

Fyren på Klovskär blinkar som vanligt.

*G. Sandahl, kriminalkommissarie*`,
  },
];

export interface Ledtrad { text: string; lucka: number; bonus?: boolean }

export const NYCKELLEDTRADAR: Ledtrad[] = [
  { text: "Margit bar in Haralds kvällstoddy kvart över tio, som varje kväll.", lucka: 3 },
  { text: "Margit hittade Harald och låste upp tornet med sin egen nyckel.", lucka: 3 },
  { text: "Fyrens loggbok: \"22.52 Ljuset störde till\".", lucka: 5 },
  { text: "Haralds brev: någon har ljugit för honom i tjugosju år.", lucka: 6 },
  { text: "Elsa: Harald svajade när hon gick – han var drogad, inte full.", lucka: 11 },
  { text: "Doktorns väska med Veronal stod i hallen under hela middagen.", lucka: 12 },
  { text: "Toddyglaset innehöll Veronal – och det var Margit som bar in toddyn.", lucka: 12 },
  { text: "Journalisten hörde snabba steg och ett metalliskt ljud på grusgången mot tornet strax efter Harald.", lucka: 14 },
  { text: "Holm såg ljuset stanna strax före elva och trodde att det var redaren vid urverket.", lucka: 5 },
  { text: "Carl såg fyren blinka konstigt strax efter 22.50 vid Kråkskär.", lucka: 15 },
  { text: "Margit hade mjölken varm innan fru Ekberg kom, och sa: \"Nu är den kvart i tolv.\"", lucka: 16 },
  { text: "Harald har blodgrupp O.", lucka: 17 },
  { text: "Doktorn tog Elsas blodgrupp åt Harald och skickade svaret den 28 november.", lucka: 18 },
  { text: "Bara två nycklar till tornet: Haralds och husfruns.", lucka: 19 },
  { text: "Elsa har blodgrupp AB – Harald kan inte vara hennes far.", lucka: 20 },
  { text: "Brevet från M. 1935 och kassaboken med M.L. 25 kr.", lucka: 21 },
  { text: "Saffransmjöl i Haralds krage och ett damskoavtryck i storlek 37–38 i mjöl – husfrun har 38.", lucka: 22 },
  { text: "Urmakaren: fickuret ställdes om för hand till 23.47.", lucka: 23 },
];
