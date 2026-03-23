import type { TrainerMethod } from "@/types/trainer";

export const ROUX: TrainerMethod<"ROUX"> = {
  id: "ROUX",
  name: "Roux",
  puzzleTypes: ["333", "333oh"],
  steps: [
    {
      algSetId: "first-block",
      label: "First Block",
    },
    {
      algSetId: "cmll",
      label: "CMLL",
    },
  ],
};
