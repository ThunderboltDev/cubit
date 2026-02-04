import type { ComponentProps } from "react";
import { StyleSheet } from "react-native";
import { View } from "@/components/ui/themed";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface SeparatorProps extends ComponentProps<typeof View> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  orientation = "horizontal",
  style,
  ...props
}: SeparatorProps) {
  const colorScheme = useColorScheme() ?? "dark";
  const color = colors[colorScheme];

  return (
    <View
      style={[
        orientation === "horizontal" ? styles.horizontal : styles.vertical,
        { backgroundColor: color.border },
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
