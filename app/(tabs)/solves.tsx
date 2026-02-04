import { Delete02Icon, FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SolveDetailsModal } from "@/components/solves/solve-details-modal";
import { SolveListItem } from "@/components/solves/solve-list-item";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogFooter,
	AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColors } from "@/hooks/use-colors";
import { useSessions } from "@/hooks/use-sessions";
import { useGlobalSettings } from "@/hooks/use-settings";
import { useSolves } from "@/hooks/use-solves";
import { getEffectiveTime } from "@/lib/time";
import type { Solve } from "@/types";

type SortOption = "latest" | "oldest" | "best";

export default function SessionSolvesPage() {
	const colors = useColors();

	const { settings } = useGlobalSettings();
	const { selectedSession } = useSessions();
	const { solves, removeSolve, setPenalty } = useSolves(
		selectedSession?.id,
		settings.selectedPuzzle
	);

	const [selectedSolve, setSelectedSolve] = useState<Solve | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [sortBy, setSortBy] = useState<SortOption>("latest");
	const [clearDnfDialogOpen, setClearDnfDialogOpen] = useState(false);

	const dnfCount = solves.filter((s) => s.penalty === "dnf").length;

	const sortedSolves = useMemo(() => {
		const validSolves = [...solves];
		switch (sortBy) {
			case "latest":
				return validSolves.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			case "oldest":
				return validSolves.sort(
					(a, b) =>
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			case "best":
				return validSolves.sort((a, b) => {
					if (a.penalty === "dnf" && b.penalty === "dnf") return 0;
					if (a.penalty === "dnf") return 1;
					if (b.penalty === "dnf") return -1;
					return getEffectiveTime(a) - getEffectiveTime(b);
				});
			default:
				return validSolves;
		}
	}, [solves, sortBy]);

	const cycleSort = () => {
		const order: SortOption[] = ["latest", "oldest", "best"];
		const currentIndex = order.indexOf(sortBy);
		const nextIndex = (currentIndex + 1) % order.length;
		setSortBy(order[nextIndex]);
	};

	const getSortLabel = () => {
		switch (sortBy) {
			case "latest":
				return "Latest";
			case "oldest":
				return "Oldest";
			case "best":
				return "Best";
		}
	};

	const handleConfirmClearDnfs = () => {
		const dnfs = solves.filter((s) => s.penalty === "dnf");
		dnfs.forEach((solve) => {
			removeSolve(solve);
		});
		setClearDnfDialogOpen(false);
	};

	const handleSolvePress = (solve: Solve) => {
		setSelectedSolve(solve);
		setModalVisible(true);
	};

	return (
		<View style={styles.container}>
			<View style={[styles.toolbar, { borderBottomColor: colors.border }]}>
				<Button onPress={cycleSort} icon={FilterHorizontalIcon}>
					{getSortLabel()}
				</Button>

				<Button
					theme="danger"
					variant="transparent"
					onPress={() => setClearDnfDialogOpen(true)}
					disabled={dnfCount === 0}
				>
					Clear DNFs
				</Button>
			</View>

			<FlatList
				data={sortedSolves}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => (
					<SolveListItem
						solve={item}
						index={sortBy === "best" ? index + 1 : sortedSolves.length - index}
						onPress={handleSolvePress}
					/>
				)}
				contentContainerStyle={styles.listContent}
				ListEmptyComponent={
					<View style={styles.emptyState}>
						<Text theme="muted" size={12}>
							No solves yet
						</Text>
					</View>
				}
			/>

			<SolveDetailsModal
				visible={modalVisible}
				solve={selectedSolve}
				onClose={() => setModalVisible(false)}
				onDelete={(solve) => {
					removeSolve(solve);
					if (selectedSolve?.id === solve.id) setModalVisible(false);
				}}
				onUpdatePenalty={(solve, penalty) => {
					setPenalty(solve, penalty);
					if (selectedSolve)
						setSelectedSolve({ ...selectedSolve, penalty: penalty });
				}}
			/>

			<AlertDialog
				open={clearDnfDialogOpen}
				onOpenChange={setClearDnfDialogOpen}
			>
				<AlertDialogHeader>
					<Text size={16} weight="bold">
						Clear DNFs
					</Text>
					<Text theme="muted" size={14}>
						Are you sure you want to delete {dnfCount} DNF solve
						{dnfCount !== 1 ? "s" : ""}? This action cannot be undone.
					</Text>
				</AlertDialogHeader>
				<AlertDialogFooter onClose={() => setClearDnfDialogOpen(false)}>
					<AlertDialogAction
						onPress={handleConfirmClearDnfs}
						theme="danger"
						icon={Delete02Icon}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialog>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	toolbar: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	listContent: {
		paddingBottom: 40,
	},
	emptyState: {
		padding: 40,
		alignItems: "center",
	},
});
