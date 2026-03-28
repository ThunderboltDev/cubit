import {
  Chart01Icon,
  LeftToRightListDashIcon,
  Settings02Icon,
  SlidersHorizontalIcon,
  Timer01Icon,
  Timer02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import type { ComponentProps } from "react";
import { LinkButton } from "@/components/ui/link-button";
import { clickSound } from "@/data/sfx/click";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/trainer/solves", label: "Solves", icon: LeftToRightListDashIcon },
  { href: "/trainer", label: "Timer", icon: Timer01Icon },
  { href: "/trainer/stats", label: "Statistics", icon: Chart01Icon },
  {
    href: "/configuration",
    label: "Configuration",
    icon: SlidersHorizontalIcon,
  },
] as const;

interface TrainerFloatingNavProps {
  hidden?: boolean;
}

export function TrainerFloatingNav({ hidden }: TrainerFloatingNavProps) {
  const matchRoute = useMatchRoute();

  return (
    <>
      <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <AnimatePresence>
          {!hidden && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                className="z-1 absolute translate-x-1/2 left-0 top-0 w-1/2 h-px bg-linear-to-r from-transparent via-muted-foreground/50 to-transparent"
              />
              <div className="flex items-center gap-1.5 rounded-full bg-muted p-1.5 shadow-md shadow-[color-mix(in_oklch,var(--muted),black_10%)] inset-shadow-xs inset-shadow-white/10 drop-shadow-lg drop-shadow-black/25">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = !!matchRoute({
                    to: item.href,
                    fuzzy: false,
                  });
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                    >
                      <NavItem
                        to={item.href}
                        isActive={isActive}
                        icon={item.icon}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <AnimatePresence>
        {!hidden && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed right-6 top-6 z-50 flex flex-row-reverse gap-2"
          >
            <LinkButton
              href="/settings"
              size="icon-lg"
              className="group/button rounded-full"
            >
              <HugeiconsIcon
                icon={Settings02Icon}
                className="size-5 group-hover/button:-rotate-180 group-active/button:scale-0.9 duration-400"
              />
            </LinkButton>

            <LinkButton
              href="/"
              size="icon-lg"
              className="group/button rounded-full"
              title="Switch to Timer"
            >
              <HugeiconsIcon
                icon={Timer02Icon}
                className="size-5 group-hover/button:scale-110 duration-200"
              />
            </LinkButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  to,
  isActive,
  icon,
}: {
  to: string;
  isActive: boolean;
  icon: ComponentProps<typeof HugeiconsIcon>["icon"];
}) {
  const [play] = useSound(clickSound);

  return (
    <Link
      to={to}
      onClick={() => play()}
      className={cn(
        "group/nav-item relative flex items-center justify-center rounded-full p-3",
        isActive ? "text-accent" : (
          "text-muted-foreground hover:text-secondary-foreground"
        ),
      )}
    >
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="activeNavTrainer"
            className="absolute inset-0 rounded-full bg-accent/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        )}
      </AnimatePresence>
      <HugeiconsIcon
        icon={icon}
        className={cn(
          "size-5 duration-200",
          "group-hover/nav-item:scale-110 group-active/nav-item:scale-95",
        )}
      />
    </Link>
  );
}
