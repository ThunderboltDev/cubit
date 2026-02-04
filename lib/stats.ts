import { getEffectiveTime } from "@/lib/time";
import type { Solve } from "@/types";

function validateSinglePuzzle(solves: Solve[]): "2x2" | "3x3" {
	if (solves.length === 0) {
		throw new Error("Cannot validate puzzle type: empty solves array");
	}

	const firstPuzzle = solves[0].puzzle;

	const hasDifferentPuzzle = solves.some((s) => s.puzzle !== firstPuzzle);

	if (hasDifferentPuzzle) {
		const uniquePuzzles = [...new Set(solves.map((s) => s.puzzle))];
		throw new Error(
			`Mixed puzzle types detected: ${uniquePuzzles.join(", ")}. Expected only ${firstPuzzle}.`
		);
	}

	return firstPuzzle;
}

export function calculateAverage(
	solves: Solve[],
	count: number
): number | null {
	if (solves.length < count) return null;

	validateSinglePuzzle(solves);

	const recentSolves = solves.slice(0, count);
	const times = recentSolves.map((solve) => getEffectiveTime(solve));

	if (times.filter((t) => t === Infinity).length > 1) return Infinity;

	const sorted = [...times].sort((a, b) => a - b);
	const trimmed = sorted.slice(1, -1);
	const sum = trimmed.reduce((a, b) => a + b, 0);

	return sum / trimmed.length;
}

export function calculateBest(solves: Solve[]): number | null {
	if (solves.length === 0) return null;

	validateSinglePuzzle(solves);

	const valid = solves.filter((solve) => solve.penalty !== "dnf");
	if (valid.length === 0) return null;

	return Math.min(...valid.map((solve) => getEffectiveTime(solve)));
}

export function calculateMean(solves: Solve[]): number | null {
	if (solves.length === 0) return null;

	validateSinglePuzzle(solves);

	const valid = solves.filter((solve) => solve.penalty !== "dnf");
	if (valid.length === 0) return null;

	const sum = valid.reduce((acc, solve) => acc + getEffectiveTime(solve), 0);
	return sum / valid.length;
}

export function calculateRollingAverage(
	solves: Solve[],
	count: number
): (number | null)[] {
	if (solves.length < count) return Array(solves.length).fill(null);

	validateSinglePuzzle(solves);

	return solves.map((_, index) => {
		if (index < count - 1) return null;
		const subset = solves.slice(index - count + 1, index + 1);
		return calculateAverage(subset, count);
	});
}

export function calculateStandardDeviation(solves: Solve[]): number | null {
	if (solves.length < 2) return null;

	validateSinglePuzzle(solves);

	const validTimes = solves
		.map((s) => getEffectiveTime(s))
		.filter((t) => t !== Infinity);

	if (validTimes.length < 2) return null;

	const mean = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
	const variance =
		validTimes.reduce((a, b) => a + (b - mean) ** 2, 0) / validTimes.length;

	return Math.sqrt(variance);
}
