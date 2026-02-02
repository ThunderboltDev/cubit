import {
  Chart01Icon,
  Timer02Icon,
  WorkflowSquare10Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Header } from "@/components/app/header";
import { colors } from "@/constants/colors";
import { useClientOnlyValue } from "@/hooks/use-client-only-value";
import { useColorScheme } from "@/hooks/use-color-scheme";

const TAB_ICONS: Record<string, ComponentProps<typeof HugeiconsIcon>["icon"]> =
  {
    trainer: WorkflowSquare10Icon,
    index: Timer02Icon,
    stats: Chart01Icon,
  } as const;

function TabBarIcon(props: {
  icon: ComponentProps<typeof HugeiconsIcon>["icon"];
  color: string;
}) {
  return <HugeiconsIcon size={24} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isHeaderShown = useClientOnlyValue(false, true);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors[colorScheme].accent,
        tabBarInactiveTintColor: colors[colorScheme].mutedForeground,
        tabBarShowLabel: false,
        headerShown: isHeaderShown,
        tabBarStyle: {
          height: 92,
          backgroundColor: colors[colorScheme].secondary,
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
      <Tabs.Screen name="trainer" />
      <Tabs.Screen name="index" />
      <Tabs.Screen name="stats" />
    </Tabs>
  );
}
