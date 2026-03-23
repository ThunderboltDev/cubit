import type { TrainerMethod } from "@/types/trainer";

export const CFOP: TrainerMethod<"CFOP"> = {
  id: "CFOP",
  name: "CFOP",
  puzzleTypes: ["333", "333oh"],
  steps: [
    {
      algSetId: "cross",
      label: "Cross",
    },
    {
      algSetId: "f2l",
      label: "F2L",
    },
    {
      algSetId: "oll",
      label: "2-Look OLL",
      groupIds: ["2look-oll"],
    },
    {
      algSetId: "pll",
      label: "2-Look PLL",
      groupIds: ["2look-pll"],
    },
    {
      algSetId: "oll",
      label: "Full OLL",
    },
    {
      algSetId: "pll",
      label: "Full PLL",
    },
  ],
};
