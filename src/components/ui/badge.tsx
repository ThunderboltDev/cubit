import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1 shrink-0",
    "text-xs font-medium whitespace-nowrap rounded-full no-underline",
    "shadow-sm inset-shadow-xs inset-shadow-white/10",
    "[&_svg]:shrink-0 [&_svg]:pointer-events-none",
    "[&_svg:not([class*='size-'])]:size-3.5",
    "outline-none focus-ring",
  ],
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground shadows-muted",
        accent: "bg-accent text-white shadows-accent",
        success: "bg-success text-white shadows-success",
        warning: "bg-warning text-white shadows-warning",
        danger: "bg-danger text-white shadows-danger",
      },
      size: {
        sm: "h-5 px-2 py-0.5 text-[10px] [&_svg:not([class*='size-'])]:size-3",
        default: "h-5.5 px-2.5 py-0.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-6.5 px-3 py-1 text-sm [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
