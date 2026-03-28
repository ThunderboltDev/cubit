import type { Solve } from "@/types/puzzles";
import type { Stat, StatType } from "@/types/stats";

export type SolveWithEffectiveTime = Solve & { effectiveTime: number | null };

export function getEffectiveTime(solve: Solve): number | null {
  if (solve.penalty === "DNF") return null;
  if (solve.penalty === "+2") return solve.time + 2000;
  return solve.time;
}

export function prepareSolves(solves: Solve[]): SolveWithEffectiveTime[] {
  return solves.map((solve) => ({
    ...solve,
    effectiveTime: getEffectiveTime(solve),
  }));
}

export function calculateTrimCount(
  total: number,
  trimPercentage: number,
): number {
  return Math.floor((total * trimPercentage) / 100);
}

export function calculateAverageOfN(
  solves: Solve[],
  n: number = Infinity,
  trimPercentage: number = 5,
): number | null {
  const targetN = n === Infinity ? solves.length : n;

  if (solves.length < targetN) return null;
  if (targetN === 0) return null;

  const recentSolves = n === Infinity ? solves : solves.slice(-n);
  const preparedSolves = prepareSolves(recentSolves);
  const times = preparedSolves.map((s) => s.effectiveTime);

  const trimCount = calculateTrimCount(times.length, trimPercentage);
  const dnfCount = times.filter((t) => t === null).length;

  if (dnfCount > trimCount) return null;

  const validTimes = times.filter((t): t is number => t !== null);
  if (validTimes.length < times.length - trimCount * 2) return null;

  validTimes.sort((a, b) => a - b);

  const trimmed = validTimes.slice(trimCount, validTimes.length - trimCount);

  if (trimmed.length === 0) return null;

  const sum = trimmed.reduce((acc, time) => acc + time, 0);
  return sum / trimmed.length;
}

export function calculateBestOfN(
  solves: Solve[],
  n: number = Infinity,
): number | null {
  const targetN = n === Infinity ? solves.length : n;

  if (solves.length < targetN) return null;

  const recentSolves = n === Infinity ? solves : solves.slice(-n);
  const preparedSolves = prepareSolves(recentSolves);
  const validTimes = preparedSolves
    .map((s) => s.effectiveTime)
    .filter((t): t is number => t !== null);

  if (validTimes.length === 0) return null;

  return Math.min(...validTimes);
}

export function calculateMeanOfN(
  solves: Solve[],
  n: number = Infinity,
): number | null {
  const targetN = n === Infinity ? solves.length : n;

  if (solves.length < targetN) return null;
  if (targetN === 0) return null;

  const recentSolves = n === Infinity ? solves : solves.slice(-n);
  const preparedSolves = prepareSolves(recentSolves);
  const times = preparedSolves.map((s) => s.effectiveTime);

  if (times.some((t) => t === null)) return null;

  const validTimes = times.filter((t): t is number => t !== null);
  const sum = validTimes.reduce((acc, time) => acc + time, 0);

  return sum / validTimes.length;
}

export function calculateConsistencyOfN(
  solves: Solve[],
  n: number = Infinity,
): number | null {
  if (solves.length < 2) return null;

  const recentSolves = n === Infinity ? solves : solves.slice(-n);
  const preparedSolves = prepareSolves(recentSolves);
  const validTimes = preparedSolves
    .map((s) => s.effectiveTime)
    .filter((t): t is number => t !== null);

  if (validTimes.length < 2) return null;

  const mean = validTimes.reduce((acc, t) => acc + t, 0) / validTimes.length;
  const squaredDiffs = validTimes.map((t) => (t - mean) ** 2);
  const variance =
    squaredDiffs.reduce((acc, d) => acc + d, 0) / validTimes.length;

  return Math.sqrt(variance);
}

export function getBestSingleTime(solves: Solve[]): number | null {
  if (solves.length === 0) return null;

  const preparedSolves = prepareSolves(solves);
  const validTimes = preparedSolves
    .map((s) => s.effectiveTime)
    .filter((t): t is number => t !== null);

  if (validTimes.length === 0) return null;

  return Math.min(...validTimes);
}

export function getWorstSingleTime(solves: Solve[]): number | null {
  if (solves.length === 0) return null;

  const preparedSolves = prepareSolves(solves);
  const validTimes = preparedSolves
    .map((s) => s.effectiveTime)
    .filter((t): t is number => t !== null);

  if (validTimes.length === 0) return null;

  return Math.max(...validTimes);
}

export function calculateBestAverage(
  solves: Solve[],
  n: number,
  trimPercentage: number = 5,
): number | null {
  const targetN = n === Infinity ? solves.length : n;
  if (solves.length < targetN || targetN === 0) return null;

  if (n === Infinity) {
    return calculateAverageOfN(solves, Infinity, trimPercentage);
  }

  let bestAvg: number | null = null;

  for (let i = n; i <= solves.length; i++) {
    const subset = solves.slice(i - n, i);
    const avg = calculateAverageOfN(subset, n, trimPercentage);

    if (avg !== null && (bestAvg === null || avg < bestAvg)) {
      bestAvg = avg;
    }
  }

  return bestAvg;
}

export function calculateBestMean(solves: Solve[], n: number): number | null {
  const targetN = n === Infinity ? solves.length : n;
  if (solves.length < targetN || targetN === 0) return null;

  if (n === Infinity) {
    return calculateMeanOfN(solves, Infinity);
  }

  let bestMean: number | null = null;

  for (let i = n; i <= solves.length; i++) {
    const subset = solves.slice(i - n, i);
    const mean = calculateMeanOfN(subset, n);

    if (mean !== null && (bestMean === null || mean < bestMean)) {
      bestMean = mean;
    }
  }

  return bestMean;
}

