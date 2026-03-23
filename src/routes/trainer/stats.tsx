import { FilterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALG_SETS, getAlgSetsForPuzzle } from "@/data/trainer";
import { usePuzzles } from "@/hooks/use-puzzles";
import { useTrainerSolves } from "@/hooks/use-trainer-solves";
import { formatTime } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import type { TrainerSolve } from "@/types/trainer";

export const Route = createFileRoute("/trainer/stats")({
  component: TrainerStatsPage,
});

type TimeRange = "all" | "7d" | "30d";

function computeStats(solves: TrainerSolve[]) {
  const valid = solves.filter((s) => s.penalty !== "DNF");
  if (valid.length === 0) return null;

  const times = valid.map((s) => (s.penalty === "+2" ? s.time + 2000 : s.time));
  const best = Math.min(...times);
  const mean = times.reduce((a, b) => a + b, 0) / times.length;
  const dnfs = solves.filter((s) => s.penalty === "DNF").length;

  // Ao5 — last 5 valid
  let ao5: number | null = null;
  if (times.length >= 5) {
    const last5 = times.slice(-5);
    const sorted = [...last5].sort((a, b) => a - b);
    ao5 = sorted.slice(1, 4).reduce((a, b) => a + b, 0) / 3;
  }

  // Simple improvement: compare first half mean vs second half mean
  let improvement: number | null = null;
  if (times.length >= 4) {
    const half = Math.floor(times.length / 2);
    const firstMean = times.slice(0, half).reduce((a, b) => a + b, 0) / half;
    const secondMean = times.slice(-half).reduce((a, b) => a + b, 0) / half;
    improvement = firstMean - secondMean; // positive = improved
  }

  return { best, mean, ao5, dnfs, count: solves.length, improvement };
}

interface CaseStatRowProps {
  caseName: string;
  solves: TrainerSolve[];
}

function CaseStatRow({ caseName, solves }: CaseStatRowProps) {
  const stats = computeStats(solves);
  if (!stats) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border/10 hover:bg-accent/5 transition-colors rounded-lg">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium truncate">{caseName}</span>
        <span className="text-xs text-muted-foreground">
          {stats.count} solve{stats.count !== 1 ? "s" : ""}
          {stats.dnfs > 0 && ` · ${stats.dnfs} DNF`}
        </span>
      </div>

      <div className="flex items-center gap-4 shrink-0 ml-4">
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">Best</span>
          <span className="font-mono text-sm font-semibold">
            {formatTime(stats.best)}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">Mean</span>
          <span className="font-mono text-sm font-semibold">
            {formatTime(stats.mean)}
          </span>
        </div>
        {stats.ao5 !== null && (
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Ao5</span>
            <span className="font-mono text-sm font-semibold">
              {formatTime(stats.ao5)}
            </span>
          </div>
        )}
        {stats.improvement !== null && (
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Trend</span>
            <span
              className={cn(
                "font-mono text-sm font-semibold",
                stats.improvement > 0 ? "text-green-500" : "text-danger",
              )}
            >
              {stats.improvement > 0 ? "↑" : "↓"}{" "}
              {formatTime(Math.abs(stats.improvement))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function TrainerStatsPage() {
  const { currentPuzzle } = usePuzzles();

  const [algSetFilter, setAlgSetFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");

  const availableAlgSets = useMemo(
    () => getAlgSetsForPuzzle(currentPuzzle.type),
    [currentPuzzle.type],
  );

  const { solves } = useTrainerSolves({
    puzzleId: currentPuzzle.id,
    algSetId: algSetFilter !== "all" ? algSetFilter : undefined,
  });

  const filteredByTime = useMemo(() => {
    if (!solves || timeRange === "all") return solves ?? [];
    const cutoff =
      timeRange === "7d" ?
        Date.now() - 7 * 24 * 60 * 60 * 1000
      : Date.now() - 30 * 24 * 60 * 60 * 1000;
    return solves.filter((s: TrainerSolve) => s.createdAt >= cutoff);
  }, [solves, timeRange]);

  // Group by case
  const byCaseId = useMemo(() => {
    const map = new Map<string, TrainerSolve[]>();
    for (const solve of filteredByTime) {
      const existing = map.get(solve.caseId) ?? [];
      existing.push(solve);
      map.set(solve.caseId, existing);
    }
    // Sort by case mean ascending (fastest first)
    return [...map.entries()].sort(([, a], [, b]) => {
      const statsA = computeStats(a);
      const statsB = computeStats(b);
      if (!statsA) return 1;
      if (!statsB) return -1;
      return statsA.mean - statsB.mean;
    });
  }, [filteredByTime]);

  // Overall stats across all filtered solves
  const overallStats = useMemo(
    () => computeStats(filteredByTime),
    [filteredByTime],
  );

  const activeAlgSet =
    algSetFilter !== "all" ? (ALG_SETS[algSetFilter] ?? null) : null;

  const getCaseName = (caseId: string) => {
    if (activeAlgSet) return activeAlgSet.cases[caseId]?.name ?? caseId;
    // Search across all sets
    for (const set of Object.values(ALG_SETS)) {
      if (set.cases[caseId]) return `${set.name} — ${set.cases[caseId].name}`;
    }
    return caseId;
  };

  return (
    <div className="flex h-dvh flex-col bg-background md:h-svh p-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/10 pb-4 mb-4">
        <h1 className="font-semibold text-xl">Trainer Stats</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/10 pb-3 mb-4">
        <HugeiconsIcon
          icon={FilterIcon}
          size={14}
          className="text-muted-foreground"
        />

        <Select value={algSetFilter} onValueChange={setAlgSetFilter}>
          <SelectTrigger className="h-8 w-32 text-xs border-none bg-accent/10">
            <SelectValue placeholder="Alg Set" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sets</SelectItem>
            {availableAlgSets.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as TimeRange)}
        >
          <SelectTrigger className="h-8 w-28 text-xs border-none bg-accent/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>

        <span className="ml-auto text-xs text-muted-foreground">
          {filteredByTime.length} solve{filteredByTime.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Overall summary */}
      {overallStats && (
        <div className="grid grid-cols-4 gap-px bg-border/10 border-b border-border/10 mb-6 rounded-xl overflow-hidden">
          {[
            { label: "Best", value: formatTime(overallStats.best) },
            { label: "Mean", value: formatTime(overallStats.mean) },
            {
              label: "Ao5",
              value:
                overallStats.ao5 !== null ? formatTime(overallStats.ao5) : "—",
            },
            { label: "DNFs", value: overallStats.dnfs.toString() },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center py-4 bg-background gap-1"
            >
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
              <span className="font-mono text-base font-bold">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Per-case breakdown */}
      <div className="flex-1 overflow-y-auto">
        {byCaseId.length === 0 ?
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <p className="text-sm">No data yet.</p>
            <p className="text-xs opacity-60">
              Start drilling to see your stats.
            </p>
          </div>
        : <>
            <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
              By case
            </div>
            {byCaseId.map(([caseId, caseSolves]) => (
              <CaseStatRow
                key={caseId}
                caseName={getCaseName(caseId)}
                solves={caseSolves}
              />
            ))}
          </>
        }
      </div>
    </div>
  );
}
