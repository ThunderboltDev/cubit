import { StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColors } from "@/hooks/use-colors";
import { formatTime } from "@/lib/time";

interface StatCardProps {
	label: string;
	value: number | string | null;
	highlight?: "best" | "worst" | "none";
	color?: string;
	variant?: "card" | "badge";
}

export function StatCard({
	label,
	value,
	highlight = "none",
	color,
	variant = "card",
}: StatCardProps) {
	const colors = useColors();

	const getHighlightColor = () => {
		if (color) return color;
		if (highlight === "best") return colors.success;
		if (highlight === "worst") return colors.danger;
		return colors.foreground;
	};

	const displayValue =
		typeof value === "number" ? formatTime(value) : (value ?? "---");

	const isBadge = variant === "badge";

	return (
		<View
			style={[
				styles.padding,
				styles.container,
				!isBadge && { backgroundColor: colors.secondary },
			]}
		>
			<Text
				style={[styles.label, isBadge && styles.badgeLabel]}
				theme="muted"
				size={12}
			>
				{label}
			</Text>
			<Text
				style={[
					styles.value,
					{ color: getHighlightColor() },
					isBadge ? styles.badgeValue : styles.cardValue,
				]}
				theme={"strong"}
				size={isBadge ? 16 : 12}
				weight={isBadge ? "bold" : "normal"}
				numberOfLines={1}
				adjustsFontSizeToFit
			>
				{displayValue}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		minWidth: 80,
	},
	padding: {
		paddingVertical: 8,
		paddingHorizontal: 16,
	},
	cardPadding: {
		padding: 12,
	},
	label: {
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	badgeLabel: {
		fontSize: 10,
		marginBottom: 2,
	},
	cardLabel: {
		fontSize: 12,
		marginBottom: 4,
	},
	value: {
		fontVariant: ["tabular-nums"],
	},
	badgeValue: {
		fontSize: 16,
	},
	cardValue: {
		fontFamily: "JetBrainsMono-SemiBold",
	},
});
