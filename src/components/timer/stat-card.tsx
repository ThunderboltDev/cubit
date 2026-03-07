import { formatTime } from "@/lib/format-time";
import { getStatLabel } from "@/lib/stats";
import type { Stat, StatStyle } from "@/types/stats";

interface StatCardProps {
  stat: Stat;
  style: StatStyle;
}

export function StatCard({ stat, style }: StatCardProps) {
  if (style === "lines") {
    return (
      <div className="flex flex-row items-center justify-between py-2">
        <span className="text-sm font-medium text-foreground">
          {getStatLabel(stat)}:
        </span>
        <span className="font-mono font-semibold text-foreground">
          {formatTime(stat.value)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl min-w-[80px] flex-1 bg-muted shadow-sm shadow-[color-mix(in_oklch,var(--muted),black_10%)] inset-shadow-xs inset-shadow-white/10 p-3">
      <span className="uppercase tracking-wide text-muted-foreground text-xs mb-1">
        {getStatLabel(stat)}
      </span>
      <span className="font-mono font-semibold truncate text-sm">
        {formatTime(stat.value)}
      </span>
    </div>
  );
}
