// Barndeckarens luckor är enklare än Klovskärs: en bild, en kort text att läsa högt,
// en fråga med tre svar och ett frivilligt uppdrag att göra på riktigt.

export interface BarnSvar {
  text: string;
  /** Rätt svar. Exakt ett per fråga. */
  ratt?: true;
  /** Det Sotis säger när barnet väljer svaret. Vid fel svar är det en ledtråd, aldrig ett stopp. */
  svar: string;
}

export interface BarnUppdrag {
  titel: string;
  text: string;
  /** Det som behövs, i klartext till den vuxna. */
  behovs: string;
  /** Större uppdrag som passar en ledig dag. */
  stor?: true;
  /** Märkets symbol i detektivpasset. */
  marke: string;
}

export interface BarnLucka {
  nr: number;
  titel: string;
  /** En rad som lockar utan att avslöja – visas i admin och i utskick. */
  teaser: string;
  bildAlt: string;
  /** Stycken. Sotis berättar. */
  text: string[];
  fraga: { text: string; val: [BarnSvar, BarnSvar, BarnSvar] };
  uppdrag: BarnUppdrag;
  /** Figur som detektiverna kan stryka efter den här luckan. */
  stryk?: string;
}
