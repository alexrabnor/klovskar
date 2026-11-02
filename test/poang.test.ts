import { describe, it, expect } from "vitest";
import { raknaPoang, MAX_POANG } from "@/lib/poang";

describe("poängen", () => {
  it("allt rätt plus sex bonusar ger max", () => {
    const p = raknaPoang({ mordare: "margit", motiv: "hemlighet", metod: "somnmedel", tid: "22:52" }, 6);
    expect(p.totalt).toBe(MAX_POANG);
    expect(p.totalt).toBe(19);
  });
  it("23.47 är den falska tiden och ger inga tidpoäng", () => {
    expect(raknaPoang({ tid: "23:47" }, 0).tid).toBe(0);
  });
  it("tidsfönstret är 22.40–23.05 inklusive", () => {
    expect(raknaPoang({ tid: "22:40" }, 0).tid).toBe(2);
    expect(raknaPoang({ tid: "23:05" }, 0).tid).toBe(2);
    expect(raknaPoang({ tid: "22:39" }, 0).tid).toBe(0);
    expect(raknaPoang({ tid: "23:06" }, 0).tid).toBe(0);
  });
  it("fel mördare ger noll för mördaren men resten räknas", () => {
    const p = raknaPoang({ mordare: "bertil", motiv: "hemlighet", metod: "gift" }, 2);
    expect(p).toMatchObject({ mordare: 0, motiv: 3, metod: 0, bonus: 2, totalt: 5 });
  });
});
