import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Stack, useRouter } from "expo-router";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColors } from "@/hooks/use-colors";

function HeaderTitle({
	title,
	description,
}: {
	title: string;
	description?: string;
}) {
	return (
		<View>
			<Text size={20} weight="bold">
				{title}
			</Text>
			{description && (
				<Text size={12} theme="muted">
					{description}
				</Text>
			)}
		</View>
	);
}

export default function StackLayout() {
	const router = useRouter();
	const colors = useColors();

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: colors.secondary,
				},
				headerTitleAlign: "left",
				headerLeft: ({ canGoBack }) =>
					canGoBack ? (
						<IconButton
							style={{
								marginRight: 8,
							}}
							variant="transparent"
							icon={ArrowLeft01Icon}
							onPress={() => router.back()}
						/>
					) : null,
			}}
		>
			<Stack.Screen
				name="global-settings"
				options={{
					headerTitle: () => <HeaderTitle title="Global Settings" />,
					headerBackVisible: false,
				}}
			/>
		</Stack>
	);
}
