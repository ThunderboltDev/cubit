import { useEffect, useState } from "react";
import {
  getSessionSettings,
  getSettings,
  saveGlobalSettings,
  saveSessionSettings,
} from "@/lib/settings";
import type { GlobalSettings, SessionSettings } from "@/types";

export function useGlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load
  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const data = await getSettings();

    setSettings(data.global);
    setIsLoading(false);
  }

  async function updateSettings(updates: Partial<GlobalSettings>) {
    await saveGlobalSettings(updates);
    setSettings((prev) => (prev ? { ...prev, ...updates } : null));
  }

  return { settings, isLoading, updateSettings, refreshSettings: loadSettings };
}

export function useSessionSettings(sessionId: string | undefined) {
  const [settings, setSettings] = useState<SessionSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load
  useEffect(() => {
    if (sessionId) {
      loadSettings();
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
    setSettings((prev) => (prev ? { ...prev, ...updates } : null));
  }

  return {
    settings,
    isLoading,
    updateSettings,
    refreshSettings: loadSettings,
  };
}
