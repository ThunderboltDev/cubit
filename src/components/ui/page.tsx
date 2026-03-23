import { ArrowLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageContextValue = {
  showNavHeader: boolean;
};

const PageContext = createContext<PageContextValue | undefined>(undefined);

function usePageContext() {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error("PageHeader components must be used inside <Page>");
  return ctx;
}

interface PageProps extends ComponentProps<"div"> {
  showNavHeader?: boolean;
}

export function Page({
  showNavHeader = false,
  className,
  children,
  ...props
}: PageProps) {
  return (
    <PageContext.Provider value={{ showNavHeader }}>
      <div
        className={cn("wrapper-xl space-y-8 pb-mobile-nav pt-8", className)}
        {...props}
      >
        {children}
      </div>
    </PageContext.Provider>
  );
}

export function PageHeader(props: ComponentProps<"div">) {
  const router = useRouter();

  const { showNavHeader } = usePageContext();

  if (!showNavHeader) {
    return <div className={cn("space-y-1", props.className)} {...props} />;
  }

  return (
    <div className="sticky top-0 z-20 min-w-dvw px-4 -ml-8 -mt-8 border-b border-border bg-muted md:static md:bg-transparent md:border-none md:-ml-4 md:mt-0 md:shadow-none">
      <div className="flex h-14 items-center gap-4">
        <Button
          size="icon"
          variant="ghost"
          className="text-foreground"
          onClick={() => router.history.back()}
        >
          <HugeiconsIcon icon={ArrowLeftIcon} />
        </Button>
        {props.children}
      </div>
    </div>
  );
}

export function PageTitle(props: ComponentProps<"h1">) {
  const { showNavHeader } = usePageContext();

  return (
    <h1
      className={cn(
        "text-2xl font-bold tracking-tight",
        showNavHeader && "text-lg",
        props.className,
      )}
      {...props}
    />
  );
}

export function PageDescription(props: ComponentProps<"p">) {
  const { showNavHeader } = usePageContext();

  if (showNavHeader) {
    return null;
  }

  return (
    <p
      className={cn("text-base text-muted-foreground", props.className)}
      {...props}
    />
  );
}

export function PageBody(props: ComponentProps<"div">) {
  return <div className={cn("space-y-6", props.className)} {...props} />;
}
