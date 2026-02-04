import { StyleSheet, View } from "react-native";
import { PuzzleIcon } from "@/components/icons/puzzle";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { puzzleLabels, puzzles } from "@/constants/puzzles";
import { useColors } from "@/hooks/use-colors";
import type { Puzzle } from "@/types";

interface PuzzleSelectorProps {
	open: boolean;
	onOpenChange: (value: boolean) => void;
	selectedPuzzle: Puzzle | undefined;
	onSelect: (puzzle: Puzzle) => void;
}

export function PuzzleSelector({
	open,
	onOpenChange,
	selectedPuzzle,
	onSelect,
}: PuzzleSelectorProps) {
	const colors = useColors();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
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
									backgroundColor: isSelected
										? `${colors.accent}35`
										: colors.secondary,
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
