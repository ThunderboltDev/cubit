import {
  BluetoothIcon,
  KeyboardIcon,
  Tick02Icon,
  Timer01Icon,
  Timer02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { VisualizationFormat } from "cubing/twisty";
import { type SubmitEvent, useState } from "react";
import { ScramblePreview } from "@/components/timer/scramble-preview";
import { SettingsItem, SettingsSection } from "@/components/timer/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Page, PageBody, PageHeader, PageTitle } from "@/components/ui/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { usePuzzles } from "@/hooks/use-puzzles";
import {
  DEFAULT_DISPLAY_STATS,
  PUZZLE_LABELS,
  PUZZLE_TYPES,
} from "@/lib/constants";
import type { InputMethod, PuzzleType } from "@/types/puzzles";

export const Route = createFileRoute("/puzzles/custom")({
  component: CustomPuzzlePage,
});

function CustomPuzzlePage() {
  const navigate = useNavigate();
  const { createPuzzle } = usePuzzles();

  const [name, setName] = useState("");
  const [type, setType] = useState<PuzzleType>("333");
  const [inspectionEnabled, setInspectionEnabled] = useState(true);
  const [inspectionDuration, setInspectionDuration] = useState(15);
  const [multiphaseEnabled, setMultiphaseEnabled] = useState(false);
  const [multiphaseCount, setMultiphaseCount] = useState(2);
  const [trimPercentage, setTrimPercentage] = useState(5);
  const [scramblePreview, setScramblePreview] = useState(true);
  const [scramblePreviewVisualization, setScramblePreviewVisualization] =
    useState<VisualizationFormat>("3D");
  const [inputMethod, setInputMethod] = useState<InputMethod>("timer");

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const puzzleData = {
      name: name.trim() || type,
      type,
      inspectionEnabled,
      inspectionDuration,
      multiphaseEnabled,
      multiphaseCount: multiphaseEnabled ? multiphaseCount : 0,
      trimPercentage,
      inputMethod,
      scramblePreview,
      scramblePreviewVisualization: "3D" as const,
      displayStats: DEFAULT_DISPLAY_STATS,
    };

    createPuzzle(puzzleData);
    navigate({ to: "/" });
  };

  return (
    <Page className="wrapper-md!" showNavHeader>
      <PageHeader>
        <PageTitle>Create Custom Puzzle</PageTitle>
      </PageHeader>
      <PageBody>
        <form onSubmit={handleSubmit} className="space-y-8">
          <SettingsSection title="General">
            <SettingsItem
              label="Name"
              description="A unique name for this puzzle."
            >
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="3x3"
                className="w-32"
              />
            </SettingsItem>

            <SettingsItem
              label="Puzzle Type"
              description="Select the puzzle type for logic and scrambles."
              orientation="responsive"
            >
              <Select
                value={type}
                onValueChange={(v) => setType(v as PuzzleType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PUZZLE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {PUZZLE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingsItem>
          </SettingsSection>

          <SettingsSection title="Core Settings">
            <SettingsItem
              label="Inspection"
              description="Enable standard WCA-style inspection."
            >
              <Switch
                checked={inspectionEnabled}
                onCheckedChange={setInspectionEnabled}
              />
            </SettingsItem>

            <SettingsItem
              label="Inspection Duration"
              description={`${inspectionDuration} seconds`}
              orientation="vertical"
              disabled={!inspectionEnabled}
            >
              <Slider
                value={[inspectionDuration]}
                onValueChange={(v) =>
                  setInspectionDuration(typeof v === "number" ? v : v[0])
                }
                min={0}
                max={60}
                step={1}
                formatBadge={(value) => `${value}s`}
                badgeWidth="7ch"
              />
            </SettingsItem>

            <SettingsItem
              label="Multiphase"
              description="Split your solve into multiple steps."
            >
              <Switch
                checked={multiphaseEnabled}
                onCheckedChange={setMultiphaseEnabled}
              />
            </SettingsItem>

            <SettingsItem
              label="Number of Phases"
              description={`${multiphaseCount} phases`}
              orientation="vertical"
              disabled={!multiphaseEnabled}
            >
              <Slider
                value={[multiphaseCount]}
                onValueChange={(v) =>
                  setMultiphaseCount(typeof v === "number" ? v : v[0])
                }
                min={2}
                max={10}
                step={1}
                formatBadge={(value) => `${value}`}
                badgeWidth="6ch"
              />
            </SettingsItem>
            <SettingsItem
              label="Trim Percentage"
              description="Percentage of best/worst solves to exclude from AoN."
              orientation="vertical"
            >
              <Slider
                value={[trimPercentage]}
                onValueChange={(v) =>
                  setTrimPercentage(typeof v === "number" ? v : v[0])
                }
                min={0}
                max={20}
                step={1}
                formatBadge={(value) => `${value}%`}
                badgeWidth="7ch"
              />
            </SettingsItem>
          </SettingsSection>

          <SettingsSection title="Input">
            <SettingsItem label="Input Method">
              <Select
                value={inputMethod}
                onValueChange={(value) => setInputMethod(value as InputMethod)}
              >
                <SelectTrigger className="w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="manual" disabled>
                    <HugeiconsIcon icon={KeyboardIcon} />
                    Manual (type time)
                  </SelectItem>
                  <SelectItem value="timer">
                    <HugeiconsIcon icon={Timer02Icon} />
                    On-screen timer
                  </SelectItem>
                  <SelectItem value="stackmat" disabled>
                    <HugeiconsIcon icon={Timer01Icon} />
                    Stackmat
                  </SelectItem>
                  <SelectItem value="bluetooth" disabled>
                    <HugeiconsIcon icon={BluetoothIcon} />
                    Bluetooth cube
                  </SelectItem>
                </SelectContent>
              </Select>
            </SettingsItem>
          </SettingsSection>

          <SettingsSection title="Visualization">
            <SettingsItem
              label="Scramble Preview"
              description="Show puzzle state visualization"
            >
              <Switch
                checked={scramblePreview}
                onCheckedChange={(checked) => setScramblePreview(checked)}
              />
            </SettingsItem>

            <SettingsItem
              label="Visualization Style"
              disabled={!scramblePreview}
            >
              <Select
                value={scramblePreviewVisualization}
                onValueChange={(value) =>
                  setScramblePreviewVisualization(value as "2D" | "3D")
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end" className="w-36">
                  <SelectItem value="2D">2D Net</SelectItem>
                  <SelectItem value="3D">3D Cube</SelectItem>
                </SelectContent>
              </Select>
            </SettingsItem>

            <ScramblePreview
              scramble=""
              className="w-full"
              puzzleType={type}
              visualization={scramblePreviewVisualization}
            />
          </SettingsSection>

          <Button variant="accent" type="submit" className="flex ml-auto">
            <HugeiconsIcon icon={Tick02Icon} />
            Create Puzzle
          </Button>
        </form>
      </PageBody>
    </Page>
  );
}
