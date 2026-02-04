import { StyleSheet } from "react-native";
import { Text, View } from "@/components/ui/themed";
import { formatTime } from "@/lib/time";

export function TimeStat({
  label,
  value,
}: {
  label: string;
  value: number | string | null;
}) {
  if (typeof value === "number") {
    value = formatTime(value);
  } else if (!value) {
    value = "---";
  }

  return (
    <View style={[styles.statBadge]}>
      <Text style={styles.statLabel} variant="muted">
        {label}
      </Text>
      <Text style={styles.statValue} variant="strong">
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 80,
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontVariant: ["tabular-nums"],
  },
});
