import { formatTime } from "@/lib/format-time";
import { getStatLabel } from "@/lib/stats";
import { cn } from "@/lib/utils";
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
        <span
          className={cn("font-mono font-semibold text-foreground", {
            "text-shadow-lg text-shadow-foreground/25": stat.isNewRecord,
          })}
        >
          {formatTime(stat.value)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl min-w-[80px] flex-1 bg-muted shadow-sm shadow-[color-mix(in_oklch,var(--muted),black_10%)] inset-shadow-xs inset-shadow-white/10">
      <span className="uppercase tracking-wide text-muted-foreground text-xs mb-1 pt-3 px-3">
        {getStatLabel(stat)}
      </span>
      <span
        className={cn("font-mono font-semibold truncate text-sm pb-3 px-3", {
          "text-shadow-lg text-shadow-foreground/25": stat.isNewRecord,
        })}
      >
        {formatTime(stat.value)}
      </span>
    </div>
  );
}
