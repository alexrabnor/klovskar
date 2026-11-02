// Stämningsljud per lucka. Publikt – ljuden avslöjar inget. Filer i public/ljud/, källor i public/ljud/KALLOR.md.

export type Stamning = "vind" | "inne" | "brasa" | "kok" | "klocka" | "hav" | "is";

export const LUCKLJUD: Record<number, Stamning> = {
  1: "vind",    // Telegrammet
  2: "brasa",   // De sju
  3: "vind",    // Fickuret – tornet
  4: "inne",    // Kartan
  5: "vind",    // Fyrens dagbok
  6: "klocka",  // Det sönderrivna brevet – kontoret
  7: "hav",     // M/S Svanhild
  8: "klocka",  // Apoteket Ugglan
  9: "inne",    // Herr L.
  10: "is",     // Spåren på isen
  11: "klocka", // Förhöret med Elsa
  12: "klocka", // Doktorns väska
  13: "brasa",  // Lucia
  14: "inne",   // Journalistens rum
  15: "hav",    // Sjöboden
  16: "inne",   // Fru Ekbergs natt
  17: "klocka", // Inskrivningsboken
  18: "brasa",  // Doktorns bekännelse
  19: "inne",   // Två nyckelknippor
  20: "klocka", // Blodgivarkortet
  21: "brasa",  // Brevet från 1935
  22: "kok",    // Gult mjöl
  23: "klocka", // Urmakarens utlåtande
  24: "brasa",  // Julafton
};
