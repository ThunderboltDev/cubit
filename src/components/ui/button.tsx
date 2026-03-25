import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { clickSound } from "@/data/sfx/click";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

const baseClasses = [
  "inline-flex items-center justify-center gap-1.5 shrink-0",
  "transition-all duration-200",
  "focus-ring shadow-md inset-shadow-xs",
  "text-[15px] font-medium whitespace-nowrap",
  "hover:brightness-103",
  "active:translate-y-0.5 active:shadow-xs",
  "rounded-md no-underline cursor-pointer",
  "[&_svg]:shrink-0 [&_svg]:pointer-events-none",
  "[&_svg:not([class*='size-'])]:size-4.5",
  "aria-invalid:ring-danger/50 aria-invalid:border-danger",
  "aria-busy:opacity-75 aria-busy:saturate-100 aria-busy:cursor-progress",
  "disabled:opacity-75 disabled:saturate-0 disabled:cursor-not-allowed",
  "disabled:hover:brightness-100 disabled:active:brightness-100",
  "disabled:active:translate-y-0 disabled:active:shadow-md",
];

const buttonVariants = cva(baseClasses.join(" "), {
  variants: {
    variant: {
      default:
        "bg-muted shadows-muted focus-visible:ring-foreground/50 active:opacity-60",
      ghost:
        "bg-transparent text-muted-foreground shadow-none active:shadow-none inset-shadow-none active:translate-y-0 active:opacity-60 disabled:active:shadow-none",
      accent: "bg-accent text-white shadows-accent active:brightness-80",
      danger:
        "bg-danger text-white focus-visible:ring-danger/50 shadows-danger active:brightness-80",
      success:
        "bg-success text-white focus-visible:ring-success/50 shadows-success active:brightness-80",
      warning:
        "bg-warning text-white focus-visible:ring-warning/50 shadows-warning active:brightness-80",
    },
    size: {
      "default":
        "h-9 px-4 py-2 has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-4.5",
      "sm": "h-8.5 gap-1 px-3 text-sm has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-4",
      "lg": "h-9.5 px-4 gap-2 text-base [&_svg:not([class*='size-'])]:size-5",
      "icon": "size-9 [&_svg:not([class*='size-'])]:size-4",
      "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-4.5",
      "icon-lg": "size-10 [&_svg:not([class*='size-'])]:size-5",
      "responsive": [
        "h-9 px-4 py-2 has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-4.5",
        "md:h-8 md:gap-1 md:px-3 md:text-sm md:has-[>svg]:px-3",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonProps = ComponentProps<typeof ButtonPrimitive> &
  VariantProps<typeof buttonVariants>;

function Button({
  className,
  children,
  variant = "default",
  size = "default",
  onClick,
  ...props
}: ButtonProps) {
  const [play] = useSound(clickSound);

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={(e) => {
        play();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  );
}

export { Button };
