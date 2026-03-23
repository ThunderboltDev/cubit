import type { VisualizationFormat } from "cubing/twisty";
import type { PUZZLE_TYPES } from "@/data/puzzles";
import type { DisplayStatsConfig } from "@/types/stats";
import type { LetteringScheme, MethodForPuzzle } from "@/types/trainer";

export type PuzzleType = (typeof PUZZLE_TYPES)[number];

export type Penalty = "OK" | "+2" | "DNF";

export type InputMethod = "timer" | "manual" | "stackmat" | "bluetooth";

export type BLDPuzzleType = Extract<
  PuzzleType,
  "333bf" | "444bf" | "555bf" | "333mbf"
>;

export type Puzzle<T extends PuzzleType = PuzzleType> = {
  id: string;
  name: string; // label set by user
  // can't be changed later
  type: T;
  inspectionEnabled: boolean;
  inspectionDuration: number;
  multiphaseEnabled: boolean;
  multiphaseCount: number;
  trimPercentage: number;
  // trainer
  method: MethodForPuzzle<T>;
  trainerMethodId?: MethodForPuzzle<T> | null;
  trainerCornerMethodId?: MethodForPuzzle<T> | null;
  trainerEdgeMethodId?: MethodForPuzzle<T> | null;
  lettering: T extends BLDPuzzleType ? LetteringScheme : undefined;
  // can be changed later
  inputMethod: InputMethod;
  scramblePreview: boolean;
  scramblePreviewVisualization: VisualizationFormat;
  displayStats: DisplayStatsConfig;
};

type BaseSolve = {
  id: string;
  time: number;
  scramble: string;
  puzzleId: string;
  penalty: Penalty;
  createdAt: number;
};

export type Solve =
  | ({ kind: "base" } & BaseSolve)
  | ({ kind: "inspection" } & BaseSolve & { inspectionTime: number })
  | ({ kind: "multiphase" } & BaseSolve & { phases: number[] })
  | ({
      kind: "full";
    } & BaseSolve & { inspectionTime: number; phases: number[] });

export type SolveWithEffectiveTime = Solve & { effectiveTime: number | null };

type BaseSolveInput = {
  puzzleId: string;
  time: number;
  scramble: string;
  penalty: Penalty;
};

export type SolveInput =
  | ({ kind: "base" } & BaseSolveInput)
  | ({ kind: "inspection" } & BaseSolveInput & { inspectionTime: number })
  | ({ kind: "multiphase" } & BaseSolveInput & { phases: number[] })
  | ({ kind: "full" } & BaseSolveInput & {
        inspectionTime: number;
        phases: number[];
      });
