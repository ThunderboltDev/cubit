import type { Solve } from "@/types";

export function msToSeconds(ms: number): number {
  return ms / 1000;
}

export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

export function formatTime(ms: number, precision: 2 | 3 = 2): string {
  if (ms === Infinity || ms < 0) return "DNF";

  const divisor = precision === 2 ? 10 : 1;
  const roundedMs = Math.round(ms / divisor) * divisor;

  const totalSeconds = Math.floor(roundedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const seconds = totalSeconds % 60;

  const remainder = Math.floor((roundedMs % 1000) / divisor);
  const remainderStr = remainder.toString().padStart(precision, "0");

  if (hours > 0) {
    return `${hours}:${(minutes % 60).toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${remainderStr}`;
  }

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${remainderStr}`;
  }

  return `${seconds}.${remainderStr}`;
}

export function getEffectiveTime(solve: Solve): number {
  if (solve.penalty === "dnf" || solve.time <= 0) {
    return Infinity;
  }

  if (solve.penalty === "+2") {
    return solve.time + 2000;
  }

  return solve.time;
}
