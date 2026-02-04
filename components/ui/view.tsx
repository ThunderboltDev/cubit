import { View as DefaultView } from "react-native";
import { useColors } from "@/hooks/use-colors";

type ViewTheme = "default" | "background" | "secondary" | "muted";

export type ViewProps = DefaultView["props"] & {
	theme?: ViewTheme;
};

export function View({ style, theme = "default", ...props }: ViewProps) {
	const colors = useColors();

	const getBackgroundColor = (): string => {
		switch (theme) {
			case "background":
				return colors.background;
			case "secondary":
				return colors.secondary;
			case "muted":
				return colors.muted;
			default:
				return "transparent";
		}
	};

	return (
		<DefaultView
			style={[{ backgroundColor: getBackgroundColor() }, style]}
			{...props}
		/>
	);
}
