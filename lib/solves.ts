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

export function subscribeToSolves(listener: SolvesListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

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
  notifyListeners(sessionId);
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
  notifyListeners(sessionId);
}

export async function updateSolvePenalty(
  sessionId: string,
  solveId: string,
  penalty?: Solve["penalty"],
): Promise<void> {
  const solves = await getSolves(sessionId);

  await storage.set(
    STORAGE_KEYS.SOLVES(sessionId),
    solves.map((s) =>
      s.id === solveId ? { ...s, penalty: penalty ?? "none" } : s,
    ),
  );
  notifyListeners(sessionId);
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
  notifyListeners(sessionId);
}
