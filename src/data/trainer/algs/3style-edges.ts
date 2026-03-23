import type { AlgSet } from "@/types/trainer";

export const THREE_STYLE_EDGES: AlgSet = {
  id: "3style-edges",
  name: "3-Style Edges",
  puzzleTypes: ["333bf", "444bf", "555bf", "333mbf"],
  cases: {
    "random-uf": {
      id: "random-uf",
      name: "Random UF Buffer",
      alg: "Generating...",
      isDynamic: true,
      generatorType: "bld-edges",
    },
  },
  groups: [
    {
      id: "all",
      name: "All cases",
      caseIds: ["random-uf"],
    },
  ],
};
