import {
  ActivityIcon,
  Add01Icon,
  ArrowDownIcon,
  ArrowHorizontalIcon,
  ArrowUpIcon,
  ArrowVerticalIcon,
  BluetoothIcon,
  Cancel01Icon,
  ChampionIcon,
  type ChartIcon,
  ChartUpIcon,
  KeyboardIcon,
  LayoutGridIcon,
  Menu02Icon,
  TargetIcon,
  Timer01Icon,
  Timer02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PuzzleIcon } from "@/components/puzzle/icon";
import { ScramblePreview } from "@/components/timer/scramble-preview";
import { SettingsItem, SettingsSection } from "@/components/timer/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Switch } from "@/components/ui/switch";
import { usePuzzles } from "@/hooks/use-puzzles";
import { PUZZLE_LABELS } from "@/lib/constants";
import type { InputMethod } from "@/types/puzzles";
import type { StatType } from "@/types/stats";

export const Route = createFileRoute("/_timer/configuration")({
  component: PuzzleConfigurationPage,
});

const STAT_TYPE_OPTIONS: {
  value: StatType["type"];
  label: string;
  icon: typeof ChartIcon;
}[] = [
  { value: "average", label: "Average", icon: ChartUpIcon },
  { value: "best", label: "Best", icon: ChampionIcon },
  { value: "mean", label: "Mean", icon: ActivityIcon },
  { value: "consistency", label: "Consistency", icon: TargetIcon },
];

const MAX_STATS = 5;

let hasPageAnimated = false;

