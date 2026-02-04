import { StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";

export default function GlobalSettings() {
	return (
		<View style={styles.container}>
			<Text size={20} weight="bold">
				Global Settings
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
