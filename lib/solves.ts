import { randomUUID } from "expo-crypto";
import { STORAGE_KEYS } from "@/constants/storage";
import type { Puzzle, Solve } from "@/types";
import { storage } from "./storage";

export type SolvesListener = (sessionId: string) => void;
const listeners: Set<SolvesListener> = new Set();

function notifyListeners(sessionId: string) {
	for (const listener of listeners) {
		listener(sessionId);
	}
}

export function isSolveOfType<T extends Puzzle>(
	solve: Solve,
	puzzle: T
): solve is Solve<T> {
	return solve.puzzle === puzzle;
}

export function filterSolvesByPuzzle<T extends Puzzle>(
	solves: Solve[],
	puzzle: T
): Solve<T>[] {
	return solves.filter((solve): solve is Solve<T> => solve.puzzle === puzzle);
}

export function subscribeToSolves(listener: SolvesListener): () => void {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export async function getSolves(
	sessionId: string,
	puzzle: Puzzle
): Promise<Solve[]> {
	return (
		(await storage.get<Solve[]>(STORAGE_KEYS.SOLVES(sessionId, puzzle))) || []
	);
}

export async function addSolve(
	sessionId: string,
	solve: Omit<Solve, "id" | "createdAt">
): Promise<Solve> {
	const solves = await getSolves(sessionId, solve.puzzle);

	const newSolve: Solve = {
		...solve,
		id: randomUUID(),
		createdAt: new Date().toISOString(),
	};

	await storage.set(STORAGE_KEYS.SOLVES(sessionId, solve.puzzle), [
		newSolve,
		...solves,
	]);
	notifyListeners(sessionId);
	return newSolve;
}

export async function deleteSolve(
	sessionId: string,
	solve: Solve
): Promise<void> {
	const solves = await getSolves(sessionId, solve.puzzle);

	await storage.set(
		STORAGE_KEYS.SOLVES(sessionId, solve.puzzle),
		solves.filter((s) => s.id !== solve.id)
	);

	notifyListeners(sessionId);
}

export async function updateSolvePenalty(
	sessionId: string,
	solve: Solve,
	penalty?: Solve["penalty"]
): Promise<void> {
	const solves = await getSolves(sessionId, solve.puzzle);

	await storage.set(
		STORAGE_KEYS.SOLVES(sessionId, solve.puzzle),
		solves.map((s) =>
			s.id === solve.id ? { ...s, penalty: penalty ?? "none" } : s
		)
	);
	notifyListeners(sessionId);
}
