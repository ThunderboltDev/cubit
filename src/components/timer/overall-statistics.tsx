import { motion } from "framer-motion";
import { Card, CardBody } from "@/components/ui/card";
import type { ExtendedStats } from "@/hooks/use-statistics";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100 blur-md" />
      <CardBody className="flex flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-2xl font-bold tracking-tight">
          {value}
        </span>
      </CardBody>
    </Card>
  );
}

interface OverallStatisticsProps {
  stats: ExtendedStats;
  format: (ms: number | null) => string;
}

export function OverallStatistics({ stats, format }: OverallStatisticsProps) {
  return (
    <div className="space-y-8">
      <motion.h3 variants={item} className="text-xl font-bold tracking-tight">
        Overall Statistics
      </motion.h3>

      <motion.div
        variants={item}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <StatItem label="Best Single" value={format(stats.bestSingle)} />
        <StatItem label="Worst Single" value={format(stats.worstSingle)} />
      </motion.div>

      <div className="space-y-4">
        <motion.h4
          variants={item}
          className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Average
        </motion.h4>
        <motion.div
          variants={item}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          <StatItem label="Current Ao5" value={format(stats.currentAo5)} />
          <StatItem label="Current Ao12" value={format(stats.currentAo12)} />
          <StatItem label="Current Ao100" value={format(stats.currentAo100)} />
          <StatItem label="Best Ao5" value={format(stats.bestAo5)} />
          <StatItem label="Best Ao12" value={format(stats.bestAo12)} />
          <StatItem label="Best Ao100" value={format(stats.bestAo100)} />
        </motion.div>
      </div>

      <div className="space-y-4">
        <motion.h4
          variants={item}
          className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Mean
        </motion.h4>
        <motion.div
          variants={item}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          <StatItem label="Current Mo5" value={format(stats.currentMo5)} />
          <StatItem label="Current Mo12" value={format(stats.currentMo12)} />
          <StatItem label="Current Mo100" value={format(stats.currentMo100)} />
          <StatItem label="Best Mo5" value={format(stats.bestMo5)} />
          <StatItem label="Best Mo12" value={format(stats.bestMo12)} />
          <StatItem label="Best Mo100" value={format(stats.bestMo100)} />
        </motion.div>
      </div>

      <div className="space-y-4">
        <motion.h4
          variants={item}
          className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Consistency (SD)
        </motion.h4>
        <motion.div
          variants={item}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          <StatItem label="Current Co5" value={format(stats.currentCo5)} />
          <StatItem label="Current Co12" value={format(stats.currentCo12)} />
          <StatItem label="Current Co100" value={format(stats.currentCo100)} />
          <StatItem label="Best Co5" value={format(stats.bestCo5)} />
          <StatItem label="Best Co12" value={format(stats.bestCo12)} />
          <StatItem label="Best Co100" value={format(stats.bestCo100)} />
        </motion.div>
      </div>
    </div>
  );
}
