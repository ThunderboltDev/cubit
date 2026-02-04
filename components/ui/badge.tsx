import { HugeiconsIcon } from "@hugeicons/react-native";
import type { ComponentProps } from "react";
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColors } from "@/hooks/use-colors";

type BadgeTheme = "default" | "accent" | "success" | "danger" | "gold";

interface BadgeProps {
	children: string | ComponentProps<typeof HugeiconsIcon>["icon"];
	style?: StyleProp<ViewStyle>;
	theme?: BadgeTheme;
}

export function Badge({ children, theme = "default", ...props }: BadgeProps) {
	const colors = useColors();

	const getBackgroundColor = () => {
		switch (theme) {
			case "default":
				return colors.secondary;
			case "accent":
				return colors.accent;
			case "success":
				return colors.success;
			case "danger":
				return colors.danger;
			case "gold":
				return colors.gold;
			default:
				return colors.secondary;
		}
	};

	const getTextColor = () => {
		switch (theme) {
			case "default":
				return colors.foreground;
			case "accent":
			case "success":
			case "danger":
			case "gold":
				return "white";
			default:
				return colors.foreground;
		}
	};

	const isIcon = typeof children !== "string";

	return (
		<View
			style={[
				styles.badge,
				{
					backgroundColor: getBackgroundColor(),
				},
				props.style,
			]}
		>
			{isIcon ? (
				<HugeiconsIcon icon={children} size={12} color={getTextColor()} />
			) : (
				<Text
					size={12}
					weight="medium"
					theme="strong"
					style={{ color: getTextColor() }}
				>
					{children}
				</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	badge: {
		alignSelf: "flex-start",
		borderRadius: 9999,
		paddingHorizontal: 10,
		paddingVertical: 4,
		alignItems: "center",
		justifyContent: "center",
	},
});
