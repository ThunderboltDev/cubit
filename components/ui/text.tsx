import { Text as DefaultText, type TextStyle } from "react-native";
import { useColors } from "@/hooks/use-colors";

type Theme =
	| "default"
	| "muted"
	| "strong"
	| "accent"
	| "danger"
	| "success"
	| "gold";

export type TextProps = DefaultText["props"] & {
	theme?: Theme;
	size?: number;
	weight?: "light" | "normal" | "medium" | "semibold" | "bold";
};

export function Text(props: TextProps) {
	const {
		style,
		theme = "default",
		size = 16,
		weight = "normal",
		...otherProps
	} = props;

	const colors = useColors();

	const getColor = (): string => {
		switch (theme) {
			case "muted":
				return colors.mutedForeground;
			case "strong":
				return colors.foreground;
			case "accent":
				return colors.accent;
			case "danger":
				return colors.danger;
			case "success":
				return colors.success;
			case "gold":
				return colors.gold;
			default:
				return colors.secondaryForeground;
		}
	};

	const getFontFamily = (): string => {
		switch (weight) {
			case "light":
				return "Rubik-Light";
			case "medium":
				return "Rubik-Medium";
			case "semibold":
				return "Rubik-SemiBold";
			case "bold":
				return "Rubik-Bold";
			default:
				return "Rubik-Regular";
		}
	};
	const getLineHeight = (): number => {
		let ratio: number;

		if (size >= 24) {
			ratio = 1.2;
		} else if (size >= 18) {
			ratio = 1.3;
		} else if (size >= 14) {
			ratio = 1.4;
		} else {
			ratio = 1.5;
		}

		if (weight === "bold") ratio += 0.05;
		if (weight === "semibold") ratio += 0.025;

		return Math.round(size * ratio);
	};

	const textStyle: TextStyle = {
		color: getColor(),
		fontSize: size,
		fontFamily: getFontFamily(),
		lineHeight: getLineHeight(),
	};

	return <DefaultText style={[textStyle, style]} {...otherProps} />;
}
