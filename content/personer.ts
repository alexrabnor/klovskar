// De sju misstänkta. Publikt innehåll (lucka 2 är gratis smakprov) – inga hemligheter här.

export interface Person {
  id: string;
  namn: string;
  alder: number;
  roll: string;
  kort: string;
}

export const PERSONER: Person[] = [
  {
    id: "ingrid", namn: "Ingrid Ekberg", alder: 58, roll: "Haralds hustru",
    kort: "Gift med Harald i trettiofem år. Elegant, korrekt och svår att läsa. Hon har sitt eget rum i östra flygeln och säger att hon somnar tidigt.",
  },
  {
    id: "carl", namn: "Carl Ekberg", alder: 35, roll: "Sonen",
    kort: "Vice vd i Rederi AB Ekberg, åtminstone på pappret. Charmig, rastlös och alltid på väg någon annanstans. Röker John Silver.",
  },
  {
    id: "elsa", namn: "Elsa Varg", alder: 27, roll: "Sångerska",
    kort: "Anlitad att sjunga på hotellets julfest. Kom till ön med sista färjan den 26 november. Harald insisterade på att hon skulle bo i det bästa rummet.",
  },
  {
    id: "margit", namn: "Margit Lund", alder: 51, roll: "Husfru",
    kort: "Har skött Hotell Fyrbåken i trettio år. Bakar, serverar, städar och har nycklar till allt. Man hör henne innan man ser henne – nyckelknippan skramlar.",
  },
  {
    id: "bertil", namn: "Bertil Holm", alder: 46, roll: "Fyrvaktare",
    kort: "Lotsverkets man på Klovskär. Bor i fyrvaktarstugan och för fyrens dagbok. Fåordig. Har inte satt sin fot i hotellets matsal på åtta år.",
  },
  {
    id: "sven", namn: "Dr Sven Ahlgren", alder: 52, roll: "Läkare, gäst",
    kort: "Familjen Ekbergs läkare sedan kriget. Kom ut för att fira jul och spela bridge. Bär alltid sin läkarväska, även till middagen.",
  },
  {
    id: "johan", namn: "Johan Strand", alder: 31, roll: "Journalist",
    kort: "Reporter på Västkustens Dagblad. Säger att han skriver ett reportage om vinterliv i skärgården. Ställer för många frågor för att vara på semester.",
  },
];

export const personMedId = (id: string) => PERSONER.find((p) => p.id === id);
