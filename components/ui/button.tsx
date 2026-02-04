import { HugeiconsIcon } from "@hugeicons/react-native";
import type { ComponentProps, ReactNode } from "react";
import {
	ActivityIndicator,
	Pressable,
	type StyleProp,
	StyleSheet,
	type ViewStyle,
} from "react-native";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

type ButtonVariant = "default" | "transparent";

type ButtonTheme =
	| "default"
	| "secondary"
	| "accent"
	| "success"
	| "danger"
	| "gold";

type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps extends ComponentProps<typeof Pressable> {
	children?: ReactNode;
	variant?: ButtonVariant;
	theme?: ButtonTheme;
	size?: ButtonSize;
	icon?: ComponentProps<typeof HugeiconsIcon>["icon"];
	style?: StyleProp<ViewStyle>;
	loading?: boolean;
	textWrapper?: boolean;
}

export function Button({
	children,
	variant = "default",
	theme = "default",
	size = "default",
	icon,
	style,
	loading,
	disabled,
	textWrapper = true,
	...props
}: ButtonProps) {
	const colors = useColors();

	const getBackgroundColor = () => {
		if (disabled) return colors.muted;
		if (variant === "transparent") return "transparent";

		switch (theme) {
			case "default":
				return colors.secondary;
			case "secondary":
				return colors.muted;
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
		if (disabled) return colors.mutedForeground;

		if (variant === "transparent") {
			switch (theme) {
				case "default":
				case "secondary":
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
			case "secondary":
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

	const getHeight = () => {
		switch (size) {
			case "sm":
				return 36;
			case "lg":
				return 44;
			default:
				return 40;
		}
	};

	const getPadding = () => {
		switch (size) {
			case "sm":
				return { paddingHorizontal: 12 };
			case "lg":
				return { paddingHorizontal: 32 };
			default:
				return { paddingHorizontal: 16 };
		}
	};

	return (
		<Pressable
			disabled={disabled || loading}
			style={({ pressed }) => [
				styles.button,
				{
					backgroundColor: getBackgroundColor(),
					height: getHeight(),
					opacity: pressed ? 0.75 : 1,
					...getPadding(),
				},
				style,
			]}
			{...props}
		>
			{loading ? (
				<ActivityIndicator color={getTextColor()} size="small" />
			) : (
				<>
					{icon && (
						<HugeiconsIcon icon={icon} size={18} color={getTextColor()} />
					)}
					{textWrapper ? (
						<Text
							size={size === "sm" ? 12 : 14}
							weight="medium"
							theme="strong"
							style={{ color: getTextColor() }}
						>
							{children}
						</Text>
					) : (
						children
					)}
				</>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
		gap: 6,
	},
});
