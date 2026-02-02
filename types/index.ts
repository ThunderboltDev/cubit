import type { penalties, puzzles } from "@/constants/puzzles";

export type Puzzle = (typeof puzzles)[number];
export type Penalty = (typeof penalties)[number];

export interface Solve {
  id: string;
  time: number;
  scramble: string;
  puzzle: Puzzle;
  penalty: Penalty;
  createdAt: string;
  phases?: number[];
}

export interface Session {
  id: string;
  name: string;
  createdAt: string;
}

export interface SessionSettings {
  inspectionEnabled: boolean;
  inspectionTime: number;
  multiPhaseEnabled: boolean;
  phaseCount: number;
  showScramblePreview: boolean;
}

export interface GlobalSettings {
  selectedPuzzle: Puzzle;
  theme: "light" | "dark" | "system";
  hapticFeedback: boolean;
  timerPrecision: 2 | 3;
  holdToStart: boolean;
  holdTime: number;
}

export type Settings = {
  global: GlobalSettings;
  sessions: Record<string, SessionSettings>;
};
