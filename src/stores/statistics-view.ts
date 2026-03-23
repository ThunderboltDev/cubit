import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ChartConfig, DEFAULT_CHART_CONFIG } from "@/data/defaults";

interface StatisticsViewState {
  charts: Record<string, ChartConfig[]>;
  addChart: (puzzleId: string, chart: ChartConfig) => void;
  removeChart: (puzzleId: string, chartId: string) => void;
  updateChart: (
    puzzleId: string,
    chartId: string,
    updates: Partial<ChartConfig>,
  ) => void;
  getCharts: (puzzleId: string) => ChartConfig[];
}

export const useStatisticsViewStore = create<StatisticsViewState>()(
  persist(
    (set, get) => ({
      charts: {},

      getCharts: (puzzleId) => {
        const state = get();
        return state.charts[puzzleId] ?? DEFAULT_CHART_CONFIG;
      },

      addChart: (puzzleId, chart) =>
        set((state) => {
          const currentCharts = state.charts[puzzleId] ?? DEFAULT_CHART_CONFIG;
          return {
            charts: {
              ...state.charts,
              [puzzleId]: [...currentCharts, chart],
            },
          };
        }),

      removeChart: (puzzleId, chartId) =>
        set((state) => {
          const currentCharts = state.charts[puzzleId] ?? DEFAULT_CHART_CONFIG;
          return {
            charts: {
              ...state.charts,
              [puzzleId]: currentCharts.filter((c) => c.id !== chartId),
            },
          };
        }),

      updateChart: (puzzleId, chartId, updates) =>
        set((state) => {
          const currentCharts = state.charts[puzzleId] ?? DEFAULT_CHART_CONFIG;
          return {
            charts: {
              ...state.charts,
              [puzzleId]: currentCharts.map((c) =>
                c.id === chartId ? { ...c, ...updates } : c,
              ),
            },
          };
        }),
    }),
    {
      name: "cubit-statistics-view",
    },
  ),
);
