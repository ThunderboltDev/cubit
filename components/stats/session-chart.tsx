import { useMemo, useState } from "react";
import { Dimensions, type LayoutChangeEvent, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColors } from "@/hooks/use-colors";
import { calculateRollingAverage } from "@/lib/stats";
import { getEffectiveTime, msToSeconds } from "@/lib/time";
import type { Solve } from "@/types";

interface SessionChartProps {
	solves: Solve[];
}

export function SessionChart({ solves }: SessionChartProps) {
	const colors = useColors();

	const [width, setWidth] = useState(Dimensions.get("window").width - 32);
	const [showRaw, setShowRaw] = useState(true);
	const [showAo5, setShowAo5] = useState(true);
	const [showAo12, setShowAo12] = useState(false);

	const chartData = useMemo(() => {
		const chronologicalSolves = [...solves].reverse();

		const rawTimes = chronologicalSolves.map((s) => {
			const time = getEffectiveTime(s);
			return time === Infinity ? 0 : msToSeconds(time);
		});

		const ao5s = calculateRollingAverage(chronologicalSolves, 5).map((v) =>
			v ? msToSeconds(v) : 0
		);
		const ao12s = calculateRollingAverage(chronologicalSolves, 12).map((v) =>
			v ? msToSeconds(v) : 0
		);

		const datasets = [
			showRaw
				? {
						data: rawTimes,
						color: () => colors.mutedForeground,
						strokeWidth: 1,
						withDots: false,
					}
				: null,
			showAo5
				? {
						data: ao5s,
						color: () => colors.accent,
						strokeWidth: 1,
					}
				: null,
			showAo12
				? {
						data: ao12s,
						color: () => colors.gold,
						strokeWidth: 1,
					}
				: null,
		].filter(Boolean) as {
			data: number[];
			color: () => string;
			strokeWidth: number;
			withDots?: boolean;
		}[];

		return {
			labels: chronologicalSolves.map((_, i) =>
				i % 5 === 0 ? String(i + 1) : ""
			),
			datasets,
			legend: [
				showRaw ? "Time" : "",
				showAo5 ? "Ao5" : "",
				showAo12 ? "Ao12" : "",
			].filter(Boolean),
		};
	}, [solves, showRaw, showAo5, showAo12, colors]);

	if (solves.length < 2) {
		return (
			<View style={[styles.container, styles.emptyContainer]}>
				<Text theme="muted">Not enough solves to display chart</Text>
			</View>
		);
	}

	return (
		<View
			style={styles.container}
			onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
		>
			<LineChart
				data={{
					labels: chartData.labels,
					datasets: chartData.datasets,
					legend: chartData.legend.length > 0 ? chartData.legend : undefined,
				}}
				width={width}
				height={220}
				yAxisLabel=""
				yAxisSuffix=""
				fromZero={false}
				segments={5}
				chartConfig={{
					backgroundColor: colors.background,
					backgroundGradientFrom: colors.background,
					backgroundGradientTo: colors.background,
					decimalPlaces: 2,
					color: () => colors.foreground,
					labelColor: () => colors.mutedForeground,
					strokeWidth: 2,
					barPercentage: 0.5,
					useShadowColorFromDataset: false,
				}}
				bezier
				style={styles.chart}
				withDots={false}
				withShadow={false}
				withInnerLines={true}
				withOuterLines={true}
				withVerticalLines={false}
				withHorizontalLines={true}
				withHorizontalLabels={true}
				withVerticalLabels={true}
			/>

			<View style={styles.toggles}>
				<Toggle
					label="Time"
					active={showRaw}
					onPress={() => setShowRaw(!showRaw)}
					color={colors.mutedForeground}
				/>
				<Toggle
					label="Ao5"
					active={showAo5}
					onPress={() => setShowAo5(!showAo5)}
					color={colors.accent}
				/>
				<Toggle
					label="Ao12"
					active={showAo12}
					onPress={() => setShowAo12(!showAo12)}
					color={colors.gold}
				/>
			</View>
		</View>
	);
}

function Toggle({
	label,
	active,
	onPress,
	color,
}: {
	label: string;
	active: boolean;
	onPress: () => void;
	color: string;
}) {
	const colors = useColors();
	return (
		<Text
			onPress={onPress}
			weight="bold"
			size={12}
			style={[
				styles.toggle,
				{
					color: active ? color : colors.mutedForeground,
				},
			]}
		>
			{label}
		</Text>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
		alignItems: "center",
	},
	emptyContainer: {
		height: 200,
		justifyContent: "center",
	},
	chart: {
		marginRight: 10,
		paddingRight: 30,
	},
	toggles: {
		flexDirection: "row",
		gap: 20,
		marginTop: 10,
	},
	toggle: {
		padding: 8,
	},
});
