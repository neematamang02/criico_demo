import { PlayerRole } from "@/types/player";

export type ImpactScoreInput = {
    role: PlayerRole;
    matchesPlayed: number;
    totalRuns: number;
    totalWickets: number;
}

const RUN_WEIGHT = 1.2;
const WICKET_WEIGHT = 20;
const ROOKIE_MATCH_THRESHOLD = 5;
const VETERAN_MATCH_THRESHOLD = 20;
const ROOKIE_PENALTY = -50;
const VETERAN_BONUS = 100;

type RoleRule<R extends PlayerRole> = {
  runMultiplier: number;
  // A Wicketkeeper's wicket multiplier must be the literal 1.
  // Setting it to 1.5 (the Bowler multiplier) is a compile error.
  wicketMultiplier: R extends "WICKETKEEPER" ? 1 : number;
  flatBonus: number;
};

type RoleRules = { [R in PlayerRole]: RoleRule<R> };

const ROLE_RULES: RoleRules = {
  BATSMAN: { runMultiplier: 1.3, wicketMultiplier: 1, flatBonus: 0 },
  BOWLER: { runMultiplier: 1, wicketMultiplier: 1.5, flatBonus: 0 },
  ALL_ROUNDER: { runMultiplier: 1, wicketMultiplier: 1, flatBonus: 0 },
  WICKETKEEPER: { runMultiplier: 1, wicketMultiplier: 1, flatBonus: 30 },
};

function experienceAdjustment(matchesPlayed: number): number {
  if (matchesPlayed < ROOKIE_MATCH_THRESHOLD) return ROOKIE_PENALTY;
  if (matchesPlayed > VETERAN_MATCH_THRESHOLD) return VETERAN_BONUS;
  return 0;
}

export function calculateImpactScore(player: ImpactScoreInput): number {
  const { role, matchesPlayed, totalRuns, totalWickets } = player;

  if (matchesPlayed < 0 || totalRuns < 0 || totalWickets < 0) {
    throw new RangeError("Player stats cannot be negative");
  }

  const rule = ROLE_RULES[role];

  const runScore = totalRuns * rule.runMultiplier * RUN_WEIGHT;
  const wicketScore = totalWickets * rule.wicketMultiplier * WICKET_WEIGHT;

  const score =
    runScore + wicketScore + rule.flatBonus + experienceAdjustment(matchesPlayed);

  // Round to 2 decimals to avoid floating-point noise like 780.0000000000001
  return Math.round(score * 100) / 100;
}