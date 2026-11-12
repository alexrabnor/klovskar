import { describe, expect, it } from "vitest";
import { introAktiv, prisKr } from "../lib/stripe";

describe("introduktionspris", () => {
  it("gäller hela 15 december och slutar vid midnatt svensk tid", () => {
    process.env.PRIS_KR = "99";
    expect(introAktiv(Date.parse("2026-12-15T23:59:00+01:00"))).toBe(true);
    expect(prisKr(Date.parse("2026-12-15T23:59:00+01:00"))).toBe(99);
    expect(introAktiv(Date.parse("2026-12-16T00:00:00+01:00"))).toBe(false);
    expect(prisKr(Date.parse("2026-12-16T00:00:00+01:00"))).toBe(199);
  });
});
