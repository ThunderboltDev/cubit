import { puzzleIcons } from "@/constants/icons";
import type { Puzzle } from "@/types";

interface PuzzleIconProps {
  puzzle: Puzzle;
  color: string;
  size?: number;
}

export function PuzzleIcon({ puzzle, color, size = 40 }: PuzzleIconProps) {
  const Icon = puzzleIcons[puzzle];
  return <Icon width={size} height={size} fill={color} />;
}
