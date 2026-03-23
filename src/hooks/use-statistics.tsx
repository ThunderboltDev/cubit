import { useMemo } from "react";
import { usePuzzles } from "@/hooks/use-puzzles";
import { useSolves } from "@/hooks/use-solves";
import {
  calculateBestConsistency,
  calculateBestMean,
  calculateConsistencyOfN,
  calculateMeanOfN,
  calculateOverallStats,
  calculateRollingAverage,
  calculateRollingConsistency,
  calculateRollingMean,
  getEffectiveTime,
  type OverallStats,
} from "@/lib/stats";
import type { ChartConfig } from "@/data/defaults";

export type ExtendedStats = OverallStats & {
  currentMo5: number | null;
  currentMo12: number | null;
  currentMo100: number | null;
  bestMo5: number | null;
  bestMo12: number | null;
  bestMo100: number | null;
  currentCo5: number | null;
  currentCo12: number | null;
  currentCo100: number | null;
  bestCo5: number | null;
  bestCo12: number | null;
  bestCo100: number | null;
};

export type ChartDataPoint = {
  index: number;
  value: number | null;
};

type UseStatisticsReturn = {
  stats: ExtendedStats;
  computeChartData: (config: ChartConfig) => ChartDataPoint[];
  solveCount: number;
};

export function useStatistics(): UseStatisticsReturn {
  const { currentPuzzle } = usePuzzles();
  const { solves } = useSolves({ puzzleId: currentPuzzle.id });

  return useMemo(() => {
    const baseStats = calculateOverallStats(
      solves,
      currentPuzzle.trimPercentage,
    );

    const extendedStats: ExtendedStats = {
      ...baseStats,
      currentMo5: calculateMeanOfN(solves, 5),
      currentMo12: calculateMeanOfN(solves, 12),
      currentMo100: calculateMeanOfN(solves, 100),
      bestMo5: calculateBestMean(solves, 5),
      bestMo12: calculateBestMean(solves, 12),
      bestMo100: calculateBestMean(solves, 100),
      currentCo5: calculateConsistencyOfN(solves, 5),
      currentCo12: calculateConsistencyOfN(solves, 12),
      currentCo100: calculateConsistencyOfN(solves, 100),
      bestCo5: calculateBestConsistency(solves, 5),
      bestCo12: calculateBestConsistency(solves, 12),
      bestCo100: calculateBestConsistency(solves, 100),
    };

    const computeChartData = (config: ChartConfig): ChartDataPoint[] => {
      if (solves.length === 0) return [];

      const { type, n, phase } = config;

      const chronological = [...solves]
        .reverse()
        .filter((s) => getEffectiveTime(s) !== null);

      let data: ChartDataPoint[] = [];

      switch (type) {
        case "solves": {
          const recent = chronological.slice(-n);
          const offset = chronological.length - recent.length;
          data = recent.map((s, i) => ({
            index: offset + i + 1,
            value: getEffectiveTime(s),
          }));
          break;
        }

        case "inspection": {
          const recent = chronological.slice(-n);
          const offset = chronological.length - recent.length;
          data = recent.map((s, i) => {
            let val: number | null = null;
            if (s.kind === "inspection" || s.kind === "full") {
              val = s.inspectionTime;
            }
            return {
              index: offset + i + 1,
              value: val,
            };
          });
          break;
        }

        case "multiphase": {
          const recent = chronological.slice(-n);
          const offset = chronological.length - recent.length;
          const targetPhase = (phase ?? 1) - 1;
          data = recent.map((s, i) => {
            let val: number | null = null;
            if (
              (s.kind === "multiphase" || s.kind === "full") &&
              s.phases[targetPhase] !== undefined
            ) {
              val = s.phases[targetPhase];
            }
            return {
              index: offset + i + 1,
              value: val,
            };
          });
          break;
        }

        case "average": {
          const values = calculateRollingAverage(
            chronological,
            n,
            currentPuzzle.trimPercentage,
          );
          data = values.map((v, i) => ({
            index: i + 1,
            value: v,
          }));
          break;
        }

        case "mean": {
          const values = calculateRollingMean(chronological, n);
          data = values.map((v, i) => ({
            index: i + 1,
            value: v,
          }));
          break;
        }

        case "consistency": {
          const values = calculateRollingConsistency(chronological, n);
          data = values.map((v, i) => ({
            index: i + 1,
            value: v,
          }));
          break;
        }
      }

      return data;
    };

    return {
      stats: extendedStats,
      computeChartData,
      solveCount: solves.length,
    };
  }, [solves, currentPuzzle]);
}
