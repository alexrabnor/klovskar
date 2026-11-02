import "server-only";
import type { Lucka } from "./typer";

// HEMLIGT INNEHÅLL. Importeras bara från serverkod. "server-only" får bygget att
// vägra om filen av misstag hamnar i en klientkomponent.
//
// Story bible: Margit Lund dödade Harald ca 22.52 och ställde hans fickur på 23.47.
// Inget i luckorna 1–23 får säga det rakt ut, men allt som behövs för att lista ut det
// ska finnas senast i lucka 23.

export const LUCKOR: Lucka[] = [
  {
    nr: 1,
    titel: "Telegrammet",
    ingress: "Det första jag skickade i land. Isen lade sig natten mot den 30 november och färjan går inte förrän det töar.",
    bilder: [
      { namn: "lucka-01", alt: "Ett gulnat telegram på en snöig fönsterbräda: Harald Ekberg funnen död i fyrtornet, isen stoppar färjan, undertecknat kommissarie G. Sandahl." },
    ],
    avsnitt: [
      {
        format: "telegram",
        rubrik: "Telegram – Klovskär 1 dec 1962 kl 08.40",
        text: `TILL KRIMINALPOLISEN GÖTEBORG STOP
HARALD EKBERG REDARE 64 ÅR FUNNEN DÖD I FYRTORNET KLOVSKÄR KL 0710 STOP
SANNOLIKT FALL I SPIRALTRAPPAN STOP
ISEN STOPPAR FÄRJAN STOP INGEN AV GÄSTERNA KAN LÄMNA ÖN STOP
UNDERTECKNAD BOR PÅ HOTELL FYRBÅKEN ÖVER JUL STOP
BEGÄR UPPDRAG ATT UTREDA PÅ PLATS STOP
SKICKAR MATERIAL DAGLIGEN STOP
KOMMISSARIE G SANDAHL`,
      },
      {
        format: "telegram",
        rubrik: "Svar – Göteborg 1 dec 1962 kl 11.15",
        text: `TILL KOMMISSARIE SANDAHL HOTELL FYRBÅKEN STOP
UPPDRAG BEVILJAT STOP
BEHANDLA SOM OKLAR DÖDSORSAK TILLS VIDARE STOP
RAPPORTERA VARJE MORGON STOP
GOD JUL STOP
KRIMINALINTENDENT NORDH`,
      },
      {
        format: "anteckningsbok",
        rubrik: "Till min assistent",
        text: `Ni får kopior av allt jag hittar, en bunt i taget, varje morgon fram till jul. Läs dem noga. Jag tänker högt i marginalen och har ofta fel.

Ön är stängd, men inte helt. Postbudet Edvin går över isen med spark två gånger i veckan och bär mina brev och prover. Telefonen i hotellets hall fungerar när kabeln vill.

Sju personer var på ön i natt utöver mig själv. Någon av dem vet mer än de säger. Kanske alla.

Harald Ekberg skulle samla familjen på Luciadagen för att läsa upp ett nytt testamente. Nu blir det ingen uppläsning.

Det ser ut som en olycka. Det är just det som stör mig.`,
      },
    ],
    fraga: "Vad tycker ni är märkligt redan nu?",
    teaser: "Lucka 1 är öppen – ett telegram från en ö som isen har stängt.",
  },
  {
    nr: 2,
    titel: "De sju",
    ingress: "Gästlistan, som jag skrev av den ur hotellets liggare, och mina första intryck.",
    bilder: [
      { namn: "misstankta", alt: "Sju svartvita porträtt fästa på en träskiva med namnlappar: Ingrid Ekberg, Carl Ekberg, Elsa Varg, Margit Lund, Bertil Holm, Dr Sven Ahlgren och Johan Strand." },
    ],
    interaktion: "misstankta",
    avsnitt: [
      {
        format: "anteckningsbok",
        rubrik: "Hotell Fyrbåken, natten mot 1 december",
        text: `Hotellet har tolv rum. I natt var fem av dem bebodda: Harald och Ingrid i östra flygeln (skilda sovrum, dörr emellan), Carl i rum 3, fröken Varg i rum 1 – det bästa rummet, med havsutsikt, i östra flygeln intill familjen – doktor Ahlgren i rum 5 och herr Strand i rum 7 längst in i korridoren. Själv bor jag i rum 9.

Husfrun Margit Lund bor i jungfrukammaren bakom köket. Fyrvaktare Holm bor i fyrvaktarstugan, sextio meter från tornet.

Middagen serverades kl. 19.00 i matsalen. Alla utom Holm var där. Harald höll ett kort tal om "förändringar på Luciadagen" och drack ur sitt glas utan att se på någon.

Efter middagen spreds alla. Ingen har ännu kunnat säga exakt var Harald befann sig mellan halv elva och midnatt.

Korten nedan är vad jag vet om var och en. Tryck på ett porträtt.`,
      },
    ],
    fraga: "Vem av de sju skulle ni förhöra först – och varför?",
    teaser: "Lucka 2 är öppen – sju ansikten och sju skäl att ljuga.",
  },
  {
    nr: 3,
    titel: "Fickuret",
    ingress: "Mina anteckningar från tornet, gjorda medan det fortfarande var mörkt ute.",
    bilder: [
      { namn: "lucka-03", alt: "En svart anteckningsbok med blyertstext: Harald Ekberg 64 år, funnen nedanför spiraltrappan kl. 07.10. Fickuret stannat 23.47, glaset krossat. Toddyglas i tornet, nästan tomt. Vem såg honom sist?" },
      { namn: "brottsplats", alt: "Botten av fyrtornets spiraltrappa. Ett fickur med krossat glas visar 23.47, en hand i kavajärm syns i bildkanten och ett välte toddyglas står på trappsteget." },
    ],
    avsnitt: [
      {
        format: "anteckningsbok",
        rubrik: "1 dec. 1962",
        text: `Harald Ekberg, 64 år. Funnen nedanför spiraltrappan i fyrtornet kl. 07.10.

Hittad av husfrun Margit Lund, som går upp och putsar mässingen i lyktrummet varje lördagsmorgon. Det var lördag. Tornets dörr var låst. Hon låste upp med sin nyckel. Hon skrek. Holm hörde det från stugan och kom springande.

Hon gick aldrig uppför trappan, säger hon, och hon rörde honom inte. Holm bekräftar det: hon stod kvar i dörren när han kom.

Kroppen kall och stel. Doktor Ahlgren bedömer att döden inträffat "för minst sex, kanske åtta timmar sedan".

Trappan har inget räcke mot mitten. Han har fallit genom öppningen, nästan hela vägen ner.

Fickuret låg på golvet bredvid honom, kedjan fortfarande fäst i västen. Det har stannat. Visarna står på 23.47. Glaset krossat, som av fallet.

På tredje trappsteget ett toddyglas, nästan tomt och helt. Doft av rom och citron. Han måste ha ställt ifrån sig det när han började gå uppför – man behöver båda händerna i den trappan. Husfrun säger att hon bar in herr Ekbergs kvällstoddy till biblioteket vid kvart över tio, som varje kväll.

Haralds egen tornnyckel låg i hans byxficka.

Fyrens lampa lyste normalt när jag kom upp. Lyktrummet högst upp är varmt och luktar gas och mässingsputs. Dörren ut till galleriet är regelad på insidan.

Innan vi gick lät jag Holm sätta ett hänglås på tornets dörr. Nyckeln bär jag själv. Kavajen hänger i min garderob.

Vem såg honom sist? Ingen vill vara den personen.`,
      },
    ],
    fraga: "Om uret stannade 23.47 – vad tror ni hände då?",
    teaser: "Lucka 3 är öppen – ett fickur har slutat ticka.",
  },
  {
    nr: 4,
    titel: "Kartan",
    ingress: "Jag bad Holm rita av ön åt mig. Han ritar bättre än han pratar.",
    bilder: [
      { namn: "karta", alt: "Handritad karta över Klovskär 1962 med Hotell Fyrbåken, Fyrvaktarstugan, Fyrtornet, Sjöboden, det stängda färjeläget och ön Kråkskär ute på isen." },
    ],
    interaktion: "karta",
    avsnitt: [
      {
        format: "anteckningsbok",
        rubrik: "Ön",
        text: `Klovskär är mindre än jag trodde: man går runt hela ön på tjugo minuter, sommartid. Nu går man på isen.

Hotellet och tornet ligger på var sin klipphöjd med en grusgång emellan. Från hotellets köksdörr till tornets dörr är det nittio steg. Jag räknade.

Fyrvaktarstugan ligger så att Holm ser lyktrummet från sitt köksfönster. Han säger att han alltid sitter där om kvällarna.

Sjöboden nere vid bryggan används av Carl Ekberg "till fisket". Fisket har inte gett något på flera år, enligt husfrun.

Sydost, en dryg kilometer över isen, ligger Kråkskär. Obebott. Holm säger att isen bär en människa men inte en häst. Jag går inte gärna ut på den.

Tryck på platserna på kartan för mina anteckningar om var och en.`,
      },
    ],
    fraga: "Vem kunde ta sig till tornet utan att synas från hotellet?",
    teaser: "Lucka 4 är öppen – en karta över en ö där ingen kan gömma sig.",
  },
  {
    nr: 5,
    titel: "Fyrens dagbok",
    ingress: "Fyrvaktarens loggbok för natten. Holm lämnade den motvilligt.",
    bilder: [
      { namn: "lucka-05", alt: "En öppen loggbok med handskrivna rader för den 30 november 1962, med klockslag i vänsterkanten." },
    ],
    interaktion: "loggbok",
    transkription: `Klovskärs fyr – Dagbok
30 nov. 1962

16.05  Fyren tänd. Sikt god.
       Fast is runt ön.
19.30  Snöbyar från NV. Vind 6 m/s.
21.00  Linsen putsad. Allt i ordning.
22.52  Ljuset störde till
22.54  Lampan går jämnt igen.
23.40  Lugnt. Snöar lätt.

1 dec. 1962
07.10  Hörde skrik från tornet. Gick dit.`,
    avsnitt: [
      {
        format: "anteckningsbok",
        rubrik: "Om Bertil Holm",
        text: `Holm har varit fyrvaktare här i tolv år. Han är en stor, tyst man som pratar med fyren mer än med människor.

Hans son Lars dog när rederiets fartyg M/S Svanhild gick under 1954. Han nämner inte Harald Ekbergs namn. Han säger "redaren".

– Jag satt vid fönstret hela kvällen, sa han. Som jag alltid gör.

– Hela kvällen?

– Fyren ska ha ögon på sig.

Jag frågade varför han inte var på middagen. Han sa att han inte äter vid samma bord som redaren och att det var känt av alla.

Fyren tänds av sig själv vid skymning med en solventil. Linsen vrids av ett urverk som redaren själv vevade upp varje kväll – det var därför han gick upp i tornet. Holm vaktar ljuset från sitt fönster och skriver när något händer eller vädret slår om. Trappan inne i tornet syns inte från stugan.

– Linsen putsar jag utifrån, från galleriet, sa han. Dit kommer man med järnstegen på tornets utsida. Den har redaren inte kunnat låsa.

– Och därifrån kommer man in?

– Nej. Dörren från galleriet in till lyktrummet är regelad på insidan. Det har den alltid varit.

– Strax före elva stannade blinket och lyste fast ett par sekunder, sa han. Jag tänkte att redaren höll på med urverket igen. Han var klumpig med det. Sedan gick det som vanligt.

Loggboken är prydligt förd. Jag har läst den två gånger.

Jag har bett honom att inte lämna ön. Han svarade att det inte går ändå.`,
      },
    ],
    fraga: "Läs loggboken noga. Hittar ni något som borde intressera mig?",
    teaser: "Lucka 5 är öppen – fyrvaktaren skriver bara när något händer.",
  },
  {
    nr: 6,
    titel: "Det sönderrivna brevet",
    ingress: "Haralds kontor har genomsökts av någon under natten. Bitarna låg i papperskorgen.",
    bilder: [
      { namn: "lucka-06", alt: "Ett skrivbord i mörkret med sönderrivna brevbitar som lagts ihop. Bitarna nämner Dec. 1962, mitt nya testamente och Luciadagen." },
    ],
    interaktion: "pussel",
    pussel: [
      "Klovskär 28 nov. 1962",
      "Bäste advokat Hedén,",
      "jag har i dag fått besked",
      "som ändrar allt.",
      "Mitt nya testamente ska",
      "INTE undertecknas som vi sagt.",
      "Jag läser upp min vilja",
      "själv på Luciadagen – inför alla.",
      "Någon i detta hus har ljugit",
      "för mig i tjugosju år.",
      "H. Ekberg",
    ],
    avsnitt: [
      {
        format: "anteckningsbok",
        rubrik: "Kontoret",
        text: `Kontoret ligger vägg i vägg med biblioteket. Någon har dragit ut varenda låda och vänt på pappren. Skrivbordets lås är uppbrutet med något tunt – en kniv eller en hårnål.

Det var ingen rånare. Pengarna i kassaskrinet ligger kvar, 340 kronor.

Den som letade ville ha papper.

I papperskorgen under skrivbordet låg ett brev rivet i elva bitar. Haralds handstil. Det har aldrig skickats – han måste ha ändrat sig och rivit det själv. Han ville säga det med egen mun.

Jag har lagt bitarna på bordet. Hjälp mig att få ordning på dem.

Sedan vill jag att ni funderar på två frågor. Vilket besked fick Harald den 28 november? Och vem har ljugit för honom i tjugosju år?`,
      },
    ],
    fraga: "Vem kan ha ljugit för Harald i tjugosju år?",
    teaser: "Lucka 6 är öppen – elva bitar papper i en papperskorg.",
  },
  {
    nr: 7,
    titel: "M/S Svanhild",
    ingress: "Ett urklipp jag hittade i fyrvaktarstugan, fastnålat på väggen ovanför Holms säng.",
    bilder: [
      { namn: "lucka-07", alt: "Ett gulnat tidningsurklipp från Västkustens Dagblad 14 november 1954 med rubriken M/S Svanhild förlist i storm – fyra döda och en bild av ett fartyg i höga vågor." },
    ],
    avsnitt: [
      {
        format: "tidning",
        rubrik: "Västkustens Dagblad – 14 november 1954",
        text: `**M/S SVANHILD FÖRLIST I STORM – FYRA DÖDA**

*Lastfartyget M/S Svanhild, tillhörande Rederi AB Ekberg i Göteborg, sjönk natten till lördag väster om Måseskär i hård nordvästlig storm. Av besättningens tolv man kunde åtta räddas av lotsbåten från Smögen.*

Fartyget var på väg från Göteborg till Oslo med en last av järnvägsräls. Enligt de överlevande började Svanhild ta in vatten vid niotiden på kvällen. Pumparna klarade inte inflödet.

Bland de omkomna finns däcksmannen Lars Holm, 19 år, från Klovskär, son till fyrvaktaren därstädes.

**Rederiet: "Fartyget var i gott skick"**

Redare Harald Ekberg avvisar alla påståenden om brister i fartygets underhåll.

– Svanhild var besiktigad och i gott skick. Detta är en olycka orsakad av en ovanligt svår storm, säger han till vår tidning.

Sjöförhör hålls i Göteborg i december.`,
      },
      {
        format: "anteckningsbok",
        rubrik: "Min anteckning",
        text: `Sjöförhöret friade rederiet. Holm har skrivit i marginalen med blyerts: *"Han visste."*

Åtta år är lång tid att bära på något sådant. Men varför just nu?`,
      },
    ],
    fraga: "Har Bertil Holm ett motiv? Är det för uppenbart?",
    teaser: "Lucka 7 är öppen – ett gulnat tidningsurklipp från en stormnatt 1954.",
  },
  {
    nr: 8,
    titel: "Apoteket Ugglan",
    ingress: "Ett kvitto som låg i fru Ekbergs handväska. Jag letade inte. Den stod öppen.",
    bilder: [
      { namn: "lucka-08", alt: "Ett apotekskvitto från Apoteket Ugglan i Strömstad 1962 på råttgift (arsenik), signerat I. Ekberg, bredvid ett par svarta damhandskar och ett pärlhalsband." },
    ],
    avsnitt: [
      {
        format: "kvitto",
        rubrik: "Apoteket Ugglan, Strömstad",
        text: `Den 19 nov. 1962

Råttgift (arsenik), 1 ask ........ Kr 4:50

Giftbok förd. Mottaget av: I. Ekberg`,
      },
      {
        format: "forhor",
        rubrik: "Samtal med Ingrid Ekberg, 8 dec. kl. 15.30",
        text: `SANDAHL: Ni köpte arsenik den nittonde november.
INGRID EKBERG: Jag köpte råttgift. Det är skillnad.
SANDAHL: Inte för den som får i sig det.
INGRID EKBERG: Det är råttor i källaren. Det har varit råttor i källaren hela hösten. Fråga vem ni vill.
SANDAHL: Var finns asken nu?
INGRID EKBERG: I källaren, antar jag. Där råttorna är.
(Hon tar av sig handskarna, ett finger i taget.)
INGRID EKBERG: Kommissarien. Min man dog av ett fall. Det säger doktorn.
SANDAHL: Doktorn säger att han dog av fallet. Inte varför han föll.
INGRID EKBERG: Då har ni ett problem. Inte jag.
SANDAHL: Vet ni vad som stod i det nya testamentet?
INGRID EKBERG: Jag vet vad som inte stod där. Mitt namn.`,
      },
    ],
    fraga: "Tror ni på råttorna?",
    teaser: "Lucka 8 är öppen – ett apotekskvitto som någon helst hade sett försvinna.",
  },
  {
    nr: 9,
    titel: "Herr L.",
    ingress: "Hittat i Carl Ekbergs rum, hopknycklat i en jacka. Han hade glömt det.",
    bilder: [
      { namn: "lucka-09", alt: "Ett skrynkligt maskinskrivet brev: Herr Ekberg, ni är skyldig mig 12 000 kronor, jag väntar inte längre än till jul, Herr L. Bredvid ligger spelkort och en full askkopp." },
    ],
    avsnitt: [
      {
        format: "brev",
        rubrik: "Maskinskrivet, utan datum",
        text: `Herr Ekberg.

Ni är skyldig mig 12 000 kronor.

Jag väntar inte längre än till jul.

Herr L.`,
      },
      {
        format: "anteckningsbok",
        rubrik: "Carl",
        text: `12 000 kronor är mer än en fyrvaktare tjänar på ett år.

Jag frågade Carl om brevet. Han skrattade, för högt.

– En kortskuld. Poker i Göteborg. Herr L. är en vän som skämtar.

– Han låter inte som om han skämtar.

– Ni känner inte honom.

Han tände en cigarett innan den förra var slut.

Om Harald hade levt till Luciadagen och strukit Carl ur testamentet hade Carl inte haft en chans att betala. Om Harald dog innan dess ärver Carl enligt det gamla testamentet.

Var var Carl i natt? Han säger att han låg och läste i sitt rum. Hans skor stod i hallen i morse. De var blöta upp till snörningen.`,
      },
    ],
    fraga: "Vem är Herr L.?",
    teaser: "Lucka 9 är öppen – ett hotbrev med en skuld som förfaller till jul.",
  },
  {
    nr: 10,
    titel: "Spåren på isen",
    ingress: "Fotograferat i ficklampsljus i gryningen den 1 december, innan nysnön hann täcka allt.",
    bilder: [
      { namn: "lucka-10", alt: "Fotspår i snön som leder från en röd sjöbod ut över den frusna isen mot en liten ö i mörkret. I ett av spåren ligger en cigarettfimp." },
    ],
    avsnitt: [
      {
        format: "foto",
        rubrik: "Fotografi nr 14 – Sjöboden, 1 dec. kl. 07.50",
        text: `Ett spår av herrkängor, storlek 43 eller 44, går från sjöbodens dörr rakt söderut över isen. Ett annat spår, samma kängor, kommer tillbaka. Det andra spåret ligger ovanpå det första.

I spåret närmast boden: en fimp av märket John Silver. Rökt till hälften.

Spåren går sydost, mot Kråkskär.

Det började snöa lätt strax före midnatt enligt fyrens dagbok. Spåren ut är något mer översnöade än spåren hem.`,
      },
      {
        format: "anteckningsbok",
        rubrik: "Tankar",
        text: `Carl Ekberg röker John Silver. Carl Ekberg har storlek 44. Carl Ekberg hade blöta skor.

Det är nästan för bra. Det brukar betyda att det är sant, eller att någon vill att jag ska tro det.

Men vägen till Kråkskär går rakt bort från fyrtornet. Den som var på isen var inte i tornet samtidigt.

Frågan är när han var var.

Jag har också sett ett ljus i natt, långt ute mot sydost, som blinkade. Det är inte fyren. Fyren blinkar inte så.`,
      },
    ],
    fraga: "Vad gjorde Carl ute på isen mitt i natten?",
    teaser: "Lucka 10 är öppen – två spår över isen, ett ut och ett hem.",
  },
  {
    nr: 11,
    titel: "Förhöret med Elsa",
    ingress: "Fröken Varg grät hela förhöret. Jag tror att det mesta var äkta.",
    bilder: [
      { namn: "lucka-11", alt: "En ung kvinna i svart klänning sitter i en läderfåtölj i hotellets bibliotek med en näsduk i handen. Framför henne står en rullbandspelare." },
    ],
    avsnitt: [
      {
        format: "forhor",
        rubrik: "Förhör med Elsa Varg, 11 dec. kl. 10.00, biblioteket. Inspelat på band.",
        text: `SANDAHL: Ni sjunger på julfesten. Varför just här?
ELSA VARG: För att han bad om mig. Han skrev till min agent i augusti.
SANDAHL: Kände ni honom innan?
ELSA VARG: Nej. Jo. Inte på det sättet.
(Paus.)
ELSA VARG: Harald Ekberg är min far.
SANDAHL: Hur vet ni det?
ELSA VARG: Jag växte upp hos familjen Varg i Majorna. Fosterbarn. Varje månad kom det pengar i ett kuvert utan avsändare. Det gör det fortfarande. Tjugofem kronor. När mamma Varg låg för döden sa hon: "Det är herr Ekberg som betalar för dig. Fråga aldrig varför."
SANDAHL: Och ni frågade ändå.
ELSA VARG: Jag kom hit för att höra honom säga det. En gång.
SANDAHL: Sa han det?
ELSA VARG: Han var snäll de första dagarna. Han gav mig det bästa rummet. Dagen innan hörde jag honom i köket. Han var arg. Husfrun grät. Jag trodde att hon hade tappat något. Jag tänkte inte mer på det.
SANDAHL: Och sedan?
ELSA VARG: Den sista kvällen var han som en annan människa.
SANDAHL: Den trettionde. I biblioteket.
ELSA VARG: Ni vet om det?
SANDAHL: Berätta.
ELSA VARG: Han skrek. Han sa att han hade blivit lurad. Att han inte tänkte betala en öre till. Jag förstod ingenting. Jag sprang därifrån.
SANDAHL: Vilken tid?
ELSA VARG: Jag vet inte. Före elva. Jag låste in mig och grät tills jag somnade.
SANDAHL: Var han vid liv när ni gick?
ELSA VARG: Han stod vid fönstret och höll i sitt glas. Han svajade. Jag trodde att han var full.`,
      },
    ],
    fraga: "Varför skulle Harald säga att han blivit lurad?",
    teaser: "Lucka 11 är öppen – ett förhör inspelat på band.",
  },
  {
    nr: 12,
    titel: "Doktorns väska",
    ingress: "Jag bad doktor Ahlgren tömma sin väska på sängen. Han gjorde det med darrande händer.",
    bilder: [
      { namn: "lucka-12", alt: "En öppen läkarväska på en säng med medicinflaskor, ett stetoskop och ett kort där det står Veronal 10 tabl., överstruket, och saknas! i rött." },
    ],
    avsnitt: [
      {
        format: "inventarie",
        rubrik: "Inventarium, dr S. Ahlgrens läkarväska, 12 dec. 1962",
        text: `Stetoskop, 1 st.
Blodtrycksmätare, 1 st.
Spruta 5 ml med kanyler, 2 st.
Morfin 10 mg/ml, 5 ampuller – stämmer mot journal.
Digitalis, 1 flaska – stämmer.
Kodein, 1 burk – stämmer.
Veronal (barbital) 0,25 g, burk om 20 tabletter – **innehåller 10. Doktorns egen förteckning anger 20.**
Kompresser, bandage, plåster.`,
      },
      {
        format: "forhor",
        rubrik: "Samma dag",
        text: `SANDAHL: Den första december sa ni att ingenting saknades i er väska.
DR AHLGREN: Jag hade inte räknat.
SANDAHL: Ni har räknat nu.
DR AHLGREN: Ja.
SANDAHL: Tio tabletter Veronal. Vad gör tio tabletter med en man på sextiofyra år?
DR AHLGREN: Tre gör honom sömnig. Fem gör honom ostadig på benen. Tio – det beror på.
SANDAHL: Var stod väskan den trettionde?
DR AHLGREN: I hallen. Jag ställde den på bänken när jag gick in till middagen. Jag tog den med mig upp efteråt.
SANDAHL: Hela middagen. I hallen. Där alla gick förbi.
DR AHLGREN: Ja.
SANDAHL: Varför ljög ni för mig?
DR AHLGREN: Jag ljög inte. Jag … jag sa inget.`,
      },
      {
        format: "utlatande",
        rubrik: "Statens kriminaltekniska anstalt – telegram 12 dec.",
        text: `PROV: RESTER UR TODDYGLAS KLOVSKÄR STOP
INNEHÅLLER BARBITAL (VERONAL) I HÖG HALT STOP
MOTSVARAR FLERA TABLETTER STOP`,
      },
    ],
    fraga: "Vem kunde ta tabletterna – och vem visste att väskan stod där?",
    teaser: "Lucka 12 är öppen – doktorn har räknat sina tabletter.",
  },
  {
    nr: 13,
    titel: "Lucia",
    ingress: "Luciadagen. Testamentet skulle ha lästs upp i dag. I stället hittade jag utkastet.",
    bilder: [
      { namn: "lucka-13a", alt: "Ett handskrivet osignerat testamente, Mitt testamente, där Harald Ekberg förordnar att hela hans kvarlåtenskap ska tillfalla Elsa Varg, med en sigillstämpel och lack bredvid." },
      { namn: "lucka-13b", alt: "Husfrun i förkläde serverar lussekatter och kaffe i matsalen i levande ljus, med en adventsljusstake i fönstret och gästerna vid borden." },
    ],
    avsnitt: [
      {
        format: "dokument",
        rubrik: "Utkast, funnet i Haralds bibel i biblioteket",
        text: `**Mitt testamente**

Härmed förordnar jag, Harald Ekberg, att hela min kvarlåtenskap, med undantag av vad lagen tillerkänner min hustru, skall tillfalla

**Elsa Varg**, född 1935 i Göteborg.

Min son Carl Ekberg skall erhålla sin laglott och intet därutöver.

Detta testamente skall tillkännagivas på Luciadagen 1962 i närvaro av familjen.

*Undertecknas:* ________________

(Utkastet är daterat oktober 1962 och osignerat.)`,
      },
      {
        format: "scen",
        rubrik: "Matsalen, 13 dec. kl. 07.00",
        text: `Ingen ville ha Lucia i år. Margit Lund gjorde det ändå.

Hon hade stått i köket sedan fyra. När vi kom ner var matsalen full av ljus och det luktade saffran och kaffe hela vägen upp i trapporna. Hon gick runt med plåten och nyckelknippan slog mot förklädet för varje steg.

– Herr Ekberg ville alltid ha Lucia, sa hon. Varje år. Trettio år.

Fröken Varg tog en lussekatt och åt den inte. Carl åt tre. Fru Ekberg sa tack utan att titta upp.

Jag frågade fröken Varg om testamentet. Hon blev vit.

– Jag visste inte, sa hon. Jag lovar. Jag visste inte.

Om hon visste: varför skulle hon döda honom innan han hann skriva under?

Om hon inte visste: vem visste?`,
      },
    ],
    fraga: "Vinner Elsa på att Harald dör före Lucia – eller förlorar hon?",
    teaser: "Lucka 13 är öppen – Lucia på Klovskär, med saffran och ett osignerat testamente.",
  },
  {
    nr: 14,
    titel: "Journalistens rum",
    ingress: "Jag lät söka igenom rum 7 medan herr Strand var ute på isen och fotograferade.",
    bilder: [
      { namn: "lucka-14", alt: "Ett hotellrum där madrassen är lyft. Under den ligger buntar med dokument märkta Rederi AB Ekberg – konfidentiellt. På skrivbordet står en skrivmaskin, en kamera och ett presskort." },
    ],
    avsnitt: [
      {
        format: "foto",
        rubrik: "Under madrassen",
        text: `Fyra kuvert märkta *Rederi AB Ekberg – Konfidentiellt*. Besiktningsprotokoll för M/S Svanhild 1952–1954. Ett internt PM från maskinchefen till Harald Ekberg, september 1954: "Skrovet bör åtgärdas före vinterns resor."

Papperen kommer från Haralds kontor.`,
      },
      {
        format: "forhor",
        rubrik: "Förhör med Johan Strand, 14 dec.",
        text: `SANDAHL: Ni bröt er in på Haralds kontor.
JOHAN STRAND: Jag lånade några papper som borde ha legat hos sjöförhöret för åtta år sedan.
SANDAHL: Den trettionde. Vilken tid?
JOHAN STRAND: Jag gick in strax efter halv elva, när jag hörde att han satt och grälade i biblioteket. Jag tänkte att han var upptagen.
SANDAHL: Och när han slutade gräla?
JOHAN STRAND: Då kröp jag in under skrivbordet. Jag hörde honom gå förbi i korridoren. Långsamt. Han tog stöd mot väggen.
SANDAHL: Åt vilket håll?
JOHAN STRAND: Mot bakdörren. Mot tornet.
SANDAHL: Ensam?
JOHAN STRAND: Han gick ensam. Men några minuter senare gick någon ute på grusgången under kontorsfönstret, mot tornet. Fort.
SANDAHL: Vem?
JOHAN STRAND: Jag såg inte. Jag låg under ett skrivbord. Jag hörde bara steg i snön. Och ett metalliskt ljud. Det kunde ha varit vad som helst.
SANDAHL: Vilken tid var det?
JOHAN STRAND: Kvart i elva, kanske. Jag stannade kvar och letade till kvart över elva. Sedan gick jag och la mig. Jag har skrivit upp allt. Jag är journalist.`,
      },
    ],
    fraga: "Vem gick efter Harald mot tornet?",
    teaser: "Lucka 14 är öppen – något ligger gömt under en madrass i rum 7.",
  },
  {
    nr: 15,
    titel: "Sjöboden",
    ingress: "Jag gick ner till sjöboden med Holm som vittne och lyfte på presenningen.",
    bilder: [
      { namn: "lucka-15", alt: "Inne i sjöboden: trälådor under en presenning, en fotogenlykta och en lapp fäst på en låda: Mottaget 6 lådor, Kråkskär 30/11 kl. 22.50, Betalt – L." },
    ],
    avsnitt: [
      {
        format: "kvitto",
        rubrik: "Lappen på lådan",
        text: `Mottaget 6 lådor.
Kråkskär 30/11 kl. 22.50
Betalt – L.`,
      },
      {
        format: "forhor",
        rubrik: "Förhör med Carl Ekberg, 15 dec., i sjöboden",
        text: `SANDAHL: Sex lådor polsk sprit. På en ö utan systembolag.
CARL EKBERG: (tänder en cigarett) Okej. Okej. Det är min.
SANDAHL: Berätta om natten mellan trettionde och första.
CARL EKBERG: Lindqvist kommer med båt från Polen till iskanten bortom Kråkskär. Han blinkar med en lampa när han är framme, och lägger lådorna på isen vid skäret. Jag hämtar dem med spark. Jag säljer dem vidare till restauranger i Göteborg. Det betalar skulden.
SANDAHL: Herr L.
CARL EKBERG: Herr L. Han skriver lappen när han har fått betalt. Han skriver alltid klockslaget. Han litar inte på någon.
SANDAHL: Kråkskär 22.50.
CARL EKBERG: Jag gick från boden vid tjugo över tio. Det tar en halvtimme dit med lådor på sparken. Han var sen. Vi stod där och frös och räknade pengar. Jag var tillbaka efter midnatt.
SANDAHL: Har ni några vittnen?
CARL EKBERG: En smugglare från Gdynia och fyren. Den blinkade konstigt en gång, jag tittade upp. Lindqvist svor och sa att någon där borta hade ögonen på oss.
SANDAHL: Vilken tid?
CARL EKBERG: Strax efter att han skrev lappen.`,
      },
    ],
    fraga: "Vad betyder Carls kvitto för hans alibi – och för fyren?",
    teaser: "Lucka 15 är öppen – det ligger något under presenningen i sjöboden.",
  },
  {
    nr: 16,
    titel: "Fru Ekbergs natt",
    ingress: "Andra förhöret med Ingrid Ekberg. Den här gången ville hon prata.",
    bilder: [
      { namn: "lucka-16", alt: "En elegant äldre kvinna i satinpyjamas och pärlhalsband sitter i sängen med en bok och sina glasögon i handen. På nattduksbordet står en väckarklocka som visar ungefär halv elva." },
    ],
    avsnitt: [
      {
        format: "forhor",
        rubrik: "Förhör med Ingrid Ekberg, 16 dec. kl. 11.00",
        text: `INGRID EKBERG: Jag har bestämt mig för att berätta som det var. Det är snart jul.
SANDAHL: Börja vid halv elva.
INGRID EKBERG: Jag låg i sängen och läste. Klockan stod på halv elva när jag hörde honom. Biblioteket ligger under mitt rum. Jag har vetat sedan trettiotalet att min man inte alltid var trogen, kommissarien. Men så där hade han aldrig skrikit. Han skrek på ett sätt jag inte hört sedan trettiotalet.
SANDAHL: Vad skrek han?
INGRID EKBERG: Jag hörde inte allt. "Lurad." "Tjugosju år." "Inte ett öre till." Och en gång, mycket tydligt: "Hon har ljugit för mig från första dagen."
SANDAHL: Hon?
INGRID EKBERG: Jag trodde att han menade flickan. Nu är jag inte säker.
SANDAHL: När slutade det?
INGRID EKBERG: Tjugo i elva. En dörr slog igen, och någon sprang uppför trappan och förbi min dörr. Lätta steg. Unga steg. Sedan blev det tyst.
SANDAHL: Och sedan?
INGRID EKBERG: Jag kunde inte sova. Det kan jag sällan. Vid tjugo över elva gick jag ner till köket efter varm mjölk, som jag brukar. Margit stod vid bordet och knådade lussekattsdeg till första advent. Mjölken stod redan varm på spisen. Hon var röd i ansiktet och sa att köket var varmt.
SANDAHL: Stannade ni?
INGRID EKBERG: Jag satt med mjölken. Doktorn kom ner en stund senare och ville ha is till sin konjak. Vi satt där alla tre. Margit tittade på köksklockan och sa: "Nu är den kvart i tolv, nu får degen vila."
SANDAHL: Gick ni upp sedan?
INGRID EKBERG: Strax efter tolv. Jag såg inte min man igen.`,
      },
    ],
    fraga: "Vem menade Harald med \"hon\"?",
    teaser: "Lucka 16 är öppen – fru Ekberg hörde mer än hon först sa.",
  },
  {
    nr: 17,
    titel: "Inskrivningsboken",
    ingress: "Bland Haralds papper låg hans gamla bok från värnplikten. Jag förstod inte först varför den låg överst.",
    bilder: [
      { namn: "lucka-17", alt: "En gammal militär inskrivningsbok, Bok för värnpliktig, för Harald Ekberg född 1898 vid regemente I 17, med blodgrupp O ifyllt." },
    ],
    avsnitt: [
      {
        format: "dokument",
        rubrik: "Bok för värnpliktig",
        text: `Namn: **Harald Ekberg**
Född: 1898
Regemente: I 17, Uddevalla
Inskriven: 1918
**Blodgrupp: O**

(Blodgruppen är införd med annat bläck, sannolikt i samband med beredskapen 1940.)`,
      },
      {
        format: "anteckningsbok",
        rubrik: "Varför låg den överst?",
        text: `Boken låg i Haralds skrivbordslåda, överst, på ett kuvert från doktor Ahlgrens mottagning på Vasagatan. Kuvertet var tomt.

Någon hade tagit fram den nyligen. Pärmen var dammfri, de andra papperen i lådan var det inte.

Jag har pratat med provinsialläkaren i Strömstad i telefon. Jag frågade honom en enkel sak: kan en far med blodgrupp O få ett barn med vilken blodgrupp som helst?

Han sa nej. Han förklarade det två gånger, långsamt. En far med O kan få barn med O, A eller B. Aldrig AB. Det är en av få saker inom medicinen som han kallade "fullkomligt säker".

Jag vet inte ännu vem som har vilken blodgrupp. Men Harald ville vara säker på sin egen.`,
      },
    ],
    fraga: "Varför skulle Harald behöva veta sin egen blodgrupp?",
    teaser: "Lucka 17 är öppen – en gammal bok från 1918 som någon nyss har tagit fram.",
  },
  {
    nr: 18,
    titel: "Doktorns bekännelse",
    ingress: "Doktor Ahlgren knackade på min dörr klockan två i natt. Han hade druckit, men inte så mycket att han inte visste vad han sa.",
    bilder: [
      { namn: "lucka-18", alt: "En trött läkare med runda glasögon sitter vid ett patiensbord framför en öppen spis med ett glas konjak i handen och huvudet i den andra." },
    ],
    avsnitt: [
      {
        format: "forhor",
        rubrik: "Förhör med dr Sven Ahlgren, natten till 18 dec.",
        text: `DR AHLGREN: Jag har ljugit för er två gånger. Jag tänker inte göra det en tredje.
SANDAHL: Börja med Veronalet.
DR AHLGREN: Jag märkte det på morgonen den första. Tio tabletter borta. Jag förstod direkt. Han hade varit ostadig när han föll, det såg jag på honom. Men om det kommer ut att en läkare lämnar sömnmedel i en hall där vem som helst kan ta dem, då är jag färdig. Trettio år, färdig.
SANDAHL: Och den andra lögnen?
DR AHLGREN: Jag är överläkare vid blodcentralen i Göteborg. Fröken Varg ger blod där sedan flera år. Harald bad mig i oktober, i förtroende, att ta reda på hennes blodgrupp. Han ville ha det svart på vitt innan han skrev under. Jag slog upp den i registret.
SANDAHL: Vad visade provet?
DR AHLGREN: Jag skrev till honom. Brevet kom ut med sista båten den tjugoåttonde november, samma båt som jag själv. Ett kuvert.
SANDAHL: Vad stod det?
DR AHLGREN: Jag kan inte säga det. Läkarsekretess.
SANDAHL: Han är död, doktorn.
DR AHLGREN: Hon är inte det.
SANDAHL: Var var ni mellan halv elva och midnatt den trettionde?
DR AHLGREN: I salongen. Patiens, ensam. Vid halv tolv ville jag ha is och gick ut i köket. Fru Ekberg satt där med varm mjölk och husfrun stod med degen. Husfrun sa att hon hade stått där hela kvällen. Jag tänkte inte på det då.`,
      },
    ],
    fraga: "Vad tror ni stod i doktorns kuvert?",
    teaser: "Lucka 18 är öppen – doktorn knackar på mitt i natten.",
  },
  {
    nr: 19,
    titel: "Två nyckelknippor",
    ingress: "Jag lade alla tornnycklar som finns på ön på en linneduk. Det blev inte många.",
    bilder: [
      { namn: "lucka-19", alt: "Två nyckelknippor på en linneduk, märkta H. Ekberg och Husfru. På båda ringarna sitter en mässingsnyckel med ordet Fyrtornet." },
    ],
    avsnitt: [
      {
        format: "anteckningsbok",
        rubrik: "Tornets lås",
        text: `I oktober bytte Harald låset till fyrtornet. Efter ett gräl med Holm om Svanhild ville han inte att fyrvaktaren skulle ha "fri lejd i mitt torn". Tornet arrenderas av hotellet sedan 1955. Lotsverket fick ett brev. Holm fick ett annat.

Låssmeden i Strömstad gjorde två nycklar. Inte tre. Jag har hans kvitto.

Den ena hängde på Haralds egen knippa. Den låg i hans byxficka när han hittades.

Den andra hänger på husfruns knippa, "för städningen". Margit Lund putsar mässingen i lyktrummet varje lördagsmorgon.

Holm måste be om lov för att serva sin egen fyr. Han har gjort det tre gånger sedan oktober, varje gång med Margit som öppnade.

Tornets dörr var låst när Harald hittades på morgonen. Den låser inte av sig själv. Man låser den med nyckel, utifrån eller inifrån.

Om Harald låste in sig själv, låg nyckeln i hans ficka och han var ensam i tornet.

Om han inte gjorde det – vem låste efter honom?`,
      },
    ],
    fraga: "Vem kunde låsa tornet efter Harald?",
    teaser: "Lucka 19 är öppen – det finns bara två nycklar till tornet.",
  },
  {
    nr: 20,
    titel: "Blodgivarkortet",
    ingress: "Fröken Varg lät mig se hennes handväska utan att jag bad om det. Hon har inget att dölja, säger hon.",
    bilder: [
      { namn: "lucka-20", alt: "Ett ljusblått blodgivarkort från Göteborgs blodcentral för Elsa Varg, född 1935, blodgrupp AB, liggande ovanpå gamla noter." },
    ],
    avsnitt: [
      {
        format: "kort",
        rubrik: "Blodgivarkort – Göteborgs blodcentral",
        text: `Namn: **Elsa Varg**
Född: 1935
**Blodgrupp: AB**
Givit blod: 9 gånger sedan 1956`,
      },
      {
        format: "anteckningsbok",
        rubrik: "O och AB",
        text: `Harald hade blodgrupp O.

Elsa har AB.

En far med O kan inte få ett barn med AB. Provinsialläkaren kallade det fullkomligt säkert.

Doktorns kuvert kom med båten den tjugoåttonde november. Samma dag skrev Harald till advokaten att testamentet inte skulle undertecknas.`,
        tanke: `Harald Ekberg var inte Elsa Vargs far. Det visste han från den tjugoåttonde november.

"Någon i detta hus har ljugit för mig i tjugosju år." Elsa är tjugosju år. Men Elsa trodde själv att han var hennes far. Hon kan inte ha ljugit om något hon inte visste.

Någon annan visste. Någon som lät Harald betala i tjugosju år för ett barn som inte var hans.

Vem är Elsas mor?`,
      },
    ],
    fraga: "Vem är Elsas mor?",
    teaser: "Lucka 20 är öppen – ett ljusblått kort i en handväska.",
  },
  {
    nr: 21,
    titel: "Brevet från 1935",
    ingress: "I Haralds kassaskrin, under en falsk botten, låg ett brev och en kassabok. Ingrid sa att hon aldrig sett dem.",
    bilder: [
      { namn: "lucka-21", alt: "Ett handskrivet brev daterat Göteborg maj 1935, Käre Harald, vårt barn är fött, undertecknat M., ovanpå en kassabok där det står M.L. 25 kr för varje år från 1935 till 1962." },
    ],
    avsnitt: [
      {
        format: "brev",
        rubrik: "Göteborg, maj 1935",
        text: `Käre Harald,

vårt barn är fött. En flicka. Hon är frisk och har mörkt hår, som du.

Jag kan inte behålla henne. Du vet varför. Jag har ordnat ett hem åt henne hos en god familj i Majorna. De frågar inte.

Jag ber inte om mer än att du ser till att hon aldrig saknar något.

Ingen får någonsin veta. Inte din hustru. Inte flickan. Ingen.

M.`,
      },
      {
        format: "kassabok",
        rubrik: "Kassabok, privat",
        text: `M.L. 25 kr – varje månad, utan avbrott, från juni 1935 till november 1962.

Sista raden, i Haralds handstil, med annat bläck: *"Inga fler. 28/11."*`,
      },
      {
        format: "anteckningsbok",
        rubrik: "M.L.",
        text: `Tjugofem kronor i månaden i tjugosju år. Utbetalda till M.L., som skickade dem vidare i ett kuvert utan avsändare – först till familjen Varg, sedan till flickan själv.

Ett brev, en kassabok och två initialer.`,
        tanke: `Harald trodde i tjugosju år att han var far till M.L.:s barn. Den tjugoåttonde november fick han veta att han inte var det. Samma dag skrev han "Inga fler".

Jag tänker läsa hotellets gamla anställningsbok i kväll.`,
      },
    ],
    fraga: "Vad hade M.L. att förlora på Luciadagen?",
    teaser: "Lucka 21 är öppen – ett brev från 1935 under en falsk botten.",
  },
  {
    nr: 22,
    titel: "Gult mjöl",
    ingress: "Jag tog fram Haralds kavaj igen och gick upp i tornet med en starkare lampa.",
    bilder: [
      { namn: "lucka-22", alt: "Tvådelad närbild. A: gult mjöl i kragen på en mörk kavaj. B: ett mjöligt skoavtryck på ett trappsteg av järn i en spiraltrappa." },
    ],
    avsnitt: [
      {
        format: "foto",
        rubrik: "A – Kavajens krage",
        text: `I kragen på Haralds kavaj, på vänster sida där en hand skulle ta tag: ett fint, gulaktigt pulver.

Jag lät provinsialläkaren titta på det i mikroskop via sin kollega i Strömstad. Svar per telefon: vetemjöl, färgat med saffran.

Harald bakade inte. Vem bakade den trettionde november?`,
      },
      {
        format: "foto",
        rubrik: "B – Avsatsen vid urverket",
        text: `Högst upp, på avsatsen vid urverket som driver linsen: ett skoavtryck i mjöl. Litet. En damsko med låg klack. Storlek 37–38.

Fru Ekberg har storlek 36. Fröken Varg har 39. Husfrun har 38.

Tornet har varit hänglåst sedan den första december, och husfrun kom aldrig längre än till dörren den morgonen. Avtrycket kom dit innan dess.

Damerna på ön är tre. Och jag själv.

Avtrycket syns bara när ljuset kommer från sidan. Det är därför ingen såg det den första morgonen.`,
      },
      {
        format: "anteckningsbok",
        rubrik: "Urverket",
        text: `Från avsatsen vid urverket kan man nå mekanismen med handen.`,
        tanke: `Faller en tung man mot den stannar linsen ett ögonblick. Då störs ljuset.

22.52.`,
      },
    ],
    fraga: "Vem lämnade mjöl i trappan?",
    teaser: "Lucka 22 är öppen – något gult i en krage, något vitt i en trappa.",
  },
  {
    nr: 23,
    titel: "Urmakarens utlåtande",
    ingress: "Fickuret skickades i land med postsparken. Svaret kom i dag med en fiskare.",
    bilder: [
      { namn: "lucka-23", alt: "En urmakarbänk med ett guldfickur med krossat glas som visar 23.47 och en handskriven lapp: Urmakare A. Berg, kronan utdragen, klockan har ställts om för hand." },
    ],
    avsnitt: [
      {
        format: "utlatande",
        rubrik: "Urmakare A. Berg, Strömstad – Utlåtande 21 dec. 1962",
        text: `Till kommissarie G. Sandahl.

Undersökt: ett fickur av guld, fabrikat Cyma, med krossat glas.

1. Uret är inte trasigt. Verket är helt. Det går om man trycker in kronan.

2. Kronan stod **utdragen** i ställäge. Dit hamnar den inte av ett fall. Någon har dragit ut den för att vrida visarna.

3. Uret stannade inte av sig självt. En glasskärva är intryckt mellan minutvisaren och urtavlan och håller visaren fast.

4. Glaset är krossat med ett slag rakt framifrån, inte av ett fall i sidled.

Min bedömning: uret har ställts om för hand och stoppats med avsikt. Vad det visade när mannen dog kan jag inte säga.

Med vördnad,
A. Berg, urmakare`,
      },
      {
        format: "anteckningsbok",
        rubrik: "Två tider",
        text: `I morgon är det julafton. Jag samlar alla i salongen klockan sex. Innan dess vill jag ha ert svar.`,
        tanke: `23.47 är inte när Harald dog. 23.47 är när någon ville att vi skulle tro att han dog.

Vem hade alibi kl. 23.47? Och vem hade det inte kl. 22.52?`,
      },
    ],
    fraga: "Ni har allt nu. Vem, varför, hur och när?",
    teaser: "Lucka 23 är öppen – urmakaren har talat. I morgon är det julafton.",
  },
  {
    nr: 24,
    titel: "Julafton",
    ingress: "Salongen, klockan sex. Granen är tänd. Sju personer sitter och väntar på att jag ska säga något.",
    bilder: [
      { namn: "lucka-24", alt: "Julafton i hotellets salong. Sju personer sitter och står runt kommissarie Sandahl i tweeddräkt. En julgran med levande ljus lyser i hörnet och det snöar utanför fönstren." },
    ],
    interaktion: "anklagelse",
    avsnitt: [
      {
        format: "scen",
        rubrik: "Salongen, 24 dec. 1962 kl. 18.00",
        text: `Ingrid Ekberg sitter i soffan med händerna i knät. Carl bredvid, utan cigarett för en gångs skull. Elsa Varg i den bruna fåtöljen, rak i ryggen. Doktorn vid brasan med ett glas han inte dricker ur. Johan Strand står längst bak med anteckningsboken framme. Bertil Holm har kommit in i hotellet för första gången på åtta år och vet inte var han ska ställa sig.

Margit Lund har burit in glögg och står vid fönstret med nyckelknippan i handen.

Isen har börjat släppa. I morgon går färjan.

Jag har läst allt ni har läst. Jag har gjort mina antaganden och jag har haft fel förut.

Nu vill jag höra ert.

Vem dödade Harald Ekberg? Varför? Hur gick det till – och när?

Skriv ner det. Er lagledare lämnar in. Ni kan ändra så länge ni vill, men när det är inlämnat är det inlämnat.

Sedan berättar jag vad som hände.`,
      },
    ],
    teaser: "Lucka 24 är öppen – julafton i salongen. Nu är det er tur.",
  },
];

export const luckaNr = (nr: number) => LUCKOR.find((l) => l.nr === nr);