export function calculateBestConsistency(
  solves: Solve[],
  n: number,
): number | null {
  const targetN = n === Infinity ? solves.length : n;
  if (
    solves.length < targetN ||
    targetN === 0 ||
    (n === Infinity && targetN < 2)
  )
    return null;

  if (n === Infinity) {
    return calculateConsistencyOfN(solves, Infinity);
  }

  let bestConsistency: number | null = null;

  for (let i = n; i <= solves.length; i++) {
    const subset = solves.slice(i - n, i);
    const consistency = calculateConsistencyOfN(subset, n);

    if (
      consistency !== null &&
      (bestConsistency === null || consistency < bestConsistency)
    ) {
      bestConsistency = consistency;
    }
  }

  return bestConsistency;
}

export function calculateRollingAverage(
  solves: Solve[],
  n: number,
  trimPercentage: number = 5,
): (number | null)[] {
  if (solves.length === 0) return [];

  const results: (number | null)[] = [];

  for (let i = 0; i < solves.length; i++) {
    const startIdx = Math.max(0, i - n + 1);
    const window = solves.slice(startIdx, i + 1);

    results.push(calculateAverageOfN(window, window.length, trimPercentage));
  }

  return results;
}

export function calculateRollingMean(
  solves: Solve[],
  n: number,
): (number | null)[] {
  if (solves.length === 0) return [];

  const results: (number | null)[] = [];

  for (let i = 0; i < solves.length; i++) {
    const startIdx = Math.max(0, i - n + 1);
    const window = solves.slice(startIdx, i + 1);

    results.push(calculateMeanOfN(window, window.length));
  }

  return results;
}

export function calculateRollingConsistency(
  solves: Solve[],
  n: number,
): (number | null)[] {
  if (solves.length === 0 || n < 2) return [];

  const results: (number | null)[] = [];

  for (let i = 0; i < solves.length; i++) {
    const startIdx = Math.max(0, i - n + 1);
    const window = solves.slice(startIdx, i + 1);

    if (window.length < 2) {
      results.push(null);
    } else {
      results.push(calculateConsistencyOfN(window, window.length));
    }
  }

  return results;
}

export function isNewBest(newSolve: Solve, solves: Solve[]): boolean {
  const currentBest = getBestSingleTime(solves);
  const newTime = getEffectiveTime(newSolve);

  if (newTime === null) return false;
  if (currentBest === null) return true;

  return newTime < currentBest;
}

export function isNewBestAverage(
  newSolve: Solve,
  solves: Solve[],
  n: number,
  trimPercentage: number = 5,
): boolean {
  if (solves.length < n - 1) return false;

  const allSolves = [...solves, newSolve];
  const currentAverage = calculateAverageOfN(
    allSolves.slice(-n),
    n,
    trimPercentage,
  );

  if (currentAverage === null) return false;

  const previousBest = calculateBestAverage(solves, n, trimPercentage);

  if (previousBest === null) return true;

  return currentAverage < previousBest;
}

export function isNewBestMean(
  newSolve: Solve,
  solves: Solve[],
  n: number,
): boolean {
  if (solves.length < n - 1) return false;

  const allSolves = [...solves, newSolve];
  const currentMean = calculateMeanOfN(allSolves.slice(-n), n);

  if (currentMean === null) return false;

  const previousBest = calculateBestMean(solves, n);

  if (previousBest === null) return true;

  return currentMean < previousBest;
}

export function isNewBestConsistency(
  newSolve: Solve,
  solves: Solve[],
  n: number,
): boolean {
  if (solves.length < n - 1 || n < 2) return false;

  const allSolves = [...solves, newSolve];
  const currentConsistency = calculateConsistencyOfN(allSolves.slice(-n), n);

  if (currentConsistency === null) return false;

  const previousBest = calculateBestConsistency(solves, n);

  if (previousBest === null) return true;

  return currentConsistency < previousBest;
}

export interface OverallStats {
  totalSolves: number;
  bestSingle: number | null;
  worstSingle: number | null;
  overallMean: number | null;
  overallConsistency: number | null;
  currentAo5: number | null;
  currentAo12: number | null;
  currentAo100: number | null;
  bestAo5: number | null;
  bestAo12: number | null;
  bestAo100: number | null;
}

export function calculateOverallStats(
  solves: Solve[],
  trimPercentage: number = 5,
): OverallStats {
  if (solves.length === 0) {
    return {
      totalSolves: 0,
      bestSingle: null,
      worstSingle: null,
      overallMean: null,
      overallConsistency: null,
      currentAo5: null,
      currentAo12: null,
      currentAo100: null,
      bestAo5: null,
      bestAo12: null,
      bestAo100: null,
    };
  }

  return {
    totalSolves: solves.length,
    bestSingle: getBestSingleTime(solves),
    worstSingle: getWorstSingleTime(solves),
    overallMean: calculateMeanOfN(solves, Infinity),
    overallConsistency: calculateConsistencyOfN(solves, Infinity),
    currentAo5: calculateAverageOfN(solves, 5, trimPercentage),
    currentAo12: calculateAverageOfN(solves, 12, trimPercentage),
    currentAo100: calculateAverageOfN(solves, 100, trimPercentage),
    bestAo5: calculateBestAverage(solves, 5, trimPercentage),
    bestAo12: calculateBestAverage(solves, 12, trimPercentage),
    bestAo100: calculateBestAverage(solves, 100, trimPercentage),
  };
}

export function getStatLabel(stat: Stat | StatType): string {
  if (!stat.n || stat.n === Infinity) {
    return stat.type.slice(0, 1).toUpperCase() + stat.type.slice(1);
  }

  return `${stat.type.slice(0, 1).toUpperCase()}o${stat.n}`;
}
