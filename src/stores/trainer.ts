import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PuzzleTrainerSelection = {
  // null = random
  algSetId: string | null;
  groupId: string | null;
  caseId: string | null;
};

const DEFAULT_SELECTION: PuzzleTrainerSelection = {
  algSetId: null,
  groupId: null,
  caseId: null,
};

interface TrainerStoreState {
  selections: Record<string, PuzzleTrainerSelection>;
  getSelection: (puzzleId: string) => PuzzleTrainerSelection;
  setAlgSet: (puzzleId: string, algSetId: string | null) => void;
  setGroup: (puzzleId: string, groupId: string | null) => void;
  setCase: (puzzleId: string, caseId: string) => void;
}

export const useTrainerStore = create<TrainerStoreState>()(
  persist(
    (set, get) => ({
      selections: {},

      getSelection: (puzzleId) =>
        get().selections[puzzleId] ?? DEFAULT_SELECTION,

      setAlgSet: (puzzleId, algSetId) => {
        set((state) => ({
          selections: {
            ...state.selections,
            [puzzleId]: {
              ...(state.selections[puzzleId] ?? DEFAULT_SELECTION),
              algSetId,
              groupId: null,
              caseId: null,
            },
          },
        }));
      },

      setGroup: (puzzleId, groupId) => {
        set((state) => ({
          selections: {
            ...state.selections,
            [puzzleId]: {
              ...(state.selections[puzzleId] ?? DEFAULT_SELECTION),
              groupId,
              caseId: null,
            },
          },
        }));
      },

      setCase: (puzzleId, caseId) => {
        set((state) => ({
          selections: {
            ...state.selections,
            [puzzleId]: {
              ...(state.selections[puzzleId] ?? DEFAULT_SELECTION),
              caseId,
            },
          },
        }));
      },
    }),
    { name: "cubit-trainer" },
  ),
);
