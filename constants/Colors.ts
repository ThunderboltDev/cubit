const accent = "#0ea5e9" as const;
const danger = "#ef4444" as const;

export const colors = {
  accent,
  danger,
  light: {
    background: "#ffffff",
    foreground: "#0f172a",

    secondary: "#f1f5f9",
    secondaryForeground: "#0f172a",

    muted: "#e1e5e9",
    mutedForeground: "#64748b",

    accent: accent,
    danger: danger,

    border: "#e1e5e9",
    input: "#e1e5e9",
  },
  dark: {
    background: "#171717",
    foreground: "#f8fafc",

    secondary: "#272727",
    secondaryForeground: "#f4f6f8",

    muted: "#373737",
    mutedForeground: "#e8eaec",

    accent: accent,
    danger: danger,

    border: "#373737",
    input: "#373737",
  },
} as const;
