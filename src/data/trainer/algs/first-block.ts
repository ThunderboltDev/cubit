import type { AlgSet } from "@/types/trainer";

export const FIRST_BLOCK: AlgSet = {
  id: "first-block",
  name: "First Block",
  puzzleTypes: ["333"],
  cases: {
    "random-fb": {
      id: "random-fb",
      name: "Random Scramble",
      alg: "Generating...",
      isDynamic: true,
      generatorType: "full-scramble",
    },
  },
  groups: [
    {
      id: "all",
      name: "All cases",
      caseIds: ["random-fb"],
    },
  ],
};
