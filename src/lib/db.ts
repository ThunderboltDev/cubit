import Dexie, { type EntityTable } from "dexie";

import type { Solve } from "@/types/puzzles";
import type { TrainerSolve } from "@/types/trainer";

class CubitDatabase extends Dexie {
  solves!: EntityTable<Solve, "id">;
  trainerSolves!: EntityTable<TrainerSolve, "id">;

  constructor() {
    super("cubit-db");

    this.version(1).stores({
      solves:
        "id, puzzleId, createdAt, penalty, [puzzleId+createdAt], [puzzleId+penalty]",
      trainerSolves:
        "id, puzzleId, puzzleType, algSetId, groupId, caseId, createdAt, [puzzleId+createdAt]",
    });
  }
}

export const db = new CubitDatabase();
