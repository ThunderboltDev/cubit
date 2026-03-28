import {
  Bug02Icon,
  Setting07Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetBody,
  SheetCancel,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { PUZZLE_TYPES } from "@/data/puzzles";
import { db } from "@/lib/db";
import { generateBulkSolves } from "@/lib/generate-solves";
import { cn } from "@/lib/utils";
import { useDevToolsStore } from "@/stores/devtools";
import { usePuzzlesStore } from "@/stores/puzzles";

export function DevToolsProvider() {
  const { devModeEnabled, enableDevMode } = useDevToolsStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        enableDevMode();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableDevMode]);

  return (
    <>
      <AnimatePresence>{devModeEnabled && <DevToolsBadge />}</AnimatePresence>
      <DevToolsSheet />
    </>
  );
}

const TAP_TARGET = 5;
const TAP_WINDOW_MS = 3000;

export function useDevToolsTapActivator() {
  const tapTimestamps = useRef<number[]>([]);
  const { enableDevMode } = useDevToolsStore();

  const handleTap = useCallback(() => {
    const now = Date.now();
    tapTimestamps.current = tapTimestamps.current.filter(
      (t) => now - t < TAP_WINDOW_MS,
    );
    tapTimestamps.current.push(now);

    if (tapTimestamps.current.length >= TAP_TARGET) {
      tapTimestamps.current = [];
      enableDevMode();
    }
  }, [enableDevMode]);

  return handleTap;
}

function DevToolsBadge() {
  const { togglePanel } = useDevToolsStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <Button
        size="icon-lg"
        className="rounded-full border-t border-border"
        onClick={togglePanel}
      >
        <HugeiconsIcon icon={Bug02Icon} />
      </Button>
    </motion.div>
  );
}

type GenerateStatus =
  | { state: "idle" }
  | { state: "generating"; count: number }
  | { state: "done"; count: number; elapsedMs: number }
  | { state: "error"; message: string };

function DevToolsSheet() {
  const { panelOpen, setPanelOpen, disableDevMode } = useDevToolsStore();
  const addPuzzle = usePuzzlesStore((s) => s.addPuzzle);

  const [puzzleName, setPuzzleName] = useState(crypto.randomUUID().slice(0, 6));
  const [solveCount, setSolveCount] = useState(10_000);
  const [multiphaseEnabled, setMultiphaseEnabled] = useState(false);
  const [multiphaseCount, setMultiphaseCount] = useState(3);
  const [status, setStatus] = useState<GenerateStatus>({ state: "idle" });

  const handleGenerate = useCallback(async () => {
    const count = solveCount;
    if (
      !puzzleName.trim() ||
      Number.isNaN(count) ||
      count < 1 ||
      count > 100_000
    ) {
      return;
    }

    setStatus({ state: "generating", count });

    const start = performance.now();

    try {
      const randomType =
        PUZZLE_TYPES[Math.floor(Math.random() * PUZZLE_TYPES.length)];

      const puzzleId = crypto.randomUUID();

      addPuzzle({
        name: puzzleName.trim(),
        type: randomType,
        inspectionEnabled: Math.random() > 0.5,
        inspectionDuration: 15,
        multiphaseEnabled,
        multiphaseCount: multiphaseEnabled ? multiphaseCount : 0,
        trimPercentage: 5,
        inputMethod: "timer",
        scramblePreview: true,
        scramblePreviewVisualization: "3D",
        displayStats: {
          style: "cards",
          orientation: "horizontal",
          stats: [
            { type: "best", n: Infinity },
            { type: "average", n: 5 },
            { type: "average", n: 12 },
          ],
        },
        method: "Beginner",
        lettering: undefined,
      });

      const actualPuzzleId =
        usePuzzlesStore.getState().activePuzzleId ?? puzzleId;

      const solves = generateBulkSolves(
        actualPuzzleId,
        count,
        multiphaseEnabled,
        multiphaseCount,
      );

      await db.solves.bulkAdd(solves);

      const elapsedMs = Math.round(performance.now() - start);
      setStatus({ state: "done", count, elapsedMs });
      disableDevMode();
      setPuzzleName(crypto.randomUUID().slice(0, 6));
      setSolveCount(1000);
    } catch (err) {
      setStatus({
        state: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, [
    puzzleName,
    solveCount,
    multiphaseEnabled,
    multiphaseCount,
    addPuzzle,
    disableDevMode,
  ]);

  const isGenerating = status.state === "generating";
  const isValid =
    puzzleName.trim().length > 0 &&
    !Number.isNaN(solveCount) &&
    solveCount >= 1 &&
    solveCount <= 100_000;

  return (
    <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
      <SheetContent side="bottom" responsive>
        <SheetHeader>
          <SheetTitle>Dev Tools</SheetTitle>
          <SheetDescription>
            Performance testing utilities. Generate bulk solves for a custom
            puzzle.
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="gap-4">
          <div className="space-y-2">
            <Label htmlFor="devtools-puzzle-name">Puzzle Name</Label>
            <Input
              id="devtools-puzzle-name"
              placeholder="e.g. Perf Test 10k"
              value={puzzleName}
              onChange={(e) => setPuzzleName(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-4 pt-2">
            <Label htmlFor="devtools-solve-count" className="mb-2 block">
              Number of Solves
            </Label>
            <Slider
              id="devtools-solve-count"
              min={0}
              max={100_000}
              step={10_000}
              value={[solveCount]}
              marks={(v) => {
                if (v % 25_000 === 0) {
                  return v > 0 ? `${v / 1000}k` : "0";
                }

                return undefined;
              }}
              onValueChange={(val) =>
                setSolveCount(Array.isArray(val) ? val[0] : val)
              }
              disabled={isGenerating}
              formatBadge={(v) => v.toLocaleString()}
              badgeWidth="4rem"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="devtools-multiphase" className="cursor-pointer">
              Multiphase Enabled
            </Label>
            <Switch
              id="devtools-multiphase"
              checked={multiphaseEnabled}
              onCheckedChange={setMultiphaseEnabled}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-4 pb-2">
            <Label htmlFor="devtools-multiphase-count" className="block">
              Phases
            </Label>
            <Slider
              id="devtools-multiphase-count"
              min={2}
              max={10}
              step={1}
              value={[multiphaseCount]}
              marks={String}
              onValueChange={(val) =>
                setMultiphaseCount(Array.isArray(val) ? val[0] : val)
              }
              disabled={isGenerating}
              badgeWidth="2rem"
            />
          </div>

          {status.state === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-accent/10 p-3 text-sm text-accent"
            >
              Generated {status.count.toLocaleString()} solves in{" "}
              {status.elapsedMs.toLocaleString()}ms
            </motion.div>
          )}

          {status.state === "error" && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              Error: {status.message}
            </div>
          )}
        </SheetBody>

        <SheetFooter>
          <div className="mr-auto">
            <Button
              variant="danger"
              size="responsive"
              onClick={disableDevMode}
              disabled={isGenerating}
            >
              <HugeiconsIcon icon={UnavailableIcon} />
              Disable
            </Button>
          </div>
          <SheetCancel />
          <Button
            variant="accent"
            size="responsive"
            onClick={handleGenerate}
            disabled={!isValid || isGenerating}
            aria-busy={isGenerating}
          >
            <HugeiconsIcon
              icon={Setting07Icon}
              className={cn(isGenerating && "animate-spin")}
            />
            {isGenerating ? "Generating ..." : "Generate"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
