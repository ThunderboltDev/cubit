import type { AlgSet } from "@/types/trainer";

export const BLD_CORNERS: AlgSet = {
  id: "bld-corners",
  name: "BLD Corners",
  puzzleTypes: ["333bf", "444bf", "555bf", "333mbf"],
  cases: {
    "random-corners": {
      id: "random-corners",
      name: "Random Corners",
      alg: "Generating...",
      isDynamic: true,
      generatorType: "bld-corners",
    },
  },
  groups: [
    {
      id: "all",
      name: "All",
      caseIds: ["random-corners"],
    },
  ],
};
