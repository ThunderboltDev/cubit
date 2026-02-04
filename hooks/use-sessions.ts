import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/constants/storage";
import {
	createSession,
	deleteSession,
	ensureDefaultSession,
	getCurrentSession,
	getSessions,
	renameSession,
	setCurrentSession,
	subscribeToSessions,
} from "@/lib/sessions";
import { storage } from "@/lib/storage";
import type { Session } from "@/types";

export function useSessions() {
	const [isLoading, setIsLoading] = useState(true);
	const [sessions, setSessions] = useState<Session[]>([]);
	const [selectedSession, setSelectedSession] = useState<Session | null>(null);

	const loadSessions = useCallback(async () => {
		let allSessions = await getSessions();

		if (allSessions.length === 0) {
			const defaultSession = await ensureDefaultSession();
			allSessions = [defaultSession];
		}

		let currentSession = await getCurrentSession();

		if (!currentSession) {
			currentSession = allSessions[0];
			await storage.set(STORAGE_KEYS.CURRENT_SESSION, currentSession);
		}

		setSessions(allSessions);
		setSelectedSession(currentSession);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		loadSessions();

		const unsubscribe = subscribeToSessions(() => {
			loadSessions();
		});

		return () => {
			unsubscribe();
		};
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
