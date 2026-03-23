import { useCallback, useEffect, useRef, useState } from "react";
import { usePuzzles } from "@/hooks/use-puzzles";
import { useSettings } from "@/hooks/use-settings";
import { useTrainerSolves } from "@/hooks/use-trainer-solves";
import { formatTime } from "@/lib/format-time";
import type { Penalty } from "@/types/puzzles";
import type { TimerPrecision } from "@/types/settings";
import type { TrainerSolve } from "@/types/trainer";

export type TimerState =
  | "idle"
  | "holding"
  | "inspection"
  | "running"
  | "stopped";

interface UseTrainerTimerOptions {
  algSetId?: string;
  groupId?: string;
  caseId?: string;
  onSolveComplete?: () => void;
}

export function useTrainerTimer({
  algSetId,
  groupId,
  caseId,
  onSolveComplete,
}: UseTrainerTimerOptions) {
  const { currentPuzzle } = usePuzzles();
  const { settings } = useSettings();
  const { solves, addSolve, deleteSolve, updatePenalty } = useTrainerSolves({
    puzzleId: currentPuzzle.id,
    algSetId,
    groupId,
    caseId,
  });

  const [displayTime, setDisplayTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [currentSolveId, setCurrentSolveId] = useState<string | null>(null);
  const [inspectionTime, setInspectionTime] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);

  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const holdStartTimeRef = useRef<number>(0);
  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalTimeRef = useRef<number>(0);
  const timerStateRef = useRef<TimerState>("idle");
  const inspectionStartRef = useRef<number>(0);
  const inspectionPenaltyRef = useRef<Penalty>("OK");
  const lastInspectionColorRef = useRef<"normal" | "warning" | "danger">(
    "normal",
  );
  timerStateRef.current = timerState;

  const currentSolve = solves?.find(
    (s: TrainerSolve) => s.id === currentSolveId,
  );

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
    };
  }, []);

  const applyInspectionPenalty = useCallback((penalty: Penalty) => {
    inspectionPenaltyRef.current = penalty;
  }, []);

  const startInspection = useCallback(() => {
    inspectionStartRef.current = Date.now();
    inspectionPenaltyRef.current = "OK";
    setTimerState("inspection");
    setInspectionTime((currentPuzzle.inspectionDuration || 15) * 1000);
    setCurrentSolveId(null);
    setControlsVisible(false);
  }, [currentPuzzle]);

  const startSolve = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = Date.now();

    setTimerState("running");
    setDisplayTime(0);
    setCurrentSolveId(null);
    lastInspectionColorRef.current = "normal";
  }, []);

  const endSolve = useCallback(
    async (finalTime: number) => {
      if (!algSetId || !caseId) return;

      try {
        const solveParams = {
          puzzleId: currentPuzzle.id,
          puzzleType: currentPuzzle.type,
          methodId: currentPuzzle.trainerMethodId || "Beginner",
          algSetId,
          groupId: groupId ?? null,
          caseId,
          time: finalTime,
          penalty: inspectionPenaltyRef.current,
        };

        const savedSolve = await addSolve(
          solveParams as Parameters<typeof addSolve>[0],
        );

        if (savedSolve) {
          setCurrentSolveId(savedSolve.id);
          onSolveComplete?.();
        }
      } catch (error) {
        console.error("Failed to save trainer solve:", error);
      }

      inspectionPenaltyRef.current = "OK";
      inspectionStartRef.current = 0;
      setControlsVisible(true);
    },
    [algSetId, groupId, caseId, currentPuzzle, addSolve, onSolveComplete],
  );

  const stopTimer = useCallback(() => {
    const finalTime = Date.now() - startTimeRef.current;
    finalTimeRef.current = finalTime;
    setDisplayTime(finalTime);
    setTimerState("stopped");
    endSolve(finalTime);
  }, [endSolve]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset when puzzle changes
  useEffect(() => {
    setDisplayTime(0);
    setTimerState("idle");
    setCurrentSolveId(null);
    finalTimeRef.current = 0;
  }, [currentPuzzle]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset display when case changes
  useEffect(() => {
    if (caseId && timerState === "stopped") {
      setTimerState("idle");
      setDisplayTime(0);
      finalTimeRef.current = 0;
    }
  }, [caseId]);

  useEffect(() => {
    if (timerState !== "running" && timerState !== "inspection") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    if (timerState === "inspection") {
      const maxInspection = (currentPuzzle.inspectionDuration || 15) * 1000;

      const tick = () => {
        const elapsed = Date.now() - inspectionStartRef.current;
        const remaining = Math.max(0, maxInspection - elapsed);
        setInspectionTime(remaining);

        const remainingSec = Math.ceil(remaining / 1000);
        const currentColor: "normal" | "warning" | "danger" =
          remainingSec <= 3 ? "danger"
          : remainingSec <= 7 ? "warning"
          : "normal";

        if (currentColor !== lastInspectionColorRef.current) {
          lastInspectionColorRef.current = currentColor;
        }

        if (elapsed >= maxInspection + 2000) {
          applyInspectionPenalty("DNF");
          startSolve();
          return;
        }

        if (elapsed >= maxInspection && inspectionPenaltyRef.current === "OK") {
          applyInspectionPenalty("+2");
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const tick = () => {
      setDisplayTime(Date.now() - startTimeRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [timerState, currentPuzzle, startSolve, applyInspectionPenalty]);

  const handlePressIn = useCallback(() => {
    if (!caseId) return;

    if (timerState === "running") {
      stopTimer();
    } else if (timerState === "inspection") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      holdStartTimeRef.current = Date.now();
      setTimerState("holding");
      setIsReady(false);

      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = setTimeout(
        () => setIsReady(true),
        settings.holdThreshold,
      );
    } else if (timerState === "idle" || timerState === "stopped") {
      if (currentPuzzle.inspectionEnabled) {
        startInspection();
      } else {
        setDisplayTime(0);
        holdStartTimeRef.current = Date.now();
        setTimerState("holding");
        setIsReady(false);
        setControlsVisible(false);

        if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
        readyTimeoutRef.current = setTimeout(
          () => setIsReady(true),
          settings.holdThreshold,
        );
      }
    }
  }, [
    timerState,
    stopTimer,
    currentPuzzle,
    startInspection,
    settings.holdThreshold,
    caseId,
  ]);

  const handlePressOut = useCallback(() => {
    if (timerState === "running") return;

    if (timerState === "holding") {
      const holdDuration = Date.now() - (holdStartTimeRef.current || 0);

      if (holdDuration >= settings.holdThreshold && isReady) {
        const elapsed = Date.now() - inspectionStartRef.current;
        const maxInspection = (currentPuzzle.inspectionDuration || 15) * 1000;

        if (inspectionStartRef.current > 0 && elapsed >= maxInspection + 2000) {
          applyInspectionPenalty("DNF");
        } else if (inspectionStartRef.current > 0 && elapsed >= maxInspection) {
          applyInspectionPenalty("+2");
        }

        startSolve();
      } else {
        if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);

        if (inspectionStartRef.current > 0) {
          setTimerState("inspection");
          setIsReady(false);
        } else {
          setTimerState("idle");
          setIsReady(false);
          setControlsVisible(true);
        }
      }

      holdStartTimeRef.current = 0;
    }
  }, [
    timerState,
    isReady,
    settings.holdThreshold,
    currentPuzzle,
    startSolve,
    applyInspectionPenalty,
  ]);

  const getTimerColor = () => {
    if (timerState === "inspection") {
      const remainingSec = Math.ceil(inspectionTime / 1000);
      if (remainingSec <= 3) return "text-danger";
      if (remainingSec <= 7) return "text-yellow-500";
      return "text-foreground";
    }
    if (timerState === "holding")
      return isReady ? "text-green-500" : "text-danger";
    return "text-foreground";
  };

  const getDisplayText = (timerPrecision: TimerPrecision) => {
    if (timerState === "holding") return formatTime(0, timerPrecision);
    if (timerState === "idle" && currentPuzzle.inspectionEnabled) {
      return (currentPuzzle.inspectionDuration || 15).toString();
    }
    if (timerState === "inspection")
      return Math.ceil(inspectionTime / 1000).toString();
    if (currentSolve?.penalty === "+2") {
      return `${formatTime(finalTimeRef.current + 2000, timerPrecision)}+`;
    }
    if (currentSolve?.penalty === "DNF") return "DNF";
    return formatTime(
      timerState === "stopped" ? finalTimeRef.current : displayTime,
      timerPrecision,
    );
  };

  const getHintText = () => {
    if (!caseId) return "select a case to begin";
    if (timerState === "inspection") return "hold to start";
    if (timerState === "idle" && !currentPuzzle.inspectionEnabled)
      return "hold to start";
    return "click to start";
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (e.target as HTMLElement).isContentEditable
      )
        return;

      if (timerStateRef.current === "running") {
        e.preventDefault();

        stopTimer();
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handlePressIn();
      }
    },
    [stopTimer, handlePressIn],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" && timerStateRef.current !== "running") {
        e.preventDefault();
        handlePressOut();
      }
    },
    [handlePressOut],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleDeleteSolve = (onDone: () => void) => {
    if (currentSolve) deleteSolve(currentSolve.id);
    setDisplayTime(0);
    setTimerState("idle");
    setCurrentSolveId(null);
    onDone();
  };

  return {
    currentPuzzle,
    settings,
    updatePenalty,
    displayTime,
    isReady,
    timerState,
    currentSolve,
    inspectionTime,
    controlsVisible,
    finalTimeRef,
    handlePressIn,
    handlePressOut,
    getTimerColor,
    getDisplayText,
    getHintText,
    handleDeleteSolve,
    solves,
  };
}
