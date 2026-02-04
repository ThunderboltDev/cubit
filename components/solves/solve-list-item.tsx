import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColors } from "@/hooks/use-colors";
import { formatTime } from "@/lib/time";
import type { Solve } from "@/types";

interface SolveListItemProps {
	solve: Solve;
	index: number;
	onPress: (solve: Solve) => void;
}

export function SolveListItem({ solve, index, onPress }: SolveListItemProps) {
	const colors = useColors();

	const timeDisplay = () => {
		if (solve.penalty === "dnf") return "DNF";
		const timeStr = formatTime(solve.time);
		if (solve.penalty === "+2") return `${timeStr}+`;
		return timeStr;
	};

	return (
		<TouchableOpacity
			style={[styles.container, { borderBottomColor: colors.border }]}
			onPress={() => onPress(solve)}
			activeOpacity={0.7}
		>
			<View style={styles.left}>
				<Text size={12} theme="muted" style={{ opacity: 0.5 }}>
					#{index}
				</Text>
			</View>

			<View style={styles.center}>
				<Text
					size={16}
					weight="bold"
					style={[
						styles.time,
						solve.penalty === "dnf" && { color: colors.danger },
						solve.penalty === "+2" && { color: colors.danger },
					]}
				>
					{timeDisplay()}
				</Text>
				<Text size={12} theme="muted" style={styles.scramble} numberOfLines={1}>
					{solve.scramble}
				</Text>
			</View>

			<View style={styles.right} />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		paddingVertical: 16,
		paddingHorizontal: 20,
		alignItems: "center",
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	left: {
		width: 40,
	},
	center: {
		flex: 1,
		paddingHorizontal: 12,
	},
	time: {
		fontFamily: "JetBrainsMono-SemiBold",
	},
	scramble: {
		marginTop: 4,
		opacity: 0.7,
	},
	right: {
		width: 40,
		alignItems: "flex-end",
	},
});
