import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useState } from "react";
import { db } from "@/lib/db";
import type { Penalty } from "@/types/puzzles";
import type { TrainerSolve, TrainerSolveInput } from "@/types/trainer";

export type TrainerSolveSortOption = "newest" | "oldest" | "best" | "worst";
export type TrainerSolvePenaltyFilter = "all" | Penalty;

interface UseTrainerSolvesOptions {
  puzzleId: string;
  algSetId?: string;
  groupId?: string;
  caseId?: string;
  penaltyFilter?: TrainerSolvePenaltyFilter;
  sortOption?: TrainerSolveSortOption;
}

function effectiveTime(solve: TrainerSolve): number | null {
  if (solve.penalty === "DNF") return null;
  if (solve.penalty === "+2") return solve.time + 2000;
  return solve.time;
}

export function useTrainerSolves({
  puzzleId,
  algSetId,
  groupId,
  caseId,
  penaltyFilter = "all",
  sortOption = "newest",
}: UseTrainerSolvesOptions) {
  const [lastLoaded, setLastLoaded] = useState({
    puzzleId,
    algSetId,
    groupId,
    caseId,
    penaltyFilter,
    sortOption,
  });

  const totalCount = useLiveQuery(
    () =>
      puzzleId ?
        db.trainerSolves.where("puzzleId").equals(puzzleId).count()
      : Promise.resolve(0),
    [puzzleId],
    0,
  );

  const solves = useLiveQuery(async () => {
    if (!puzzleId) {
      setLastLoaded({
        puzzleId,
        algSetId,
        groupId,
        caseId,
        penaltyFilter,
        sortOption,
      });
      return [];
    }

    let query = db.trainerSolves
      .where("[puzzleId+createdAt]")
      .between(
        [puzzleId, Dexie.minKey],
        [puzzleId, Dexie.maxKey],
        true,
        true,
      ) as Dexie.Collection<TrainerSolve>;

    if (algSetId)
      query = query.filter(
        (s) => s.algSetId === algSetId,
      ) as Dexie.Collection<TrainerSolve>;
    if (groupId)
      query = query.filter(
        (s) => s.groupId === groupId,
      ) as Dexie.Collection<TrainerSolve>;
    if (caseId)
      query = query.filter(
        (s) => s.caseId === caseId,
      ) as Dexie.Collection<TrainerSolve>;

    let results = await query.toArray();

    if (penaltyFilter !== "all") {
      results = results.filter((s) => s.penalty === penaltyFilter);
    }

    if (sortOption === "newest") {
      results.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortOption === "oldest") {
      results.sort((a, b) => a.createdAt - b.createdAt);
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

    setLastLoaded({
      puzzleId,
      algSetId,
      groupId,
      caseId,
      penaltyFilter,
      sortOption,
    });

    return results;
  }, [puzzleId, algSetId, groupId, caseId, penaltyFilter, sortOption]);

  const addSolve = useCallback(async (input: TrainerSolveInput) => {
    const solve: TrainerSolve = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    await db.trainerSolves.add(solve);
    return solve;
  }, []);

  const updatePenalty = useCallback(async (id: string, penalty: Penalty) => {
    await db.trainerSolves.update(id, { penalty });
  }, []);

  const deleteSolve = useCallback(async (id: string) => {
    await db.trainerSolves.delete(id);
  }, []);

  const isLoading =
    solves === undefined ||
    puzzleId !== lastLoaded.puzzleId ||
    algSetId !== lastLoaded.algSetId ||
    groupId !== lastLoaded.groupId ||
    caseId !== lastLoaded.caseId ||
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
