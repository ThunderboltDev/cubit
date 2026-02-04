import { HugeiconsIcon } from "@hugeicons/react-native";
import type { ComponentProps } from "react";
import {
	Pressable,
	type StyleProp,
	StyleSheet,
	type ViewStyle,
} from "react-native";
import { useColors } from "@/hooks/use-colors";

type IconButtonVariant = "default" | "transparent";

type IconButtonTheme = "default" | "accent" | "success" | "danger" | "gold";

type IconButtonSize = "default" | "sm" | "lg";

interface IconButtonProps extends ComponentProps<typeof Pressable> {
	icon: ComponentProps<typeof HugeiconsIcon>["icon"];
	variant?: IconButtonVariant;
	theme?: IconButtonTheme;
	size?: IconButtonSize;
	style?: StyleProp<ViewStyle>;
	loading?: boolean;
}

export function IconButton({
	icon,
	variant = "default",
	theme = "default",
	size,
	disabled,
	loading,
	style,
	...props
}: IconButtonProps) {
	const colors = useColors();

	const getBackgroundColor = () => {
		if (disabled) return colors.muted;
		if (variant === "transparent") return "transparent";

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

	const getIconColor = () => {
		if (disabled) return colors.mutedForeground;

		if (variant === "transparent") {
			switch (theme) {
				case "default":
					return colors.foreground;
				case "accent":
					return colors.accent;
				case "success":
					return colors.success;
				case "danger":
					return colors.danger;
				case "gold":
					return colors.gold;
				default:
					return colors.foreground;
			}
		}

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

	const getDimensions = () => {
		switch (size) {
			case "sm":
				return 32;
			case "lg":
				return 48;
			default:
				return 40;
		}
	};

	const getIconSize = () => {
		switch (size) {
			case "sm":
				return 16;
			case "lg":
				return 24;
			default:
				return 20;
		}
	};

	const dim = getDimensions();

	return (
		<Pressable
			disabled={disabled || loading}
			style={({ pressed }) => [
				styles.button,
				{
					backgroundColor: getBackgroundColor(),
					height: dim,
					width: dim,
					opacity: pressed ? 0.75 : 1,
				},
				style,
			]}
			{...props}
		>
			<HugeiconsIcon icon={icon} size={getIconSize()} color={getIconColor()} />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
	},
});
