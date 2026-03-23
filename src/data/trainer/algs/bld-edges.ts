import type { AlgSet } from "@/types/trainer";

export const BLD_EDGES: AlgSet = {
  id: "bld-edges",
  name: "BLD Edges",
  puzzleTypes: ["333bf", "444bf", "555bf", "333mbf"],
  cases: {
    "random-edges": {
      id: "random-edges",
      name: "Random Edges",
      alg: "Generating...",
      isDynamic: true,
      generatorType: "bld-edges",
    },
  },
  groups: [
    {
      id: "all",
      name: "All",
      caseIds: ["random-edges"],
    },
  ],
};
