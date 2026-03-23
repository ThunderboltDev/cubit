import {
  Copy01Icon,
  Delete02Icon,
  Flag02Icon,
  Tick,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { type ComponentProps, type ReactNode, useMemo, useState } from "react";
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
import { useSolves } from "@/hooks/use-solves";
import { formatTimeShort } from "@/lib/format-time";
import { getEffectiveTime } from "@/lib/stats";
import { cn } from "@/lib/utils";
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
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

function SolvesPage() {
  const { currentPuzzle } = usePuzzles();
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
    const display = formatTimeShort(time);
    return solve.penalty === "+2" ? `${display}+` : display;
  };

  const formatDate = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(timestamp);
  };

  return (
    <Page>
      <PageHeader className="space-y-4">
        <div>
          <PageTitle>Solves</PageTitle>
          <PageDescription>{solves.length} total solves</PageDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
            className="flex flex-col gap-1"
            onAnimationComplete={() => (hasPageAnimated = true)}
          >
            {filteredSolves.map((solve) => {
              return (
                <motion.div key={solve.id} variants={itemVariants}>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedSolve(solve)}
                    className="group hover:bg-muted w-full flex items-center gap-3 text-left"
                  >
                    <span
                      className={cn(
                        "min-w-[7ch] shrink-0 font-mono text-[15px] font-semibold",
                        {
                          "text-foreground": solve.penalty === "OK",
                          "text-warning": solve.penalty === "+2",
                          "text-danger": solve.penalty === "DNF",
                        },
                      )}
                    >
                      {formatSolveTime(solve)}
                    </span>

                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                      {solve.scramble}
                    </span>

                    <span className="shrink-0 text-xs text-muted-foreground/50 font-mono">
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
        <SheetContent>
          {selectedSolve && (
            <>
              <SheetHeader>
                <SheetTitle>Solve detail</SheetTitle>
              </SheetHeader>

              <SheetBody className="gap-0 space-y-0 px-4 pb-2">
                <div className="flex items-end justify-between pb-5">
                  <div>
                    <div
                      className={cn(
                        "font-mono text-5xl font-black tracking-tighter leading-none",
                        selectedSolve.penalty === "DNF" && "text-danger",
                        selectedSolve.penalty === "+2" && "text-warning",
                        selectedSolve.penalty === null && "text-foreground",
                      )}
                    >
                      {formatSolveTime(selectedSolve)}
                    </div>
                    <div className="mt-1.5 text-sm text-muted-foreground">
                      {new Date(selectedSolve.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-border" />
                <div className="py-4 space-y-3">
                  {(selectedSolve.kind === "inspection" ||
                    selectedSolve.kind === "full") && (
                    <StatRow
                      label="Inspection"
                      value={
                        <span className="font-mono font-semibold text-accent">
                          {formatTimeShort(selectedSolve.inspectionTime)}
                        </span>
                      }
                    />
                  )}
                  <StatRow
                    label="Raw time"
                    value={
                      <span className="font-mono font-semibold">
                        {formatTimeShort(selectedSolve.time)}
                      </span>
                    }
                  />
                </div>

                <div className="h-px w-full bg-border" />

                <div className="py-4 space-y-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold uppercase tracking-widest text-muted-foreground">
                      Scramble
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:text-foreground"
                      onClick={() => handleCopyScramble(selectedSolve.scramble)}
                    >
                      <HugeiconsIcon
                        icon={Copy01Icon}
                        altIcon={Tick}
                        showAlt={copyFeedback}
                      />
                      {copyFeedback ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <p className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-inset px-4 py-3 font-mono text-[13px] leading-relaxed text-muted-foreground">
                    {selectedSolve.scramble}
                  </p>
                </div>

                <div className="h-px w-full bg-border" />

                <div className="py-4 space-y-0">
                  <span className="font-semibold uppercase tracking-widest text-muted-foreground">
                    Penalty
                  </span>
                  <div className="flex rounded-lg bg-inset p-1 gap-1">
                    <PenaltyPill
                      label="OK"
                      active={
                        selectedSolve.penalty === "OK" ||
                        selectedSolve.penalty === null
                      }
                      onClick={() => {
                        updatePenalty(selectedSolve.id, "OK");
                        setSelectedSolve({ ...selectedSolve, penalty: "OK" });
                      }}
                    />
                    <PenaltyPill
                      label="+2"
                      variant="warning"
                      active={selectedSolve.penalty === "+2"}
                      icon={Flag02Icon}
                      onClick={() => {
                        const next: Penalty =
                          selectedSolve.penalty === "+2" ? "OK" : "+2";
                        updatePenalty(selectedSolve.id, next);
                        setSelectedSolve({ ...selectedSolve, penalty: next });
                      }}
                    />
                    <PenaltyPill
                      label="DNF"
                      variant="danger"
                      active={selectedSolve.penalty === "DNF"}
                      icon={UnavailableIcon}
                      onClick={() => {
                        const next: Penalty =
                          selectedSolve.penalty === "DNF" ? "OK" : "DNF";
                        updatePenalty(selectedSolve.id, next);
                        setSelectedSolve({ ...selectedSolve, penalty: next });
                      }}
                    />
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

interface StatRowProps {
  label: string;
  value: ReactNode;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-base text-muted-foreground">{label}</span>
      <span className="text-base">{value}</span>
    </div>
  );
}

function PenaltyPill({
  label,
  active,
  variant = "default",
  icon,
  onClick,
}: {
  label: string;
  active: boolean;
  variant?: "default" | "warning" | "danger";
  icon?: ComponentProps<typeof HugeiconsIcon>["icon"];
  onClick: () => void;
}) {
  const activeClasses =
    variant === "warning" ? "bg-warning text-white shadows-warning"
    : variant === "danger" ? "bg-danger text-white shadows-danger"
    : "bg-muted shadows-muted text-foreground";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium",
        "transition-all duration-150",
        active ? activeClasses : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon && <HugeiconsIcon icon={icon} className="size-4 shrink-0" />}
      {label}
    </button>
  );
}
