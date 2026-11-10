export type Format =
  | "telegram" | "anteckningsbok" | "kort" | "karta" | "loggbok" | "pussel" | "tidning"
  | "kvitto" | "brev" | "foto" | "forhor" | "inventarie" | "dokument" | "scen" | "utlatande" | "kassabok";

export interface Avsnitt {
  format: Format;
  /** Rubrik ovanför dokumentet, t.ex. "Förhör med Elsa Varg". */
  rubrik?: string;
  /** Markdown-light: stycken, **fet**, *kursiv*. Förhör: "NAMN: repliken" per rad, (scenanvisning) inom parentes. */
  text: string;
  /** Sandahls slutsats – dold bakom "Sandahls tanke" så att laget kan försöka själv först. */
  tanke?: string;
}

export interface Bild {
  namn: string;
  alt: string;
}

/** En liten uppgift i en lucka. Svaren skickas bara till klienten när luckan är öppen. */
export type Uppgift = { rubrik: string; fraga: string; lost: string } & (
  | { typ: "rad"; rader: { text: string; svar?: string }[]; ratt: number; fel: string }
  | { typ: "tal"; enhet: string; godkand: [number, number]; fel: string }
  | { typ: "flerval"; val: string[]; ratt: string[]; felval: Record<string, string>; saknas: string }
  | { typ: "klocka"; start: string; godkand: [number, number]; fel: string; felStart: string }
);

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
  /** Liten uppgift att lösa (lucka 5, 12, 20, 23). */
  uppgift?: Uppgift;
  /** Loggbokens transkription (lucka 5). */
  transkription?: string;
}
