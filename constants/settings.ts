import type { GlobalSettings, SessionSettings } from "@/types";

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
	selectedPuzzle: "3x3",
	theme: "system",
	hapticFeedback: true,
	timerPrecision: 2,
	holdToStart: true,
	holdTime: 300,
};

export const DEFAULT_SESSION_SETTINGS: SessionSettings = {
	inspectionEnabled: true,
	inspectionTime: 15,
	multiPhaseEnabled: false,
	phaseCount: 2,
	showScramblePreview: false,
};
