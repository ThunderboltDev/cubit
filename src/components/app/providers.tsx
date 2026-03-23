import { MotionConfig } from "framer-motion";
import { type PropsWithChildren, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ScrambleProvider } from "@/contexts/scramble";
import { useSettingsStore } from "@/stores/settings";

export function Providers({ children }: PropsWithChildren) {
  const theme = useSettingsStore((store) => store.theme);
  const setTheme = useSettingsStore((store) => store.setTheme);

  const applyTheme = (newTheme: typeof theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    let effectiveTheme: "light" | "dark";

    if (newTheme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      effectiveTheme = newTheme;
    }

    root.classList.add(effectiveTheme);

    document.querySelectorAll('meta[name="theme-color"]').forEach((element) => {
      element.remove();
    });

    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = effectiveTheme === "dark" ? "#1f1f1f" : "#e8e8e8";
    document.head.appendChild(meta);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: theme load
  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (useSettingsStore.getState().theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : theme === "light" ? "dark" : "dark");
  };

  useHotkeys("l", toggleTheme, { preventDefault: true });

  return (
    <MotionConfig>
      <ScrambleProvider>{children}</ScrambleProvider>
    </MotionConfig>
  );
}
