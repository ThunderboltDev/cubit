import { Monitor, MoonIcon, SunIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useDevToolsTapActivator } from "@/components/app/devtools";
import { SettingsItem, SettingsSection } from "@/components/timer/settings";
import {
  Page,
  PageBody,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/use-settings";
import { formatTime } from "@/lib/format-time";
import type { Theme, TimerFormat, TimerPrecision } from "@/types/settings";

export const Route = createFileRoute("/settings")({
  component: SettingsRoute,
});

const SAMPLE_TIME_MS = 65432;

function SettingsRoute() {
  const { settings, updateSettings } = useSettings();
  const handleTap = useDevToolsTapActivator();

  return (
    <Page className="wrapper-md!" showNavHeader>
      <PageHeader>
        <PageTitle onClick={handleTap}>Settings</PageTitle>
        <PageDescription>Manage your preferences</PageDescription>
      </PageHeader>
      <PageBody className="space-y-10">
        <SettingsSection title="Appearance">
          <SettingsItem label="Theme">
            <Select
              value={settings.theme}
              onValueChange={(value) =>
                updateSettings({
                  theme: value as Theme,
                })
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">
                  <HugeiconsIcon icon={Monitor} />
                  System
                </SelectItem>
                <SelectItem value="light">
                  <HugeiconsIcon icon={SunIcon} />
                  Light
                </SelectItem>
                <SelectItem value="dark">
                  <HugeiconsIcon icon={MoonIcon} />
                  Dark
                </SelectItem>
              </SelectContent>
            </Select>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Display">
          <SettingsItem label="Time Format">
            <Select
              value={settings.timeFormat}
              onValueChange={(value) =>
                updateSettings({ timeFormat: value as TimerFormat })
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="decimal">Decimal</SelectItem>
                <SelectItem value="colon">Colon</SelectItem>
              </SelectContent>
            </Select>
          </SettingsItem>

          <SettingsItem
            label="Decimal Precision"
            description="Number of digits after the decimal point"
            orientation="vertical"
          >
            <Slider
              min={0}
              max={3}
              step={1}
              value={[settings.timerPrecision]}
              marks={String}
              onValueChange={(value) =>
                updateSettings({
                  timerPrecision: (Array.isArray(value)
                    ? value[0]
                    : value) as TimerPrecision,
                })
              }
              withBadge={false}
            />
          </SettingsItem>

          <SettingsItem label="Live Preview" orientation="vertical">
            <div className="flex items-center justify-center rounded-xl bg-background p-6 w-full">
              <span className="font-mono text-4xl font-bold">
                {formatTime(
                  SAMPLE_TIME_MS,
                  settings.timerPrecision,
                  settings.timeFormat,
                )}
              </span>
            </div>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Controls">
          <SettingsItem
            label="Hold to Start"
            description="Duration required to activate the timer"
            orientation="vertical"
          >
            <Slider
              min={100}
              max={1000}
              step={50}
              value={[settings.holdThreshold]}
              marks={(value) => {
                if (value === 100 || value === 1000) return String(value);
              }}
              onValueChange={(value) =>
                updateSettings({
                  holdThreshold: Array.isArray(value) ? value[0] : value,
                })
              }
              withBadge={true}
              formatBadge={(value) => `${value}ms`}
              badgeWidth="4rem"
            />
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Feedback">
          <SettingsItem
            label="Sound Effects"
            description="Play audio on timer events"
          >
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) =>
                updateSettings({ soundEnabled: checked })
              }
            />
          </SettingsItem>

          <SettingsItem
            label="Volume"
            orientation="vertical"
            disabled={!settings.soundEnabled}
          >
            <Slider
              min={0}
              max={1}
              step={0.05}
              value={[settings.soundVolume]}
              marks={(value) => `${Math.round(value * 100)}%`}
              onValueChange={(value) =>
                updateSettings({
                  soundVolume: Array.isArray(value) ? value[0] : value,
                })
              }
              formatBadge={(value) => `${Math.round(value * 100)}%`}
              badgeWidth="3rem"
              withBadge={true}
            />
          </SettingsItem>

          <SettingsItem
            label="Haptic Feedback"
            description="Vibrate on supported devices"
          >
            <Switch
              checked={settings.hapticEnabled}
              onCheckedChange={(checked) =>
                updateSettings({ hapticEnabled: checked })
              }
            />
          </SettingsItem>
        </SettingsSection>
      </PageBody>
    </Page>
  );
}
