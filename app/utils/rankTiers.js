/**
 * Ranking Tier System
 * Based on weekly leaderboard score
 */

export const TIERS = [
  {
    name: "Unranked",
    min: 0,
    max: 0,
    icon: "⬜",
    color: "#6B7280",
    glow: "rgba(107,114,128,0.2)",
  },
  {
    name: "Bronze",
    min: 1,
    max: 199,
    icon: "🥉",
    color: "#CD7F32",
    glow: "rgba(205,127,50,0.25)",
  },
  {
    name: "Silver",
    min: 200,
    max: 499,
    icon: "🥈",
    color: "#C0C0C0",
    glow: "rgba(192,192,192,0.3)",
  },
  {
    name: "Gold",
    min: 500,
    max: 999,
    icon: "🥇",
    color: "#FFD700",
    glow: "rgba(255,215,0,0.3)",
  },
  {
    name: "Diamond",
    min: 1000,
    max: Infinity,
    icon: "💎",
    color: "#B9F2FF",
    glow: "rgba(185,242,255,0.35)",
  },
];

/**
 * Get the tier for a given score
 * @param {number} score - Weekly total score
 * @returns {{ name: string, icon: string, color: string, glow: string, min: number, max: number }}
 */
export function getTier(score) {
  if (!score || score <= 0) return TIERS[0];
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (score >= TIERS[i].min) return TIERS[i];
  }
  return TIERS[0];
}

/**
 * Get progress toward next tier (0-100)
 * @param {number} score - Weekly total score
 * @returns {{ current: object, next: object|null, progress: number }}
 */
export function getTierProgress(score) {
  const current = getTier(score);
  const currentIdx = TIERS.indexOf(current);
  const next = currentIdx < TIERS.length - 1 ? TIERS[currentIdx + 1] : null;

  if (!next) return { current, next: null, progress: 100 };

  const range = next.min - current.min;
  const earned = Math.max(0, (score || 0) - current.min);
  const progress = Math.min(100, Math.round((earned / range) * 100));

  return { current, next, progress };
}
