import { Delete02Icon, UnavailableIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ALG_SETS, getAlgSetsForPuzzle } from "@/data/trainer";
import { usePuzzles } from "@/hooks/use-puzzles";
import {
  type TrainerSolvePenaltyFilter,
  type TrainerSolveSortOption,
  useTrainerSolves,
} from "@/hooks/use-trainer-solves";
import { formatTimeShort } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import type { TrainerSolve } from "@/types/trainer";

export const Route = createFileRoute("/trainer/solves")({
  component: TrainerSolvesPage,
});

const ROW_HEIGHT = 56; // px — trainer rows have two lines

function trainerEffectiveTime(solve: TrainerSolve): number | null {
  if (solve.penalty === "DNF") return null;
  if (solve.penalty === "+2") return solve.time + 2000;
  return solve.time;
}

function formatTrainerSolveTime(solve: TrainerSolve): string {
  if (solve.penalty === "DNF") return "DNF";
  const time = trainerEffectiveTime(solve);
  if (time === null) return "DNF"; // Safety
  const display = formatTimeShort(time);
  return solve.penalty === "+2" ? `${display}+` : display;
}

function TrainerSolvesPage() {
  const { currentPuzzle } = usePuzzles();

  const [algSetFilter, setAlgSetFilter] = useState<string>("all");
  const [caseFilter, setCaseFilter] = useState<string>("all");
  const [penaltyFilter, setPenaltyFilter] =
    useState<TrainerSolvePenaltyFilter>("all");
  const [sortOption, setSortOption] =
    useState<TrainerSolveSortOption>("newest");
  const [deleteTarget, setDeleteTarget] = useState<TrainerSolve | null>(null);

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

  const { solves, isLoading, totalCount, deleteSolve } = useTrainerSolves({
    puzzleId: currentPuzzle.id,
    algSetId: algSetFilter !== "all" ? algSetFilter : undefined,
    caseId: caseFilter !== "all" ? caseFilter : undefined,
    penaltyFilter,
    sortOption,
  });

  const isPageLoading = isLoading;

  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: solves.length > 0 ? solves.length + 1 : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) => (index < solves.length ? ROW_HEIGHT : 60),
    overscan: 10,
  });

  const handleAlgSetChange = (val: string) => {
    setAlgSetFilter(val);
    setCaseFilter("all");
  };

  const handlePenaltyFilterChange = useCallback((value: string) => {
    setPenaltyFilter(value as TrainerSolvePenaltyFilter);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortOption(value as TrainerSolveSortOption);
  }, []);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteSolve(deleteTarget.id);
    setDeleteTarget(null);
  };

  const items = virtualizer.getVirtualItems();

  return (
    <div className="flex h-dvh flex-col md:h-svh">
      <Page className="space-y-6 flex min-h-0 flex-1 flex-col gap-0 py-8!">
        <PageHeader className="space-y-4 px-0 pb-4 md:pb-6">
          <div>
            <PageTitle>Trainer Solves</PageTitle>
            <PageDescription>{totalCount} total solves</PageDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={algSetFilter} onValueChange={handleAlgSetChange}>
              <SelectTrigger className="w-32">
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
                <SelectTrigger className="w-36">
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
              onValueChange={handlePenaltyFilterChange}
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Penalty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="OK">OK</SelectItem>
                <SelectItem value="+2">+2</SelectItem>
                <SelectItem value="DNF">DNF</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="best">Best</SelectItem>
                <SelectItem value="worst">Worst</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PageHeader>

        <div
          ref={scrollRef}
          className={cn(
            "relative min-h-0 h-full! p-2 flex-1 overflow-y-auto scrollbar-4 rounded-sm transition-opacity duration-150 bg-inset",
            isPageLoading && "opacity-50",
          )}
        >
          {solves.length === 0 ?
            <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
              {isPageLoading ?
                <div className="flex flex-col items-center gap-3">
                  <Spinner className="size-8 text-accent" />
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Loading solves...
                  </p>
                </div>
              : <div className="flex flex-col items-center gap-4">
                  <div className="rounded-full bg-muted/30 p-4">
                    <HugeiconsIcon
                      icon={UnavailableIcon}
                      className="size-8 text-muted-foreground/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-foreground">
                      {totalCount === 0 ? "No solves yet" : "No matches found"}
                    </p>
                    <p className="text-sm text-muted-foreground max-w-[200px]">
                      {totalCount === 0 ?
                        "Complete your first solve to see it here!"
                      : "Try adjusting your filters to find what you're looking for."
                      }
                    </p>
                  </div>
                </div>
              }
            </div>
          : <div
              style={{ height: virtualizer.getTotalSize() }}
              className="relative w-full"
            >
              {items.map((vItem) => {
                const isLast = vItem.index === solves.length;

                if (isLast) {
                  return (
                    <div
                      key={vItem.key}
                      data-index={vItem.index}
                      ref={virtualizer.measureElement}
                      className="absolute left-0 top-0 w-full flex items-center justify-center pt-8 pb-16"
                      style={{
                        transform: `translateY(${vItem.start}px)`,
                      }}
                    >
                      <span className="text-xs text-center font-medium text-muted-foreground/40 uppercase tracking-widest">
                        You reached the end
                      </span>
                    </div>
                  );
                }

                const solve = solves[vItem.index];
                const algSet = ALG_SETS[solve.algSetId];
                const caseName =
                  algSet?.cases[solve.caseId]?.name ?? solve.caseId;
                const algSetName = algSet?.name ?? solve.algSetId;

                return (
                  <div
                    key={vItem.key}
                    data-index={vItem.index}
                    ref={virtualizer.measureElement}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      transform: `translateY(${vItem.start}px)`,
                    }}
                  >
                    <div
                      className="group flex items-center gap-3 rounded-lg px-2 hover:bg-muted/60 transition-colors"
                      style={{ height: ROW_HEIGHT }}
                    >
                      <span
                        className={cn(
                          "min-w-[7ch] shrink-0 text-right font-mono text-[15px] font-bold",
                          {
                            "text-foreground":
                              solve.penalty === "OK" || solve.penalty === null,
                            "text-warning": solve.penalty === "+2",
                            "text-danger": solve.penalty === "DNF",
                          },
                        )}
                      >
                        {formatTrainerSolveTime(solve)}
                      </span>

                      <div className="min-w-0 flex-1 pl-2">
                        <div className="truncate text-[12px] font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                          {algSetName}{" "}
                          <span className="text-muted-foreground/50 mx-1">
                            —
                          </span>{" "}
                          {caseName}
                        </div>
                        <div className="text-[10px] text-muted-foreground/40 group-hover:text-muted-foreground/60 font-medium transition-colors">
                          {new Date(solve.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0 text-muted-foreground/30 opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger hover:bg-danger/10"
                        onClick={() => setDeleteTarget(solve)}
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          }

          {isPageLoading && solves.length > 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/5 transition-all animate-in fade-in duration-200">
              <div className="rounded-full bg-background/80 p-3 shadow-premium-sm backdrop-blur-md border border-white/10">
                <Spinner className="size-6 text-accent" />
              </div>
            </div>
          )}
        </div>
      </Page>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Solve</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this solve? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel />
            <AlertDialogAction onClick={handleDelete} variant="danger">
              <HugeiconsIcon icon={Delete02Icon} />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
