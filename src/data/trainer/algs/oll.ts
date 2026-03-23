import type { AlgSet } from "@/types/trainer";

export const OLL: AlgSet = {
  id: "oll",
  name: "OLL",
  puzzleTypes: ["333", "333oh"],
  orientation: "x2",
  cases: {
    // Dot
    "oll-1": {
      id: "oll-1",
      name: "OLL 1",
      alg: "R U2 R2 F R F' U2 R' F R F'",
    },
    "oll-2": {
      id: "oll-2",
      name: "OLL 2",
      alg: "r U r' U2 r U2 R' U2 R U' r'",
    },
    "oll-3": {
      id: "oll-3",
      name: "OLL 3",
      alg: "r' R2 U R' U r U2 r' U M'",
    },
    "oll-4": {
      id: "oll-4",
      name: "OLL 4",
      alg: "M U' r U2 r' U' R U' R' M'",
    },
    // Line
    "oll-5": {
      id: "oll-5",
      name: "OLL 5",
      alg: "r' U2 R U R' U r",
    },
    "oll-6": {
      id: "oll-6",
      name: "OLL 6",
      alg: "r U2 R' U' R U' r'",
    },
    "oll-7": {
      id: "oll-7",
      name: "OLL 7",
      alg: "r U R' U R U2 r'",
    },
    "oll-8": {
      id: "oll-8",
      name: "OLL 8",
      alg: "r' U' R U' R' U2 r",
    },
    // Cross
    "oll-21": {
      id: "oll-21",
      name: "OLL 21",
      alg: "R U2 R' U' R U R' U' R U' R'",
    },
    "oll-22": {
      id: "oll-22",
      name: "OLL 22",
      alg: "R U2 R2 U' R2 U' R2 U2 R",
    },
    "oll-23": {
      id: "oll-23",
      name: "OLL 23",
      alg: "R2 D R' U2 R D' R' U2 R'",
    },
    "oll-24": {
      id: "oll-24",
      name: "OLL 24",
      alg: "r U R' U' r' F R F'",
    },
    "oll-25": {
      id: "oll-25",
      name: "OLL 25",
      alg: "F' r U R' U' r' F R",
    },
    // T-shape
    "oll-33": {
      id: "oll-33",
      name: "OLL 33",
      alg: "R U R' U' R' F R F'",
    },
    "oll-45": {
      id: "oll-45",
      name: "OLL 45",
      alg: "F R U R' U' F'",
    },
    // Square
    "oll-46": {
      id: "oll-46",
      name: "OLL 46",
      alg: "R' U' R' F R F' U R",
    },
    "oll-47": {
      id: "oll-47",
      name: "OLL 47",
      alg: "F' L' U' L U F",
    },
  },
  groups: [
    {
      id: "dot",
      name: "Dot",
      caseIds: ["oll-1", "oll-2", "oll-3", "oll-4"],
    },
    {
      id: "line",
      name: "Line",
      caseIds: ["oll-5", "oll-6", "oll-7", "oll-8"],
    },
    {
      id: "cross",
      name: "Cross",
      caseIds: ["oll-21", "oll-22", "oll-23", "oll-24", "oll-25"],
    },
    {
      id: "t-shape",
      name: "T-Shape",
      caseIds: ["oll-33", "oll-45"],
    },
    {
      id: "square",
      name: "Square",
      caseIds: ["oll-46", "oll-47"],
    },
    {
      id: "2look-oll",
      name: "2-Look OLL",
      caseIds: [
        "oll-21",
        "oll-22",
        "oll-23",
        "oll-24",
        "oll-25",
        "oll-45",
        "oll-47",
      ],
    },
  ],
};
