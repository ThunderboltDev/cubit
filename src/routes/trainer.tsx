import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TrainerFloatingNav } from "@/components/trainer/floating-nav";
import { useTimerStateStore } from "@/stores/timer-state";

export const Route = createFileRoute("/trainer")({
  component: TrainerLayout,
});

function TrainerLayout() {
  const timerState = useTimerStateStore((s) => s.timerState);
  const navHidden =
    timerState === "running" ||
    timerState === "holding" ||
    timerState === "inspection";

  return (
    <>
      <div className="relative isolate min-h-dvh w-full md:min-h-svh">
        <Outlet />
      </div>
      <TrainerFloatingNav hidden={navHidden} />
    </>
  );
}
