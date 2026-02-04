import type { ComponentProps } from "react";
import { StyleSheet } from "react-native";
import { View } from "@/components/ui/view";
import { useColors } from "@/hooks/use-colors";

interface SeparatorProps extends ComponentProps<typeof View> {
	orientation?: "horizontal" | "vertical";
}

export function Separator({
	orientation = "horizontal",
	style,
	...props
}: SeparatorProps) {
	const colors = useColors();

	return (
		<View
			style={[
				orientation === "horizontal" ? styles.horizontal : styles.vertical,
				{ backgroundColor: colors.border },
				style,
			]}
			{...props}
		/>
	);
}

const styles = StyleSheet.create({
	horizontal: {
		height: 1,
		width: "100%",
	},
	vertical: {
		width: 1,
		height: "100%",
	},
});
