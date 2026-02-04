import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColors } from "@/hooks/use-colors";

export default function NotFoundScreen() {
	const colors = useColors();

	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
			<View style={styles.container}>
				<Text size={20} weight="bold">
					This screen doesn't exist.
				</Text>

				<Link href="/" style={{ color: colors.accent }}>
					<Text size={14} theme="accent">
						Go to home screen!
					</Text>
				</Link>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
});
