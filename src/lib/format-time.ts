import type { TimerFormat, TimerPrecision } from "@/types/settings";

export function formatTime(
  ms: number | null,
  precision: TimerPrecision = 2,
  format: TimerFormat = "decimal",
): string {
  if (ms === null || ms === Infinity || ms < 0 || Number.isNaN(ms)) return "--";

  const totalMs = Math.floor(ms);
  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let decimalStr = "";

  if (precision > 0) {
    const divisor = 10 ** (3 - precision);
    const decimalPart = Math.floor((totalMs % 1000) / divisor);
    decimalStr = `.${decimalPart.toString().padStart(precision, "0")}`;
  }

  const ss = seconds.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");

  if (format === "colon") {
    if (hours > 0) {
      return `${hours}:${mm}:${ss}${decimalStr}`;
    }

    return `${minutes}:${ss}${decimalStr}`;
  }

  if (hours > 0) {
    return `${hours}:${mm}:${ss}${decimalStr}`;
  }

  if (minutes > 0) {
    return `${minutes}:${ss}${decimalStr}`;
  }

  return `${ss}${decimalStr}`;
}

export function formatTimeShort(ms: number | null): string {
  if (ms === null || ms === Infinity || ms < 0 || Number.isNaN(ms)) return "--";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  const cs = centiseconds.toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}.${cs}s`;
}
