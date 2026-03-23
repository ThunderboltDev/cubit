import type { AlgSet } from "@/types/trainer";

export const CROSS: AlgSet = {
  id: "cross",
  name: "Cross",
  puzzleTypes: ["333"],
  cases: {
    "random-cross": {
      id: "random-cross",
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
      caseIds: ["random-cross"],
    },
  ],
};
