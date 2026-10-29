import { describe, it, expect } from "vitest";
import { calculateImpactScore } from "./impact-score";

describe("calculateImpactScore", () => {
      it("applies the bowler wicket multiplier and rookie penalty for a bowler with 0 matches", () => {
    // runs: 10 × 1.2 = 12 | wickets: 5 × 1.5 × 20 = 150 | rookie: −50
    expect(
      calculateImpactScore({ role: "BOWLER", matchesPlayed: 0, totalRuns: 10, totalWickets: 5 })
    ).toBe(112);
  });

    it("gives a wicketkeeper with high runs a flat +30 and no role multipliers", () => {
    // runs: 1000 × 1.2 = 1200 | wickets: 0 | keeper bonus: +30
    expect(
      calculateImpactScore({ role: "WICKETKEEPER", matchesPlayed: 10, totalRuns: 1000, totalWickets: 0 })
    ).toBe(1230);
  });

    it("does not give a wicketkeeper the bowler multiplier on wickets", () => {
    // runs: 0 | wickets: 4 × 20 = 80 (not × 1.5) | keeper: +30
    expect(
      calculateImpactScore({ role: "WICKETKEEPER", matchesPlayed: 10, totalRuns: 0, totalWickets: 4 })
    ).toBe(110);
  });

  it("applies the batsman run multiplier and veteran bonus", () => {
    // runs: 500 × 1.3 × 1.2 = 780 | wickets: 2 × 20 = 40 | veteran: +100
    expect(
      calculateImpactScore({ role: "BATSMAN", matchesPlayed: 25, totalRuns: 500, totalWickets: 2 })
    ).toBe(920);
  });

  it("applies no experience adjustment at exactly 5 or exactly 20 matches", () => {
    const base = { role: "ALL_ROUNDER" as const, totalRuns: 100, totalWickets: 10 };
    // runs: 120 | wickets: 200 → 320
    expect(calculateImpactScore({ ...base, matchesPlayed: 5 })).toBe(320);
    expect(calculateImpactScore({ ...base, matchesPlayed: 20 })).toBe(320);
  });

  it("throws on negative stats", () => {
    expect(() =>
      calculateImpactScore({ role: "BATSMAN", matchesPlayed: 3, totalRuns: -10, totalWickets: 0 })
    ).toThrow(RangeError);
  });
})