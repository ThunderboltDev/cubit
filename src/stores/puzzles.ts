import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_DISPLAY_STATS, DEFAULT_PUZZLE } from "@/data/defaults";
import type { Puzzle } from "@/types/puzzles";
import type { DisplayStatsConfig } from "@/types/stats";

interface PuzzlesState {
  puzzles: Puzzle[];
  activePuzzleId: string | null;

  addPuzzle: (puzzle: Omit<Puzzle, "id">) => void;
  updatePuzzle: (id: string, updates: Partial<Puzzle>) => void;
  deletePuzzle: (id: string) => void;
  setActivePuzzle: (id: string | null) => void;
  getActivePuzzle: () => Puzzle | null;
  updateDisplayStats: (puzzleId: string, config: DisplayStatsConfig) => void;
}

export const usePuzzlesStore = create<PuzzlesState>()(
  persist(
    (set, get) => ({
      puzzles: [DEFAULT_PUZZLE],
      activePuzzleId: DEFAULT_PUZZLE.id,

      addPuzzle: (puzzle) => {
        const id = crypto.randomUUID();
        const newPuzzle: Puzzle = {
          ...puzzle,
          id,
          displayStats: puzzle.displayStats || DEFAULT_DISPLAY_STATS,
          trainerMethodId: puzzle.trainerMethodId ?? null,
        };
        set((state) => ({
          puzzles: [...state.puzzles, newPuzzle],
          activePuzzleId: id,
        }));
      },

      updatePuzzle: (id, updates) => {
        set((state) => ({
          puzzles: state.puzzles.map((puzzle) =>
            puzzle.id === id ? { ...puzzle, ...updates } : puzzle,
          ),
        }));
      },

      deletePuzzle: (id) => {
        set((state) => {
          const newPuzzles = state.puzzles.filter((puzzle) => puzzle.id !== id);
          const newActiveId =
            state.activePuzzleId === id ?
              newPuzzles[0]?.id || null
            : state.activePuzzleId;
          return {
            puzzles: newPuzzles,
            activePuzzleId: newActiveId,
          };
        });
      },

      setActivePuzzle: (id) => {
        set({ activePuzzleId: id });
      },

      getActivePuzzle: () => {
        const { puzzles, activePuzzleId } = get();
        return puzzles.find((puzzle) => puzzle.id === activePuzzleId) || null;
      },

      updateDisplayStats: (puzzleId, config) => {
        set((state) => ({
          puzzles: state.puzzles.map((puzzle) =>
            puzzle.id === puzzleId ?
              { ...puzzle, displayStats: config }
            : puzzle,
          ),
        }));
      },
    }),
    {
      name: "cubit-puzzles",
    },
  ),
);
