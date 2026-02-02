export const STORAGE_KEYS = {
  SETTINGS: "@cubetimer/settings",
  SESSIONS: "@cubetimer/sessions",
  CURRENT_SESSION: "@cubetimer/current_session",
  SOLVES: (sessionId: string) => `@cubetimer/solves/${sessionId}`,
} as const;
