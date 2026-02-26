import {
  Copy01Icon,
  Delete02Icon,
  Flag02Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useCopyToClipboard } from "react-use";
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
  PageBody,
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
import {
  Sheet,
  SheetBody,
  SheetCancel,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePuzzles } from "@/hooks/use-puzzles";
import { useSettings } from "@/hooks/use-settings";
import { useSolves } from "@/hooks/use-solves";
import { formatTime } from "@/lib/format-time";
import { getEffectiveTime } from "@/lib/stats";
import type { Penalty, Solve } from "@/types/puzzles";

export const Route = createFileRoute("/_timer/solves")({
  component: SolvesPage,
});

type PenaltyFilter = "all" | Penalty;
type SortOption = "newest" | "oldest" | "best" | "worst";

let hasPageAnimated = false;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 12 },
  show: { opacity: 1, scale: 1, y: 0 },
};

function SolvesPage() {
  const { currentPuzzle } = usePuzzles();
  const { settings } = useSettings();
  const { solves, updatePenalty, deleteSolve } = useSolves({
    puzzleId: currentPuzzle.id,
  });

  const [penaltyFilter, setPenaltyFilter] = useState<PenaltyFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [selectedSolve, setSelectedSolve] = useState<Solve | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Solve | null>(null);
  const [, copyToClipboard] = useCopyToClipboard();
  const [copyFeedback, setCopyFeedback] = useState(false);

  const filteredSolves = useMemo(() => {
    let result = [...solves];

    if (penaltyFilter !== "all") {
      result = result.filter((solve) => solve.penalty === penaltyFilter);
    }

    switch (sortOption) {
      case "newest":
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "oldest":
        result.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "best": {
        result.sort((a, b) => {
          const aTime = getEffectiveTime(a);
          const bTime = getEffectiveTime(b);
          if (aTime === null && bTime === null) return 0;
          if (aTime === null) return 1;
          if (bTime === null) return -1;
          return aTime - bTime;
        });
        break;
      }
      case "worst": {
        result.sort((a, b) => {
          const aTime = getEffectiveTime(a);
          const bTime = getEffectiveTime(b);
          if (aTime === null && bTime === null) return 0;
          if (aTime === null) return -1;
          if (bTime === null) return 1;
          return bTime - aTime;
        });
        break;
      }
    }

    return result;
  }, [solves, penaltyFilter, sortOption]);

  console.log("SolvesPage render", {
    currentPuzzleId: currentPuzzle.id,
    solvesCount: solves.length,
    solvesSample: solves.slice(0, 2),
    filteredCount: filteredSolves.length,
    penaltyFilter,
    sortOption,
  });

  const handleCopyScramble = (scramble: string) => {
    copyToClipboard(scramble);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1500);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteSolve(deleteTarget.id);
    setDeleteTarget(null);
    if (selectedSolve?.id === deleteTarget.id) {
      setSelectedSolve(null);
    }
  };

  const formatSolveTime = (solve: Solve) => {
    if (solve.penalty === "DNF") return "DNF";
    const time = getEffectiveTime(solve);
    const display = formatTime(
      time,
      settings.timerPrecision,
      settings.timeFormat,
    );
    return solve.penalty === "+2" ? `${display}+` : display;
  };

  const formatDate = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Page>
      <PageHeader className="space-y-4">
        <PageTitle>Solves</PageTitle>
        <PageDescription>{solves.length} solves</PageDescription>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={penaltyFilter}
            onValueChange={(value) => setPenaltyFilter(value as PenaltyFilter)}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="OK">OK</SelectItem>
              <SelectItem value="+2">+2</SelectItem>
              <SelectItem value="DNF">DNF</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value as SortOption)}
          >
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

      <PageBody>
        {filteredSolves.length === 0 ?
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onAnimationComplete={() => (hasPageAnimated = true)}
            className="flex h-40 items-center justify-center text-muted-foreground"
          >
            {solves.length === 0 ?
              "No solves yet. Start timing!"
            : "No solves match this filter."}
          </motion.div>
        : <motion.div
            key={`${penaltyFilter}-${sortOption}`}
            variants={containerVariants}
            initial={hasPageAnimated ? "show" : "hidden"}
            animate="show"
            className="space-y-1"
            onAnimationComplete={() => (hasPageAnimated = true)}
          >
            {filteredSolves.map((solve) => {
              const solveTimeTextClass =
                solve.penalty === "DNF" ? "text-danger"
                : solve.penalty === "+2" ? "text-warning"
                : "text-foreground";

              return (
                <motion.div key={solve.id} variants={itemVariants}>
                  <Button
                    variant="ghost"
                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary hover:shadow-sm"
                    onClick={() => setSelectedSolve(solve)}
                  >
                    <span
                      className={`min-w-20 font-mono text-base font-semibold ${solveTimeTextClass}`}
                    >
                      {formatSolveTime(solve)}
                    </span>
                    <span className="flex-1 truncate text-xs font-mono text-muted-foreground">
                      {solve.scramble}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(solve.createdAt)}
                    </span>
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        }
      </PageBody>

      <Sheet
        open={!!selectedSolve}
        onOpenChange={(open) => !open && setSelectedSolve(null)}
      >
        <SheetContent side="bottom">
          {selectedSolve && (
            <>
              <SheetHeader>
                <SheetTitle>Solve Detail</SheetTitle>
              </SheetHeader>
              <SheetBody className="space-y-6">
                <div>
                  <div
                    className={`font-mono text-5xl font-black tracking-tighter ${
                      selectedSolve.penalty === "DNF" ? "text-danger"
                      : selectedSolve.penalty === "+2" ? "text-warning"
                      : "text-foreground"
                    }`}
                  >
                    {formatSolveTime(selectedSolve)}
                  </div>
                  <div className="mt-2 text-sm font-medium text-muted-foreground">
                    {new Date(selectedSolve.createdAt).toLocaleString()}
                  </div>
                </div>

                {(selectedSolve.kind === "inspection" ||
                  selectedSolve.kind === "full") && (
                  <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
                    <span className="text-sm font-medium text-foreground">
                      Inspection Time
                    </span>
                    <span className="font-mono font-semibold text-accent">
                      {formatTime(selectedSolve.inspectionTime, 1)}s
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Scramble
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyScramble(selectedSolve.scramble)}
                      className="h-8 group"
                    >
                      <HugeiconsIcon
                        icon={Copy01Icon}
                        className="text-muted-foreground transition-colors group-hover:text-foreground"
                      />
                      {copyFeedback ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <p className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-border bg-secondary/80 p-4 font-mono text-[13px] leading-relaxed">
                    {selectedSolve.scramble}
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Penalty
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      className={
                        selectedSolve.penalty === "OK" ?
                          ""
                        : "text-muted-foreground"
                      }
                      onClick={() => {
                        updatePenalty(selectedSolve.id, "OK");
                        setSelectedSolve({
                          ...selectedSolve,
                          penalty: "OK",
                        });
                      }}
                    >
                      No Penalty
                    </Button>
                    <Button
                      variant={
                        selectedSolve.penalty === "+2" ? "warning" : "default"
                      }
                      className={
                        selectedSolve.penalty !== "+2" ?
                          "text-muted-foreground"
                        : ""
                      }
                      onClick={() => {
                        const newPenalty: Penalty =
                          selectedSolve.penalty === "+2" ? "OK" : "+2";
                        updatePenalty(selectedSolve.id, newPenalty);
                        setSelectedSolve({
                          ...selectedSolve,
                          penalty: newPenalty,
                        });
                      }}
                    >
                      <HugeiconsIcon icon={Flag02Icon} />
                      +2
                    </Button>
                    <Button
                      variant={
                        selectedSolve.penalty === "DNF" ? "danger" : "default"
                      }
                      className={
                        selectedSolve.penalty !== "DNF" ?
                          "text-muted-foreground"
                        : ""
                      }
                      onClick={() => {
                        const newPenalty: Penalty =
                          selectedSolve.penalty === "DNF" ? "OK" : "DNF";
                        updatePenalty(selectedSolve.id, newPenalty);
                        setSelectedSolve({
                          ...selectedSolve,
                          penalty: newPenalty,
                        });
                      }}
                    >
                      <HugeiconsIcon icon={UnavailableIcon} />
                      DNF
                    </Button>
                  </div>
                </div>
              </SheetBody>
              <SheetFooter>
                <SheetCancel />
                <Button
                  variant="danger"
                  onClick={() => setDeleteTarget(selectedSolve)}
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                  Delete Solve
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} variant="danger">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}
