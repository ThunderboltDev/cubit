import { useCallback, useEffect, useRef, useState } from "react";
import { useScramble } from "@/contexts/scramble";
import { inspectionTimeSound } from "@/data/sfx/inspection-time";
import { newRecord0Sound } from "@/data/sfx/new-record/0";
import { newRecord1Sound } from "@/data/sfx/new-record/1";
import { newRecord2Sound } from "@/data/sfx/new-record/2";
import { solveCompletePlus2Sound } from "@/data/sfx/solve-complete/+2";
import { solveCompleteDnfSound } from "@/data/sfx/solve-complete/dnf";
import { solveCompleteOkSound } from "@/data/sfx/solve-complete/ok";
import { useHaptic } from "@/hooks/use-haptic";
import { usePuzzles } from "@/hooks/use-puzzles";
import { useSettings } from "@/hooks/use-settings";
import { useSolves } from "@/hooks/use-solves";
import { useSound } from "@/hooks/use-sound";
import { useTimerStats } from "@/hooks/use-timer-stats";
import { formatTime } from "@/lib/format-time";
import { useTimerStateStore } from "@/stores/timer-state";
import type { Penalty, Solve, SolveInput } from "@/types/puzzles";
import type { TimerPrecision } from "@/types/settings";

export type TimerState =
  | "idle"
  | "holding"
  | "inspection"
  | "running"
  | "stopped";

