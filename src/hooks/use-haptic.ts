import { useCallback } from "react";
import type { HapticInput, TriggerOptions } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";
import { useSettings } from "@/hooks/use-settings";

type Input =
  | HapticInput
  | "success"
  | "warning"
  | "error"
  | "light"
  | "medium"
  | "heavy"
  | "soft"
  | "rigid"
  | "selection"
  | "nudge"
  | "buzz";

export function useHaptic() {
  const { settings } = useSettings();
  const { trigger, isSupported } = useWebHaptics();

  const vibrate = useCallback(
    (input?: Input, options?: TriggerOptions) => {
      if (!settings.hapticEnabled || !isSupported) return;
      trigger(input, options);
    },
    [settings.hapticEnabled, isSupported, trigger],
  );

  return { vibrate, isSupported } as const;
}
