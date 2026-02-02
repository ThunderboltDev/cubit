import { useEffect, useState } from "react";
import {
  addSolve,
  deleteSolve,
  getSolves,
  updateSolvePenalty,
} from "@/lib/solves";
import type { Solve } from "@/types";

export function useSolves(sessionId: string | undefined) {
  const [solves, setSolves] = useState<Solve[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial solves
  useEffect(() => {
    if (sessionId) {
      loadSolves();
    }
  }, [sessionId]);

  async function loadSolves() {
    if (!sessionId) return;

    const data = await getSolves(sessionId);

    setSolves(data);
    setIsLoading(false);
  }

  async function recordSolve(solve: Omit<Solve, "id" | "createdAt">) {
    if (!sessionId) return;

    const newSolve = await addSolve(sessionId, solve);
    setSolves((prev) => [newSolve, ...prev]);
    return newSolve;
  }

  async function removeSolve(solveId: string) {
    if (!sessionId) return;

    await deleteSolve(sessionId, solveId);
    setSolves((prev) => prev.filter((s) => s.id !== solveId));
  }

  async function setPenalty(solveId: string, penalty: Solve["penalty"]) {
    if (!sessionId) return;

    await updateSolvePenalty(sessionId, solveId, penalty);
    setSolves((prev) =>
      prev.map((s) => (s.id === solveId ? { ...s, penalty } : s)),
    );
  }

  return {
    solves,
    isLoading,
    setPenalty,
    recordSolve,
    removeSolve,
    refreshSolves: loadSolves,
  };
}
