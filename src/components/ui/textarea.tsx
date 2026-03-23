import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "input inset-shadow-md",
        "flex field-sizing-content min-h-16 w-full px-3 py-2 scrollbar-3",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
