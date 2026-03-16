import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DevToolsState {
  devModeEnabled: boolean;
  panelOpen: boolean;
  enableDevMode: () => void;
  disableDevMode: () => void;
  togglePanel: () => void;
  setPanelOpen: (open: boolean) => void;
}

export const useDevToolsStore = create<DevToolsState>()(
  persist(
    (set) => ({
      devModeEnabled: false,
      panelOpen: false,

      enableDevMode: () => set({ devModeEnabled: true, panelOpen: true }),

      disableDevMode: () => set({ devModeEnabled: false, panelOpen: false }),

      togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),

      setPanelOpen: (open) => set({ panelOpen: open }),
    }),
    {
      name: "cubit-devtools",
      partialize: (state) => ({ devModeEnabled: state.devModeEnabled }),
    },
  ),
);
