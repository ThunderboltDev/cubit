import type { PUZZLE_METHODS } from "@/data/puzzles";
import type { Penalty, PuzzleType } from "@/types/puzzles";

//  Lettering

export type StickerTarget = string;

export type PieceGroup = "corners" | "edges" | "wings";

type BaseLetteringScheme = {
  id: string;
  name: string;
  puzzleType: PuzzleType;
  groups: Partial<Record<PieceGroup, Record<StickerTarget, string>>>;
  buffers: Partial<Record<PieceGroup, StickerTarget>>;
};

export type BuiltInScheme = Readonly<BaseLetteringScheme & { builtin: true }>;

export type CustomScheme = BaseLetteringScheme & {
  builtin: false;
  createdAt: number;
};

export type LetteringScheme = BuiltInScheme | CustomScheme;

// Methods

export type MethodForPuzzle<T extends PuzzleType> =
  (typeof PUZZLE_METHODS)[T][number];

export type Method = { [K in PuzzleType]: MethodForPuzzle<K> }[PuzzleType];

// Trainer-specific piece type for BLD methods
export type TrainerPieceType = "corners" | "edges";

// Generator types for dynamic scrambles
export type ScrambleGeneratorType =
  | "full-scramble"
  | "bld-corners"
  | "bld-edges";

//  Alg sets

export type TrainerCase = {
  id: string;
  name: string;
  alg: string;
  isDynamic?: boolean;
  generatorType?: ScrambleGeneratorType;
};

export type AlgGroup = {
  id: string;
  name: string;
  caseIds: string[];
};

export type AlgSet = {
  id: string;
  name: string;
  puzzleTypes: PuzzleType[];
  cases: Record<string, TrainerCase>;
  groups?: AlgGroup[];
  orientation?: string;
};

export type MethodStep = {
  algSetId: string;
  label: string;
  groupIds?: string[];
};

export type TrainerMethod<T extends Method = Method> = {
  id: T;
  name: string;
  puzzleTypes: PuzzleType[];
  pieceType?: TrainerPieceType;
  steps: MethodStep[];
};

// Solves

type BLDPuzzleType = Extract<PuzzleType, "333bf" | "444bf" | "555bf">;

type BaseTrainerSolve = {
  id: string;
  puzzleId: string;
  createdAt: number;
  penalty: Penalty;
  algSetId: string;
  groupId: string | null;
  caseId: string;
  methodId: Method;
};

export type TrainerSolve<T extends PuzzleType = PuzzleType> =
  BaseTrainerSolve & {
    puzzleType: T;
    time: number;
  } & (T extends BLDPuzzleType
      ? { memoTime?: number | null }
      : { memoTime?: never });

export type TrainerSolveInput<T extends PuzzleType = PuzzleType> = Omit<
  TrainerSolve<T>,
  "id" | "createdAt"
>;