export function useTimer() {
  const { currentPuzzle } = usePuzzles();
  const { settings } = useSettings();
  const { scramble, scrambleRef, generateNewScramble } = useScramble();
  const { solves, addSolve, deleteSolve, updatePenalty } = useSolves({
    puzzleId: currentPuzzle.id,
  });

  const stats = useTimerStats();
  const { vibrate } = useHaptic();

  const [playRecord0] = useSound(newRecord0Sound);
  const [playRecord1] = useSound(newRecord1Sound);
  const [playRecord2] = useSound(newRecord2Sound);
  const [playInspection] = useSound(inspectionTimeSound);
  const [playSolveOk] = useSound(solveCompleteOkSound);
  const [playSolvePlus2] = useSound(solveCompletePlus2Sound);
  const [playSolveDnf] = useSound(solveCompleteDnfSound);

  const [displayTime, setDisplayTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [timerState, setTimerStateLocal] = useState<TimerState>("idle");

  const syncTimerState = useTimerStateStore((s) => s.setTimerState);

  const setTimerState = useCallback(
    (s: TimerState) => {
      setTimerStateLocal(s);
      syncTimerState(s);
    },
    [syncTimerState],
  );
  const [currentSolveId, setCurrentSolveId] = useState<string | null>(null);
  const [inspectionTime, setInspectionTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);

  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const holdStartTimeRef = useRef<number>(0);
  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalTimeRef = useRef<number>(0);
  const inspectionStartRef = useRef<number>(0);
  const phaseTimesRef = useRef<number[]>([]);
  const phaseStartRef = useRef<number>(0);
  const inspectionPenaltyRef = useRef<Penalty>("OK");
  const lastInspectionColorRef = useRef<"normal" | "warning" | "danger">(
    "normal",
  );

  const currentSolve = solves.find((s: Solve) => s.id === currentSolveId);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
    };
  }, []);

  const prevSolveIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (currentSolveId === prevSolveIdRef.current) return;
    if (!stats || !solves?.[0] || solves[0].id !== currentSolveId) return;

    prevSolveIdRef.current = currentSolveId;

    const containsMajorRecord = stats.stats.some((s) => s.isNewRecord);

    if (containsMajorRecord) {
      playRecord0();
      playRecord1();
      playRecord2();
      vibrate("success");
    }
  }, [
    currentSolveId,
    stats,
    solves,
    playRecord0,
    playRecord1,
    playRecord2,
    vibrate,
  ]);

  const timerStateRef = useRef<TimerState>("idle");
  timerStateRef.current = timerState;

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
    vibrate("buzz");
  }, [currentPuzzle, setTimerState, vibrate]);

  const startSolve = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const now = Date.now();
    startTimeRef.current = now;
    phaseStartRef.current = now;
    phaseTimesRef.current = [];
    setTimerState("running");
    setDisplayTime(0);
    setCurrentSolveId(null);
    setCurrentPhase(currentPuzzle.multiphaseEnabled ? 1 : 0);
    lastInspectionColorRef.current = "normal";
    vibrate("rigid");
  }, [currentPuzzle, setTimerState, vibrate]);

  const endSolve = useCallback(
    async (finalTime: number) => {
      if (!currentPuzzle) return;

      const now = Date.now();
      const hasInspection =
        currentPuzzle.inspectionEnabled && inspectionStartRef.current > 0;
      const hasMultiphase =
        currentPuzzle.multiphaseEnabled && phaseTimesRef.current.length > 0;

      let solve: SolveInput;

      const baseSolve = {
        puzzleId: currentPuzzle.id,
        scramble: scrambleRef.current,
        time: finalTime,
        penalty: inspectionPenaltyRef.current,
      };

      if (hasInspection && hasMultiphase) {
        solve = {
          ...baseSolve,
          kind: "full",
          inspectionTime: now - inspectionStartRef.current,
          phases: phaseTimesRef.current,
        };
      } else if (hasInspection) {
        solve = {
          ...baseSolve,
          kind: "inspection",
          inspectionTime: now - inspectionStartRef.current,
        };
      } else if (hasMultiphase) {
        solve = {
          ...baseSolve,
          kind: "multiphase",
          phases: phaseTimesRef.current,
        };
      } else {
        solve = {
          ...baseSolve,
          kind: "base",
        };
      }

      try {
        const savedSolve = await addSolve(solve);
        if (savedSolve) {
          setCurrentSolveId(savedSolve.id);
          generateNewScramble();

          if (savedSolve.penalty === "DNF") {
            playSolveDnf();
            vibrate("error");
          } else if (savedSolve.penalty === "+2") {
            playSolvePlus2();
            vibrate("warning");
          } else {
            playSolveOk();
            vibrate("success");
          }
        }
      } catch (error) {
        console.error("Failed to save solve:", error);
      }

      inspectionPenaltyRef.current = "OK";
      inspectionStartRef.current = 0;
      phaseTimesRef.current = [];
      setCurrentPhase(0);
      setControlsVisible(true);
    },
    [
      currentPuzzle,
      addSolve,
      generateNewScramble,
      scrambleRef,
      playSolveDnf,
      playSolvePlus2,
      playSolveOk,
      vibrate,
    ],
  );

  const handlePhaseComplete = useCallback(() => {
    const now = Date.now();
    const phaseDuration = now - phaseStartRef.current;
    phaseTimesRef.current.push(phaseDuration);
    phaseStartRef.current = now;

    const totalPhases =
      currentPuzzle.multiphaseEnabled ? currentPuzzle.multiphaseCount : 1;

    if (phaseTimesRef.current.length >= totalPhases) {
      const totalTime = phaseTimesRef.current.reduce(
        (sum, time) => sum + time,
        0,
      );
      finalTimeRef.current = totalTime;
      setDisplayTime(totalTime);
      setTimerState("stopped");
      endSolve(totalTime);
    } else {
      setCurrentPhase(phaseTimesRef.current.length + 1);
    }
  }, [currentPuzzle, endSolve, setTimerState]);

  const stopTimer = useCallback(() => {
    if (currentPuzzle.multiphaseEnabled) {
      handlePhaseComplete();
    } else {
      const finalTime = Date.now() - startTimeRef.current;
      finalTimeRef.current = finalTime;
      setDisplayTime(finalTime);
      setTimerState("stopped");
      endSolve(finalTime);
    }
  }, [currentPuzzle, handlePhaseComplete, endSolve, setTimerState]);

  useEffect(() => {
    if (currentPuzzle) {
      setDisplayTime(0);
      setTimerState("idle");
      setCurrentSolveId(null);
      finalTimeRef.current = 0;
    }
  }, [currentPuzzle, setTimerState]);

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
        let currentColor: "normal" | "warning" | "danger" = "normal";
        if (remainingSec <= 3) currentColor = "danger";
        else if (remainingSec <= 7) currentColor = "warning";

        if (currentColor !== lastInspectionColorRef.current) {
          if (
            lastInspectionColorRef.current !== "normal" ||
            currentColor !== "normal"
          ) {
            playInspection();
          }
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

    if (timerState === "running") {
      const tick = () => {
        const elapsed = Date.now() - startTimeRef.current;
        setDisplayTime(elapsed);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [
    timerState,
    currentPuzzle,
    startSolve,
    applyInspectionPenalty,
    playInspection,
  ]);

  const handlePressIn = useCallback(() => {
    if (timerState === "running") {
      stopTimer();
    } else if (timerState === "inspection") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      holdStartTimeRef.current = Date.now();
      setTimerState("holding");
      setIsReady(false);

      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = setTimeout(() => {
        setIsReady(true);
      }, settings.holdThreshold);
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
        readyTimeoutRef.current = setTimeout(() => {
          setIsReady(true);
          vibrate("light");
        }, settings.holdThreshold);
      }
    }
  }, [
    timerState,
    stopTimer,
    currentPuzzle,
    startInspection,
    settings.holdThreshold,
    setTimerState,
    vibrate,
  ]);

  const handlePressOut = useCallback(() => {
    if (timerState === "running") return;

    if (timerState === "holding") {
      const holdDuration = Date.now() - (holdStartTimeRef.current || 0);

      if (holdDuration >= settings.holdThreshold && isReady) {
        const now = Date.now();
        const elapsed = now - inspectionStartRef.current;
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
    setTimerState,
  ]);

  const getTimerColor = () => {
    if (timerState === "inspection") {
      const remainingSec = Math.ceil(inspectionTime / 1000);
      if (remainingSec <= 3) return "text-danger";
      if (remainingSec <= 7) return "text-yellow-500";
      return "text-foreground";
    }

    if (timerState === "running") return "text-foreground";
    if (timerState === "holding")
      return isReady ? "text-green-500" : "text-danger";

    if (currentSolve?.penalty === "+2") return "text-warning";
    if (currentSolve?.penalty === "DNF") return "text-danger";

    return "text-foreground";
  };

  const getDisplayText = (timerPrecision: TimerPrecision) => {
    if (timerState === "holding") {
      return formatTime(0, timerPrecision);
    }

    if (timerState === "idle" && currentPuzzle.inspectionEnabled) {
      return (currentPuzzle.inspectionDuration || 15).toString();
    }

    if (timerState === "inspection") {
      return Math.ceil(inspectionTime / 1000).toString();
    }

    if (currentSolve?.penalty === "+2") {
      return `${formatTime(finalTimeRef.current + 2000, timerPrecision)}+`;
    }

    if (currentSolve?.penalty === "DNF") {
      return "DNF";
    }

    return formatTime(
      timerState === "stopped" ? finalTimeRef.current : displayTime,
      timerPrecision,
    );
  };

  const getHintText = () => {
    if (timerState === "inspection") {
      return "hold to start";
    }

    if (timerState === "running" && currentPuzzle.multiphaseEnabled) {
      const totalPhases = currentPuzzle.multiphaseCount;
      return `Phase ${currentPhase}/${totalPhases}`;
    }

    if (timerState === "idle" && !currentPuzzle.inspectionEnabled) {
      return "hold to start";
    }

    return "click to start";
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore key events when focus is inside an interactive element
      const tag = (e.target as HTMLElement).tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (timerStateRef.current === "running") {
        // Any key stops the timer
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
    scramble,
    stats,
    updatePenalty,
    displayTime,
    isReady,
    timerState,
    currentSolve,
    inspectionTime,
    currentPhase,
    controlsVisible,
    finalTimeRef,
    handlePressIn,
    handlePressOut,
    getTimerColor,
    getDisplayText,
    getHintText,
    handleDeleteSolve,
  };
}
