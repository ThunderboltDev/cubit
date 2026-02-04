import {
	DEFAULT_GLOBAL_SETTINGS,
	DEFAULT_SESSION_SETTINGS,
} from "@/constants/settings";
import { STORAGE_KEYS } from "@/constants/storage";
import { storage } from "@/lib/storage";
import type { GlobalSettings, SessionSettings, Settings } from "@/types";

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
	for (const listener of listeners) {
		listener();
	}
}

export function subscribeToSettings(listener: Listener): () => void {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export async function getSettings(): Promise<Settings> {
	const settings = await storage.get<Settings>(STORAGE_KEYS.SETTINGS);

	return {
		global: { ...DEFAULT_GLOBAL_SETTINGS, ...settings?.global },
		sessions: settings?.sessions || {},
	};
}

export async function saveGlobalSettings(
	settings: Partial<GlobalSettings>
): Promise<void> {
	const current = await getSettings();

	await storage.set(STORAGE_KEYS.SETTINGS, {
		...current,
		global: { ...current.global, ...settings },
	});
	notifyListeners();
}

export async function saveSessionSettings(
	sessionId: string,
	settings: Partial<SessionSettings>
): Promise<void> {
	const current = await getSettings();

	await storage.set(STORAGE_KEYS.SETTINGS, {
		...current,
		sessions: {
			...current.sessions,
			[sessionId]: {
				...DEFAULT_SESSION_SETTINGS,
				...current.sessions[sessionId],
				...settings,
			},
		},
	});
	notifyListeners();
}

export async function getSessionSettings(
	sessionId: string
): Promise<SessionSettings> {
	const settings = await getSettings();

	return { ...DEFAULT_SESSION_SETTINGS, ...settings.sessions[sessionId] };
}

export async function deleteSessionSettings(sessionId: string): Promise<void> {
	const current = await getSettings();
	const { [sessionId]: _, ...rest } = current.sessions;

	await storage.set(STORAGE_KEYS.SETTINGS, {
		...current,
		sessions: rest,
	});
	notifyListeners();
}
