import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Samma typsnitt och färger som adventdeckare.se (app/globals.css).
// Typsnitten ligger lokalt i public/typsnitt (SIL Open Font License), så renderingen kräver inget nät.
export const F_RUBRIK = "DM Serif Display";
export const F_MASKIN = "Special Elite";
export const F_BROD = "Source Serif 4";

loadFont({ family: F_RUBRIK, url: staticFile("typsnitt/DMSerifDisplay.woff2") });
loadFont({ family: F_MASKIN, url: staticFile("typsnitt/SpecialElite.woff2") });
loadFont({ family: F_BROD, url: staticFile("typsnitt/SourceSerif4.woff2"), weight: "400 600" });

export const FARG = {
  natt: "#0b161b",
  fg: "#e9e1d2",
  dampad: "#9fb2b5",
  barnsten: "#e2a24a",
  rod: "#c0463a",
  papper: "#efe4cc",
};

export const SKUGGA = "0 4px 24px rgba(0,0,0,.85), 0 2px 6px rgba(0,0,0,.9)";
