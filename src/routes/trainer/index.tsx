import {
  ArrowRight01Icon,
  Delete02Icon,
  Flag02Icon,
  GridViewIcon,
  Tick02Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ScramblePreview } from "@/components/timer/scramble-preview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FieldItem, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALG_SETS,
  BLD_CORNER_METHODS,
  BLD_EDGE_METHODS,
  getBldMethodsForPuzzle,
  getMethodsForPuzzle,
  isBldPuzzleType,
  TRAINER_METHODS,
} from "@/data/trainer";
import { usePuzzles } from "@/hooks/use-puzzles";
import { useTrainerTimer } from "@/hooks/use-trainer-timer";
import { generateScramble } from "@/lib/scrambles";
import { cn } from "@/lib/utils";
import { useTrainerStore } from "@/stores/trainer";
import type { Method } from "@/types/trainer";

export const Route = createFileRoute("/trainer/")({
  component: TrainerPage,
});

function MethodSelector({
  methods,
  onSelect,
}: {
  methods: { id: string; name: string }[];
  onSelect: (id: Method) => void;
}) {
  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center gap-4 p-6 pb-24">
      <div className="text-center space-y-2 max-w-sm">
        <h1 className="text-2xl font-bold">Select a Trainer Method</h1>
        <p className="text-muted-foreground">
          Choose a solving method to train. This cannot be changed later.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {methods.map((m) => (
          <Button
            key={m.id}
            size="lg"
            className="w-full justify-between"
            onClick={() => onSelect(m.id as Method)}
          >
            <span>{m.name}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Button>
        ))}
      </div>
    </div>
  );
}

