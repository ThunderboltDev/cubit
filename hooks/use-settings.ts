import { useEffect, useState } from "react";
import {
  DEFAULT_GLOBAL_SETTINGS,
  DEFAULT_SESSION_SETTINGS,
} from "@/constants/settings";
import {
  getSessionSettings,
  getSettings,
  saveGlobalSettings,
  saveSessionSettings,
  subscribeToSettings,
} from "@/lib/settings";
import type { GlobalSettings, SessionSettings } from "@/types";

export function useGlobalSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<GlobalSettings>(
    DEFAULT_GLOBAL_SETTINGS,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load
  useEffect(() => {
    loadSettings();
    return subscribeToSettings(loadSettings);
  }, []);

  async function loadSettings() {
    const data = await getSettings();

    setSettings(data.global);
    setIsLoading(false);
  }

  async function updateSettings(updates: Partial<GlobalSettings>) {
    await saveGlobalSettings(updates);
  }

  return { settings, isLoading, updateSettings, refreshSettings: loadSettings };
}

export function useSessionSettings(sessionId: string | undefined) {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SessionSettings>(
    DEFAULT_SESSION_SETTINGS,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load
  useEffect(() => {
    if (sessionId) {
      loadSettings();
      return subscribeToSettings(loadSettings);
    }
  }, [sessionId]);

  async function loadSettings() {
    if (!sessionId) return;

    const data = await getSessionSettings(sessionId);

    setSettings(data);
    setIsLoading(false);
  }

  async function updateSettings(updates: Partial<SessionSettings>) {
    if (!sessionId) return;

    await saveSessionSettings(sessionId, updates);
  }

  return {
    settings,
    isLoading,
    updateSettings,
    refreshSettings: loadSettings,
  };
}
