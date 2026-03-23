import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChartCard } from "@/components/timer/chart-card";
import { ChartEditor } from "@/components/timer/chart-editor";
import { OverallStatistics } from "@/components/timer/overall-statistics";
import { Button } from "@/components/ui/button";
import { Page, PageBody, PageHeader, PageTitle } from "@/components/ui/page";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ChartConfig } from "@/data/defaults";
import { usePuzzles } from "@/hooks/use-puzzles";
import { useSettings } from "@/hooks/use-settings";
import { useStatistics } from "@/hooks/use-statistics";
import { formatTime } from "@/lib/format-time";
import { useStatisticsViewStore } from "@/stores/statistics-view";

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.25,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
};

let hasPageAnimated = false;

export const Route = createFileRoute("/_timer/statistics")({
  component: StatisticsPage,
});

function StatisticsPage() {
  const { currentPuzzle } = usePuzzles();
  const { stats, computeChartData, solveCount } = useStatistics();
  const { settings } = useSettings();
  const { getCharts, addChart, removeChart, updateChart } =
    useStatisticsViewStore();

  const charts = getCharts(currentPuzzle.id);
  const [editingChart, setEditingChart] = useState<ChartConfig | "new" | null>(
    null,
  );

  const format = (ms: number | null) =>
    formatTime(ms, settings.timerPrecision, settings.timeFormat);

  if (solveCount === 0) {
    return (
      <div className="flex h-dvh items-center justify-center text-muted-foreground md:h-svh">
        No solves yet.
      </div>
    );
  }

  return (
    <Page>
      <PageHeader className="flex items-center justify-between">
        <PageTitle>Statistics</PageTitle>
        <Button variant="accent" onClick={() => setEditingChart("new")}>
          <HugeiconsIcon icon={Add01Icon} />
          Add Chart
        </Button>
      </PageHeader>

      <PageBody className="pb-12">
        <motion.div
          variants={containerVariants}
          initial={hasPageAnimated ? "show" : "hidden"}
          animate="show"
          className="space-y-8"
          onAnimationComplete={() => {
            hasPageAnimated = true;
          }}
        >
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {charts.map((config) => {
                const rawData = computeChartData(config);
                const firstValidIndex = rawData.findIndex(
                  (d) => d.value !== null,
                );
                const data =
                  firstValidIndex >= 0 ? rawData.slice(firstValidIndex) : [];
                const hasData = data.length > 1;

                return (
                  <motion.div key={config.id} variants={itemVariants}>
                    <ChartCard
                      config={config}
                      data={data}
                      hasData={hasData}
                      onEdit={() => setEditingChart(config)}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <motion.div variants={itemVariants}>
            <OverallStatistics stats={stats} format={format} />
          </motion.div>
        </motion.div>
      </PageBody>

      <Sheet
        open={!!editingChart}
        onOpenChange={(open) => !open && setEditingChart(null)}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingChart === "new" ? "Add Chart" : "Edit Chart"}
            </SheetTitle>
            <SheetDescription>
              Configure your chart settings below.
            </SheetDescription>
          </SheetHeader>
          <ChartEditor
            initialConfig={
              !editingChart || editingChart === "new"
                ? {
                    id: crypto.randomUUID(),
                    type: "solves",
                    n: 50,
                  }
                : editingChart
            }
            isNew={editingChart === "new"}
            onSave={(config) => {
              if (editingChart === "new") {
                addChart(currentPuzzle.id, config);
              } else if (editingChart) {
                updateChart(currentPuzzle.id, editingChart.id, config);
              }
              setEditingChart(null);
            }}
            onCancel={() => setEditingChart(null)}
            onDelete={() => {
              if (editingChart && editingChart !== "new") {
                removeChart(currentPuzzle.id, editingChart.id);
                setEditingChart(null);
              }
            }}
            puzzleFeatures={{
              inspection: currentPuzzle.inspectionEnabled,
              multiphase: currentPuzzle.multiphaseEnabled,
              phaseCount: currentPuzzle.multiphaseCount,
            }}
          />
        </SheetContent>
      </Sheet>
    </Page>
  );
}