function BldMethodSelector({
  puzzleType,
  onSelect,
}: {
  puzzleType: Parameters<typeof getBldMethodsForPuzzle>[0];
  onSelect: (cornerMethodId: Method, edgeMethodId: Method) => void;
}) {
  const cornerMethods = useMemo(
    () => getBldMethodsForPuzzle(puzzleType, "corners"),
    [puzzleType],
  );

  const edgeMethods = useMemo(
    () => getBldMethodsForPuzzle(puzzleType, "edges"),
    [puzzleType],
  );

  const [selectedCorner, setSelectedCorner] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  const canConfirm = selectedCorner !== null && selectedEdge !== null;

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center gap-4 p-6 pb-24">
      <div className="text-center space-y-2 max-md">
        <h1 className="text-2xl font-bold">Select BLD Methods</h1>
        <p className="text-muted-foreground">
          Choose a method for corners and edges separately. This cannot be
          changed later.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
        <FieldItem>
          <FieldLabel>Corners</FieldLabel>
          <Select
            value={selectedCorner ?? undefined}
            onValueChange={(value) => setSelectedCorner(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a corner method" />
            </SelectTrigger>
            <SelectContent>
              {cornerMethods.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldItem>

        <FieldItem>
          <FieldLabel>Edges</FieldLabel>
          <Select
            value={selectedEdge ?? undefined}
            onValueChange={(value) => setSelectedEdge(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an edge method" />
            </SelectTrigger>
            <SelectContent>
              {edgeMethods.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldItem>
      </div>

      <Button
        variant="accent"
        disabled={!canConfirm}
        onClick={() => {
          if (selectedCorner && selectedEdge) {
            onSelect(selectedCorner as Method, selectedEdge as Method);
          }
        }}
      >
        <HugeiconsIcon icon={Tick02Icon} size={16} />
        Confirm Selection
      </Button>
    </div>
  );
}

function NoMethodsAvailable() {
  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center gap-4 p-6 pb-24">
      <HugeiconsIcon
        icon={GridViewIcon}
        className="size-12 text-muted-foreground"
      />
      <div className="text-center space-y-2">
        <h3 className="text-xl font-medium">No Training Available</h3>
        <p className="text-balance text-muted-foreground">
          There are no trainer methods configured for this puzzle type yet.
        </p>
      </div>
    </div>
  );
}

function TrainerPage() {
  const { currentPuzzle, updatePuzzle } = usePuzzles();
  const { getSelection, setAlgSet, setGroup, setCase } = useTrainerStore();

  const { algSetId, groupId, caseId } = getSelection(currentPuzzle.id);

  const isBld = isBldPuzzleType(currentPuzzle.type);

  const methodId = currentPuzzle.trainerMethodId ?? null;

  const cornerMethodId = currentPuzzle.trainerCornerMethodId ?? null;
  const edgeMethodId = currentPuzzle.trainerEdgeMethodId ?? null;

  const hasMethod = isBld
    ? cornerMethodId !== null && edgeMethodId !== null
    : methodId !== null;

  const availableMethods = useMemo(
    () => getMethodsForPuzzle(currentPuzzle.type),
    [currentPuzzle.type],
  );

  const activeMethod = methodId ? (TRAINER_METHODS[methodId] ?? null) : null;
  const activeAlgSet = algSetId ? (ALG_SETS[algSetId] ?? null) : null;

  const methodSteps = useMemo(() => {
    if (isBld) {
      const cornerMethod = cornerMethodId
        ? BLD_CORNER_METHODS.find((m) => m.id === cornerMethodId)
        : null;
      const edgeMethod = edgeMethodId
        ? BLD_EDGE_METHODS.find((m) => m.id === edgeMethodId)
        : null;

      return [...(cornerMethod?.steps ?? []), ...(edgeMethod?.steps ?? [])];
    }
    return activeMethod?.steps ?? [];
  }, [isBld, cornerMethodId, edgeMethodId, activeMethod]);

  const stepOptions = useMemo(() => {
    return methodSteps
      .map((step) => {
        const set = ALG_SETS[step.algSetId];
        if (!set) return null;
        return { step, set };
      })
      .filter(Boolean) as {
      step: (typeof methodSteps)[number];
      set: (typeof ALG_SETS)[string];
    }[];
  }, [methodSteps]);

  const activeStep = useMemo(() => {
    if (!algSetId) return null;
    return methodSteps.find((s) => s.algSetId === algSetId) ?? null;
  }, [algSetId, methodSteps]);

  const availableGroups = useMemo(() => {
    if (!activeAlgSet?.groups) return [];
    if (!activeStep || !algSetId) return activeAlgSet.groups;

    if (activeStep.groupIds) {
      return activeAlgSet.groups.filter((g) =>
        activeStep.groupIds?.includes(g.id),
      );
    }
    return activeAlgSet.groups;
  }, [activeAlgSet, activeStep, algSetId]);

  const activeCases = useMemo(() => {
    if (!activeAlgSet) return [];
    const allCases = Object.values(activeAlgSet.cases);
    if (!groupId) {
      if (activeStep?.groupIds && activeAlgSet.groups) {
        const validCaseIds = new Set(
          activeAlgSet.groups
            .filter((g) => activeStep.groupIds?.includes(g.id))
            .flatMap((g) => g.caseIds),
        );
        return allCases.filter((c) => validCaseIds.has(c.id));
      }
      return allCases;
    }

    const group = activeAlgSet.groups?.find((g) => g.id === groupId);
    if (!group) return allCases;
    return group.caseIds.map((id) => activeAlgSet.cases[id]).filter(Boolean);
  }, [activeAlgSet, groupId, activeStep]);

  const [isRandom, setIsRandom] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showAlg, setShowAlg] = useState(false);
  const [dynamicScramble, setDynamicScramble] = useState<string | null>(null);

  const currentCase = caseId ? (activeAlgSet?.cases[caseId] ?? null) : null;

  useEffect(() => {
    let active = true;

    if (currentCase?.isDynamic) {
      if (
        currentCase.generatorType === "full-scramble" ||
        currentCase.generatorType === "bld-corners" ||
        currentCase.generatorType === "bld-edges"
      ) {
        generateScramble(currentPuzzle.type).then((scramble) => {
          if (active) setDynamicScramble(scramble);
        });
      }
    } else {
      setDynamicScramble(null);
    }

    return () => {
      active = false;
    };
  }, [currentCase, currentPuzzle.type]);

  const advanceCase = () => {
    if (activeCases.length === 0) return;
    let nextCase = currentCase;
    if (isRandom) {
      const pool =
        activeCases.length > 1
          ? activeCases.filter((c) => c.id !== caseId)
          : activeCases;
      nextCase = pool[Math.floor(Math.random() * pool.length)];
    } else {
      const currentIndex = activeCases.findIndex((c) => c.id === caseId);
      nextCase = activeCases[(currentIndex + 1) % activeCases.length];
    }
    if (nextCase) {
      setCase(currentPuzzle.id, nextCase.id);
      setShowAlg(false);
    }
  };

  const {
    settings,
    updatePenalty,
    timerState,
    currentSolve,
    controlsVisible,
    handlePressIn,
    handlePressOut,
    getTimerColor,
    getDisplayText,
    getHintText,
    handleDeleteSolve,
  } = useTrainerTimer({
    algSetId: algSetId ?? undefined,
    groupId: groupId ?? undefined,
    caseId: caseId ?? undefined,
    onSolveComplete: advanceCase,
  });

  const handleStepChange = (stepIndex: string) => {
    const idx = Number.parseInt(stepIndex, 10);
    const step = methodSteps[idx];
    if (!step) return;

    setAlgSet(currentPuzzle.id, step.algSetId);

    if (step.groupIds?.[0]) {
      setGroup(currentPuzzle.id, step.groupIds[0]);
    } else {
      setGroup(currentPuzzle.id, null);
    }

    const set = ALG_SETS[step.algSetId];
    if (set) {
      if (step.groupIds) {
        const group = set.groups?.find((g) => g.id === step.groupIds?.[0]);
        const firstCaseId = group?.caseIds[0];
        if (firstCaseId) setCase(currentPuzzle.id, firstCaseId);
      } else {
        const first = Object.values(set.cases)[0];
        if (first) setCase(currentPuzzle.id, first.id);
      }
    }
  };

  const handleMethodChange = (newMethodId: Method) => {
    updatePuzzle(currentPuzzle.id, { trainerMethodId: newMethodId });
    const method = TRAINER_METHODS[newMethodId];
    const firstStep = method?.steps[0];
    if (firstStep) {
      setAlgSet(currentPuzzle.id, firstStep.algSetId);
      const set = ALG_SETS[firstStep.algSetId];
      if (set) {
        const first = Object.values(set.cases)[0];
        if (first) setCase(currentPuzzle.id, first.id);
      }
    }
  };

  const handleBldMethodSelect = (cornerMethod: Method, edgeMethod: Method) => {
    updatePuzzle(currentPuzzle.id, {
      trainerCornerMethodId: cornerMethod,
      trainerEdgeMethodId: edgeMethod,
    });
  };

  const handleGroupChange = (newGroupId: string | null) => {
    setGroup(currentPuzzle.id, newGroupId);
    if (!activeAlgSet) return;
    if (newGroupId) {
      const group = activeAlgSet.groups?.find((g) => g.id === newGroupId);
      const firstId = group?.caseIds[0];
      const first = firstId ? activeAlgSet.cases[firstId] : null;
      if (first) setCase(currentPuzzle.id, first.id);
    } else {
      const first = Object.values(activeAlgSet.cases)[0];
      if (first) setCase(currentPuzzle.id, first.id);
    }
  };

  if (!isBld && availableMethods.length === 0) {
    return <NoMethodsAvailable />;
  }

  if (!hasMethod) {
    if (isBld) {
      return (
        <BldMethodSelector
          puzzleType={currentPuzzle.type}
          onSelect={handleBldMethodSelect}
        />
      );
    }

    return (
      <MethodSelector
        methods={availableMethods}
        onSelect={handleMethodChange}
      />
    );
  }

  const currentStepIndex = methodSteps.findIndex(
    (s) => s.algSetId === algSetId,
  );

  const displayAlg = currentCase?.isDynamic
    ? dynamicScramble || currentCase.alg
    : (currentCase?.alg ?? "");

  return (
    <div className="relative overflow-hidden h-dvh w-full flex flex-col items-center justify-center gap-4 p-6">
      <button
        type="button"
        className="absolute inset-0 z-0 flex items-center justify-center bg-background"
        onMouseDown={handlePressIn}
        onMouseUp={handlePressOut}
        onTouchStart={timerState !== "running" ? handlePressIn : undefined}
        onTouchEnd={timerState !== "running" ? handlePressOut : undefined}
        aria-label="Timer area. Press and hold to start, release to stop."
      >
        <div className="flex flex-col items-center">
          <motion.span
            key={timerState === "stopped" ? "stopped" : "running"}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "font-mono text-7xl font-bold leading-[90px]",
              getTimerColor(),
            )}
          >
            {getDisplayText(settings.timerPrecision)}
          </motion.span>
          <motion.span
            animate={{
              opacity:
                timerState === "idle" || timerState === "inspection" ? 0.5 : 0,
            }}
            className="mt-3 h-7 text-xs uppercase tracking-widest"
          >
            {getHintText()}
          </motion.span>
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ opacity: controlsVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col"
      >
        <div className="pointer-events-auto flex items-center gap-2 p-3 bg-background/60 backdrop-blur-sm border-b border-border/10 flex-wrap">
          {activeMethod && !isBld && (
            <div className="flex items-center px-3 h-8 text-xs font-medium bg-accent/10 rounded-md text-muted-foreground">
              {activeMethod.name}
            </div>
          )}
          {isBld && (
            <div className="flex items-center px-3 h-8 text-xs font-medium bg-accent/10 rounded-md text-muted-foreground gap-1">
              <span>{cornerMethodId}</span>
              <span className="opacity-40">/</span>
              <span>{edgeMethodId}</span>
            </div>
          )}

          {stepOptions.length > 0 && (
            <Select
              value={currentStepIndex >= 0 ? String(currentStepIndex) : ""}
              onValueChange={handleStepChange}
            >
              <SelectTrigger className="w-36 h-8 text-xs border-none bg-accent/10">
                <SelectValue placeholder="Select step" />
              </SelectTrigger>
              <SelectContent>
                {stepOptions.map(({ step }, i) => (
                  <SelectItem
                    key={`${step.algSetId}-${step.label}`}
                    value={String(i)}
                  >
                    {step.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {availableGroups.length > 0 && (
            <Select
              value={groupId ?? "all"}
              onValueChange={(val) =>
                handleGroupChange(val === "all" ? null : val)
              }
            >
              <SelectTrigger className="w-36 h-8 text-xs border-none bg-accent/10">
                <SelectValue placeholder="Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cases</SelectItem>
                {availableGroups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name} ({g.caseIds.length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex-1" />

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-xs rounded-full h-8 px-3",
              isRandom ? "bg-accent/20 text-accent" : "",
            )}
            onClick={() => setIsRandom(!isRandom)}
          >
            {isRandom ? "Random" : "Sequential"}
          </Button>
        </div>

        {currentCase ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: controlsVisible ? 1 : 0,
              y: controlsVisible ? 0 : -10,
            }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="pointer-events-auto flex flex-col items-center gap-3 p-4 pt-6"
          >
            <div className="text-center w-full max-w-xl">
              <div className="text-xs font-semibold text-accent mb-1 uppercase tracking-widest">
                {activeStep?.label ?? activeAlgSet?.name} — {currentCase.name}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-balance leading-tight mb-4">
                {displayAlg}
              </div>

              <AnimatePresence>
                {timerState === "stopped" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    {!showAlg ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowAlg(true)}
                      >
                        Show alg
                      </Button>
                    ) : (
                      <div className="font-mono text-base text-green-400 font-semibold px-3 py-2 bg-accent/10 rounded-lg">
                        {displayAlg}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {currentPuzzle.scramblePreview && (
              <div className="max-h-[120px] md:max-h-[160px] flex items-center justify-center mt-2">
                <ScramblePreview
                  scramble={
                    currentCase.isDynamic
                      ? dynamicScramble || currentCase.alg
                      : `${activeAlgSet?.orientation ?? ""} ${currentCase.alg}`
                  }
                  puzzleType={currentPuzzle.type}
                  visualization={currentPuzzle.scramblePreviewVisualization}
                />
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground pointer-events-auto">
            <HugeiconsIcon
              icon={GridViewIcon}
              size={32}
              className="opacity-30"
            />
            <p className="text-sm">Select a step to start drilling.</p>
          </div>
        )}

        <div className="flex-1" />

        <div className="pointer-events-auto flex items-center justify-center gap-3 py-8">
          <AnimatePresence mode="popLayout">
            {timerState === "stopped" && currentSolve && (
              <>
                {[
                  {
                    key: "plus2",
                    icon: Flag02Icon,
                    active: currentSolve.penalty === "+2",
                    rotate: "group-hover/button:rotate-12",
                    onClick: () =>
                      currentSolve &&
                      updatePenalty(
                        currentSolve.id,
                        currentSolve.penalty === "+2" ? "OK" : "+2",
                      ),
                  },
                  {
                    key: "dnf",
                    icon: UnavailableIcon,
                    active: currentSolve.penalty === "DNF",
                    rotate: "group-hover/button:rotate-180",
                    onClick: () =>
                      currentSolve &&
                      updatePenalty(
                        currentSolve.id,
                        currentSolve.penalty === "DNF" ? "OK" : "DNF",
                      ),
                  },
                  {
                    key: "delete",
                    icon: Delete02Icon,
                    active: true,
                    danger: true,
                    rotate: "group-hover/button:rotate-180",
                    onClick: () => setIsDeleteDialogOpen(true),
                  },
                ].map(({ key, icon, active, danger, rotate, onClick }, i) => (
                  <motion.div
                    key={key}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                      delay: i * 0.05,
                    }}
                  >
                    <Button
                      className="group/button rounded-full"
                      variant={
                        danger
                          ? "danger"
                          : active && key !== "delete"
                            ? "danger"
                            : "default"
                      }
                      onClick={onClick}
                    >
                      <HugeiconsIcon
                        className={cn("duration-300", rotate)}
                        icon={icon}
                      />
                    </Button>
                  </motion.div>
                ))}

                <motion.div
                  key="next"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                    delay: 0.15,
                  }}
                >
                  <Button
                    className="group/button rounded-full"
                    onClick={advanceCase}
                  >
                    <HugeiconsIcon
                      className="group-hover/button:translate-x-1 duration-200"
                      icon={ArrowRight01Icon}
                    />
                  </Button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
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
            <AlertDialogAction
              onClick={() =>
                handleDeleteSolve(() => setIsDeleteDialogOpen(false))
              }
              variant="danger"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
