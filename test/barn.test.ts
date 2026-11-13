import { describe, expect, it } from "vitest";
import { BARNLUCKOR } from "../content/barn/luckor";
import { figurMedId } from "../content/barn/figurer";
import { bildensAtkomst } from "../lib/bilder";
import { farSeBild, oppenLucka } from "../lib/innehall";
import { oppenBarnLucka } from "../lib/barn";
import { prisFor } from "../lib/stripe";
import { barnPa } from "../lib/spel";
import type { Lag } from "../lib/db";

const lag = (spel: "klovskar" | "barn"): Lag => ({
  id: 1, namn: "Test", kod: "ABC123", startdatum: "2026-12-01", forskjutning_min: 0, skapad: "", synlig_i_topplista: 0,
  anklagelse_inlamnad: 0, poang: null, ledare_token: "x", ledare_epost: null, morgonmejl: 0, aktiveringskod: null, forsta_oppning: null, spel,
});
const DAG5 = Date.parse("2026-12-05T12:00:00+01:00");

describe("barndeckarens innehåll", () => {
  it("har 24 luckor i ordning", () => {
    expect(BARNLUCKOR.map((l) => l.nr)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1));
  });
  it("har exakt ett rätt svar per fråga och text i varje del", () => {
    for (const l of BARNLUCKOR) {
      expect(l.fraga.val.filter((v) => v.ratt).length, `lucka ${l.nr}`).toBe(1);
      expect(l.text.length, `lucka ${l.nr}`).toBeGreaterThan(2);
      expect(l.uppdrag.titel && l.uppdrag.text && l.uppdrag.behovs && l.uppdrag.marke, `lucka ${l.nr}`).toBeTruthy();
    }
  });
  it("stryker bara figurer som finns", () => {
    for (const l of BARNLUCKOR) if (l.stryk) expect(figurMedId(l.stryk), `lucka ${l.nr}`).toBeTruthy();
  });
  it("har en sifferkod i lucka 21 som blir STALLET", () => {
    const rad = BARNLUCKOR[20].text.find((t) => /^[\d\s–]+$/.test(t))!;
    expect(rad.split("–").map((n) => String.fromCharCode(64 + Number(n.trim()))).join("")).toBe("STALLET");
  });
});

describe("spelen hålls isär", () => {
  it("ett barnlag ser sina öppna luckor men aldrig Klovskärs", () => {
    expect(oppenBarnLucka(lag("barn"), 5, DAG5)?.nr).toBe(5);
    expect(oppenBarnLucka(lag("barn"), 6, DAG5)).toBeNull();
    expect(oppenLucka(lag("barn"), 5, DAG5)).toBeNull();
    expect(farSeBild("lucka-05", lag("barn"), DAG5, false)).toBe(false);
    expect(farSeBild("barn-lucka-05", lag("barn"), DAG5, false)).toBe(true);
    expect(farSeBild("barn-lucka-06", lag("barn"), DAG5, false)).toBe(false);
  });
  it("ett Klovskärlag ser aldrig barndeckarens låsta luckor", () => {
    expect(oppenBarnLucka(lag("klovskar"), 5, DAG5)).toBeNull();
    expect(farSeBild("barn-lucka-05", lag("klovskar"), DAG5, false)).toBe(false);
    expect(farSeBild("lucka-05", lag("klovskar"), DAG5, false)).toBe(true);
  });
  it("smakprovets bilder är publika, resten låsta", () => {
    expect(bildensAtkomst("barn-omslag").slag).toBe("publik");
    expect(bildensAtkomst("barn-lucka-02").slag).toBe("publik");
    expect(bildensAtkomst("barn-lucka-03")).toEqual({ slag: "barnlucka", nr: 3 });
  });
});

describe("priser och påslagning", () => {
  it("barndeckaren kostar 60 kr och paketet 150 kr", () => {
    delete process.env.PRIS_BARN_KR;
    delete process.env.PRIS_BADA_KR;
    expect(prisFor("barn")).toBe(60);
    expect(prisFor("bada")).toBe(150);
  });
  it("barndeckaren finns bara där den är påslagen", () => {
    expect(barnPa({})).toBe(false);
    expect(barnPa({ BARN: "1" })).toBe(true);
    expect(barnPa({ STARTSIDA: "barn" })).toBe(true);
  });
});
