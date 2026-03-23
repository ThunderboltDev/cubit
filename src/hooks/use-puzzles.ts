import { useCallback, useMemo } from "react";
import { DEFAULT_PUZZLE } from "@/data/defaults";
import { db } from "@/lib/db";
import { usePuzzlesStore } from "@/stores/puzzles";
import type { Puzzle } from "@/types/puzzles";
import type { DisplayStatsConfig } from "@/types/stats";

export function usePuzzles() {
  const store = usePuzzlesStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load
  const currentPuzzle = useMemo(() => {
    return store.getActivePuzzle() ?? DEFAULT_PUZZLE;
  }, [store.puzzles, store.activePuzzleId]);

  const puzzleList = store.puzzles;

  const switchPuzzle = useCallback(
    (puzzleId: string) => {
      store.setActivePuzzle(puzzleId);
    },
    [store],
  );

  const createPuzzle = useCallback(
    (puzzle: Omit<Puzzle, "id">) => {
      store.addPuzzle(puzzle);
    },
    [store],
  );

  const updatePuzzle = useCallback(
    (puzzleId: string, updates: Partial<Puzzle>) => {
      store.updatePuzzle(puzzleId, updates);
    },
    [store],
  );

  const deletePuzzle = useCallback(
    async (puzzleId: string) => {
      await db.solves.where("puzzleId").equals(puzzleId).delete();
      store.deletePuzzle(puzzleId);
    },
    [store],
  );

  const updateDisplayStats = useCallback(
    (puzzleId: string, config: DisplayStatsConfig) => {
      store.updateDisplayStats(puzzleId, config);
    },
    [store],
  );

  return {
    currentPuzzle,
    puzzleList,
    switchPuzzle,
    createPuzzle,
    updatePuzzle,
    deletePuzzle,
    updateDisplayStats,
  };
}
