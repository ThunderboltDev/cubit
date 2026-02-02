import { useEffect, useState } from "react";
import {
  createSession,
  getCurrentSession,
  getSessions,
  setCurrentSession,
} from "@/lib/sessions";
import type { Session } from "@/types";

export function useSessions() {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intial load
  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    const [allSessions, currentSession] = await Promise.all([
      getSessions(),
      getCurrentSession(),
    ]);

    if (allSessions.length === 0) {
      const defaultSession = await createSession("Default");
      allSessions.push(defaultSession);
    }

    setSessions(allSessions);
    setSelectedSession(currentSession || allSessions[0]);
    setIsLoading(false);
  }

  async function switchSession(session: Session) {
    await setCurrentSession(session);
    setSelectedSession(session);
  }

  return {
    sessions,
    isLoading,
    selectedSession,
    switchSession,
    refreshSessions: loadSessions,
  };
}
