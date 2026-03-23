import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type LinkButtonProps = Omit<ComponentProps<typeof Link>, "to"> &
  ComponentProps<typeof Button> & {
    href: ComponentProps<typeof Link>["to"];
  };

export function LinkButton({
  className,
  onClick,
  href,
  ...props
}: LinkButtonProps) {
  return (
    <Button
      nativeButton={false}
      className={className}
      render={<Link to={href} {...props} />}
      onClick={onClick}
      {...props}
    />
  );
}
