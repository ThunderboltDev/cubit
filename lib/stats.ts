import { getEffectiveTime } from "@/lib/time";
import type { Solve } from "@/types";

export function calculateAverage(
  solves: Solve[],
  count: number,
): number | null {
  if (solves.length < count) return null;

  const recentSolves = solves.slice(0, count);
  const times = recentSolves.map((solve) => getEffectiveTime(solve));

  if (times.filter((t) => t === Infinity).length > 1) return Infinity;

  const sorted = [...times].sort((a, b) => a - b);
  const trimmed = sorted.slice(1, -1);
  const sum = trimmed.reduce((a, b) => a + b, 0);

  return sum / trimmed.length;
}

export function calculateBest(solves: Solve[]): number | null {
  if (solves.length === 0) return null;

  const valid = solves.filter((solve) => solve.penalty !== "dnf");
  if (valid.length === 0) return null;

  return Math.min(...valid.map((solve) => getEffectiveTime(solve)));
}

export function calculateMean(solves: Solve[]): number | null {
  if (solves.length === 0) return null;

  const valid = solves.filter((solve) => solve.penalty !== "dnf");
  if (valid.length === 0) return null;

  const sum = valid.reduce((acc, solve) => acc + getEffectiveTime(solve), 0);
  return sum / valid.length;
}
