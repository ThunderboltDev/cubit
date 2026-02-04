import {
	AccountSetting01Icon,
	Chart01Icon,
	RightToLeftListDashIcon,
	Timer02Icon,
	WorkflowSquare10Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Header } from "@/components/app/header";
import { useClientOnlyValue } from "@/hooks/use-client-only-value";
import { useColors } from "@/hooks/use-colors";

const TAB_ICONS: Record<string, ComponentProps<typeof HugeiconsIcon>["icon"]> =
	{
		solves: RightToLeftListDashIcon,
		trainer: WorkflowSquare10Icon,
		index: Timer02Icon,
		stats: Chart01Icon,
		settings: AccountSetting01Icon,
	} as const;

function TabBarIcon(props: {
	icon: ComponentProps<typeof HugeiconsIcon>["icon"];
	color: string;
}) {
	return <HugeiconsIcon size={24} {...props} />;
}

export default function TabLayout() {
	const colors = useColors();
	const isHeaderShown = useClientOnlyValue(false, true);

	return (
		<Tabs
			initialRouteName="index"
			screenOptions={({ route }) => ({
				tabBarActiveTintColor: colors.accent,
				tabBarInactiveTintColor: colors.mutedForeground,
				tabBarShowLabel: false,
				headerShown: isHeaderShown,
				tabBarStyle: {
					height: 92,
					backgroundColor: colors.secondary,
					paddingTop: 8,
					borderTopWidth: 0,
					elevation: 0,
					shadowOpacity: 0,
				},
				header: () => <Header />,
				tabBarIcon: ({ color }) => (
					<TabBarIcon icon={TAB_ICONS[route.name]} color={color} />
				),
			})}
		>
			<Tabs.Screen name="solves" />
			<Tabs.Screen name="trainer" />
			<Tabs.Screen name="index" />
			<Tabs.Screen name="stats" />
			<Tabs.Screen name="settings" />
		</Tabs>
	);
}
