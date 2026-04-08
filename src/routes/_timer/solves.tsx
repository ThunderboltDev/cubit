import {
  Copy01Icon,
  Delete02Icon,
  Flag02Icon,
  Tick02Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { usePuzzles } from "@/hooks/use-puzzles";
import {
  type SolvePenaltyFilter,
  type SolveSortOption,
  useSolves,
} from "@/hooks/use-solves";
import { formatTimeShort } from "@/lib/format-time";
import { getEffectiveTime } from "@/lib/stats";
import { cn } from "@/lib/utils";
import type { Penalty, Solve } from "@/types/puzzles";

export const Route = createFileRoute("/_timer/solves")({
  component: SolvesPage,
});

const ROW_HEIGHT = 40;

function formatSolveTime(solve: Solve): string {
  if (solve.penalty === "DNF") return "DNF";
  const time = getEffectiveTime(solve);
  const display = formatTimeShort(time);
  return solve.penalty === "+2" ? `${display}+` : display;
}

function formatDate(timestamp: number): string {
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
}

function SolvesPage() {
  const { currentPuzzle } = usePuzzles();

  const [penaltyFilter, setPenaltyFilter] = useState<SolvePenaltyFilter>("all");
  const [sortOption, setSortOption] = useState<SolveSortOption>("newest");
  const [selectedSolve, setSelectedSolve] = useState<Solve | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Solve | null>(null);
  const [, copyToClipboard] = useCopyToClipboard();
  const [copyFeedback, setCopyFeedback] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { solves, isLoading, totalCount, updatePenalty, deleteSolve } =
    useSolves({
      puzzleId: currentPuzzle.id,
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

  const handlePenaltyFilterChange = useCallback((value: string) => {
    setPenaltyFilter(value as SolvePenaltyFilter);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortOption(value as SolveSortOption);
  }, []);

  useEffect(() => () => clearTimeout(copyTimeoutRef.current), []);

  const handleCopyScramble = (scramble: string) => {
    copyToClipboard(scramble);
    setCopyFeedback(true);
    clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopyFeedback(false), 1500);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteSolve(deleteTarget.id);
    setDeleteTarget(null);
    if (selectedSolve?.id === deleteTarget.id) {
      setSelectedSolve(null);
    }
  };

  const items = virtualizer.getVirtualItems();

  return (
    <div className="flex h-dvh flex-col md:h-svh">
      <Page className="space-y-6 flex min-h-0 flex-1 flex-col gap-0 py-8!">
        <PageHeader className="space-y-3 px-0">
          <div>
            <PageTitle>Solves</PageTitle>
            <PageDescription>{totalCount} total solves</PageDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={penaltyFilter}
              onValueChange={handlePenaltyFilterChange}
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
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedSolve(solve)}
                      className="group h-[40px] hover:bg-background/60 w-full flex items-center gap-4 px-4 text-left transition-colors"
                    >
                      <span
                        className={cn(
                          "min-w-[5ch] text-right shrink-0 font-mono text-[14px] font-bold tabular-nums",
                          {
                            "text-foreground": solve.penalty === "OK",
                            "text-warning": solve.penalty === "+2",
                            "text-danger": solve.penalty === "DNF",
                          },
                        )}
                      >
                        {formatSolveTime(solve)}
                      </span>

                      <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                        {solve.scramble}
                      </span>

                      <span className="shrink-0 text-[10px] text-muted-foreground/30 font-medium group-hover:text-muted-foreground/50 transition-colors">
                        {formatDate(solve.createdAt)}
                      </span>
                    </Button>
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
                      size="icon-sm"
                      variant="ghost"
                      className="hover:text-foreground"
                      title={copyFeedback ? "Copied!" : "Copy"}
                      onClick={() => handleCopyScramble(selectedSolve.scramble)}
                    >
                      <HugeiconsIcon
                        icon={Copy01Icon}
                        altIcon={Tick02Icon}
                        showAlt={copyFeedback}
                      />
                      <span className="sr-only">
                        {copyFeedback ? "Copied!" : "Copy"}
                      </span>
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
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex-1",
        active ? activeClasses : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon && <HugeiconsIcon icon={icon} />}
      {label}
    </Button>
  );
}
