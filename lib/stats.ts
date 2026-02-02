import type { Solve } from "@/types";

export function calculateAverage(
  solves: Solve[],
  count: number,
): number | null {
  if (solves.length < count) return null;

  const recent = solves.slice(0, count);
  const times = recent.map((solve) =>
    solve.penalty === "DNF" ?
      Infinity
    : solve.time + (solve.penalty === "+2" ? 2 : 0),
  );

  if (times.filter((t) => t === Infinity).length > 1) return Infinity;

  const sorted = [...times].sort((a, b) => a - b);
  const trimmed = sorted.slice(1, -1);
  const sum = trimmed.reduce((a, b) => a + b, 0);

  return sum / trimmed.length;
}

export function calculateBest(solves: Solve[]): number | null {
  if (solves.length === 0) return null;

  const valid = solves.filter((solve) => solve.penalty !== "DNF");
  if (valid.length === 0) return null;

  return Math.min(
    ...valid.map((solve) => solve.time + (solve.penalty === "+2" ? 2 : 0)),
  );
}

export function calculateMean(solves: Solve[]): number | null {
  if (solves.length === 0) return null;

  const valid = solves.filter((solve) => solve.penalty !== "DNF");
  if (valid.length === 0) return null;

  const sum = valid.reduce(
    (acc, solve) => acc + solve.time + (solve.penalty === "+2" ? 2 : 0),
    0,
  );
  return sum / valid.length;
}

export function formatTime(ms: number, precision: 2 | 3 = 2): string {
  if (ms === Infinity) return "DNF";

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainder = (ms % 1000) / (precision === 2 ? 10 : 1);

  if (hours > 0) {
    return `${hours}:${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}.${remainder.toString().padStart(precision, "0")}`;
  }

  if (minutes > 0) {
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}.${remainder.toString().padStart(precision, "0")}`;
  }

  return `${seconds}.${remainder.toString().padStart(precision, "0")}`;
}
