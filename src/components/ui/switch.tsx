import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { motion } from "framer-motion";
import type { ComponentProps } from "react";
import { switchSound } from "@/data/sfx/switch";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

const thumbSize = {
  sm: "size-3.5",
  default: "size-5",
} as const;

const thumbTranslate = {
  sm: { unchecked: 2, checked: 14 },
  default: { unchecked: 2, checked: 19 },
} as const;

interface SwitchProps extends Omit<
  ComponentProps<typeof SwitchPrimitive.Root>,
  "size"
> {
  size?: "sm" | "default";
}

function Switch({
  className,
  size = "default",
  checked,
  ...props
}: SwitchProps) {
  const [play] = useSound(switchSound);
  const translate = thumbTranslate[size];

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      onClick={() => play()}
      className={cn(
        "peer group/switch relative inline-flex items-center shrink-0",
        "rounded-full border-none outline-none",
        "transition-all duration-200",
        "focus-ring focus-visible:ring-foreground/50",
        "inset-shadow-sm inset-shadow-black/10",
        "data-checked:bg-accent data-unchecked:bg-inset",
        "data-checked:shadow-accent",
        "data-checked:focus-visible:ring-accent/50",
        "cursor-pointer",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:saturate-0",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        size === "sm" ? "h-[18px] w-[30px]" : "h-[24px] w-[41px]",
        className,
      )}
      checked={checked}
      {...props}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb">
        <motion.span
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2",
            "block rounded-full pointer-events-none ring-0",
            "bg-white shadow-sm shadow-black/10",
            thumbSize[size],
          )}
          initial={false}
          animate={{ x: checked ? translate.checked : translate.unchecked }}
          transition={{ type: "spring", stiffness: 600, damping: 30 }}
          layout
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
