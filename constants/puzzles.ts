export const puzzles = [
  "2x2",
  "3x3",
  // "4x4",
  // "5x5",
  // "6x6",
  // "7x7",
  // "3x3 OH",
  // "3x3 BLD",
  // "3x3 FMC",
  // "4x4 BLD",
  // "5x5 BLD",
  // "Megaminx",
  // "Pyraminx",
  // "Skewb",
  // "Square-1",
  // "Clock",
  // "Multi-Blind",
] as const;

export const puzzleLabels: Record<(typeof puzzles)[number], string> = {
  "2x2": "2x2 Cube",
  "3x3": "3x3 Cube",
  // "4x4": "4x4 Cube",
  // "5x5": "5x5 Cube",
  // "6x6": "6x6 Cube",
  // "7x7": "7x7 Cube",
  // "3x3 OH": "3x3 One-Handed",
  // "3x3 BLD": "3x3 Blindfolded",
  // "3x3 FMC": "3x3 Fewest Moves",
  // "4x4 BLD": "4x4 Blindfolded",
  // "5x5 BLD": "5x5 Blindfolded",
  // "Megaminx": "Megaminx",
  // "Pyraminx": "Pyraminx",
  // "Skewb": "Skewb",
  // "Square-1": "Square-1",
  // "Clock": "Clock",
  // "Multi-Blind": "Multi-Blind",
} as const;

export const penalties = ["none", "+2", "DNF"] as const;

export const penaltyLabels: Record<(typeof penalties)[number], string> = {
  "none": "No Penalty",
  "+2": "+2 Penalty",
  "DNF": "DNF",
} as const;
