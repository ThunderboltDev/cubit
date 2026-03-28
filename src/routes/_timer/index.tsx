import {
  Delete02Icon,
  Flag02Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ScramblePreview } from "@/components/timer/scramble-preview";
import { StatCard } from "@/components/timer/stat-card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTimer } from "@/hooks/use-timer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_timer/")({
  component: TimerPage,
});

let hasTimerPageAnimated = false;

function TimerPage() {
  const {
    currentPuzzle,
    settings,
    scramble,
    stats,
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
  } = useTimer();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isScrambleDialogOpen, setIsScrambleDialogOpen] = useState(false);

  return (
    <div className="relative h-dvh w-full overflow-hidden select-none touch-none md:h-svh">
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
            initial={hasTimerPageAnimated ? false : { opacity: 0, y: 10 }}
            animate={{
              opacity:
                (
                  timerState === "idle" ||
                  timerState === "inspection" ||
                  (timerState === "running" && currentPuzzle.multiphaseEnabled)
                ) ?
                  0.5
                : 0,
              y: 0,
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
        <motion.div
          initial={hasTimerPageAnimated ? false : { opacity: 0, y: -20 }}
          animate={{
            opacity: controlsVisible ? 1 : 0,
            y: controlsVisible ? 0 : -20,
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="pointer-events-auto flex flex-col gap-3 p-4 pb-0 pt-20 md:pt-4"
        >
          <button
            type="button"
            className="h-auto min-h-[52px] w-full whitespace-normal max-w-xl mx-auto cursor-pointer hover:text-secondary-foreground active:brightness-85"
            onClick={() => setIsScrambleDialogOpen(true)}
          >
            <motion.span
              key={scramble}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="line-clamp-2 text-lg md:text-3xl text-center text-balance font-bold leading-tight"
            >
              {scramble}
            </motion.span>
          </button>
          <div
            className={cn(
              "max-h-[80px] md:max-h-[120px] items-center justify-center transition-opacity",
              currentPuzzle.scramblePreview ? "flex" : "hidden",
            )}
          >
            <ScramblePreview
              scramble={scramble}
              puzzleType={currentPuzzle.type}
              visualization={currentPuzzle.scramblePreviewVisualization}
            />
          </div>
        </motion.div>

        <div className="flex-1" />

        <div className="pointer-events-auto flex items-center justify-center gap-4 py-4">
          <AnimatePresence mode="popLayout">
            {timerState === "stopped" && currentSolve && (
              <>
                <motion.div
                  key="flag"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Button
                    className="group/button rounded-full"
                    variant={
                      currentSolve.penalty === "+2" ? "danger" : "default"
                    }
                    onClick={() =>
                      updatePenalty(
                        currentSolve.id,
                        currentSolve.penalty === "+2" ? "OK" : "+2",
                      )
                    }
                  >
                    <HugeiconsIcon
                      className="group-hover/button:scale-95 group-hover/button:rotate-12 duration-400"
                      icon={Flag02Icon}
                    />
                  </Button>
                </motion.div>

                <motion.div
                  key="unavailable"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                    delay: 0.05,
                  }}
                >
                  <Button
                    className="group/button rounded-full"
                    variant={
                      currentSolve.penalty === "DNF" ? "danger" : "default"
                    }
                    onClick={() =>
                      updatePenalty(
                        currentSolve.id,
                        currentSolve.penalty === "DNF" ? "OK" : "DNF",
                      )
                    }
                  >
                    <HugeiconsIcon
                      className="group-hover/button:scale-95 group-hover/button:rotate-180 duration-400"
                      icon={UnavailableIcon}
                    />
                  </Button>
                </motion.div>

                <motion.div
                  key="delete"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                    delay: 0.1,
                  }}
                >
                  <Button
                    variant="danger"
                    className="group/button rounded-full"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <HugeiconsIcon
                      className="group-hover/button:scale-95 group-hover/button:rotate-180 duration-400"
                      icon={Delete02Icon}
                    />
                  </Button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="pointer-events-auto flex flex-col wrapper-md pb-26">
          <motion.div
            initial={false}
            animate={{ opacity: controlsVisible ? 1 : 0 }}
            className="flex flex-row justify-center gap-4"
          >
            {stats?.stats.map((stat, index) => (
              <motion.div
                key={stat.type + stat.n}
                initial={hasTimerPageAnimated ? false : { opacity: 0, y: 20 }}
                animate={{
                  opacity: controlsVisible ? 1 : 0,
                  y: controlsVisible ? 0 : 20,
                }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                onAnimationComplete={
                  index === stats.stats.length - 1 ?
                    () => {
                      hasTimerPageAnimated = true;
                    }
                  : undefined
                }
              >
                <StatCard
                  stat={stat}
                  style={currentPuzzle.displayStats.style}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <Dialog
        open={isScrambleDialogOpen}
        onOpenChange={setIsScrambleDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scramble</DialogTitle>
            <DialogDescription className="text-secondary-foreground text-lg">
              {scramble}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

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
            <AlertDialogCancel />
            <AlertDialogAction
              onClick={() =>
                handleDeleteSolve(() => setIsDeleteDialogOpen(false))
              }
              variant="danger"
            >
              <HugeiconsIcon icon={Delete02Icon} />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
