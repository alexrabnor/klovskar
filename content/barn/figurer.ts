// Öborna på Måsholmen. Publikt innehåll (lucka 2 är gratis smakprov) – inga hemligheter här.

export interface Figur {
  id: string;
  namn: string;
  roll: string;
  kort: string;
}

export const FIGURER: Figur[] = [
  { id: "algot", namn: "Algot", roll: "Fyrvaktare", kort: "Har tänt stjärnan i fyren i fyrtio år. Snäll och lite glömsk. Har öns största stövlar." },
  { id: "saga", namn: "Saga", roll: "Bagare", kort: "Bakar öns lussekatter och går upp mitt i natten. Har alltid mjöl på förklädet." },
  { id: "tore", namn: "Tore", roll: "Fiskare", kort: "Äger båthuset vid bryggan. Där står näten, årorna och alla färgburkarna." },
  { id: "majken", namn: "Majken", roll: "Brevbärare", kort: "Kommer med postbåten från fastlandet och cyklar fortare än någon annan." },
  { id: "tvillingarna", namn: "Ebba och Love", roll: "Tvillingar, 9 år", kort: "Bygger alltid på något hemligt. Ebba har glasögon, Love har en glugg mellan tänderna." },
  { id: "pip", namn: "Professor Pip", roll: "Fågelskådare", kort: "Bor i gäststugan över vintern. Tittar i kikare hela dagarna och skriver i en bok som ingen får läsa." },
  { id: "gosta", namn: "Gösta", roll: "Mås", kort: "Tar allt som glänser och bär hem det till sitt bo på klippan." },
  { id: "mackan", namn: "Mackan", roll: "Get", kort: "Bor i det lilla röda stallet uppe på backen. Äter det mesta och tycker om värme." },
];

export const figurMedId = (id: string) => FIGURER.find((f) => f.id === id);

/** Berättaren. Står inte bland de misstänkta. */
export const SOTIS = { namn: "Sotis", roll: "Fyrkatt", kort: "Svart med en vit tass och röd halsduk. Det är Sotis som berättar, och Sotis gömmer sig i varje bild." };
