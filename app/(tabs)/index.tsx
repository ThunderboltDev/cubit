import {
	Delete02Icon,
	Flag02Icon,
	RotateClockwiseIcon,
	UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { StatCard } from "@/components/ui/stat-card";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { colors } from "@/constants/colors";
import { useColors } from "@/hooks/use-colors";
import { useSessions } from "@/hooks/use-sessions";
import { useGlobalSettings } from "@/hooks/use-settings";
import { useSolves } from "@/hooks/use-solves";
import { generateScramble } from "@/lib/scrambles";
import { calculateAverage, calculateBest } from "@/lib/stats";
import { formatTime } from "@/lib/time";
import type { Solve } from "@/types";

type TimerState = "idle" | "holding" | "running" | "stopped";

export default function TimerPage() {
	const themeColors = useColors();

	const { settings } = useGlobalSettings();
	const { selectedSession } = useSessions();
	const { solves, recordSolve, removeSolve, setPenalty } = useSolves(
		selectedSession?.id,
		settings.selectedPuzzle
	);

	const [displayTime, setDisplayTime] = useState(0);
	const [isReady, setIsReady] = useState<boolean>(false);
	const [timerState, setTimerState] = useState<TimerState>("idle");
	const [scramble, setScramble] = useState<string>("Generating scramble...");
	const [currentSolveId, setCurrentSolveId] = useState<string | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
	const [scrambleDialogOpen, setScrambleDialogOpen] = useState(false);

	const rafRef = useRef<number>(0);
	const startTimeRef = useRef<number>(0);
	const holdStartTimeRef = useRef<number>(0);
	const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const finalTimeRef = useRef<number>(0);
	const scrambleRef = useRef<string>(scramble);

	const controlsOpacity = useRef(new Animated.Value(1)).current;

	const currentSolve = solves.find((s) => s.id === currentSolveId);

	useEffect(() => {
		scrambleRef.current = scramble;
	}, [scramble]);

	useEffect(() => {
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
		};
	}, []);

	useEffect(() => {
		if (settings?.selectedPuzzle) {
			const newScramble = generateScramble(settings.selectedPuzzle);
			setScramble(newScramble);
			scrambleRef.current = newScramble;
		}
	}, [settings?.selectedPuzzle]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: stable setters
	useEffect(() => {
		if (timerState !== "running") {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			return;
		}

		startTimeRef.current = Date.now() - displayTime;

		const tick = () => {
			const now = Date.now();
			const elapsed = now - startTimeRef.current;
			setDisplayTime(elapsed);
			rafRef.current = requestAnimationFrame(tick);
		};

		rafRef.current = requestAnimationFrame(tick);

		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [timerState]);

	const generateNewSramble = useCallback(() => {
		if (settings?.selectedPuzzle) {
			const newScramble = generateScramble(settings.selectedPuzzle);
			setScramble(newScramble);
			scrambleRef.current = newScramble;
		}
	}, [settings?.selectedPuzzle]);

	const handleSolveFinish = useCallback(
		async (finalTime: number, currentScramble: string) => {
			if (!selectedSession || !settings?.selectedPuzzle) return;

			const solve: Omit<Solve, "id" | "createdAt"> = {
				puzzle: settings.selectedPuzzle,
				scramble: currentScramble,
				time: finalTime,
				penalty: "none",
			};

			try {
				const savedSolve = await recordSolve(solve);
				if (savedSolve) {
					setCurrentSolveId(savedSolve.id);
					generateNewSramble();
				}
			} catch (error) {
				console.error("Failed to save solve:", error);
			}

			Animated.timing(controlsOpacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		},
		[
			selectedSession,
			settings?.selectedPuzzle,
			recordSolve,
			generateNewSramble,
			controlsOpacity,
		]
	);

	const handlePressIn = useCallback(() => {
		if (timerState === "running") {
			const endTime = Date.now();
			const finalTime = endTime - startTimeRef.current;
			finalTimeRef.current = finalTime;

			setDisplayTime(finalTime);
			setTimerState("stopped");

			const currentScramble = scrambleRef.current;
			handleSolveFinish(finalTime, currentScramble);
		} else if (timerState === "idle" || timerState === "stopped") {
			setDisplayTime(0);
			holdStartTimeRef.current = Date.now();
			setTimerState("holding");
			setIsReady(false);

			Animated.timing(controlsOpacity, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start();

			if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
			readyTimeoutRef.current = setTimeout(() => {
				setIsReady(true);
			}, 300);
		}
	}, [timerState, controlsOpacity, handleSolveFinish]);

	const handlePressOut = useCallback(() => {
		if (timerState === "running") return;

		if (holdStartTimeRef.current) {
			const holdDuration = Date.now() - holdStartTimeRef.current;

			if (holdDuration >= 300 && timerState === "holding" && isReady) {
				const now = Date.now();
				startTimeRef.current = now;
				setDisplayTime(0);
				setTimerState("running");
				setCurrentSolveId(null);
			} else {
				setTimerState(timerState === "stopped" ? "stopped" : "idle");
				setIsReady(false);
				Animated.timing(controlsOpacity, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true,
				}).start();
			}

			holdStartTimeRef.current = 0;
		}
	}, [timerState, isReady, controlsOpacity]);

	const getTimerColor = () => {
		if (timerState === "running") return themeColors.foreground;
		if (timerState === "holding")
			return isReady ? colors.light.success : colors.light.danger;
		return themeColors.foreground;
	};

	const handleDeleteSolve = () => {
		setDeleteDialogOpen(false);
		setDisplayTime(0);
		setTimerState("idle");
		setCurrentSolveId(null);

		if (currentSolve) removeSolve(currentSolve);
	};

	return (
		<Pressable
			style={{
				flex: 1,
				backgroundColor: themeColors.background,
			}}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
		>
			<Animated.View style={[styles.scrambleRow, { opacity: controlsOpacity }]}>
				<Pressable
					onPress={() => {
						setScrambleDialogOpen(true);
					}}
					style={({ pressed }) => ({
						flex: 1,
						opacity: pressed ? 0.75 : 1,
					})}
				>
					<Text weight="bold" numberOfLines={3} style={styles.scrambleText}>
						{scramble}
					</Text>
				</Pressable>
				<IconButton
					icon={RotateClockwiseIcon}
					onPress={generateNewSramble}
					variant="transparent"
				/>
			</Animated.View>

			<Dialog open={scrambleDialogOpen} onOpenChange={setScrambleDialogOpen}>
				<DialogHeader>
					<Text size={18} weight="bold">
						Scramble
					</Text>
					<Text size={14} weight="medium">
						{scramble}
					</Text>
				</DialogHeader>
			</Dialog>

			<View style={styles.timerArea}>
				<Text
					style={[
						styles.timerText,
						{
							color: getTimerColor(),
						},
					]}
				>
					{currentSolve?.penalty === "+2"
						? `${formatTime(finalTimeRef.current + 2000)}+`
						: currentSolve?.penalty === "dnf"
							? "DNF"
							: formatTime(
									timerState === "stopped" ? finalTimeRef.current : displayTime
								)}
				</Text>

				<Text
					style={[
						styles.hintText,
						{ opacity: timerState === "idle" ? 0.5 : 0 },
					]}
				>
					Hold to start
				</Text>

				<Animated.View
					style={[styles.penaltyRow, { opacity: controlsOpacity }]}
				>
					{timerState === "stopped" && currentSolve && (
						<>
							<IconButton
								icon={Flag02Icon}
								theme={currentSolve?.penalty === "+2" ? "accent" : "default"}
								onPress={() =>
									setPenalty(
										currentSolve,
										currentSolve?.penalty === "+2" ? "none" : "+2"
									)
								}
								style={{
									borderRadius: 99999,
								}}
							/>
							<IconButton
								icon={UnavailableIcon}
								theme={currentSolve?.penalty === "dnf" ? "danger" : "default"}
								onPress={() =>
									setPenalty(
										currentSolve,
										currentSolve?.penalty === "dnf" ? "none" : "dnf"
									)
								}
								style={{
									borderRadius: 99999,
								}}
							/>
							<IconButton
								icon={Delete02Icon}
								theme="danger"
								onPress={() => setDeleteDialogOpen(true)}
								style={{
									borderRadius: 99999,
								}}
							/>
						</>
					)}
				</Animated.View>
			</View>

			<Animated.View style={[styles.bottomArea, { opacity: controlsOpacity }]}>
				<View style={styles.statsRow}>
					<StatCard
						variant="badge"
						label="Ao5"
						value={calculateAverage(solves, 5)}
					/>
					<StatCard
						variant="badge"
						label="Ao12"
						value={calculateAverage(solves, 12)}
					/>
					<StatCard
						variant="badge"
						label="Best"
						value={calculateBest(solves)}
					/>
				</View>
			</Animated.View>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Solve</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this solve? This action cannot be
						undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction
						onPress={handleDeleteSolve}
						theme="danger"
						icon={Delete02Icon}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialog>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	scrambleRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "center",
		padding: 18,
		height: 120,
		gap: 8,
	},
	scrambleText: {
		flex: 1,
		textAlign: "center",
	},
	timerArea: {
		paddingTop: 60,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	timerText: {
		fontSize: 72,
		lineHeight: 90,
		fontFamily: "JetBrainsMono-Bold",
	},
	hintText: {
		height: 28,
		marginTop: 12,
		fontSize: 12,
		opacity: 0.5,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	penaltyRow: {
		height: 60,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
	},
	bottomArea: {
		height: 120,
		padding: 24,
		justifyContent: "flex-end",
	},
	statsRow: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 24,
	},
});
