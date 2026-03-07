import { Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PuzzleIcon } from "@/components/puzzle/icon";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Page, PageBody, PageHeader, PageTitle } from "@/components/ui/page";
import { usePuzzles } from "@/hooks/use-puzzles";
import { DEFAULT_DISPLAY_STATS, WCA_PRESETS } from "@/lib/constants";
import type { Puzzle } from "@/types/puzzles";

export const Route = createFileRoute("/puzzles/new")({
  component: NewPuzzlePage,
});

function NewPuzzlePage() {
  const navigate = useNavigate();
  const { createPuzzle } = usePuzzles();

  const handleCreate = (puzzleData: Omit<Puzzle, "id">) => {
    createPuzzle(puzzleData);
    navigate({ to: "/" });
  };

  return (
    <Page showNavHeader>
      <PageHeader>
        <PageTitle>New Puzzle</PageTitle>
      </PageHeader>
      <PageBody>
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 md:grid-cols-4">
          {WCA_PRESETS.map((preset) => (
            <Button
              size="lg"
              key={preset.id}
              onClick={() =>
                handleCreate({
                  ...preset,
                  name: preset.name ?? "New Puzzle",
                  type: preset.type ?? "333",
                  inspectionEnabled: preset.inspectionEnabled ?? true,
                  inspectionDuration: preset.inspectionDuration ?? 15,
                  multiphaseEnabled: false,
                  multiphaseCount: 0,
                  inputMethod: "timer",
                  scramblePreview: true,
                  scramblePreviewVisualization: "3D",
                  displayStats: DEFAULT_DISPLAY_STATS,
                  trimPercentage: preset.trimPercentage ?? 5,
                } as Puzzle)
              }
              className="group h-auto relative flex flex-col rounded-xl p-6 text-center"
            >
              <div className="relative flex items-center justify-center">
                <PuzzleIcon puzzleType={preset.type ?? "333"} size={72} />
              </div>
              <span className="font-medium text-base md:text-lg text-foreground">
                {preset.name}
              </span>
            </Button>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <LinkButton href="/puzzles/custom" variant="accent">
            <HugeiconsIcon icon={Plus} />
            Create Custom Puzzle
          </LinkButton>
        </div>
      </PageBody>
    </Page>
  );
}
