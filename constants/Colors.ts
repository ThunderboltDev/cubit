type RGB = {
	r: number;
	g: number;
	b: number;
};

function hexToRgb(hex: string): RGB {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!result) throw new Error(`Invalid hex color: ${hex}`);
	return {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
	};
}

function rgbToHex(r: number, g: number, b: number): string {
	const toHex = (n: number) => {
		const clamped = Math.max(0, Math.min(255, Math.round(n)));
		return clamped.toString(16).padStart(2, "0");
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function adjustBrightness(hex: string, factor: number): string {
	const rgb = hexToRgb(hex);

	const adjusted = {
		r: rgb.r + (255 - rgb.r) * factor,
		g: rgb.g + (255 - rgb.g) * factor,
		b: rgb.b + (255 - rgb.b) * factor,
	};

	return rgbToHex(adjusted.r, adjusted.g, adjusted.b);
}

function darken(hex: string, factor: number): string {
	const rgb = hexToRgb(hex);

	const adjusted = {
		r: rgb.r * (1 - factor),
		g: rgb.g * (1 - factor),
		b: rgb.b * (1 - factor),
	};

	return rgbToHex(adjusted.r, adjusted.g, adjusted.b);
}

export function forLightMode(hex: string): string {
	return darken(hex, 0.15);
}

export function forDarkMode(hex: string): string {
	return adjustBrightness(hex, 0.15);
}

const accent = "#0ea5e9" as const;
const danger = "#ef4444" as const;
const success = "#22c55e" as const;
const gold = "#f59e0b" as const;

export const colors = {
	white: "#ffffff",
	black: "#000000",
	light: {
		background: "#ffffff",
		foreground: "#0f172a",

		secondary: "#f1f5f9",
		secondaryForeground: "#0f172a",

		muted: "#e1e5e9",
		mutedForeground: "#64748b",

		border: "#e1e5e9",
		input: "#e1e5e9",

		gold: forLightMode(gold),
		accent: forLightMode(accent),
		danger: forLightMode(danger),
		success: forLightMode(success),
	},
	dark: {
		background: "#171717",
		foreground: "#f8fafc",

		secondary: "#272727",
		secondaryForeground: "#f4f6f8",

		muted: "#373737",
		mutedForeground: "#a0a2a4",

		border: "#373737",
		input: "#373737",

		gold: forDarkMode(gold),
		accent: forDarkMode(accent),
		danger: forDarkMode(danger),
		success: forDarkMode(success),
	},
} as const;
