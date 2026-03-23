import type { AlgSet } from "@/types/trainer";

export const PLL: AlgSet = {
  id: "pll",
  name: "PLL",
  puzzleTypes: ["333", "333oh"],
  orientation: "x2",
  cases: {
    // Edges Only
    "pll-ua": {
      id: "pll-ua",
      name: "Ua Perm",
      alg: "R2 U' R' U' R U R U R U' R",
    },
    "pll-ub": {
      id: "pll-ub",
      name: "Ub Perm",
      alg: "R' U R' U' R' U' R' U R U R2",
    },
    "pll-h": {
      id: "pll-h",
      name: "H Perm",
      alg: "M2 U M2 U2 M2 U M2",
    },
    "pll-z": {
      id: "pll-z",
      name: "Z Perm",
      alg: "M2 U M2 U M' U2 M2 U2 M' U2",
    },
    // Corners Only
    "pll-aa": {
      id: "pll-aa",
      name: "Aa Perm",
      alg: "x R' U R' D2 R U' R' D2 R2 x'",
    },
    "pll-ab": {
      id: "pll-ab",
      name: "Ab Perm",
      alg: "x R2 D2 R U R' D2 R U' R x'",
    },
    "pll-e": {
      id: "pll-e",
      name: "E Perm",
      alg: "x' R U' R' D R U R' D' R U R' D R U' R' D' x",
    },
    // Edges & Corners - Adjacent Swap
    "pll-t": {
      id: "pll-t",
      name: "T Perm",
      alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
    },
    "pll-f": {
      id: "pll-f",
      name: "F Perm",
      alg: "R' U2 R' d' R' F' R2 U' R' U R' F R U' F",
    },
    "pll-ja": {
      id: "pll-ja",
      name: "Ja Perm",
      alg: "R' U L' U2 R U' R' U2 R L",
    },
    "pll-jb": {
      id: "pll-jb",
      name: "Jb Perm",
      alg: "R U R' F' R U R' U' R' F R2 U' R'",
    },
    "pll-ra": {
      id: "pll-ra",
      name: "Ra Perm",
      alg: "R U' R' U' R U R D R' U' R D' R' U2 R'",
    },
    "pll-rb": {
      id: "pll-rb",
      name: "Rb Perm",
      alg: "R' U2 R U2 R' F R U R' U' R' F' R2 U'",
    },
    // Edges & Corners - Diagonal Swap
    "pll-v": {
      id: "pll-v",
      name: "V Perm",
      alg: "R' U R' d' R' F' R2 U' R' U R' F R F",
    },
    "pll-y": {
      id: "pll-y",
      name: "Y Perm",
      alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    },
    "pll-na": {
      id: "pll-na",
      name: "Na Perm",
      alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
    },
    "pll-nb": {
      id: "pll-nb",
      name: "Nb Perm",
      alg: "r' D r U2 r' D r U2 r' D r U2 r' D r U2 r' D r",
    },
    // G Perms
    "pll-ga": {
      id: "pll-ga",
      name: "Ga Perm",
      alg: "R2 u R' U R' U' R u' R2 y' R' U R",
    },
    "pll-gb": {
      id: "pll-gb",
      name: "Gb Perm",
      alg: "R' U' R y R2 u R' U R U' R u' R2",
    },
    "pll-gc": {
      id: "pll-gc",
      name: "Gc Perm",
      alg: "R2 u' R U' R U R' u R2 y R U' R'",
    },
    "pll-gd": {
      id: "pll-gd",
      name: "Gd Perm",
      alg: "R U R' y' R2 u' R U' R' U R' u R2",
    },
  },
  groups: [
    {
      id: "edges-only",
      name: "Edges Only",
      caseIds: ["pll-ua", "pll-ub", "pll-h", "pll-z"],
    },
    {
      id: "corners-only",
      name: "Corners Only",
      caseIds: ["pll-aa", "pll-ab", "pll-e"],
    },
    {
      id: "adjacent-swap",
      name: "Adjacent Swap",
      caseIds: ["pll-t", "pll-f", "pll-ja", "pll-jb", "pll-ra", "pll-rb"],
    },
    {
      id: "diagonal-swap",
      name: "Diagonal Swap",
      caseIds: ["pll-v", "pll-y", "pll-na", "pll-nb"],
    },
    {
      id: "g-perms",
      name: "G Perms",
      caseIds: ["pll-ga", "pll-gb", "pll-gc", "pll-gd"],
    },
    {
      id: "2look-pll",
      name: "2-Look PLL",
      caseIds: ["pll-ua", "pll-ub", "pll-h", "pll-aa", "pll-ab", "pll-e"],
    },
  ],
};
