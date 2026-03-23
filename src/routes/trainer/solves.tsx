import { Delete02Icon, FilterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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

export const Route = createFileRoute("/trainer/solves")({
  component: TrainerSolvesPage,
});

type PenaltyFilter = "all" | "OK" | "+2" | "DNF";

function TrainerSolvesPage() {
  const { currentPuzzle } = usePuzzles();

  const [algSetFilter, setAlgSetFilter] = useState<string>("all");
  const [caseFilter, setCaseFilter] = useState<string>("all");
  const [penaltyFilter, setPenaltyFilter] = useState<PenaltyFilter>("all");

  const availableAlgSets = useMemo(
    () => getAlgSetsForPuzzle(currentPuzzle.type),
    [currentPuzzle.type],
  );

  const activeAlgSet =
    algSetFilter !== "all" ? (ALG_SETS[algSetFilter] ?? null) : null;

  const availableCases = useMemo(() => {
    if (!activeAlgSet) return [];
    return Object.values(activeAlgSet.cases);
  }, [activeAlgSet]);

  const { solves, deleteSolve } = useTrainerSolves({
    puzzleId: currentPuzzle.id,
    algSetId: algSetFilter !== "all" ? algSetFilter : undefined,
    caseId: caseFilter !== "all" ? caseFilter : undefined,
  });

  const filteredSolves = useMemo(() => {
    if (!solves) return [];
    if (penaltyFilter === "all") return solves;
    return solves.filter((s: TrainerSolve) => s.penalty === penaltyFilter);
  }, [solves, penaltyFilter]);

  const handleAlgSetChange = (val: string) => {
    setAlgSetFilter(val);
    setCaseFilter("all");
  };

  return (
    <div className="flex h-dvh flex-col bg-background md:h-svh p-6 pb-24">
      <div className="flex items-center gap-3 border-b border-border/10 pb-4 mb-4">
        <h1 className="font-semibold text-xl">Trainer Solves</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-border/10 pb-3 mb-4">
        <HugeiconsIcon
          icon={FilterIcon}
          size={14}
          className="text-muted-foreground"
        />

        <Select value={algSetFilter} onValueChange={handleAlgSetChange}>
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

        {availableCases.length > 0 && (
          <Select value={caseFilter} onValueChange={setCaseFilter}>
            <SelectTrigger className="h-8 w-36 text-xs border-none bg-accent/10">
              <SelectValue placeholder="Case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cases</SelectItem>
              {availableCases.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={penaltyFilter}
          onValueChange={(v) => setPenaltyFilter(v as PenaltyFilter)}
        >
          <SelectTrigger className="h-8 w-28 text-xs border-none bg-accent/10">
            <SelectValue placeholder="Penalty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="OK">OK</SelectItem>
            <SelectItem value="+2">+2</SelectItem>
            <SelectItem value="DNF">DNF</SelectItem>
          </SelectContent>
        </Select>

        <span className="ml-auto text-xs text-muted-foreground">
          {filteredSolves.length} solve{filteredSolves.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredSolves.length === 0 ?
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <p className="text-sm">No solves yet.</p>
            <p className="text-xs opacity-60">
              Start drilling on the trainer page.
            </p>
          </div>
        : <ul className="divide-y divide-border/10">
            {filteredSolves.map((solve: TrainerSolve) => {
              const algSet = ALG_SETS[solve.algSetId];
              const caseName =
                algSet?.cases[solve.caseId]?.name ?? solve.caseId;
              const algSetName = algSet?.name ?? solve.algSetId;

              const effectiveTime =
                solve.penalty === "DNF" ? null
                : solve.penalty === "+2" ? solve.time + 2000
                : solve.time;

              return (
                <li
                  key={solve.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-accent/5 transition-colors rounded-lg"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">
                      {algSetName} — {caseName}
                    </span>
                    <span className="text-xs text-muted-foreground/60">
                      {new Date(solve.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "font-mono text-sm font-semibold",
                        solve.penalty === "DNF" && "text-danger",
                        solve.penalty === "+2" && "text-yellow-500",
                      )}
                    >
                      {solve.penalty === "DNF" ?
                        "DNF"
                      : effectiveTime !== null ?
                        `${formatTime(effectiveTime)}${solve.penalty === "+2" ? "+" : ""}`
                      : "—"}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full text-muted-foreground hover:text-danger"
                      onClick={() => deleteSolve(solve.id)}
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={14} />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        }
      </div>
    </div>
  );
}
