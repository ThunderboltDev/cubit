import {
	Delete02Icon,
	FloppyDiskIcon,
	PencilEdit01Icon,
	Settings02Icon,
	UserAdd01Icon,
	UserIcon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PuzzleSelector } from "@/components/app/puzzle-selector";
import { PuzzleIcon } from "@/components/icons/puzzle";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogHeader } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColors } from "@/hooks/use-colors";
import { useSessions } from "@/hooks/use-sessions";
import { useGlobalSettings } from "@/hooks/use-settings";

export function Header() {
	const router = useRouter();
	const colors = useColors();

	const [puzzleModalOpen, setPuzzleModalOpen] = useState(false);
	const [sessionModalOpen, setSessionModalOpen] = useState(false);
	const [upsertModalOpen, setUpsertModalOpen] = useState(false);
	const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

	const [sessionName, setSessionName] = useState("");
	const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
	const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

	const { settings, updateSettings } = useGlobalSettings();

	const {
		sessions,
		selectedSession,
		switchSession,
		createSession,
		deleteSession,
		renameSession,
	} = useSessions();

	const handleSettings = () => {
		router.push("/global-settings");
	};

	const handleUpsertSession = () => {
		if (!sessionName.trim()) return;

		if (editingSessionId) {
			renameSession(editingSessionId, sessionName);
		} else {
			createSession(sessionName);
		}

		setSessionName("");
		setEditingSessionId(null);
		setUpsertModalOpen(false);
	};

	const confirmDelete = () => {
		if (sessionToDelete) {
			deleteSession(sessionToDelete);
			setSessionToDelete(null);
			setDeleteAlertOpen(false);
		}
	};

	return (
		<>
			<SafeAreaView
				edges={["top"]}
				style={[styles.safeArea, { backgroundColor: colors.secondary }]}
			>
				<View theme="secondary" style={styles.header}>
					<IconButton
						icon={UserIcon}
						variant="transparent"
						onPress={() => setSessionModalOpen(true)}
					/>

					<Button
						variant="transparent"
						onPress={() => setPuzzleModalOpen(true)}
						style={styles.puzzleButton}
						textWrapper={false}
					>
						<View style={styles.puzzleHeader}>
							<PuzzleIcon
								size={24}
								puzzle={settings?.selectedPuzzle}
								color={colors.foreground}
							/>
							<Text size={16} weight="semibold">
								{settings?.selectedPuzzle}
							</Text>
						</View>
						<Text theme="muted" size={10}>
							{selectedSession?.name}
						</Text>
					</Button>

					<IconButton
						icon={Settings02Icon}
						variant="transparent"
						onPress={handleSettings}
					/>
				</View>
			</SafeAreaView>

			<PuzzleSelector
				open={puzzleModalOpen}
				onOpenChange={() => setPuzzleModalOpen(false)}
				selectedPuzzle={settings?.selectedPuzzle}
				onSelect={(puzzle) => {
					updateSettings({ selectedPuzzle: puzzle });
					setPuzzleModalOpen(false);
				}}
			/>

			<Dialog open={sessionModalOpen} onOpenChange={setSessionModalOpen}>
				<DialogHeader>
					<Text size={16} weight="bold">
						Sessions
					</Text>
				</DialogHeader>
				<DialogBody style={styles.sessionList}>
					{sessions.map((session) => {
						const isSelected = selectedSession?.id === session.id;

						return (
							<View
								key={session.id}
								style={[
									styles.sessionRow,
									{
										backgroundColor: colors.accent + (isSelected ? "20" : "00"),
									},
								]}
							>
								<Button
									variant="transparent"
									theme="default"
									onPress={() => {
										switchSession(session.id);
										setSessionModalOpen(false);
									}}
									style={styles.sessionButton}
								>
									{session.name}
								</Button>

								<IconButton
									icon={PencilEdit01Icon}
									variant="transparent"
									onPress={() => {
										setEditingSessionId(session.id);
										setSessionName(session.name);
										setSessionModalOpen(false);
										setUpsertModalOpen(true);
									}}
								/>

								{!isSelected && sessions.length > 1 && (
									<IconButton
										theme="danger"
										variant="transparent"
										icon={Delete02Icon}
										onPress={() => {
											setSessionToDelete(session.id);
											setDeleteAlertOpen(true);
										}}
									/>
								)}
							</View>
						);
					})}

					<Button
						theme="accent"
						icon={UserAdd01Icon}
						onPress={() => {
							setEditingSessionId(null);
							setSessionName("");
							setSessionModalOpen(false);
							setUpsertModalOpen(true);
						}}
					>
						New Session
					</Button>
				</DialogBody>
			</Dialog>

			<AlertDialog open={upsertModalOpen} onOpenChange={setUpsertModalOpen}>
				<AlertDialogBody>
					<AlertDialogHeader>
						<Text size={16} weight="bold">
							{editingSessionId ? "Rename Session" : "New Session"}
						</Text>
					</AlertDialogHeader>
					<Input
						placeholder="Session Name"
						value={sessionName}
						onChangeText={setSessionName}
						maxLength={20}
						autoFocus
					/>
					<Text theme="muted" size={10} style={styles.charCount}>
						{sessionName.length}/20
					</Text>
					<AlertDialogFooter
						onClose={() => {
							setUpsertModalOpen(false);
							setEditingSessionId(null);
							setSessionName("");
						}}
					>
						<AlertDialogAction
							theme="accent"
							onPress={handleUpsertSession}
							disabled={!sessionName.trim()}
							icon={editingSessionId ? FloppyDiskIcon : UserAdd01Icon}
						>
							{editingSessionId ? "Save" : "Create"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogBody>
			</AlertDialog>

			<AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
				<AlertDialogBody>
					<AlertDialogHeader>
						<Text size={16} weight="bold">
							Delete Session?
						</Text>
						<Text theme="muted" size={14}>
							This will permanently delete this session and all its recorded
							times.
						</Text>
					</AlertDialogHeader>
					<AlertDialogFooter onClose={() => setDeleteAlertOpen(false)}>
						<AlertDialogAction
							theme="danger"
							onPress={confirmDelete}
							icon={Delete02Icon}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogBody>
			</AlertDialog>
		</>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		width: "100%",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		height: 56,
	},
	puzzleButton: {
		flexDirection: "column",
		alignItems: "center",
		gap: 1,
	},
	puzzleHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	sessionList: {
		gap: 8,
		paddingBottom: 16,
	},
	sessionRow: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 8,
		gap: 4,
	},
	sessionButton: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		flex: 1,
	},
	charCount: {
		textAlign: "right",
		paddingRight: 4,
		marginTop: -12,
	},
});
