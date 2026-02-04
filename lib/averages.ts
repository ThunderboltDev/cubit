import { getEffectiveTime } from "@/lib/time";
import type { Solve } from "@/types";

export function calculateMean(times: number[]): number | null {
  if (times.length === 0) return null;
  if (times.some((t) => Number.isFinite(t) || t <= 0)) return null;

  const sum = times.reduce((acc, t) => acc + t, 0);
  return sum / times.length;
}

export function calculateAverage(
  solves: Solve[],
  size: number,
): {
  average: number | null;
  trimmedIndices: number[];
  includedSolves: Solve[];
} | null {
  if (solves.length < size) return null;

  const recentSolves = solves.slice(0, size);

  const solveData = recentSolves.map((solve, index) => ({
    solve,
    index,
    effectiveTime: getEffectiveTime(solve),
    isDNF: solve.penalty === "dnf" || solve.time <= 0,
  }));

  const dnfCount = solveData.filter((s) => s.isDNF).length;

  if (dnfCount > 1) {
    return {
      average: null,
      trimmedIndices: [],
      includedSolves: recentSolves,
    };
  }

  const sorted = [...solveData].sort((a, b) => {
    if (a.isDNF) return 1;
    if (b.isDNF) return -1;
    return a.effectiveTime - b.effectiveTime;
  });

  let trimBest = 1;
  let trimWorst = 1;

  if (size === 3) {
    trimBest = 0;
    trimWorst = 0;
  }

  const trimmedIndices: number[] = [];
  const remaining: typeof solveData = [];

  if (trimBest > 0 && sorted.length > 0) {
    trimmedIndices.push(sorted[0].index);
  }
  if (trimWorst > 0 && sorted.length > 1) {
    trimmedIndices.push(sorted[sorted.length - 1].index);
  }

  for (let i = 0; i < sorted.length; i++) {
    const shouldTrim =
      (trimBest > 0 && i < trimBest) ||
      (trimWorst > 0 && i >= sorted.length - trimWorst);

    if (!shouldTrim) {
      remaining.push(sorted[i]);
    }
  }

  if (remaining.length === 0) {
    return {
      average: null,
      trimmedIndices,
      includedSolves: recentSolves,
    };
  }

  if (remaining.some((s) => s.isDNF)) {
    return {
      average: null,
      trimmedIndices,
      includedSolves: recentSolves,
    };
  }

  const sum = remaining.reduce((acc, s) => acc + s.effectiveTime, 0);
  const average = sum / remaining.length;

  return {
    average,
    trimmedIndices,
    includedSolves: recentSolves,
  };
}

export function calculateAo5(solves: Solve[]) {
  return calculateAverage(solves, 5);
}

export function calculateAo12(solves: Solve[]) {
  return calculateAverage(solves, 12);
}

export function calculateAo100(solves: Solve[]) {
  return calculateAverage(solves, 100);
}

export function calculateMo3(solves: Solve[]) {
  return calculateAverage(solves, 3);
}

export interface SessionStats {
  totalSolves: number;
  bestSingle: number | null;
  worstSingle: number | null;
  currentAo5: number | null;
  currentAo12: number | null;
  currentAo100: number | null;
  bestAo5: number | null;
  bestAo12: number | null;
  bestAo100: number | null;
  sessionMean: number | null;
}

export function calculateSessionStats(solves: Solve[]): SessionStats {
  if (solves.length === 0) {
    return {
      totalSolves: 0,
      bestSingle: null,
      worstSingle: null,
      currentAo5: null,
      currentAo12: null,
      currentAo100: null,
      bestAo5: null,
      bestAo12: null,
      bestAo100: null,
      sessionMean: null,
    };
  }

  const validSolves = solves.filter((s) => s.penalty !== "dnf" && s.time > 0);
  const effectiveTimes = validSolves.map((s) =>
    s.penalty === "+2" ? s.time + 2000 : s.time,
  );

  const bestSingle =
    effectiveTimes.length > 0 ? Math.min(...effectiveTimes) : null;
  const worstSingle =
    effectiveTimes.length > 0 ? Math.max(...effectiveTimes) : null;

  const currentAo5 = calculateAo5(solves)?.average ?? null;
  const currentAo12 = calculateAo12(solves)?.average ?? null;
  const currentAo100 = calculateAo100(solves)?.average ?? null;

  const bestAo5 = findBestAverage(solves, 5);
  const bestAo12 = findBestAverage(solves, 12);
  const bestAo100 = findBestAverage(solves, 100);

  const sessionMean = calculateMean(effectiveTimes);

  return {
    totalSolves: solves.length,
    bestSingle,
    worstSingle,
    currentAo5,
    currentAo12,
    currentAo100,
    bestAo5,
    bestAo12,
    bestAo100,
    sessionMean,
  };
}

function findBestAverage(solves: Solve[], size: number): number | null {
  if (solves.length < size) return null;

  let bestAvg: number | null = null;

  for (let i = 0; i <= solves.length - size; i++) {
    const window = solves.slice(i, i + size);
    const result = calculateAverage(window, size);

    if (result?.average !== null) {
      if (bestAvg === null || (result?.average && result?.average < bestAvg)) {
        bestAvg = result?.average ?? null;
      }
    }
  }

  return bestAvg;
}

export function isNewPersonalBest(solves: Solve[], size: number): boolean {
  if (solves.length < size) return false;

  const currentResult = calculateAverage(solves.slice(0, size), size);
  if (!currentResult?.average) return false;

  const previousSolves = solves.slice(size);
  if (previousSolves.length < size) return true;

  const bestPrevious = findBestAverage(previousSolves, size);
  if (bestPrevious === null) return true;

  return currentResult.average < bestPrevious;
}
