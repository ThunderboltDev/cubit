import { create } from "zustand";
import type { TimerState } from "@/hooks/use-trainer-timer";

interface TrainerTimerStateStore {
  timerState: TimerState;
  setTimerState: (state: TimerState) => void;
}

export const useTimerStateStore = create<TrainerTimerStateStore>((set) => ({
  timerState: "idle",
  setTimerState: (timerState) => set({ timerState }),
}));
