import { puzzles } from "@/constants/puzzles";
import { DEFAULT_SESSION_SETTINGS } from "@/constants/settings";
import { STORAGE_KEYS } from "@/constants/storage";
import { saveSessionSettings } from "@/lib/settings";
import { storage } from "@/lib/storage";
import type { Session } from "@/types";

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
	for (const listener of listeners) listener();
}

export function subscribeToSessions(listener: Listener): () => void {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export async function getSessions(): Promise<Session[]> {
	const sessions = (await storage.get<Session[]>(STORAGE_KEYS.SESSIONS)) || [];
	return sessions;
}

export async function ensureDefaultSession(): Promise<Session> {
	const sessions = await getSessions();

	if (sessions.length === 0) {
		const defaultSession: Session = {
			id: `session-${Date.now()}`,
			name: "Default",
			createdAt: new Date().toISOString(),
		};

		await storage.set(STORAGE_KEYS.SESSIONS, [defaultSession]);
		await saveSessionSettings(defaultSession.id, DEFAULT_SESSION_SETTINGS);
		await storage.set(STORAGE_KEYS.CURRENT_SESSION, defaultSession);

		notifyListeners();
		return defaultSession;
	}

	return sessions[0];
}

export async function createSession(name: string): Promise<Session> {
	const sessions = await getSessions();
	const newSession: Session = {
		id: `session-${Date.now()}`,
		name: name.trim(),
		createdAt: new Date().toISOString(),
	};

	await storage.set(STORAGE_KEYS.SESSIONS, [...sessions, newSession]);
	await saveSessionSettings(newSession.id, DEFAULT_SESSION_SETTINGS);

	notifyListeners();
	return newSession;
}

export async function renameSession(
	id: string,
	newName: string
): Promise<void> {
	const sessions = await getSessions();
	const updated = sessions.map((s) =>
		s.id === id ? { ...s, name: newName.trim() } : s
	);

	await storage.set(STORAGE_KEYS.SESSIONS, updated);

	const current = await getCurrentSession();

	if (current?.id === id) {
		await setCurrentSession(id);
	}

	notifyListeners();
}

export async function deleteSession(sessionId: string): Promise<void> {
	const sessions = await getSessions();
	const filtered = sessions.filter((s) => s.id !== sessionId);

	await storage.set(STORAGE_KEYS.SESSIONS, filtered);

	for (const puzzle of puzzles) {
		await storage.remove(STORAGE_KEYS.SOLVES(sessionId, puzzle));
	}

	const current = await getCurrentSession();
	if (current?.id === sessionId) {
		await storage.set(STORAGE_KEYS.CURRENT_SESSION, filtered[0] || null);
	}

	notifyListeners();
}

export async function getCurrentSession(): Promise<Session | null> {
	return storage.get<Session>(STORAGE_KEYS.CURRENT_SESSION);
}

export async function setCurrentSession(sessionId: string): Promise<void> {
	const sessions = await getSessions();
	const session = sessions.find((session) => session.id === sessionId);
	if (!session) throw new Error("Session not found");

	await storage.set(STORAGE_KEYS.CURRENT_SESSION, session);
	notifyListeners();
}
