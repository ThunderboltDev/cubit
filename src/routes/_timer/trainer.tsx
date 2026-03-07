import {
  BookOpen01Icon,
  CursorMagicSelection02Icon,
  LibraryIcon,
  Timer02Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ComponentProps } from "react";
import { Card } from "@/components/ui/card";
import { Page, PageBody } from "@/components/ui/page";

export const Route = createFileRoute("/_timer/trainer")({
  component: TrainerPage,
});

let hasPageAnimated = false;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0 },
};

function TrainerPage() {
  return (
    <Page className="overflow-hidden">
      <PageBody className="flex min-h-[80dvh] flex-col items-center justify-center py-12">
        <div className="relative mb-16 text-center">
          <motion.div
            initial={hasPageAnimated ? "show" : "hidden"}
            animate="show"
            variants={itemVariants}
            onAnimationComplete={() => (hasPageAnimated = true)}
            className="mb-4 inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-accent uppercase ring-1 ring-accent/20"
          >
            <HugeiconsIcon icon={ZapIcon} className="mr-2 size-3.5" />
            Under Development
          </motion.div>

          <motion.h1
            initial={hasPageAnimated ? "show" : "hidden"}
            animate="show"
            variants={itemVariants}
            transition={{ delay: 0.1 }}
            className="mb-4 text-4xl font-black tracking-tight sm:text-6xl md:text-7xl"
          >
            The Trainer is <br />
            <span className="bg-linear-to-b from-[color-mix(in_oklch,var(--accent)_75%,white)] to-accent bg-clip-text text-transparent">
              Coming Soon
            </span>
          </motion.h1>

          <motion.p
            initial={hasPageAnimated ? "show" : "hidden"}
            animate="show"
            variants={itemVariants}
            transition={{ delay: 0.3 }}
            className="mx-auto max-w-(--size-xs) text-lg text-muted-foreground"
          >
            A powerful suite of tools designed to help you master algorithms,
            improve execution speed, and smash your PBs.
          </motion.p>

          <div className="bg-accent/20 absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] opacity-20" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid w-full max-w-4xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <FeatureCard
            icon={BookOpen01Icon}
            title="Learn Algorithms"
            description="Interactive algorithm sheets with 3D visualization and step-by-step guidance."
          />
          <FeatureCard
            icon={CursorMagicSelection02Icon}
            title="Practice Solves"
            description="Targeted practice sessions focusing on specific subsets like F2L, OLL, or PLL."
          />
          <FeatureCard
            icon={Timer02Icon}
            title="Time Algorithms"
            description="Benchmark your execution speed across multiple trials to find your weak spots."
          />
          <FeatureCard
            icon={LibraryIcon}
            title="Custom Drills"
            description="Create your own algorithm sets and training routines tailored to your needs."
          />
          <FeatureCard
            icon={ZapIcon}
            title="Smart Analytics"
            description="In-depth breakdown of your progress with heatmaps and performance trends."
          />
        </motion.div>
      </PageBody>
    </Page>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ComponentProps<typeof HugeiconsIcon>["icon"];
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={hasPageAnimated ? "show" : "hidden"}
      animate="show"
      variants={itemVariants}
    >
      <Card className="group relative h-full overflow-hidden border-none bg-accent/10 duration-200 shadow-none inset-shadow-none">
        <div className="relative z-10 flex flex-col p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-white shadow-lg inset-shadow-xs shadows-accent group-hover:scale-105 duration-200">
            <HugeiconsIcon icon={icon} className="size-6" />
          </div>
          <h3 className="mb-2 text-lg font-bold tracking-tight">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
