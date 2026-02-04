import { useEffect, useMemo, useState } from "react";
import {
	addSolve,
	deleteSolve,
	filterSolvesByPuzzle,
	getSolves,
	subscribeToSolves,
	updateSolvePenalty,
} from "@/lib/solves";
import type { Puzzle, Solve } from "@/types";

export function useSolves<T extends Puzzle = Puzzle>(
	sessionId: string | undefined,
	puzzle: T
) {
	const [solves, setSolves] = useState<Solve[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: initial load
	useEffect(() => {
		if (sessionId) {
			loadSolves();
			return subscribeToSolves((updatedSessionId) => {
				if (updatedSessionId === sessionId) {
					loadSolves();
				}
			});
		}
	}, [sessionId]);

	async function loadSolves() {
		if (!sessionId) return;
		const data = await getSolves(sessionId, puzzle);
		setSolves(data);
		setIsLoading(false);
	}

	const filteredSolves = useMemo(() => {
		if (!puzzle) return solves as Solve<T>[];
		return filterSolvesByPuzzle(solves, puzzle);
	}, [solves, puzzle]);

	async function recordSolve(solve: Omit<Solve<T>, "id" | "createdAt">) {
		if (!sessionId) return;
		const newSolve = await addSolve(
			sessionId,
			solve as Omit<Solve, "id" | "createdAt">
		);
		return newSolve as Solve<T>;
	}

	async function removeSolve(solve: Solve) {
		if (!sessionId) return;
		await deleteSolve(sessionId, solve);
	}

	async function setPenalty(solve: Solve, penalty?: Solve<T>["penalty"]) {
		if (!sessionId) return;
		await updateSolvePenalty(sessionId, solve, penalty);
	}

	return {
		solves: filteredSolves,
		allSolves: solves,
		isLoading,
		setPenalty,
		recordSolve,
		removeSolve,
		refreshSolves: loadSolves,
	};
}
