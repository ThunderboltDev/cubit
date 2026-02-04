import {
  Delete02Icon,
  Flag02Icon,
  RotateClockwiseIcon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Text, useColors, View } from "@/components/ui/themed";
import { TimeStat } from "@/components/ui/time-stat";
import { colors } from "@/constants/colors";
import { useSessions } from "@/hooks/use-sessions";
import { useGlobalSettings } from "@/hooks/use-settings";
import { useSolves } from "@/hooks/use-solves";
import { generateScramble } from "@/lib/scrambles";
import { calculateAverage, calculateBest } from "@/lib/stats";
import { formatTime } from "@/lib/time";
import type { Solve } from "@/types";

type TimerState = "idle" | "holding" | "running" | "stopped";

export default function TimerPage() {
  const themeColors = useColors();

  const { settings } = useGlobalSettings();
  const { selectedSession } = useSessions();
  const { solves, recordSolve, removeSolve, setPenalty } = useSolves(
    selectedSession?.id,
  );

  const [displayTime, setDisplayTime] = useState(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [scramble, setScramble] = useState<string>("Generating scramble...");
  const [currentSolveId, setCurrentSolveId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [scrambleDialogOpen, setScrambleDialogOpen] = useState(false);

  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const holdStartTimeRef = useRef<number>(0);
  const readyTimeoutRef = useRef<number>(null);
  const finalTimeRef = useRef<number>(0);

  const controlsOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (settings?.selectedPuzzle) {
      setScramble(generateScramble(settings.selectedPuzzle));
    }
  }, [settings?.selectedPuzzle]);

  useEffect(() => {
    if (timerState !== "running") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    startTimeRef.current = performance.now();

    const tick = () => {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      setDisplayTime(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [timerState]);

  const generateNewSramble = useCallback(() => {
    if (settings?.selectedPuzzle) {
      setScramble(generateScramble(settings.selectedPuzzle));
    }
  }, [settings?.selectedPuzzle]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: stable setters
  const handlePressIn = useCallback(() => {
    if (timerState === "running") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      finalTimeRef.current = displayTime;
      setTimerState("stopped");
      handleSolveFinish();
    } else if (timerState === "idle" || timerState === "stopped") {
      setDisplayTime(0);
      holdStartTimeRef.current = performance.now();
      setTimerState("holding");
      setIsReady(false);

      if (currentSolveId) {
        setPenalty(currentSolveId, "none");
      }

      Animated.timing(controlsOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = setTimeout(() => {
        setIsReady(true);
      }, 300);
    }
  }, [timerState, displayTime, controlsOpacity, currentSolveId, setPenalty]);

  const handlePressOut = useCallback(() => {
    if (timerState === "running") return;

    if (holdStartTimeRef.current) {
      const holdDuration = performance.now() - holdStartTimeRef.current;

      if (holdDuration >= 300 && timerState === "holding" && isReady) {
        startTimeRef.current = performance.now();
        setDisplayTime(0);
        setTimerState("running");
        setCurrentSolveId(null);
      } else {
        setTimerState(timerState === "stopped" ? "stopped" : "idle");
        setIsReady(false);
        Animated.timing(controlsOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
      holdStartTimeRef.current = 0;
    }
  }, [timerState, isReady, controlsOpacity]);

  const handleSolveFinish = async () => {
    if (selectedSession && settings?.selectedPuzzle) {
      const solve: Omit<Solve, "id" | "createdAt"> = {
        puzzle: settings.selectedPuzzle,
        scramble,
        time: finalTimeRef.current,
        penalty: "none",
      };

      const savedSolve = await recordSolve(solve);
      if (savedSolve) {
        setCurrentSolveId(savedSolve.id);
        generateNewSramble();
      }

      Animated.timing(controlsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const getTimerColor = () => {
    if (timerState === "running") return themeColors.foreground;
    if (timerState === "holding")
      return isReady ? colors.light.success : colors.light.danger;
    return themeColors.foreground;
  };

  const handleDeleteSolve = () => {
    setDeleteDialogOpen(false);
    setDisplayTime(0);
    setTimerState("idle");
    setCurrentSolveId(null);

    if (currentSolveId) removeSolve(currentSolveId);
  };

  const currentSolve = solves.find((s) => s.id === currentSolveId);

  return (
    <Pressable
      style={{
        flex: 1,
        backgroundColor: themeColors.background,
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.scrambleRow, { opacity: controlsOpacity }]}>
        <Pressable
          onPress={() => {
            setScrambleDialogOpen(true);
          }}
          style={({ pressed }) => ({
            flex: 1,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text variant="strong" numberOfLines={3} style={styles.scrambleText}>
            {scramble}
          </Text>
        </Pressable>
        <IconButton
          icon={RotateClockwiseIcon}
          onPress={generateNewSramble}
          variant="transparent"
        />
      </Animated.View>

      <Dialog
        visible={scrambleDialogOpen}
        onClose={() => setScrambleDialogOpen(false)}
      >
        <DialogHeader>
          <Text variant="h3">Scramble</Text>
          <Text variant="strong">{scramble}</Text>
        </DialogHeader>
      </Dialog>

      <View style={styles.timerArea}>
        <Text
          style={[
            styles.timerText,
            {
              color: getTimerColor(),
            },
          ]}
        >
          {currentSolve?.penalty === "+2" ?
            `${formatTime(finalTimeRef.current + 2000)}+`
          : currentSolve?.penalty === "dnf" ?
            "DNF"
          : formatTime(
              timerState === "stopped" ? finalTimeRef.current : displayTime,
            )
          }
        </Text>

        <Text
          style={[
            styles.hintText,
            { opacity: timerState === "idle" ? 0.5 : 0 },
          ]}
        >
          Hold to start
        </Text>

        <Animated.View style={[styles.penaltyRow, { opacity: controlsOpacity }]}>
          {timerState === "stopped" && currentSolveId && (
            <>
              <IconButton
                icon={Flag02Icon}
                theme={currentSolve?.penalty === "+2" ? "accent" : "default"}
                onPress={() =>
                  setPenalty(
                    currentSolveId,
                    currentSolve?.penalty === "+2" ? "none" : "+2",
                  )
                }
                style={{
                  borderRadius: 99999,
                }}
              />
              <IconButton
                icon={UnavailableIcon}
                theme={currentSolve?.penalty === "dnf" ? "danger" : "default"}
                onPress={() =>
                  setPenalty(
                    currentSolveId,
                    currentSolve?.penalty === "dnf" ? "none" : "dnf",
                  )
                }
                style={{
                  borderRadius: 99999,
                }}
              />
              <IconButton
                icon={Delete02Icon}
                theme="danger"
                onPress={() => setDeleteDialogOpen(true)}
                style={{
                  borderRadius: 99999,
                }}
              />
            </>
          )}
        </Animated.View>
      </View>

      <Animated.View style={[styles.bottomArea, { opacity: controlsOpacity }]}>
        <View style={styles.statsRow}>
          <TimeStat label="Ao5" value={calculateAverage(solves, 5)} />
          <TimeStat label="Ao12" value={calculateAverage(solves, 12)} />
          <TimeStat label="Best" value={calculateBest(solves)} />
        </View>
      </Animated.View>

      <AlertDialog
        visible={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <AlertDialogHeader
          title="Delete Solve"
          description="Are you sure you want to delete this solve? This action cannot be undone."
        />
        <AlertDialogFooter
          onCancel={() => setDeleteDialogOpen(false)}
          action={
            <AlertDialogAction
              onPress={handleDeleteSolve}
              theme="danger"
              icon={Delete02Icon}
            >
              Delete
            </AlertDialogAction>
          }
        />
      </AlertDialog>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrambleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 18,
    height: 120,
    gap: 8,
  },
  scrambleText: {
    flex: 1,
    textAlign: "center",
  },
  timerArea: {
    paddingTop: 60,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 72,
    lineHeight: 90,
    fontFamily: "JetBrainsMono-Bold",
  },
  hintText: {
    height: 28,
    marginTop: 12,
    fontSize: 12,
    opacity: 0.5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  penaltyRow: {
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  bottomArea: {
    height: 120,
    padding: 24,
    justifyContent: "flex-end",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
});
