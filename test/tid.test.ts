import { describe, it, expect } from "vitest";
import { arOppen, facitOppet, oppningstid, serverNu, stockholm, tolkaSvenskTid, allaFarLamnaIn, antalOppna, manaderEfterSistaLuckan } from "@/lib/tid";

const advent = { startdatum: "2026-12-01", forskjutning_min: 0 };

describe("datumlåset", () => {
  it("lucka 5 är låst 5 dec 05.59 svensk tid", () => {
    expect(arOppen(advent, 5, stockholm(2026, 12, 5, 5, 59))).toBe(false);
  });
  it("lucka 5 öppnar 5 dec 06.00 svensk tid", () => {
    expect(arOppen(advent, 5, stockholm(2026, 12, 5, 6, 0))).toBe(true);
  });
  it("06.00 svensk tid är 05.00 UTC i december", () => {
    expect(new Date(oppningstid("2026-12-01", 5)).toISOString()).toBe("2026-12-05T05:00:00.000Z");
  });
  it("sommartid räknas rätt (06.00 = 04.00 UTC i juli)", () => {
    expect(new Date(oppningstid("2027-07-01", 1)).toISOString()).toBe("2027-07-01T04:00:00.000Z");
  });
  it("eget startdatum över månadsskifte", () => {
    const lag = { startdatum: "2027-01-20", forskjutning_min: 0 };
    expect(new Date(oppningstid(lag.startdatum, 24)).toISOString()).toBe("2027-02-12T05:00:00.000Z");
    expect(arOppen(lag, 13, stockholm(2027, 2, 1, 6, 0))).toBe(true);
    expect(arOppen(lag, 14, stockholm(2027, 2, 1, 6, 0))).toBe(false);
  });
  it("ogiltiga luckor är aldrig öppna", () => {
    const sent = stockholm(2030, 1, 1);
    for (const nr of [0, 25, -1, 1.5, NaN]) expect(arOppen(advent, nr, sent)).toBe(false);
  });
  it("adminens tidsförskjutning flyttar bara det laget", () => {
    const testlag = { startdatum: "2026-12-01", forskjutning_min: 60 * 24 * 10 };
    const nu = stockholm(2026, 12, 1, 7, 0);
    expect(antalOppna(advent, nu)).toBe(1);
    expect(antalOppna(testlag, nu)).toBe(11);
  });
});

describe("facit", () => {
  const fore24 = stockholm(2026, 12, 24, 5, 59);
  const efter24 = stockholm(2026, 12, 24, 6, 0);
  it("är låst före inlämning även efter 24 dec 06.00", () => {
    expect(facitOppet({ ...advent, anklagelse_inlamnad: 0 }, efter24)).toBe(false);
  });
  it("är låst efter inlämning men före 24 dec 06.00", () => {
    expect(facitOppet({ ...advent, anklagelse_inlamnad: 1 }, fore24)).toBe(false);
  });
  it("öppnar när båda villkoren är uppfyllda", () => {
    expect(facitOppet({ ...advent, anklagelse_inlamnad: 1 }, efter24)).toBe(true);
  });
  it("alla får lämna in först 12 h efter lucka 24", () => {
    expect(allaFarLamnaIn(advent, stockholm(2026, 12, 24, 17, 59))).toBe(false);
    expect(allaFarLamnaIn(advent, stockholm(2026, 12, 24, 18, 0))).toBe(true);
  });
});

describe("testläget", () => {
  it("är avstängt när variabeln saknas", () => {
    expect(serverNu({}, 12345)).toBe(12345);
    expect(serverNu({ TESTLAGE_DATUM: "" }, 12345)).toBe(12345);
    expect(serverNu({ TESTLAGE_DATUM: "   " }, 12345)).toBe(12345);
  });
  it("tolkar TESTLAGE_DATUM som svensk tid", () => {
    expect(serverNu({ TESTLAGE_DATUM: "2026-12-14T08:00" }, 0)).toBe(stockholm(2026, 12, 14, 8, 0));
    expect(new Date(tolkaSvenskTid("2026-12-14T08:00")!).toISOString()).toBe("2026-12-14T07:00:00.000Z");
  });
  it("ignorerar ogiltigt värde", () => {
    expect(serverNu({ TESTLAGE_DATUM: "imorgon" }, 777)).toBe(777);
  });
});

describe("månader efter sista luckan", () => {
  it("håller 06.00 svensk tid över sommartid", () => {
    expect(manaderEfterSistaLuckan("2026-12-01", 6)).toBe(stockholm(2027, 6, 24, 6, 0));
  });
  it("13 månader från advent 2026 är 24 januari 2028", () => {
    expect(manaderEfterSistaLuckan("2026-12-01", 13)).toBe(stockholm(2028, 1, 24, 6, 0));
  });
  it("klarar månader med färre dagar", () => {
    // lucka 24 den 31 januari 2027 → 28 februari 2027
    expect(manaderEfterSistaLuckan("2027-01-08", 1)).toBe(stockholm(2027, 2, 28, 6, 0));
  });
});