function PuzzleConfigurationPage() {
  const { currentPuzzle, updatePuzzle } = usePuzzles();

  if (!currentPuzzle) {
    return (
      <Page>
        <PageHeader>
          <PageTitle>Puzzle Configuration</PageTitle>
          <PageDescription>No puzzle selected</PageDescription>
        </PageHeader>
      </Page>
    );
  }

  const displayStats = currentPuzzle.displayStats;

  const updateStat = (index: number, updates: Partial<StatType>) => {
    const newStats = [...displayStats.stats];
    newStats[index] = { ...newStats[index], ...updates } as StatType;
    updatePuzzle(currentPuzzle.id, {
      displayStats: { ...displayStats, stats: newStats },
    });
  };

  const addStat = () => {
    if (displayStats.stats.length >= MAX_STATS) return;
    const newStat: StatType = { type: "average", n: 5 };
    updatePuzzle(currentPuzzle.id, {
      displayStats: {
        ...displayStats,
        stats: [...displayStats.stats, newStat],
      },
    });
  };

  const removeStat = (index: number) => {
    const newStats = displayStats.stats.filter((_, i) => i !== index);
    updatePuzzle(currentPuzzle.id, {
      displayStats: { ...displayStats, stats: newStats },
    });
  };

  const moveStat = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === displayStats.stats.length - 1) return;

    const newStats = [...displayStats.stats];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newStats[index], newStats[newIndex]] = [
      newStats[newIndex],
      newStats[index],
    ];

    updatePuzzle(currentPuzzle.id, {
      displayStats: { ...displayStats, stats: newStats },
    });
  };

  return (
    <Page className="wrapper-md!">
      <PageHeader>
        <PageTitle>Puzzle Configuration</PageTitle>
        <PageDescription>Customize your solving experience</PageDescription>
      </PageHeader>

      <PageBody className="pb-12">
        <motion.div
          className="space-y-10"
          initial={hasPageAnimated ? "show" : "hidden"}
          animate="show"
          variants={{
            show: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          onAnimationComplete={() => {
            hasPageAnimated = true;
          }}
        >
          <SettingsSection title="Identity">
            <SettingsItem label="Puzzle Name">
              <Input
                value={currentPuzzle.name}
                onChange={(e) =>
                  updatePuzzle(currentPuzzle.id, { name: e.target.value })
                }
                className="w-32"
                placeholder="3x3"
              />
            </SettingsItem>

            <SettingsItem
              label="Puzzle Type"
              description="Cannot be changed after creation"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <PuzzleIcon puzzleType={currentPuzzle.type} size={20} />
                <span className="font-medium">
                  {PUZZLE_LABELS[currentPuzzle.type]}
                </span>
              </div>
            </SettingsItem>
          </SettingsSection>

          <SettingsSection title="Core Settings">
            <SettingsItem label="Inspection" description="WCA Inspection">
              <span className="text-muted-foreground">
                {currentPuzzle.inspectionEnabled ? "Enabled" : "Disabled"}
              </span>
            </SettingsItem>

            {currentPuzzle.inspectionEnabled && (
              <SettingsItem label="Inspection Duration">
                <span className="text-muted-foreground">
                  {currentPuzzle.inspectionDuration}s
                </span>
              </SettingsItem>
            )}

            <SettingsItem label="Multiphase">
              <span className="text-muted-foreground">
                {currentPuzzle.multiphaseEnabled ? "Enabled" : "Disabled"}
              </span>
            </SettingsItem>

            {currentPuzzle.multiphaseEnabled && (
              <SettingsItem label="Phase Count">
                <span className="text-muted-foreground">
                  {currentPuzzle.multiphaseCount}
                </span>
              </SettingsItem>
            )}

            <SettingsItem
              label="Trim Percentage"
              description="Outliers removed from average calculations"
            >
              <span className="text-muted-foreground">
                {currentPuzzle.trimPercentage}%
              </span>
            </SettingsItem>
          </SettingsSection>

          <SettingsSection title="Input">
            <SettingsItem label="Input Method">
              <Select
                value={currentPuzzle.inputMethod}
                onValueChange={(value) =>
                  updatePuzzle(currentPuzzle.id, {
                    inputMethod: value as InputMethod,
                  })
                }
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
                checked={currentPuzzle.scramblePreview}
                onCheckedChange={(checked) =>
                  updatePuzzle(currentPuzzle.id, { scramblePreview: checked })
                }
              />
            </SettingsItem>

            <SettingsItem
              label="Visualization Style"
              disabled={!currentPuzzle.scramblePreview}
            >
              <Select
                value={currentPuzzle.scramblePreviewVisualization}
                onValueChange={(value) =>
                  updatePuzzle(currentPuzzle.id, {
                    scramblePreviewVisualization: value as "2D" | "3D",
                  })
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
              puzzleType={currentPuzzle.type}
              visualization={currentPuzzle.scramblePreviewVisualization}
            />
          </SettingsSection>

          <SettingsSection title="Timer Stats">
            <SettingsItem label="Layout Style">
              <Select
                value={displayStats.style}
                onValueChange={(value) =>
                  updatePuzzle(currentPuzzle.id, {
                    displayStats: {
                      ...displayStats,
                      style: value as "cards" | "lines",
                    },
                  })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="cards">
                    <HugeiconsIcon icon={LayoutGridIcon} />
                    Cards
                  </SelectItem>
                  <SelectItem value="lines">
                    <HugeiconsIcon icon={Menu02Icon} />
                    Lines
                  </SelectItem>
                </SelectContent>
              </Select>
            </SettingsItem>

            <SettingsItem label="Orientation">
              <Select
                value={displayStats.orientation}
                onValueChange={(value) =>
                  updatePuzzle(currentPuzzle.id, {
                    displayStats: {
                      ...displayStats,
                      orientation: value as "horizontal" | "vertical",
                    },
                  })
                }
              >
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="horizontal">
                    <HugeiconsIcon icon={ArrowHorizontalIcon} />
                    Horizontal
                  </SelectItem>
                  <SelectItem value="vertical">
                    <HugeiconsIcon icon={ArrowVerticalIcon} />
                    Vertical
                  </SelectItem>
                </SelectContent>
              </Select>
            </SettingsItem>

            <SettingsItem
              label={`Stats (${displayStats.stats.length}/${MAX_STATS})`}
            >
              <Button
                onClick={addStat}
                disabled={displayStats.stats.length >= MAX_STATS}
              >
                <HugeiconsIcon icon={Add01Icon} />
                Add Stat
              </Button>
            </SettingsItem>

            <div className="space-y-3 p-3">
              {displayStats.stats.map((stat, index) => (
                <div
                  className="flex items-center gap-3"
                  key={`stat-${stat.type}-${index}`}
                >
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-foreground rounded-full"
                      onClick={() => moveStat(index, "up")}
                      disabled={index === 0}
                    >
                      <HugeiconsIcon icon={ArrowUpIcon} size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-foreground rounded-full"
                      onClick={() => moveStat(index, "down")}
                      disabled={index === displayStats.stats.length - 1}
                    >
                      <HugeiconsIcon icon={ArrowDownIcon} size={14} />
                    </Button>
                  </div>

                  <div className="flex flex-1 items-center gap-3 min-w-0">
                    <Select
                      value={stat.type}
                      onValueChange={(value) =>
                        updateStat(index, { type: value as StatType["type"] })
                      }
                    >
                      <SelectTrigger className="w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STAT_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <HugeiconsIcon icon={opt.icon} size={14} />
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      min={1}
                      max={1000}
                      value={stat.n === 0 ? "" : String(stat.n)}
                      placeholder="∞"
                      className="w-15"
                      onChange={(e) =>
                        updateStat(index, {
                          n:
                            (
                              e.target.value === "" ||
                              Number(e.target.value) <= 0
                            ) ?
                              0
                            : parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-full text-muted-foreground hover:text-danger hover:bg-danger/10"
                    onClick={() => removeStat(index)}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </SettingsSection>
        </motion.div>
      </PageBody>
    </Page>
  );
}
