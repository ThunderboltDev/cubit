import type { Puzzle } from "@/types";

export const STORAGE_KEYS = {
  SETTINGS: "@cubit/settings",
  SESSIONS: "@cubit/sessions",
  CURRENT_SESSION: "@cubit/current_session",
  SOLVES: (sessionId: string, puzzle: Puzzle) =>
    `@cubit/solves/${sessionId}/${puzzle}`,
} as const;
