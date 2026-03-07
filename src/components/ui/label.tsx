import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Label({ className, htmlFor, ...props }: ComponentProps<"label">) {
  return (
    <label
      htmlFor={htmlFor}
      aria-label={props["aria-label"]}
      data-slot="label"
      className={cn(
        "gap-2 text-[15px] md:text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
