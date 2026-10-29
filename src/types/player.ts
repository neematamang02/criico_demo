export const PLAYER_ROLES = ["BATSMAN", "BOWLER", "ALL_ROUNDER", "WICKETKEEPER"] as const;

export type PlayerRole = (typeof PLAYER_ROLES)[number];