import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useState } from "react";
import { db } from "@/lib/db";
import type { Penalty, Solve, SolveInput } from "@/types/puzzles";

export type SolveSortOption = "newest" | "oldest" | "best" | "worst";
export type SolvePenaltyFilter = "all" | Penalty;

interface UseSolvesOptions {
  puzzleId?: string;
  penaltyFilter?: SolvePenaltyFilter;
  sortOption?: SolveSortOption;
}

function effectiveTime(solve: Solve): number | null {
  if (solve.penalty === "DNF") return null;
  if (solve.penalty === "+2") return solve.time + 2000;
  return solve.time;
}

export function useSolves(options: UseSolvesOptions = {}) {
  const { puzzleId, penaltyFilter = "all", sortOption = "newest" } = options;
  const [lastLoaded, setLastLoaded] = useState({
    puzzleId,
    penaltyFilter,
    sortOption,
  });

  const totalCount = useLiveQuery(
    () =>
      puzzleId ?
        db.solves.where("puzzleId").equals(puzzleId).count()
      : Promise.resolve(0),
    [puzzleId],
    0,
  );

  const solves = useLiveQuery(async () => {
    if (!puzzleId) {
      setLastLoaded({ puzzleId, penaltyFilter, sortOption });
      return [];
    }

    let results: Solve[];

    if (penaltyFilter !== "all") {
      results = await db.solves
        .where("[puzzleId+penalty]")
        .equals([puzzleId, penaltyFilter])
        .toArray();

      if (sortOption === "newest" || sortOption === "oldest") {
        results.sort((a, b) =>
          sortOption === "newest" ?
            b.createdAt - a.createdAt
          : a.createdAt - b.createdAt,
        );
      } else {
        results.sort((a, b) => {
          const ae = effectiveTime(a);
          const be = effectiveTime(b);

          if (ae === null && be === null) return 0;
          if (ae === null) return sortOption === "worst" ? -1 : 1;
          if (be === null) return sortOption === "worst" ? 1 : -1;

          return sortOption === "best" ? ae - be : be - ae;
        });
      }
    } else {
      const collection = db.solves
        .where("[puzzleId+createdAt]")
        .between(
          [puzzleId, Dexie.minKey],
          [puzzleId, Dexie.maxKey],
          true,
          true,
        );

      if (sortOption === "newest") {
        results = await collection.reverse().toArray();
      } else if (sortOption === "oldest") {
        results = await collection.toArray();
      } else {
        results = await collection.toArray();
        results.sort((a, b) => {
          const ae = effectiveTime(a);
          const be = effectiveTime(b);

          if (ae === null && be === null) return 0;
          if (ae === null) return sortOption === "worst" ? -1 : 1;
          if (be === null) return sortOption === "worst" ? 1 : -1;

          return sortOption === "best" ? ae - be : be - ae;
        });
      }
    }

    setLastLoaded({ puzzleId, penaltyFilter, sortOption });
    return results;
  }, [puzzleId, penaltyFilter, sortOption]);

  const addSolve = useCallback(async (solveData: SolveInput) => {
    const newSolve: Solve = {
      ...solveData,
      id: crypto.randomUUID() as string,
      createdAt: Date.now(),
    };
    await db.solves.add(newSolve);
    return newSolve;
  }, []);

  const updatePenalty = useCallback(async (id: string, penalty: Penalty) => {
    await db.solves.update(id, { penalty });
  }, []);

  const deleteSolve = useCallback(async (id: string) => {
    await db.solves.delete(id);
  }, []);

  const isLoading =
    solves === undefined ||
    puzzleId !== lastLoaded.puzzleId ||
    penaltyFilter !== lastLoaded.penaltyFilter ||
    sortOption !== lastLoaded.sortOption;

  return {
    solves: solves ?? [],
    isLoading,
    totalCount,
    addSolve,
    updatePenalty,
    deleteSolve,
  };
}
