import { DEFAULT_SESSION_SETTINGS } from "@/constants/settings";
import { STORAGE_KEYS } from "@/constants/storage";
import { getSettings, saveSessionSettings } from "@/lib/settings";
import { storage } from "@/lib/storage";
import type { Session } from "@/types";

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeToSessions(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function getSessions(): Promise<Session[]> {
  return (await storage.get<Session[]>(STORAGE_KEYS.SESSIONS)) || [];
}

export async function createSession(name: string): Promise<Session> {
  const sessions = await getSessions();

  const newSession: Session = {
    id: `session-${Date.now()}`,
    name,
    createdAt: new Date().toISOString(),
  };

  await storage.set(STORAGE_KEYS.SESSIONS, [...sessions, newSession]);

  const settings = await getSettings();

  if (!settings.sessions[newSession.id]) {
    await saveSessionSettings(newSession.id, DEFAULT_SESSION_SETTINGS);
  }

  notifyListeners();
  return newSession;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = await getSessions();

  await storage.set(
    STORAGE_KEYS.SESSIONS,
    sessions.filter((s) => s.id !== sessionId),
  );

  await storage.remove(STORAGE_KEYS.SOLVES(sessionId));
  notifyListeners();
}

export async function getCurrentSession(): Promise<Session | null> {
  return storage.get<Session>(STORAGE_KEYS.CURRENT_SESSION);
}

export async function setCurrentSession(session: Session): Promise<void> {
  await storage.set(STORAGE_KEYS.CURRENT_SESSION, session);
  notifyListeners();
}

export async function getSessionById(id: string): Promise<Session | null> {
  const sessions = await getSessions();

  return sessions.find((session) => session.id === id) || null;
}
