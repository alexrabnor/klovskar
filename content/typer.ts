export type Format =
  | "telegram" | "anteckningsbok" | "kort" | "karta" | "loggbok" | "pussel" | "tidning"
  | "kvitto" | "brev" | "foto" | "forhor" | "inventarie" | "dokument" | "scen" | "utlatande" | "kassabok";

export interface Avsnitt {
  format: Format;
  /** Rubrik ovanför dokumentet, t.ex. "Förhör med Elsa Varg". */
  rubrik?: string;
  /** Markdown-light: stycken, **fet**, *kursiv*. Förhör: "NAMN: repliken" per rad, (scenanvisning) inom parentes. */
  text: string;
}

export interface Bild {
  namn: string;
  alt: string;
}

export interface Lucka {
  nr: number;
  titel: string;
  /** Kort rad i Sandahls röst överst i luckan. */
  ingress: string;
  bilder: Bild[];
  avsnitt: Avsnitt[];
  interaktion?: "karta" | "loggbok" | "pussel" | "anklagelse" | "misstankta";
  /** Fråga till laget längst ner. */
  fraga?: string;
  /** Pushnotis när luckan öppnar – utan spoilers. */
  teaser: string;
  /** Pusselbitar (lucka 6) i rätt ordning. */
  pussel?: string[];
  /** Loggbokens transkription (lucka 5). */
  transkription?: string;
}
