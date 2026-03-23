import type { TrainerMethod } from "@/types/trainer";

// Corner methods

export const BLD_OP_CORNERS: TrainerMethod<"OP"> = {
  id: "OP",
  name: "Old Pochman",
  puzzleTypes: ["333bf", "444bf", "555bf", "333mbf"],
  pieceType: "corners",
  steps: [{ algSetId: "bld-corners", label: "Corners" }],
};

export const BLD_OROZCO_CORNERS: TrainerMethod<"Orozco"> = {
  id: "Orozco",
  name: "Orozco",
  puzzleTypes: ["333bf", "444bf", "555bf", "333mbf"],
  pieceType: "corners",
  steps: [{ algSetId: "bld-corners", label: "Corners" }],
};

export const BLD_3STYLE_CORNERS: TrainerMethod<"3-style"> = {
  id: "3-style",
  name: "3-Style",
  puzzleTypes: ["333bf", "444bf", "555bf", "333mbf"],
  pieceType: "corners",
  steps: [{ algSetId: "bld-corners", label: "Corners" }],
};

export const BLD_EKA_CORNERS: TrainerMethod = {
  id: "EKA",
  name: "EKA",
  puzzleTypes: ["333bf"],
  pieceType: "corners",
  steps: [{ algSetId: "bld-corners", label: "Corners" }],
};

// Edge methods

export const BLD_OP_EDGES: TrainerMethod<"OP"> = {
  id: "OP",
  name: "Old Pochman",
  puzzleTypes: ["333bf", "444bf", "555bf", "333mbf"],
  pieceType: "edges",
  steps: [{ algSetId: "bld-edges", label: "Edges" }],
};

export const BLD_M2_EDGES: TrainerMethod = {
  id: "M2",
  name: "M2",
  puzzleTypes: ["333bf", "333mbf"],
  pieceType: "edges",
  steps: [{ algSetId: "bld-edges", label: "Edges" }],
};

export const BLD_OROZCO_EDGES: TrainerMethod<"Orozco"> = {
  id: "Orozco",
  name: "Orozco",
  puzzleTypes: ["333bf", "444bf", "555bf", "333mbf"],
  pieceType: "edges",
  steps: [{ algSetId: "bld-edges", label: "Edges" }],
};

export const BLD_3STYLE_EDGES: TrainerMethod<"3-style"> = {
  id: "3-style",
  name: "3-Style",
  puzzleTypes: ["333bf", "444bf", "555bf", "333mbf"],
  pieceType: "edges",
  steps: [{ algSetId: "bld-edges", label: "Edges" }],
};
