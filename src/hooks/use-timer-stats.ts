import { useMemo } from "react";
import { usePuzzles } from "@/hooks/use-puzzles";
import { useSolves } from "@/hooks/use-solves";
import {
  calculateAverageOfN,
  calculateBestAverage,
  calculateBestConsistency,
  calculateBestMean,
  calculateBestOfN,
  calculateConsistencyOfN,
  calculateMeanOfN,
} from "@/lib/stats";
import type { DisplayStats, Stat } from "@/types/stats";

export function useTimerStats(): DisplayStats | null {
  const { currentPuzzle } = usePuzzles();
  const { solves: rawSolves } = useSolves({ puzzleId: currentPuzzle?.id });

  return useMemo(() => {
    if (!currentPuzzle || !rawSolves?.length) {
      return null;
    }

    const solves = [...rawSolves].reverse();
    const { displayStats, trimPercentage } = currentPuzzle;
    const statsWithValues: Stat[] = [];

    for (const stat of displayStats.stats) {
      let value: number | null = null;
      let isNewRecord = false;

      const n = !stat.n ? Infinity : stat.n;

      switch (stat.type) {
        case "average": {
          value = calculateAverageOfN(solves, n, trimPercentage);

          if (value === null) break;

          const historicalBest = calculateBestAverage(
            solves.slice(0, -1),
            n,
            trimPercentage,
          );

          isNewRecord = historicalBest === null || value < historicalBest;

          break;
        }
        case "best": {
          value = calculateBestOfN(solves, n);

          if (value === null) break;

          const historicalBest = calculateBestOfN(solves.slice(0, -1), n);

          isNewRecord = historicalBest === null || value < historicalBest;

          break;
        }
        case "mean": {
          value = calculateMeanOfN(solves, n);

          if (value === null) break;

          const historicalBest = calculateBestMean(solves.slice(0, -1), n);

          isNewRecord = historicalBest === null || value < historicalBest;

          break;
        }
        case "consistency": {
          value = calculateConsistencyOfN(solves, n);

          if (value === null) break;

          const historicalBest = calculateBestConsistency(
            solves.slice(0, -1),
            n,
          );

          isNewRecord = historicalBest === null || value < historicalBest;

          break;
        }
      }

      statsWithValues.push({
        value,
        type: stat.type,
        n,
        isNewRecord,
      });
    }

    return {
      style: displayStats.style,
      orientation: displayStats.orientation,
      stats: statsWithValues,
    };
  }, [currentPuzzle, rawSolves]);
}
