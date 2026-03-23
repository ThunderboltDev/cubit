import type { Puzzle } from "@/types/puzzles";
import type { DisplayStatsConfig } from "@/types/stats";

export const DEFAULT_DISPLAY_STATS: DisplayStatsConfig = {
  style: "cards",
  orientation: "horizontal",
  stats: [
    { type: "best", n: Infinity },
    { type: "average", n: 5 },
    { type: "average", n: 12 },
    { type: "average", n: 100 },
    { type: "mean", n: Infinity },
  ],
};

export const DEFAULT_PUZZLE: Puzzle = {
  id: "default-puzzle",
  name: "3x3",
  type: "333",
  trimPercentage: 5,
  inspectionEnabled: true,
  inspectionDuration: 15,
  multiphaseEnabled: false,
  multiphaseCount: 0,
  inputMethod: "timer",
  scramblePreview: true,
  scramblePreviewVisualization: "3D",
  displayStats: DEFAULT_DISPLAY_STATS,
  method: "Beginner",
  trainerMethodId: null,
  trainerCornerMethodId: null,
  trainerEdgeMethodId: null,
  lettering: undefined,
};

export type ChartType =
  | "solves"
  | "average"
  | "mean"
  | "consistency"
  | "inspection"
  | "multiphase";

export type ChartConfig = {
  id: string;
  type: ChartType;
  n: number;
  phase?: number;
};

export const DEFAULT_CHART_CONFIG: ChartConfig[] = [
  { id: "default-solves", type: "solves", n: 100 },
  { id: "default-average", type: "average", n: 5 },
];
