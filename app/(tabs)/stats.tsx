import { ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SessionChart } from "@/components/stats/session-chart";
import { StatCard } from "@/components/ui/stat-card";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColors } from "@/hooks/use-colors";
import { useSessions } from "@/hooks/use-sessions";
import { useGlobalSettings } from "@/hooks/use-settings";
import { useSolves } from "@/hooks/use-solves";
import {
	calculateAverage,
	calculateBest,
	calculateMean,
	calculateStandardDeviation,
} from "@/lib/stats";
import { formatTime, getEffectiveTime } from "@/lib/time";

export default function Statistics() {
	const router = useRouter();
	const colors = useColors();

	const { settings } = useGlobalSettings();
	const { selectedSession } = useSessions();
	const { solves } = useSolves(selectedSession?.id, settings.selectedPuzzle);

	const [filterCount, setFilterCount] = useState<number | null>(null);

	const stats = useMemo(() => {
		const filteredSolves = filterCount ? solves.slice(0, filterCount) : solves;
		const totalSolves = filteredSolves.length;
		const dnfCount = filteredSolves.filter((s) => s.penalty === "dnf").length;

		const validSolves = filteredSolves.filter((s) => s.penalty !== "dnf");

		const mean = calculateMean(filteredSolves);
		const best = calculateBest(filteredSolves);
		const worst =
			validSolves.length > 0
				? Math.max(...validSolves.map((s) => getEffectiveTime(s)))
				: null;

		const currentAo5 = calculateAverage(filteredSolves, 5);
		const currentAo12 = calculateAverage(filteredSolves, 12);
		const currentAo100 = calculateAverage(filteredSolves, 100);

		const getBestAverage = (n: number): number | null => {
			if (filteredSolves.length < n) return null;
			let bestAvg = Infinity;
			for (let i = 0; i <= filteredSolves.length - n; i++) {
				const avg = calculateAverage(filteredSolves.slice(i, i + n), n);
				if (avg !== null && avg < bestAvg) bestAvg = avg;
			}
			return bestAvg === Infinity ? null : bestAvg;
		};

		const bestAo5 = getBestAverage(5);
		const bestAo12 = getBestAverage(12);
		const stdDev = calculateStandardDeviation(filteredSolves);

		return {
			filteredSolves,
			totalSolves,
			dnfCount,
			mean,
			best,
			worst,
			currentAo5,
			currentAo12,
			currentAo100,
			bestAo5,
			bestAo12,
			stdDev,
		};
	}, [solves, filterCount]);

	const safeFormatTime = (time: number | null | undefined): string => {
		if (
			time === null ||
			time === undefined ||
			Number.isNaN(time) ||
			Number.isFinite(time)
		) {
			return "--";
		}
		return formatTime(time);
	};

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.header}>
					<Text theme="strong" size={24}>
						{selectedSession?.name || "Session"} Stats
					</Text>
					<TouchableOpacity
						onPress={() => router.push("/solves")}
						style={styles.viewAllButton}
					>
						<Text style={{ color: colors.accent, fontWeight: "bold" }}>
							View Solves
						</Text>
						<HugeiconsIcon icon={ViewIcon} size={20} color={colors.accent} />
					</TouchableOpacity>
				</View>

				<View style={styles.section}>
					<SessionChart solves={stats.filteredSolves} />

					<View style={styles.filterRow}>
						{[null, 10, 50, 100].map((count) => (
							<TouchableOpacity
								key={String(count)}
								onPress={() => setFilterCount(count)}
								style={[
									styles.filterChip,
									{
										backgroundColor:
											filterCount === count ? colors.accent : colors.secondary,
									},
								]}
							>
								<Text
									style={{
										color:
											filterCount === count
												? colors.background
												: colors.mutedForeground,
										fontSize: 12,
										fontWeight: "bold",
									}}
								>
									{count ? `Last ${count}` : "All"}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				<View style={styles.grid}>
					<StatCard label="Mean" value={safeFormatTime(stats.mean)} />
					<StatCard
						label="Best"
						value={safeFormatTime(stats.best)}
						highlight="best"
					/>
					<StatCard
						label="Worst"
						value={safeFormatTime(stats.worst)}
						highlight="worst"
					/>
				</View>

				<View style={styles.section}>
					<Text theme="strong" size={18} style={styles.sectionTitle}>
						Current Averages
					</Text>
					<View style={styles.grid}>
						<StatCard label="Ao5" value={safeFormatTime(stats.currentAo5)} />
						<StatCard label="Ao12" value={safeFormatTime(stats.currentAo12)} />
						<StatCard
							label="Ao100"
							value={safeFormatTime(stats.currentAo100)}
						/>
					</View>
				</View>

				<View style={styles.section}>
					<Text theme="strong" size={18} style={styles.sectionTitle}>
						Best Averages
					</Text>
					<View style={styles.grid}>
						<StatCard
							label="Best Ao5"
							value={safeFormatTime(stats.bestAo5)}
							color={colors.gold}
						/>
						<StatCard
							label="Best Ao12"
							value={safeFormatTime(stats.bestAo12)}
							color={colors.gold}
						/>
						<StatCard
							label="Dev"
							value={
								stats.stdDev !== null && Number.isNaN(stats.stdDev)
									? stats.stdDev.toFixed(2)
									: "--"
							}
						/>
					</View>
				</View>

				<View style={[styles.section, styles.infoRow]}>
					<View style={styles.infoItem}>
						<Text theme="muted" size={12}>
							Total Solves
						</Text>
						<Text theme="strong" size={18}>
							{stats.totalSolves}
						</Text>
					</View>
					<View style={styles.infoItem}>
						<Text theme="muted" size={12}>
							DNFs
						</Text>
						<Text theme="strong" size={18} style={{ color: colors.danger }}>
							{stats.dnfCount}
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		padding: 20,
		paddingBottom: 40,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	viewAllButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		padding: 8,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		marginBottom: 12,
	},
	grid: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 24,
	},
	filterRow: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 8,
		marginTop: 16,
	},
	filterChip: {
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 20,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		backgroundColor: "rgba(0,0,0,0.05)",
		padding: 20,
		borderRadius: 12,
	},
	infoItem: {
		alignItems: "center",
	},
});
