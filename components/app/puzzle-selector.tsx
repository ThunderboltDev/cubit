import { StyleSheet, View } from "react-native";
import { PuzzleIcon } from "@/components/icons/puzzle";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Text, useColors } from "@/components/ui/themed";
import { puzzleLabels, puzzles } from "@/constants/puzzles";
import type { Puzzle } from "@/types";

interface PuzzleSelectorProps {
  visible: boolean;
  onClose: () => void;
  selectedPuzzle: Puzzle | undefined;
  onSelect: (puzzle: Puzzle) => void;
}

export function PuzzleSelector({
  visible,
  onClose,
  selectedPuzzle,
  onSelect,
}: PuzzleSelectorProps) {
  const colors = useColors();

  return (
    <Dialog visible={visible} onClose={onClose}>
      <View style={styles.grid}>
        {puzzles.map((puzzle) => {
          const isSelected = selectedPuzzle === puzzle;
          return (
            <Button
              key={puzzle}
              onPress={() => onSelect(puzzle)}
              textWrapper={false}
              style={[
                styles.puzzleButton,
                {
                  backgroundColor:
                    isSelected ? `${colors.accent}35` : colors.secondary,
                  flexDirection: "column",
                  height: "auto",
                  paddingHorizontal: 4,
                },
              ]}
            >
              <PuzzleIcon puzzle={puzzle} color={colors.secondaryForeground} />
              <Text style={styles.puzzleText}>{puzzleLabels[puzzle]}</Text>
            </Button>
          );
        })}
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  puzzleButton: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    padding: 4,
  },
  puzzleText: {
    fontSize: 12,
  },
});
