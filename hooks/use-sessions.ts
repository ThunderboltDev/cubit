import { useCallback, useEffect, useState } from "react";
import {
  createSession,
  deleteSession,
  getCurrentSession,
  getSessions,
  renameSession,
  setCurrentSession,
  subscribeToSessions,
} from "@/lib/sessions";
import type { Session } from "@/types";

export function useSessions() {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const loadSessions = useCallback(async () => {
    const [allSessions, currentSession] = await Promise.all([
      getSessions(),
      getCurrentSession(),
    ]);

    setSessions(allSessions);
    setSelectedSession(currentSession || allSessions[0]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSessions();
    return subscribeToSessions(loadSessions);
  }, [loadSessions]);

  return {
    sessions,
    isLoading,
    selectedSession,
    createSession,
    deleteSession,
    renameSession,
    switchSession: setCurrentSession,
    refreshSessions: loadSessions,
  };
}
