import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback } from "react";
import { db } from "@/lib/db";
import type { Penalty } from "@/types/puzzles";
import type { TrainerSolve, TrainerSolveInput } from "@/types/trainer";

interface UseTrainerSolvesOptions {
  puzzleId: string;
  algSetId?: string;
  groupId?: string;
  caseId?: string;
}

export function useTrainerSolves({
  puzzleId,
  algSetId,
  groupId,
  caseId,
}: UseTrainerSolvesOptions) {
  const solves = useLiveQuery(
    async () => {
      let query = db.trainerSolves
        .where("[puzzleId+createdAt]")
        .between([puzzleId, Dexie.minKey], [puzzleId, Dexie.maxKey]);

      if (algSetId) query = query.filter((s) => s.algSetId === algSetId);
      if (groupId) query = query.filter((s) => s.groupId === groupId);
      if (caseId) query = query.filter((s) => s.caseId === caseId);

      return (await query.sortBy("createdAt")).reverse();
    },
    [puzzleId, algSetId, groupId, caseId],
    [],
  );

  const addSolve = useCallback(
    async (input: TrainerSolveInput): Promise<TrainerSolve> => {
      const solve: TrainerSolve = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      await db.trainerSolves.add(solve);
      return solve;
    },
    [],
  );

  const updatePenalty = useCallback(async (id: string, penalty: Penalty) => {
    await db.trainerSolves.update(id, { penalty });
  }, []);

  const deleteSolve = useCallback(async (id: string) => {
    await db.trainerSolves.delete(id);
  }, []);

  return { solves, addSolve, updatePenalty, deleteSolve };
}
