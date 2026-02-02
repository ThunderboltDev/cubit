import { randomUUID } from "expo-crypto";
import { STORAGE_KEYS } from "@/constants/storage";
import type { Puzzle, Solve } from "@/types";
import { storage } from "./storage";

export async function getSolves(sessionId: string): Promise<Solve[]> {
  return (await storage.get<Solve[]>(STORAGE_KEYS.SOLVES(sessionId))) || [];
}

export async function addSolve(
  sessionId: string,
  solve: Omit<Solve, "id" | "createdAt">,
): Promise<Solve> {
  const solves = await getSolves(sessionId);

  const newSolve: Solve = {
    ...solve,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await storage.set(STORAGE_KEYS.SOLVES(sessionId), [newSolve, ...solves]);

  return newSolve;
}

export async function deleteSolve(
  sessionId: string,
  solveId: string,
): Promise<void> {
  const solves = await getSolves(sessionId);

  await storage.set(
    STORAGE_KEYS.SOLVES(sessionId),
    solves.filter((s) => s.id !== solveId),
  );
}

export async function updateSolvePenalty(
  sessionId: string,
  solveId: string,
  penalty: Solve["penalty"],
): Promise<void> {
  const solves = await getSolves(sessionId);

  await storage.set(
    STORAGE_KEYS.SOLVES(sessionId),
    solves.map((s) => (s.id === solveId ? { ...s, penalty } : s)),
  );
}

export async function getSolvesByPuzzle(
  sessionId: string,
  puzzle: Puzzle,
): Promise<Solve[]> {
  const solves = await getSolves(sessionId);

  return solves.filter((s) => s.puzzle === puzzle);
}

export async function clearSolves(sessionId: string): Promise<void> {
  await storage.remove(STORAGE_KEYS.SOLVES(sessionId));
}
