// Alg Setsz

import { THREE_STYLE_EDGES } from "@/data/trainer/algs/3style-edges";
import { BLD_CORNERS } from "@/data/trainer/algs/bld-corners";
import { BLD_EDGES } from "@/data/trainer/algs/bld-edges";
import { CMLL } from "@/data/trainer/algs/cmll";
import { CROSS } from "@/data/trainer/algs/cross";
import { F2L } from "@/data/trainer/algs/f2l";
import { FIRST_BLOCK } from "@/data/trainer/algs/first-block";
import { OLL } from "@/data/trainer/algs/oll";
import { PLL } from "@/data/trainer/algs/pll";

// Methods

import {
  BLD_3STYLE_CORNERS,
  BLD_3STYLE_EDGES,
  BLD_EKA_CORNERS,
  BLD_M2_EDGES,
  BLD_OP_CORNERS,
  BLD_OP_EDGES,
  BLD_OROZCO_CORNERS,
  BLD_OROZCO_EDGES,
} from "@/data/trainer/methods/bld";
import { CFOP } from "@/data/trainer/methods/cfop";
import { ROUX } from "@/data/trainer/methods/roux";

import type { PuzzleType } from "@/types/puzzles";
import type { AlgSet, TrainerMethod, TrainerPieceType } from "@/types/trainer";

export const ALG_SETS: Record<string, AlgSet> = {
  [OLL.id]: OLL,
  [PLL.id]: PLL,
  [F2L.id]: F2L,
  [CROSS.id]: CROSS,
  [CMLL.id]: CMLL,
  [FIRST_BLOCK.id]: FIRST_BLOCK,
  [BLD_CORNERS.id]: BLD_CORNERS,
  [BLD_EDGES.id]: BLD_EDGES,
  [THREE_STYLE_EDGES.id]: THREE_STYLE_EDGES,
};

export const TRAINER_METHODS: Record<string, TrainerMethod> = {
  [CFOP.id]: CFOP,
  [ROUX.id]: ROUX,
};

// BLD methods keyed by "{pieceType}:{id}" to avoid collisions
// (e.g. "OP" exists for both corners and edges)
export const BLD_CORNER_METHODS: TrainerMethod[] = [
  BLD_OP_CORNERS,
  BLD_OROZCO_CORNERS,
  BLD_3STYLE_CORNERS,
  BLD_EKA_CORNERS,
];

export const BLD_EDGE_METHODS: TrainerMethod[] = [
  BLD_OP_EDGES,
  BLD_M2_EDGES,
  BLD_OROZCO_EDGES,
  BLD_3STYLE_EDGES,
];

export function getAlgSet(id: string): AlgSet | undefined {
  return ALG_SETS[id];
}

export function getMethod(id: string): TrainerMethod | undefined {
  return TRAINER_METHODS[id];
}

export function getAlgSetsForPuzzle(puzzleType: PuzzleType): AlgSet[] {
  return Object.values(ALG_SETS).filter((s) =>
    s.puzzleTypes.includes(puzzleType),
  );
}

export function getMethodsForPuzzle(puzzleType: PuzzleType): TrainerMethod[] {
  return Object.values(TRAINER_METHODS).filter((m) =>
    m.puzzleTypes.includes(puzzleType),
  );
}

export function getBldMethodsForPuzzle(
  puzzleType: PuzzleType,
  pieceType: TrainerPieceType,
): TrainerMethod[] {
  const methods =
    pieceType === "corners" ? BLD_CORNER_METHODS : BLD_EDGE_METHODS;
  return methods.filter((m) => m.puzzleTypes.includes(puzzleType));
}

export function isBldPuzzleType(
  puzzleType: PuzzleType,
): puzzleType is Extract<PuzzleType, "333bf" | "444bf" | "555bf" | "333mbf"> {
  return (
    puzzleType === "333bf" ||
    puzzleType === "444bf" ||
    puzzleType === "555bf" ||
    puzzleType === "333mbf"
  );
}
