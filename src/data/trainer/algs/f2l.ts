import type { AlgSet } from "@/types/trainer";

export const F2L: AlgSet = {
  id: "f2l",
  name: "F2L",
  puzzleTypes: ["333", "333oh"],
  orientation: "x2",
  cases: {
    // Basic Inserts (Easy Cases)
    "f2l-1": {
      id: "f2l-1",
      name: "F2L 1",
      alg: "U (R U' R')",
    },
    "f2l-2": {
      id: "f2l-2",
      name: "F2L 2",
      alg: "y' U' (R' U R)",
    },
    "f2l-3": {
      id: "f2l-3",
      name: "F2L 3",
      alg: "y U' (L' U L)",
    },
    "f2l-4": {
      id: "f2l-4",
      name: "F2L 4",
      alg: "y' (R' U' R)",
    },
    // Corner & Edge on Top (Connected/Disconnected)
    "f2l-5": {
      id: "f2l-5",
      name: "F2L 5",
      alg: "U' R U R' U2 R U' R'",
    },
    "f2l-6": {
      id: "f2l-6",
      name: "F2L 6",
      alg: "y' U R' U' R U2' R' U R",
    },
    "f2l-7": {
      id: "f2l-7",
      name: "F2L 7",
      alg: "U' R U2' R' U2 R U' R'",
    },
    "f2l-8": {
      id: "f2l-8",
      name: "F2L 8",
      alg: "y' U R' U2 R U2' R' U R",
    },
    "f2l-9": {
      id: "f2l-9",
      name: "F2L 9",
      alg: "y' R' U R U' d' R U R'",
    },
    "f2l-10": {
      id: "f2l-10",
      name: "F2L 10",
      alg: "R U' R' U d R' U' R",
    },
    "f2l-11": {
      id: "f2l-11",
      name: "F2L 11",
      alg: "y' d R' U' R U' R' U' R",
    },
    "f2l-12": {
      id: "f2l-12",
      name: "F2L 12",
      alg: "U' R U R' U R U R'",
    },
    "f2l-13": {
      id: "f2l-13",
      name: "F2L 13",
      alg: "U' R U2' R' d R' U' R",
    },
    "f2l-14": {
      id: "f2l-14",
      name: "F2L 14",
      alg: "R' U2 R2 U R2' U R",
    },
    "f2l-15": {
      id: "f2l-15",
      name: "F2L 15",
      alg: "y' d R' U R U' R' U' R",
    },
    "f2l-16": {
      id: "f2l-16",
      name: "F2L 16",
      alg: "U' R U' R' U R U R'",
    },
    // Corner Pointing Up, Edge on Top
    "f2l-17": {
      id: "f2l-17",
      name: "F2L 17",
      alg: "R U2' R' U' R U R'",
    },
    "f2l-18": {
      id: "f2l-18",
      name: "F2L 18",
      alg: "y' R' U2 R U R' U' R",
    },
    "f2l-19": {
      id: "f2l-19",
      name: "F2L 19",
      alg: "U R U2 R' U R U' R'",
    },
    "f2l-20": {
      id: "f2l-20",
      name: "F2L 20",
      alg: "y' U' R' U2 R U' R' U R",
    },
    "f2l-21": {
      id: "f2l-21",
      name: "F2L 21",
      alg: "U2 R U R' U R U' R'",
    },
    "f2l-22": {
      id: "f2l-22",
      name: "F2L 22",
      alg: "y' U2 R' U' R U' R' U R",
    },
    "f2l-23": {
      id: "f2l-23",
      name: "F2L 23",
      alg: "U2 R2 U2 R' U' R U' R2",
    },
    "f2l-24": {
      id: "f2l-24",
      name: "F2L 24",
      alg: "y' U2 R2 U2 R U R' U R2",
    },
    // Corner in Bottom, Edge on Top
    "f2l-25": {
      id: "f2l-25",
      name: "F2L 25",
      alg: "U R U' R' d' L' U L",
    },
    "f2l-26": {
      id: "f2l-26",
      name: "F2L 26",
      alg: "y' U' R' U R r' U' R U M'",
    },
    "f2l-27": {
      id: "f2l-27",
      name: "F2L 27",
      alg: "y' R' U' R U R' U' R",
    },
    "f2l-28": {
      id: "f2l-28",
      name: "F2L 28",
      alg: "R U R' U' R U R'",
    },
    "f2l-29": {
      id: "f2l-29",
      name: "F2L 29",
      alg: "R U' R' U R U' R'",
    },
    "f2l-30": {
      id: "f2l-30",
      name: "F2L 30",
      alg: "y' R' U R U' R' U R",
    },
    // Corner on Top, Edge in Middle
    "f2l-31": {
      id: "f2l-31",
      name: "F2L 31",
      alg: "U' R U' R' U2 R U' R'",
    },
    "f2l-32": {
      id: "f2l-32",
      name: "F2L 32",
      alg: "d R' U R U2 R' U R",
    },
    "f2l-33": {
      id: "f2l-33",
      name: "F2L 33",
      alg: "U' R U R' d R' U' R",
    },
    "f2l-34": {
      id: "f2l-34",
      name: "F2L 34",
      alg: "d R' U' R d' R U R'",
    },
    "f2l-35": {
      id: "f2l-35",
      name: "F2L 35",
      alg: "R U' R' d R' U R",
    },
    "f2l-36": {
      id: "f2l-36",
      name: "F2L 36",
      alg: "R U R' U' R U R' U' R U R'",
    },
    // Corner in Bottom, Edge in Middle (Pieces in Slot)
    "f2l-37": {
      id: "f2l-37",
      name: "F2L 37",
      alg: "R U' R' U' R U R' U2 R U' R'",
    },
    "f2l-38": {
      id: "f2l-38",
      name: "F2L 38",
      alg: "R U R' U2 R U' R' U R U R'",
    },
    "f2l-39": {
      id: "f2l-39",
      name: "F2L 39",
      alg: "R U' R' d R' U' R U' R' U' R",
    },
    "f2l-40": {
      id: "f2l-40",
      name: "F2L 40",
      alg: "R U R' U' R U' R' U2 y' R' U' R",
    },
    "f2l-41": {
      id: "f2l-41",
      name: "F2L 41",
      alg: "R U' R' U y' R' U2 R U2' R' U R",
    },
  },
  groups: [
    {
      id: "basic-inserts",
      name: "Basic Inserts",
      caseIds: ["f2l-1", "f2l-2", "f2l-3", "f2l-4"],
    },
    {
      id: "corner-edge-top",
      name: "Corner & Edge on Top",
      caseIds: [
        "f2l-5",
        "f2l-6",
        "f2l-7",
        "f2l-8",
        "f2l-9",
        "f2l-10",
        "f2l-11",
        "f2l-12",
        "f2l-13",
        "f2l-14",
        "f2l-15",
        "f2l-16",
      ],
    },
    {
      id: "corner-up-edge-top",
      name: "Corner Pointing Up",
      caseIds: [
        "f2l-17",
        "f2l-18",
        "f2l-19",
        "f2l-20",
        "f2l-21",
        "f2l-22",
        "f2l-23",
        "f2l-24",
      ],
    },
    {
      id: "corner-bottom-edge-top",
      name: "Corner Bottom, Edge Top",
      caseIds: ["f2l-25", "f2l-26", "f2l-27", "f2l-28", "f2l-29", "f2l-30"],
    },
    {
      id: "corner-top-edge-middle",
      name: "Corner Top, Edge Middle",
      caseIds: ["f2l-31", "f2l-32", "f2l-33", "f2l-34", "f2l-35", "f2l-36"],
    },
    {
      id: "pieces-in-slot",
      name: "Pieces in Slot",
      caseIds: ["f2l-37", "f2l-38", "f2l-39", "f2l-40", "f2l-41"],
    },
    {
      id: "easy-cases",
      name: "Easy Cases",
      caseIds: ["f2l-1", "f2l-2", "f2l-3", "f2l-4", "f2l-27", "f2l-28"],
    },
  ],
};
