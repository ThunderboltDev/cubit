import { Copy01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as Clipboard from "expo-clipboard";
import { Modal, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColors } from "@/hooks/use-colors";
import { formatTime } from "@/lib/time";
import type { Solve } from "@/types";

interface SolveDetailsModalProps {
	visible: boolean;
	solve: Solve | null;
	onClose: () => void;
	onDelete: (solve: Solve) => void;
	onUpdatePenalty: (solve: Solve, penalty: Solve["penalty"]) => void;
}

export function SolveDetailsModal({
	visible,
	solve,
	onClose,
	onDelete,
	onUpdatePenalty,
}: SolveDetailsModalProps) {
	const colors = useColors();

	if (!solve) return null;

	const copyScramble = async () => {
		await Clipboard.setStringAsync(solve.scramble);
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<View style={[styles.sheet, { backgroundColor: colors.secondary }]}>
					<View style={styles.handle} />

					<View style={styles.header}>
						<Text theme="strong" weight="bold" size={18}>
							{formatTime(solve.time)}
						</Text>
						<Text theme="muted" size={12}>
							{new Date(solve.createdAt).toLocaleString()}
						</Text>
					</View>

					<View style={styles.scrambleBox}>
						<Text style={styles.scrambleText}>{solve.scramble}</Text>
						<TouchableOpacity onPress={copyScramble} style={styles.copyButton}>
							<HugeiconsIcon
								icon={Copy01Icon}
								size={20}
								color={colors.accent}
							/>
							<Text style={{ color: colors.accent, marginLeft: 4 }}>Copy</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.actions}>
						<Text theme="strong" style={styles.sectionLabel}>
							Penalty
						</Text>
						<View style={styles.penaltyRow}>
							<PenaltyToggle
								label="OK"
								isActive={solve.penalty === "none"}
								onPress={() => onUpdatePenalty(solve, "none")}
							/>
							<PenaltyToggle
								label="+2"
								isActive={solve.penalty === "+2"}
								onPress={() => onUpdatePenalty(solve, "+2")}
							/>
							<PenaltyToggle
								label="DNF"
								isActive={solve.penalty === "dnf"}
								onPress={() => onUpdatePenalty(solve, "dnf")}
							/>
						</View>
					</View>

					<TouchableOpacity
						style={[styles.deleteButton, { borderColor: colors.danger }]}
						onPress={() => {
							onDelete(solve);
							onClose();
						}}
					>
						<HugeiconsIcon
							icon={Delete02Icon}
							size={20}
							color={colors.danger}
						/>
						<Text style={{ color: colors.danger, fontWeight: "bold" }}>
							Delete Solve
						</Text>
					</TouchableOpacity>

					{/* Spacer for bottom safe area */}
					<View style={{ height: 40 }} />
				</View>
			</Pressable>
		</Modal>
	);
}

function PenaltyToggle({
	label,
	isActive,
	onPress,
}: {
	label: string;
	isActive: boolean;
	onPress: () => void;
}) {
	const colors = useColors();

	return (
		<TouchableOpacity
			style={[
				styles.penaltyBtn,
				{
					backgroundColor: isActive ? colors.foreground : colors.background,
					borderColor: isActive ? colors.foreground : colors.border,
				},
			]}
			onPress={onPress}
		>
			<Text
				style={{
					color: isActive ? colors.background : colors.foreground,
					fontWeight: "bold",
				}}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "flex-end",
	},
	sheet: {
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 24,
		minHeight: 400,
	},
	handle: {
		width: 40,
		height: 4,
		backgroundColor: "rgba(128,128,128,0.3)",
		alignSelf: "center",
		borderRadius: 2,
		marginBottom: 20,
	},
	header: {
		alignItems: "center",
		marginBottom: 24,
		gap: 4,
	},
	scrambleBox: {
		backgroundColor: "rgba(0,0,0,0.05)",
		padding: 16,
		borderRadius: 12,
		marginBottom: 24,
	},
	scrambleText: {
		marginBottom: 12,
		lineHeight: 22,
		fontFamily: "Rubik-Medium",
	},
	copyButton: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	actions: {
		marginBottom: 32,
	},
	sectionLabel: {
		marginBottom: 12,
	},
	penaltyRow: {
		flexDirection: "row",
		gap: 12,
	},
	penaltyBtn: {
		flex: 1,
		height: 44,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
	},
	deleteButton: {
		flexDirection: "row",
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 12,
		borderWidth: 1,
		gap: 8,
	},
});
